/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { processNoteEvent } from '../../actions';
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

      centsAndPxHeights: this.mapCentsAndPxHeights([0, 75, 200, 250, 400, 500, 600, 700, 800, 850, 1000, 1100]),
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
    console.log(this.state.pitchMap)
    // console.log('centsAndPxHeights', this.state.centsAndPxHeights)
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d')
    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
      // WORKS BUT DOESN'T ACCOUNT FOR SCREEN RESIZE

    this.drawOffScreen()
    this.drawNotes()
    this.drawOnScreen()

  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
    // POSSIBLY test HERE if there's a reason to re render?
    // "offscreenBufferDirty" as a state flag.
    // "onscreenBufferDirty" also as a stae flag
      // that means Do rerender it...
  // }

  componentDidUpdate() {
    this.drawOffScreen()
    this.drawNotes()
    this.drawOnScreen()
  }

  mapCentsAndPxHeights(centsArr) {
    const centsAndPxHeights = []
    centsArr.forEach(cents => {
      const refObj = { cents, px: (cents/1200) * offscreenOctavePx }
      centsAndPxHeights.push(refObj)
    })
    return centsAndPxHeights
  }

  drawNotes() {
    const { notes } = this.props
    // console.log('notes', notes)
    notes.forEach((noteObject, index) => this.drawNote(noteObject, index))
  }

  drawNote(noteObject) {
    // console.log('drawing note', noteObject)
    const { centsAndPxHeights } = this.state
    const offscreenCtx = this.offscreen.getContext('2d')

    const octavesHeight = offscreenOctavePx * noteObject.octave
    const centsHeight = offscreenOctavePx * (noteObject.cents/1200)
    const index = centsAndPxHeights.findIndex(el => el.cents === noteObject.cents)
    const nextCents = index < centsAndPxHeights.length-1 ? centsAndPxHeights[index+1].cents : 1200
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
    console.log('coords', x, y, width, height)
    offscreenCtx.rect(x, y, width, height);
    offscreenCtx.fill()
    offscreenCtx.stroke();
  }


  drawOffScreen() {
    let { compositionLength } = this.props;
    const offscreenCtx = this.offscreen.getContext('2d')

    let x = 0
    for (let i=0; i<compositionLength; i++) {
      let y =  offscreenOctavePx * octaves
      // console.log('y', y)
      this.state.pitchMap.forEach((pitchObj, i) => {
        const cellheight = offscreenOctavePx * ((pitchObj.nextCents - pitchObj.cents) / 1200)
        // console.log('cellheight', cellheight)
        const celltop = y - cellheight
        offscreenCtx.beginPath();
        offscreenCtx.fillStyle = pitchObj.color;
        // offscreenCtx.fillStyle = "#000";

        offscreenCtx.strokeStyle = "rgb(24,24,24)";
        offscreenCtx.fillRect(x, celltop, offscreenCellWidth, cellheight);
        offscreenCtx.strokeRect(x, celltop, offscreenCellWidth, cellheight);

        y -= cellheight
      })
      x+=offscreenCellWidth
    }
  }

  drawOnScreen() {
    const { compositionLength, zoomX, zoomY, scrollLeft, scrollTop } = this.props;
    // console.log('measures', compositionLength * 50, octaves * 12 * 25);
    // console.log('piano offsets', this.canvas.offsetWidth, this.canvas.offsetHeight)
    // console.log('piano width', this.canvas.width)
    // console.log('zoomz', zoomX, zoomY)
    this.ctx.drawImage(
      this.offscreen,
      scrollLeft, scrollTop,
      (compositionLength * offscreenCellWidth) / zoomX + scrollLeft,
      (octaves * offscreenOctavePx) / zoomY + scrollTop,
      0, 0,
      this.canvas.offsetWidth, this.canvas.offsetHeight
    );
  }

  handleClick(e) {
    const { compositionLength, zoomX, zoomY, scrollLeft, scrollTop,
      processNoteEvent } = this.props
    const offscreenWidth = this.offscreen.width;
    console.log('canvasHeight', this.canvas.height)
    const offscreenHeight = this.offscreen.height;
    console.log('offscreenHeight', offscreenHeight)
    const rect = e.target.getBoundingClientRect()
    const xPix = e.clientX - rect.left;
    // const yPix = rect.bottom - e.clientY;
    const yPix = e.clientY - rect.top;
    // console.log('xPIx', xPix)
    console.log('yPix', yPix);
    const xScale = offscreenWidth / this.canvas.width
    const yScale = offscreenHeight / this.canvas.height
    // console.log('yScale', yScale)
    // const xOffscreen = (xPix + scrollLeft) * zoomX;
    // const yOffscreen = (yPix + scrollTop) * zoomY;
    const xOffscreen = (xPix * xScale) / zoomX
    const yAdding = offscreenHeight - (offscreenHeight / zoomY)
    console.log('yAdding', yAdding) // YEAH except for SCROLL
    const yOffscreen = (yPix * yScale) / zoomY
    // console.log('xOff', xOffscreen)
    console.log('yOff', yOffscreen)
    const yFlipOff = offscreenHeight - yOffscreen
    console.log('yFlipOff', yFlipOff)
    const noteInfo = {}
    // HMM: this is a map of where each cell is on the OFFSCREEN (I think)
    this.state.pitchMap.forEach((pitchObj, index)=> {
      const cellStart = (pitchObj.totalCents/1200) * offscreenOctavePx
      const cellEnd = (pitchObj.totalCentsNext/1200) * offscreenOctavePx
      if (yFlipOff >= cellStart && yFlipOff < cellEnd) {
        console.log('cell clicked', cellStart, cellEnd)
        console.log('yOff/offOctPx', yFlipOff / offscreenOctavePx)
        noteInfo.octave = Math.floor(yFlipOff / offscreenOctavePx)
        noteInfo.cents = pitchObj.cents
        noteInfo.start = Math.floor(xOffscreen / offscreenCellWidth)
        noteInfo.duration = 1
        noteInfo.selected = false
      }
    })
    console.log('noteInfo', noteInfo)

    processNoteEvent(noteInfo);
  }

  render() {
    // console.log('PianoRoll.js rendering')
    // console.log('ctx', this.ctx) // NOTE: undefined on initial render

    return (
      <Wrapper>
        <canvas
          ref={this.canvasRef}
          onClick={(e) => this.handleClick(e)}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    notes: state.notes,
    compositionLength: state.compositionLength,
    zoomX: state.zoomX,
    zoomY: state.zoomY,
    scrollLeft: state.scrollLeft,
    scrollTop: state.scrollTop
  };
};


