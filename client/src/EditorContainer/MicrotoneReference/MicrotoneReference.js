import React, { Component } from 'react';
import { connect } from 'react-redux';

// import { addRemoveNote } from '../../actions';
import { buildPitchSet } from '../../helpers/helpers'
import { Wrapper } from './MicrotoneReference.styles';


class MicrotoneReference extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      mouseDown: false
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.cellwidth = 50
    this.drawPitches();
  }

  componentDidUpdate() {
    this.drawPitches();
  }

  // each gem gets a pitch array, notes get assigned to an index for pitchClass and an octave
    //  transposing: just a matter of changing pitchesArray,
    // if the array is different notes are moved (by *cents*) to the closest value by rounding


  drawPitches() {
    let { octavePx } = this.props;
    let y =  octavePx * 7
    // console.log('y', y)


    const base = 261.63
    const cents = [0, 75, 200, 250, 400, 500, 600, 700, 800, 850, 1000, 1100]
    // const cents = [0, 54.54, 109.08, ] // 22edo ... edos add each value? or division feature?
    //  lets say cents input accepts a string which converts to an array of numbers OR '11edo', 22 tet', etc...
    const shaded = [2,4,7,9,11]
    const pitchMap = buildPitchSet(base, cents, shaded)

    // console.log(pitchMap)
    pitchMap.forEach((pitchObj, i) => {
       // console.log(pitchObj.pitch, i)
      // let nextPitch // if (i===pitchMap.length-1) { nextPitch = pitchMap[i]+20 } // this isn't displaying... yet... // else { nextPitch = pitchMap[i+1].pitch } // const cellheight = octavePx * Math.log2(nextPitch / pitchObj.pitch)
      const cellheight = octavePx * ((pitchObj.nextCents - pitchObj.cents) / 1200)
      // console.log('cellheight', cellheight)
      const celltop = y - cellheight
      this.ctx.beginPath();
      if (pitchObj.shaded) {
        this.ctx.fillStyle = "rgb(132,132,132)";
      } else {
        this.ctx.fillStyle = "rgb(225,225,225)";
      }
      this.ctx.strokeStyle = "rgb(24,24,24)";
      this.ctx.fillRect(0, celltop, this.cellwidth, cellheight);
      this.ctx.strokeRect(0, celltop, this.cellwidth, cellheight);

      this.ctx.fillStyle = "blue";
      this.ctx.font = "8px Arial";
      const text = pitchObj.index===0 ? 'HZ: '+pitchObj.pitch : '+'+pitchObj.cents+'c'
      this.ctx.fillText(text, 20, celltop+cellheight-2);

      y -= cellheight
    })
  }


  handleOnMouseDown(e) {
    console.log('scrollTop', e.target.scrollTop)
    this.props.togglePianoBarZoomAndScroll(e.clientX, e.clientY)
  }


  render() {
    let { octavePx } = this.props
    // octavePx = octavePx/2
    // console.log('octavePx', octavePx)
    const height = octavePx * 7
    // console.log('height', height)
    return (
      <Wrapper>
        <canvas
          // id="pianoroll"
          height={height}
          width="50"
          ref={this.canvasRef}
          onMouseDown={(e) => this.handleOnMouseDown(e)}
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
)(MicrotoneReference);
