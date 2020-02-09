import React, { Component } from 'react';
import { connect } from 'react-redux';

import { processNoteEvent } from '../../actions';
import { Wrapper } from './PianoRoll.styles';


class PianoRoll extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    // this.state = {};
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.w = this.canvas.scrollWidth;
    this.h = this.canvas.scrollHeight;
    this.cellwidth = 50
    this.cellheight = 20
    this.drawPianoGrid();
    this.drawNotes()
  }

  componentDidUpdate() {
    this.drawPianoGrid();
    this.drawNotes()
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
    x=x * this.cellwidth;
    y=y * this.cellheight;
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

  // drawPlayHead(x) {
  //   ctx.beginPath();
  //   ctx.moveTo(x,0);
  //   ctx.lineWidth = 2;
  //   ctx.strokeStyle = "red";
  //   ctx.lineTo(x,h);
  //   ctx.shadowBlur=0;
  //   ctx.stroke();
  // }


  drawPianoGrid() {
    for(let y=0; y < this.h; y=y+this.cellheight){
      for(let x=0; x < this.w; x=x+this.cellwidth){
        // horizontal lines strangely fade at the far right side
        if(y % (12*this.cellheight) === 0){
          this.ctx.beginPath();
          this.ctx.moveTo(0, y);
          this.ctx.strokeStyle = "#aaa";
          this.ctx.lineTo(this.w, y);
          this.ctx.shadowBlur=0;
          this.ctx.stroke();
        }
        if(x % (4*this.cellwidth) === 0){
          this.ctx.beginPath();
          this.ctx.moveTo(x,0);
          this.ctx.strokeStyle = "black";
          this.ctx.lineTo(x, this.h);
          this.ctx.shadowBlur=0;
          this.ctx.stroke();
        }
        this.ctx.beginPath();
        if(
          (y+11*this.cellheight) % (12*this.cellheight)===0 ||
          (y+9*this.cellheight) % (12*this.cellheight)===0 ||
          (y+7*this.cellheight) % (12*this.cellheight)===0 ||
          (y+4*this.cellheight) % (12*this.cellheight)===0 ||
          (y+2*this.cellheight) % (12*this.cellheight)===0
        ){
          this.ctx.fillStyle = "rgb(32,32,32)";
        }else{
          this.ctx.fillStyle = "rgb(45,45,80)";
        }
        this.ctx.strokeStyle = "rgb(24,24,24)";
        this.ctx.rect(x, y, this.cellwidth, this.cellheight);
        this.ctx.fill()
        this.ctx.stroke();
      }
    }
  }


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

  handleClick(e) {
    const rect = e.target.getBoundingClientRect()
    const xPix = e.clientX - rect.left;
    const yPix = e.clientY - rect.top;
    const x = Math.floor(xPix / this.cellwidth)
    const y = Math.floor(yPix / this.cellheight)
    this.props.addRemoveNote(this.props.notes, [x, y, 1]);
  }

  render() {

    return (
      <Wrapper>
        <canvas
          // id="pianoroll"
          height="600"
          width="1000"
          ref={this.canvasRef}
          onClick={(e) => this.handleClick(e)}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    octavePix: state.octavePix,
    notes: state.notes,
  };
};


export default connect(
  mapStateToProps,
  { addRemoveNote: processNoteEvent }
)(PianoRoll);
