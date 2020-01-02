import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addRemoveNote } from '../../actions';
import { Wrapper } from './PianoRoll.styles';
import {buildPitchSet} from "../../helpers/helpers"


class PianoRoll extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      cellwidth: 50,
      cellCountX: 128
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    // this.w = this.canvas.scrollWidth;
    // this.h = this.canvas.scrollHeight;
    // this.cellheight = 20
    this.drawPianoGrid();
    // this.drawNotes()
  }

  componentDidUpdate() {
    this.drawPianoGrid();
    // this.drawNotes()
  }

  drawNotes() {
    // this.state.notes.forEach(noteArr => this.drawNote(noteArr))
    this.props.notes.forEach(noteArr => this.drawNote(noteArr))
    console.log('notes', this.props.notes)
  }

  drawNote(noteArray) {
    let x = noteArray[0];
    let y = noteArray[1];
    let length = noteArray[2];
    let selected = noteArray[3] || false;
    x=x * this.state.cellwidth;
    y=y * this.state.cellheight;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgb(128,128,128)";
    if(selected){
      this.ctx.strokeStyle = "rgb(255,255,255)";
    }else{
      this.ctx.strokeStyle = "rgb(24,24,24)";
    }
    this.ctx.rect(x, y, this.cellwidth*length, this.cellheight);
    this.ctx.fill()
    this.ctx.stroke();
  }

  drawPianoGrid() {
    const { cellwidth, cellCountX } = this.state
    let { octavePx } = this.props

    const base = 261.63
    const cents = [0, 75, 200, 250, 400, 500, 600, 700, 800, 850, 1000, 1100]
    // const cents = [0, 54.54, 109.08, ] // 22edo ... edos add each value? or division feature?
    //  lets say cents input accepts a string which converts to an array of numbers OR '11edo', 22 tet', etc...
    const shaded = [2,4,7,9,11]
    const pitchMap = buildPitchSet(base, cents, shaded)

    let x = 0
    for (let i=0; i<cellCountX; i++) {
      console.log('x', x)
      let y =  octavePx * 7
      pitchMap.forEach((pitchObj, i) => {
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
    const rect = e.target.getBoundingClientRect()
    const xPix = e.clientX - rect.left;
    const yPix = e.clientY - rect.top;
    const x = Math.floor(xPix / this.cellwidth)
    const y = Math.floor(yPix / this.cellheight)
    this.props.addRemoveNote(this.props.notes, [x, y, 1]);
  }

  render() {
    const { cellwidth, cellCountX } = this.state
    let { octavePx } = this.props
    const height = octavePx * 7
    const width = cellwidth * cellCountX

    return (
      <Wrapper>
        <canvas
          height={height}
          width={width}
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
  { addRemoveNote: addRemoveNote }
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
