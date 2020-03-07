/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  setCanvasWidth, setCanvasHeight, setGemBoxWidth, setGemBoxHeight, processNoteEvent,
} from '../../redux/actions';
import { Wrapper } from './PianoRoll.styles';
import { buildPitchSet } from "../../helpers/helpers";
import { octaves, offscreenOctavePx, offscreenCellWidth } from "../../config/constants";


class PianoRoll extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    const offscreenWidth = this.props.compositionLength * offscreenCellWidth;
    const offscreenHeight = octaves * offscreenOctavePx;
    // console.log('piano offscreenHeight', offscreenHeight)
    this.offscreen = new OffscreenCanvas(offscreenWidth, offscreenHeight);
      // SO the offscreen hard-codes a base cell size here (scaling octave by 12 also as a base...)

    this.state = {
      pitchMap: buildPitchSet(
        261.63,
        [
          {cents:0,    color: '#fff', name: 'C' },
          {cents:75,   color: '#99a', name: 'c#'},
          {cents:200,  color: '#aaa', name: 'D' },
          {cents:250,  color: '#99a', name: 'd#'},
          {cents:400,  color: '#aaa', name: 'E' },
          {cents:500,  color: '#aaa', name: 'F' },
          {cents:600,  color: '#99a', name: 'F#'},
          {cents:700,  color: '#aaa', name: 'G' },
          {cents:800,  color: '#99a', name: 'G#'},
          {cents:850,  color: '#aaa', name: 'a' },
          {cents:1000, color: '#99a', name: 'A#'},
          {cents:1100, color: '#333', name: 'B' },
        ]
      ),
      offscreenDirty: true,
      onscreenDirty: true,
    };
  }

  componentDidMount() {
    // console.log(this.state.pitchMap)

    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d')
    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
      // WORKS BUT DOESN'T ACCOUNT FOR SCREEN RESIZE

    this.handleResize()
    this.DrawOnscreen()

    window.addEventListener('resize', this.handleResize) // remove this at some point?
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) { // PureComponent?
    console.log('nextProps', nextProps, 'nextState', nextState)
    // skip the note add re-render because the state change to offscreen dirty catches it
    return this.props.notes.length === nextProps.notes.length;
    // is there a use for onscreenDirty?
      // currently it's just rerendering for any props update other than note change
    // are there any other conditions where it should not update?
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('piano didUpdate')
    this.DrawOnscreen()
  }

  handleResize = () => {
    console.log('resizing')
    const { setCanvasWidth, setCanvasHeight, setGemBoxWidth, setGemBoxHeight } = this.props;

    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    setCanvasWidth(this.canvas.width)
    setCanvasHeight(this.canvas.height)
    setGemBoxWidth(this.canvas.width, true)
    setGemBoxHeight(this.canvas.height, true)
      // wait. do you really want to change the gemBox when you resize?
        // because that changes what notes are displayed and such
        // seems like that's what you want to keep constant...
      // potentially call setGemBoxWidth from setCanvasWidth?
      // is there any situation where you don't want to do that?

    // this.setState({ onscreenDirty: true })
    // this.forceUpdate() // because otherwise apparently you have to add arbitrary stuff
      // wait why is this needed at all? You're setting redux...
  }

  drawNotes() {
    const { notes } = this.props
    // console.log('notes', notes)
    notes.forEach((noteObject, index) => this.drawNote(noteObject, index))
  }

  drawNote(noteObject) {
    // console.log('drawing note', noteObject)
    const offscreenCtx = this.offscreen.getContext('2d')

    const octavesHeight = offscreenOctavePx * noteObject.octave
    const centsHeight = offscreenOctavePx * (noteObject.cents/1200)
    const nextCents = noteObject.nextCents
    // console.log('nextCents', nextCents)
    const cellHeight = offscreenOctavePx * ((nextCents- noteObject.cents) / 1200)
    // console.log('cellHeight', cellHeight)

    const canvasBottom = offscreenOctavePx * octaves
    const noteTop = canvasBottom - (octavesHeight + centsHeight + cellHeight)

    offscreenCtx.beginPath();
    offscreenCtx.fillStyle = "rgb(128,128,128)";
    // offscreenCtx.fillStyle = "#000";
    // if(noteObject.selected){
    //   offscreenCtx.strokeStyle = "rgb(255,255,255)";
    // }else{
    //   offscreenCtx.strokeStyle = "rgb(24,24,24)";
    // }
    const x = offscreenCellWidth*noteObject.start;
    const y = noteTop
    const width = offscreenCellWidth*noteObject.duration
    const height = cellHeight
    // console.log('coords', x, y, width, height)
    offscreenCtx.rect(x, y, width, height);
    offscreenCtx.fill()
    offscreenCtx.stroke();
  }


  drawOffscreen() {
    console.log('piano offscreen')
    let { compositionLength } = this.props;
    const offscreenCtx = this.offscreen.getContext('2d')

    // do this
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let x = 0
    for (let i=0; i < compositionLength; i++) {
      let y =  offscreenOctavePx * octaves
      this.state.pitchMap.forEach((pitchObj, i) => {
        const cellheight = offscreenOctavePx * ((pitchObj.nextCents - pitchObj.cents) / 1200)
        const celltop = y - cellheight
        offscreenCtx.beginPath();
        offscreenCtx.fillStyle = pitchObj.color;

        offscreenCtx.strokeStyle = "rgb(24,24,24)";
        offscreenCtx.fillRect(x, celltop, offscreenCellWidth, cellheight);
        offscreenCtx.strokeRect(x, celltop, offscreenCellWidth, cellheight);

        y -= cellheight
      })
      x+=offscreenCellWidth
    }

    this.drawNotes()
  }

  DrawOnscreen() {
    const {
      offscreenDirty,
      // onscreenDirty
    } = this.state;
    const { gemBoxX, gemBoxY, gemBoxWidth, gemBoxHeight } = this.props;

    if (offscreenDirty) {
      this.drawOffscreen()
      this.setState({ offscreenDirty: false })
    }
    // if (!onscreenDirty) {return }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.offscreen,
      gemBoxX, gemBoxY, gemBoxWidth, gemBoxHeight,
      0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight
    );
  }

  handleClick(e) {

    const { processNoteEvent, gemBoxX, gemBoxY, gemBoxWidth, gemBoxHeight, } = this.props

    const offscreenHeight = this.offscreen.height;
    const xScale = gemBoxWidth / this.canvas.width
    const yScale = gemBoxHeight / this.canvas.height
    console.log('click yScale', yScale)
    const rect = e.target.getBoundingClientRect()

    const xPix = e.clientX - rect.left
    const yPix = e.clientY - rect.top;
    // console.log('xPIx', xPix)
    // console.log('yPix', yPix);

    const xOffscreen = xPix * xScale + gemBoxX
    const yOffscreen = yPix * yScale + gemBoxY
    const yFlipOff = offscreenHeight - yOffscreen
    // console.log('yFlipOff', yFlipOff)
    const noteInfo = {}
    // HMM: this is a map of where each cell is on the OFFSCREEN (I think)
    this.state.pitchMap.forEach((pitchObj, index)=> {
      const cellStartY = (pitchObj.totalCents/1200) * offscreenOctavePx
      const cellEndY = (pitchObj.totalCentsNext/1200) * offscreenOctavePx
      if (yFlipOff >= cellStartY && yFlipOff < cellEndY) {
        // console.log('cell clicked', cellStart, cellEnd)
        // console.log('yOff/offOctPx', yFlipOff / offscreenOctavePx)
        noteInfo.octave = Math.floor(yFlipOff / offscreenOctavePx) // note that octave starts at 0.
        noteInfo.cents = pitchObj.cents
        noteInfo.nextCents = pitchObj.nextCents
        noteInfo.start = Math.floor(xOffscreen / offscreenCellWidth)
        noteInfo.duration = 1
        noteInfo.selected = false
      }
    })
    // console.log('noteInfo', noteInfo)

    processNoteEvent(noteInfo);
    this.setState({offscreenDirty: true})
  }

  handleWheel(e) {
    e.preventDefault()
    e.stopPropagation();
    // [Intervention] Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/6662647093133312
    // console.log('e.deltaX', e.deltaX)
    // console.log('e.deltaY', e.deltaY)
  }

  render() {
    console.log('PianoRoll.js rendering')
    // console.log('ctx', this.ctx) // NOTE: undefined on initial render

    return (
      <Wrapper>
        <canvas
          ref={this.canvasRef}
          onMouseDown={(e) => {}}
          onClick={(e) => this.handleClick(e)}
          // onWheel={(e) => { this.handleWheel(e) }}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    notes: state.notes,
    compositionLength: state.compositionLength,
    gemBoxX: state.gemBoxX,
    gemBoxY: state.gemBoxY,
    gemBoxWidth: state.gemBoxWidth,
    gemBoxHeight: state.gemBoxHeight,
  };
};


export default connect(
  mapStateToProps,
  {
    setCanvasWidth,
    setCanvasHeight,
    setGemBoxWidth,
    setGemBoxHeight,
    processNoteEvent,
  }
)(PianoRoll);


// drawPlayHead(x) {
//   ctx.beginPath();
//   ctx.moveTo(x,0);
//   ctx.lineWidth = 2;
//   ctx.strokeStyle = "red";
//   ctx.lineTo(x,h);
//   ctx.shadowBlur=0;
//   ctx.stroke();
// }


// resizeCanvasToDisplaySize(canvas) {
//   look up the size the canvas is being displayed
// var width = canvas.clientWidth;
// var height = canvas.clientHeight;
//
// If it's resolution does not match change it
// if (canvas.width !== width || canvas.height !== height) {
//   canvas.width = width;
//   canvas.height = height;
//   return true;
// }
//
// return false;
// }

