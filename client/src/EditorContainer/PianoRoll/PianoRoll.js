/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  setCanvasWidth, setCanvasHeight, processNoteEvent,
  setOffscreenDirty, setOnscreenDirty,
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
      )
    };
  }

  componentDidMount() {
    // console.log(this.state.pitchMap)
    const { setCanvasWidth, setCanvasHeight } = this.props;

    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d')
    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
      // WORKS BUT DOESN'T ACCOUNT FOR SCREEN RESIZE

    setCanvasWidth(this.canvas.width)
    setCanvasHeight(this.canvas.height)

    // this.drawOffScreen()
    // this.drawNotes()
    this.drawOnScreen()

  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
    // POSSIBLY test HERE if there's a reason to re render?
    // "offscreenBufferDirty" as a state flag.
    // "onscreenBufferDirty" also as a stae flag
      // that means Do rerender it...
  // }

  componentDidUpdate() {
    console.log('piano update')
    // this.drawOffScreen()
    // this.drawNotes()
    this.drawOnScreen()
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


  drawOffScreen() {
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

  drawOnScreen() {
    console.log('piano onscreen')
    const { offscreenDirty, onscreenDirty, setOffscreenDirty,
      gemBoxX, gemBoxY, gemBoxWidth, gemBoxHeight } = this.props;

    console.log('offscreen dirty', offscreenDirty)
    if (offscreenDirty) {
      this.drawOffScreen()
      setOffscreenDirty(false)
    }
    console.log('onscreen dirty', onscreenDirty)
    if (!onscreenDirty) {return }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.offscreen,
      gemBoxX, gemBoxY, gemBoxWidth, gemBoxHeight,
      0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight
    );
  }

  handleClick(e) {
    const {
      setOffscreenDirty, processNoteEvent,
      gemBoxX, gemBoxY, gemBoxWidth, gemBoxHeight,
    } = this.props
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
    console.log('noteInfo', noteInfo)

    processNoteEvent(noteInfo);
    // does this go here?
    setOffscreenDirty(true)

  }

  handleWheel(e) {
    e.preventDefault()
    e.stopPropagation();
    // [Intervention] Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/6662647093133312
    // console.log('e.deltaX', e.deltaX)
    // console.log('e.deltaY', e.deltaY)
  }

  render() {
    // console.log('PianoRoll.js rendering')
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
    offscreenDirty: state.offscreenDirty,
    onscreenDirty: state.onscreenDirty,
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
    setOffscreenDirty,
    setOnscreenDirty,
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

