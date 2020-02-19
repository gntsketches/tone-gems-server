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

    this.offscreen = new OffscreenCanvas(this.props.compositionLength * offscreenCellWidth, octaves * offscreenOctavePx);
      // SO the offscreen hard-codes a base cell size here (scaling octave by 12 also as a base...)

    this.state = {
      cellwidth: 50,
      cellCountX: 128,
      // const cents = [0, 75, 200, 250, 400, 500, 600, 700, 800, 850, 1000, 1100]
      centsAndPxHeights: this.mapCentsAndPxHeights([0, 75, 200, 250, 400, 500, 600, 700, 800, 850, 1000, 1100]),
      pitchMap: buildPitchSet(
        261.63,
        [
          {cents:0,    color: '#aaa', name: 'C' },
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
          {cents:1100, color: '#aaa', name: 'B' },
        ]
      )
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d')
    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
      // WORKS BUT DOESN'T ACCOUNT FOR SCREEN RESIZE

    // this.drawPianoGrid();
    this.drawOffScreen()
    this.drawOnScreen()
    this.drawNotes()

  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
    // POSSIBLY test HERE if there's a reason to re render?
    // "offscreenBufferDirty" as a state flag.
    // "onscreenBufferDirty" also as a stae flag
      // that means Do rerender it...
  // }

  componentDidUpdate() {
    // this.drawPianoGrid();
    this.drawOffScreen()
    this.drawOnScreen()
    this.drawNotes()
  }

  mapCentsAndPxHeights(centsArr) {
    let { octavePx } = this.props
    const centsAndPxHeights = []
    centsArr.forEach(cents => {
      const refObj = { cents, px: (cents/1200) * octavePx }
      centsAndPxHeights.push(refObj)
    })
    return centsAndPxHeights
  }

  drawNotes() {
    const { notes } = this.props
    // console.log('notes', notes)
    notes.forEach((noteObject, index) => this.drawNote(noteObject, index))
  }

  drawNote(noteObject ) {
    const { cellwidth, centsAndPxHeights } = this.state
    console.log('centsAndPxHeights', centsAndPxHeights)
    const { octavePx } = this.props
    const octavesHeight = octavePx * noteObject.octave
    const centsHeight = octavePx * (noteObject.cents/1200)

    const index = centsAndPxHeights.findIndex(el => el.cents === noteObject.cents)
    const nextCents = index < centsAndPxHeights.length-1 ? centsAndPxHeights[index+1].cents : 1200
    // console.log('nextCents', nextCents)
    const cellHeight = octavePx * ((nextCents- noteObject.cents) / 1200)

    const canvasBottom =  octavePx * 7
    const noteTop = canvasBottom - (octavesHeight + centsHeight + cellHeight)

    this.ctx.beginPath();
    this.ctx.fillStyle = "rgb(128,128,128)";
    if(noteObject.selected){
      this.ctx.strokeStyle = "rgb(255,255,255)";
    }else{
      this.ctx.strokeStyle = "rgb(24,24,24)";
    }
    this.ctx.rect(cellwidth*noteObject.start, noteTop, cellwidth*noteObject.duration, cellHeight);
    this.ctx.fill()
    this.ctx.stroke();
  }


  drawOffScreen() {
    const { cellwidth, cellCountX } = this.state
      // aren't those on redux now?
    let { octavePx } = this.props

    const ctx = this.offscreen.getContext('2d')

    let x = 0
    for (let i=0; i<cellCountX; i++) {
      let y =  octavePx * 7
      console.log('y', y)
      this.state.pitchMap.forEach((pitchObj, i) => {
        const cellheight = octavePx * ((pitchObj.nextCents - pitchObj.cents) / 1200)
        // console.log('cellheight', cellheight)
        const celltop = y - cellheight
        ctx.beginPath();
        ctx.fillStyle = pitchObj.color;
        ctx.strokeStyle = "rgb(24,24,24)";
        ctx.fillRect(x, celltop, cellwidth, cellheight);
        ctx.strokeRect(x, celltop, cellwidth, cellheight);

        y -= cellheight
      })
      x+=cellwidth
    }
  }

  drawOnScreen() {
    const { compositionLength, zoomX, zoomY, scrollLeft, scrollTop } = this.props;
    console.log('measures', compositionLength * 50, octaves * 12 * 25);
    console.log('offsets', this.canvas.offsetWidth, this.canvas.offsetHeight)
    console.log('zoomz', zoomX, zoomY)
    this.ctx.drawImage(
      this.offscreen,
      scrollLeft, 0,
      (compositionLength * offscreenCellWidth) / zoomX + scrollLeft,
      (octaves * offscreenOctavePx) / zoomY + scrollTop,
      0, 0,
      this.canvas.offsetWidth, this.canvas.offsetHeight
    );
  }

  handleClick(e) {
    const { processNoteEvent } = this.props
    const rect = e.target.getBoundingClientRect()
    const xPix = e.clientX - rect.left;
    const yPix = rect.bottom - e.clientY;
    // console.log('xPIx', xPix); console.log('yPix', yPix);
    const noteInfo = {}
    this.state.pitchMap.forEach((pitchObj, index)=>{
      const cellStart = (pitchObj.totalCents/1200) * this.props.octavePx
      const cellEnd = (pitchObj.totalCentsNext/1200) * this.props.octavePx
      if (yPix >= cellStart && yPix < cellEnd) {
        noteInfo.octave = Math.floor(yPix / this.props.octavePx)
        noteInfo.cents = pitchObj.cents
        noteInfo.start = Math.floor(xPix / this.state.cellwidth)
        noteInfo.duration = 1
        noteInfo.selected = false
      }
    })
    // console.log('noteInfo', noteInfo)

    processNoteEvent(noteInfo);
  }

  render() {
    // console.log('PianoRoll.js rendering')
    const { cellwidth, cellCountX } = this.state
    let { octavePx } = this.props
    const height = octavePx * 7
    const width = cellwidth * cellCountX
    // console.log('ctx', this.ctx) // NOTE: undefined on initial render

    return (
      <Wrapper>
        <canvas
          // height={height}
          // height="100%"
          // width={width}
          // width="100%"
          ref={this.canvasRef}
          onClick={(e) => this.handleClick(e)}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    octavePx: state.octavePx,
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

