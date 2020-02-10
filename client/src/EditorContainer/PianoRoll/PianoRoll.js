import React, { Component } from 'react';
import { connect } from 'react-redux';

import { processNoteEvent } from '../../actions';
import { Wrapper } from './PianoRoll.styles';
import {buildPitchSet} from "../../helpers/helpers"


class PianoRoll extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      cellwidth: 50,
      cellCountX: 128,
      // const cents = [0, 75, 200, 250, 400, 500, 600, 700, 800, 850, 1000, 1100]
      centsAndPxHeights: this.mapCentsAndPxHeights([0, 75, 200, 250, 400, 500, 600, 700, 800, 850, 1000, 1100]),
      pitchMap: buildPitchSet(261.63, [0, 75, 200, 250, 400, 500, 600, 700, 800, 850, 1000, 1100], [2,4,7,9,11])
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.drawPianoGrid();
    this.drawNotes()
  }

  componentDidUpdate() {
    this.drawPianoGrid();
    // this.drawNotes()
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

  drawPianoGrid() {
    const { cellwidth, cellCountX } = this.state
    let { octavePx } = this.props

    let x = 0
    for (let i=0; i<cellCountX; i++) {
      // console.log('x', x)
      let y =  octavePx * 7
      this.state.pitchMap.forEach((pitchObj, i) => {
        const cellheight = octavePx * ((pitchObj.nextCents - pitchObj.cents) / 1200)
        // console.log('cellheight', cellheight)
        const celltop = y - cellheight
        this.ctx.beginPath();
        if (pitchObj.shaded) {
          this.ctx.fillStyle = "rgb(32,32,32)";
        } else {
          this.ctx.fillStyle = "rgb(45,45,80)";
        }
        this.ctx.strokeStyle = "rgb(24,24,24)";
        this.ctx.fillRect(x, celltop, cellwidth, cellheight);
        this.ctx.strokeRect(x, celltop, cellwidth, cellheight);

        // this.ctx.fillStyle = "blue";
        // this.ctx.font = "8px Arial";
        // const text = pitchObj.index===0 ? 'HZ: '+pitchObj.pitch : '+'+pitchObj.cents+'c'
        // this.ctx.fillText(text, 20, celltop+cellheight-2);

        y -= cellheight
      })
      x+=cellwidth
    }
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

    return (
      <Wrapper>
        <canvas
          style={{color: 'darkblue'}}
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
