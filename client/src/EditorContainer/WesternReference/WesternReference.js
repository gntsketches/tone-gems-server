import React, { Component } from 'react';
import { connect } from 'react-redux';

// import { addRemoveNote } from '../../actions';
import { Wrapper } from './WesternReference.styles';


class WesternReference extends Component {
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
  }

  componentDidUpdate() {
    this.drawPianoGrid();
  }

  drawPianoGrid() {
    // console.log(this.props)
    const cellheight = this.props.octavePx / 12;
    // console.log('cellheight', cellheight)
    for(let y=0; y < this.h; y=y+cellheight){
      for(let x=0; x < this.w; x=x+this.cellwidth){
        if(y % (12*cellheight) === 0){
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
          (y+11*cellheight) % (12*cellheight)===0 ||
          (y+9*cellheight) % (12*cellheight)===0 ||
          (y+7*cellheight) % (12*cellheight)===0 ||
          (y+4*cellheight) % (12*cellheight)===0 ||
          (y+2*cellheight) % (12*cellheight)===0
        ){
          this.ctx.fillStyle = "rgb(32,32,32)";
        }else{
          this.ctx.fillStyle = "rgb(225,225,225)";
        }
        this.ctx.strokeStyle = "rgb(24,24,24)";
        this.ctx.rect(x, y, this.cellwidth, cellheight);
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

  }

  render() {
    return (
      <Wrapper>
        <canvas
          // id="pianoroll"
          height={this.props.octavePx * 7}
          width="50"
          ref={this.canvasRef}
          onClick={(e) => this.handleClick(e)}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    octavePx: state.octavePx
  };
};


export default connect(
  mapStateToProps,
  // { addRemoveNote: addRemoveNote }
)(WesternReference);
