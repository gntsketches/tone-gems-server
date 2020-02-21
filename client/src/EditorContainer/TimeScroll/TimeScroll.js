import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Wrapper } from './TimeScroll.styles';
import { octaves, offscreenOctavePx, offscreenCellWidth,
  offscreenTimeScrollHeight, offscreenReferenceWidth
} from "../../config/constants";


class TimeScroll extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    const offscreenWidth = this.props.compositionLength * offscreenCellWidth;
    this.offscreen = new OffscreenCanvas(offscreenWidth, offscreenTimeScrollHeight);


    this.state = {
      mouseDown: false
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    // WORKS BUT DOESN'T ACCOUNT FOR SCREEN RESIZE

    this.drawOffscreen();
    this.drawOnScreen()
  }

  componentDidUpdate() {
    this.drawOffscreen();
    this.drawOnScreen()
  }

  drawOffscreen() {
    const { compositionLength } = this.props;
    const offscreenCtx = this.offscreen.getContext('2d')

    let x = 0;
    for (let i=0; i < compositionLength ; i++) {
      // console.log('x', x)
      if (i % 4 === 0) {
        offscreenCtx.strokeStyle = "#000";
        offscreenCtx.beginPath();
        offscreenCtx.moveTo(x, this.offscreen.height-1);
        offscreenCtx.lineTo(x, this.offscreen.height-31);
        offscreenCtx.stroke();

        offscreenCtx.fillStyle = 'blue'
        offscreenCtx.font = "16px Arial";
        const text = (i+1).toString();
        offscreenCtx.fillText(text, x+5, this.offscreen.height-10);

      }

      x += offscreenCellWidth;
    }
  }

  drawOnScreen() {
    const { compositionLength, zoomX, scrollLeft } = this.props;
    // console.log('measures', compositionLength * 50, octaves * 12 * 25);
    // console.log('piano offsets', this.canvas.offsetWidth, this.canvas.offsetHeight)
    // console.log('zoomz', zoomX, zoomY)
    this.ctx.drawImage(
      this.offscreen,
      scrollLeft, 0,
      (compositionLength * offscreenCellWidth) / zoomX + scrollLeft,
      offscreenTimeScrollHeight,
      0, 0,
      this.canvas.offsetWidth, this.canvas.offsetHeight
    );
  }

  handleOnMouseDown(e) {
    console.log('scrollTop', e.target.scrollTop)
    // this.props.togglePianoBarZoomAndScroll(e.clientX, e.clientY)
  }


  render() {
    // console.log('MicrotoneReference.js rendering')
    let { octavePx } = this.props
    // octavePx = octavePx/2
    // console.log('octavePx', octavePx)
    const height = octavePx * 7
    // console.log('height', height)
    return (
      <Wrapper>
        <canvas
          style={{background: '#ccc'}}
          ref={this.canvasRef}
          onMouseDown={(e) => this.handleOnMouseDown(e)}
        />
      </Wrapper>
    );
  }

}

const mapStateToProps = state => {
  return {
    octavePx: state.octavePx,
    // notes: state.notes,
    compositionLength: state.compositionLength,
    zoomX: state.zoomX,
    // zoomY: state.zoomY,
    scrollLeft: state.scrollLeft,
    // scrollTop: state.scrollTop
  };
};


export default connect(
  mapStateToProps,
  // { addRemoveNote: addRemoveNote }
)(TimeScroll);