export default connect(
  mapStateToProps,
  { processNoteEvent: processNoteEvent }
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


// drawPianoGrid() {
//   for(let y=0; y < this.h; y=y+this.cellheight){
//     for(let x=0; x < this.w; x=x+this.cellwidth){
// // horizontal lines strangely fade at the far right side
// if(y % (12*this.cellheight) === 0){
//   this.ctx.beginPath();
//   this.ctx.moveTo(0, y);
//   this.ctx.strokeStyle = "#aaa";
//   this.ctx.lineTo(this.w, y);
//   this.ctx.shadowBlur=0;
//   this.ctx.stroke();
// }
// if(x % (4*this.cellwidth) === 0){
//   this.ctx.beginPath();
//   this.ctx.moveTo(x,0);
//   this.ctx.strokeStyle = "black";
//   this.ctx.lineTo(x, this.h);
//   this.ctx.shadowBlur=0;
//   this.ctx.stroke();
// }
// this.ctx.beginPath();
// if(
//   (y+11*this.cellheight) % (12*this.cellheight)===0 ||
//   (y+9*this.cellheight) % (12*this.cellheight)===0 ||
//   (y+7*this.cellheight) % (12*this.cellheight)===0 ||
//   (y+4*this.cellheight) % (12*this.cellheight)===0 ||
//   (y+2*this.cellheight) % (12*this.cellheight)===0
// ){
//   this.ctx.fillStyle = "rgb(32,32,32)";
// }else{
//   this.ctx.fillStyle = "rgb(45,45,80)";
// }
// this.ctx.strokeStyle = "rgb(24,24,24)";
// this.ctx.rect(x, y, this.cellwidth, this.cellheight);
// this.ctx.fill()
// this.ctx.stroke();
// }
// }
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

