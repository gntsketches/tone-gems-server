/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Wrapper } from './MicrotoneReference.styles';
import { octaves, offscreenOctavePx, offscreenCellWidth, offscreenReferenceWidth} from "../../config/constants";
// import { addRemoveNote } from '../../actions';
import { buildPitchSet } from '../../helpers/helpers'


class MicrotoneReference extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    const offscreenHeight = octaves * offscreenOctavePx;
    // console.log('reference offscreenHeight', offscreenHeight)
    this.offscreen = new OffscreenCanvas(offscreenReferenceWidth, offscreenHeight);

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
    let cellwidth = this.canvas.offsetWidth;
    let y =  offscreenOctavePx * octaves
    // console.log('y', y)
    const offscreenCtx = this.offscreen.getContext('2d')

    const pitchMap = buildPitchSet(
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

    // console.log(pitchMap)
    pitchMap.forEach((pitchObj, i) => {
       // console.log(pitchObj.pitch, i)
      const cellheight = offscreenOctavePx * ((pitchObj.nextCents - pitchObj.cents) / 1200)
      // console.log('cellheight', cellheight)
      const celltop = y - cellheight
      offscreenCtx.beginPath();
      offscreenCtx.fillStyle = pitchObj.color;
      offscreenCtx.strokeStyle = "rgb(24,24,24)";
      offscreenCtx.fillRect(0, celltop, cellwidth, cellheight);
      offscreenCtx.strokeRect(0, celltop, cellwidth, cellheight);

      offscreenCtx.fillStyle = 'blue'
      offscreenCtx.font = "8px Arial";
      const text = pitchObj.index===0 ? 'HZ: '+pitchObj.pitch : '+'+pitchObj.cents+'c'
      offscreenCtx.fillText(text, 10, celltop+cellheight-2);

      y -= cellheight
    })
  }

  drawOnScreen() {
    const { gemBoxY, height } = this.props;
    // console.log('reference offsets', this.canvas.offsetWidth, this.canvas.offsetHeight)
    // console.log('zoomY', zoomY)
    const offscreenHeight = octaves * offscreenOctavePx;
    this.ctx.drawImage(
      this.offscreen,
      0, gemBoxY, offscreenReferenceWidth, height,
      0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight,
    );
  }

  handleOnMouseDown(e) {
    // console.log('scrollTop', e.target.scrollTop)
    this.props.togglePianoBarZoomAndScroll(e.clientX, e.clientY)
  }


  render() {
    // console.log('MicrotoneReference.js rendering')
    const offscreenHeight = octaves * offscreenOctavePx;

    return (
      <Wrapper>
        <canvas
          // height={offscreenHeight}
          style={{background: 'blue'}}
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
    height: state.gemBoxHeight,
    gemBoxY: state.gemBoxY,
  };
};


export default connect(
  mapStateToProps,
  null
)(MicrotoneReference);
