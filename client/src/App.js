import React, { Component } from 'react';
import { connect } from 'react-redux';

// import CanvasAnimationTut from "./CanvasAnimationTut/CanvasAnimationTut"
import EditorContainer from './EditorContainer/EditorContainer';
import { Wrapper } from './App.styles';
import { updateOctavePx } from './actions'

class App extends Component {
  constructor() {
    super()
    this.state = {
      adjustingVerticalZoom: false,
      mouseLeft: '',
      mouseTop: '',
      pianoRollScrollTop: 0,
    }
  };

  togglePianoBarZoomAndScroll = (x, y) => {
    console.log('toggling')
    this.setState({
      adjustingVerticalZoom: !this.state.adjustingVerticalZoom,
      mouseLeft: x,
      mouseTop: y,
    })
  }

  handleMouseMove = e => {
    if (this.state.adjustingVerticalZoom) {
      const leftMod = e.clientX - (e.clientX - this.state.mouseLeft)/2
      const leftRatio = leftMod/this.state.mouseLeft
      const newOctavePx = (this.props.octavePx * leftRatio) // multiplier to adjust zoom speed? tricky... try subtracting (e.clientX-this.state.mouseLeft)/2
      console.log('newOctavePx', newOctavePx)
      if (newOctavePx > 400/7 && newOctavePx < 500) {
        this.props.updateOctavePx(newOctavePx)
        this.setState({mouseLeft: e.clientX}, ()=>console.log('newMouseLeft', this.state.mouseLeft))
      }

      const scrollTopAdjust = - (e.clientY - this.state.mouseTop)
      console.log('scrollTopAdjust', scrollTopAdjust)
      const newPianoRollScrollTop = this.state.pianoRollScrollTop + scrollTopAdjust
      if (newPianoRollScrollTop >=0 && newPianoRollScrollTop <= newOctavePx*7) {
        this.setState({
          pianoRollScrollTop: newPianoRollScrollTop,
          mouseTop: e.clientY
        })
      }

    }
  }

  handleOnMouseUp = e => {
    if (this.state.adjustingVerticalZoom) {
      console.log('up', e)
      this.togglePianoBarZoomAndScroll()
    }
  }

  render() {

    return (
      <Wrapper
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleOnMouseUp}
      >
        <EditorContainer
          togglePianoBarZoomAndScroll={this.togglePianoBarZoomAndScroll}
          scrollTop={this.state.pianoRollScrollTop}
        />
      </Wrapper>
    );
  }
}



const mapStateToProps = state => {
  return {
    // notes: state.notes,
    octavePx: state.octavePx
  };
};


export default connect(
  mapStateToProps,
  { updateOctavePx: updateOctavePx }
)(App);

