/* eslint-disable */
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { Wrapper } from './App.styles'
import {
  fetchUser, updateOctavePx,
  setGemBoxX, setGemBoxY, setGemBoxWidth, setGemBoxHeight
} from './actions'

import Compose from './containers/Compose'
import passPropsToEmbededComponent from "./HOCS/passPropsToEmbededComponent"
import Header from "./components/Header/Header"
import Landing from './components/Landing';
import { octaves, offscreenOctavePx, offscreenCellWidth } from "./config/constants";

const Community = () => <h2>Other people who do this</h2>
const Wander = () => <h2>Explore stuff people have made</h2>
const Profile = () => <h2>Personal details and settings</h2>


class App extends Component {
  constructor() {
    super()
    this.state = {
      adjustingVerticalZoom: false, // rename that
      mouseLeft: '',
      mouseTop: '',
      canvasHeight: null
    }
    this.scrollTimer = -1

  };

  componentDidMount() {
    this.props.fetchUser()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('App.js updated')
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const newOctavePx = this.props.octavePx !== nextProps.octavePx
    const newScrollTop = this.props.octavePx !== nextProps.scrollTop
    // console.log('nextProps.scrollTop', nextProps.scrollTop)
    return false
  }

  setCanvasHeight = height => { // called on Piano didMount. can probably get rid of it in favor of passing height arg
    this.setState({canvasHeight: height })
  }

  togglePianoBarZoomAndScroll = (x, y, height) => {
    // console.log('toggling')
    this.setState({
      adjustingVerticalZoom: !this.state.adjustingVerticalZoom,
      mouseLeft: x,
      mouseTop: y,
    })
  }

  handleMouseMove = e => {
    const { gemBoxX, gemBoxY, gemBoxWidth, gemBoxHeight } = this.props;
    if (this.state.adjustingVerticalZoom) {
      // RATHER than zoomx/Y, think of 'height/width' of an inner box relative to the offscreen (which happens to be mapped to onscren)
      // also call it xOffset yOffset rather than scrollLeft/Right
      // (x, y, width, height) and also (offscreenWidth, offscreenHeight)
        // so it's way easier to bound this using min & max functions -
          // can you extract the mouseDrag logic to a helper or something?

      const offscreenHeight = offscreenOctavePx*octaves
      const deltaY = e.clientY - this.state.mouseTop
      const deltaYAdjusted = deltaY * (gemBoxHeight / this.state.canvasHeight)
      let gemBoxAdjusted = gemBoxY - deltaYAdjusted
      const gemBoxYMax =  offscreenHeight - gemBoxHeight
      if (gemBoxAdjusted < 0) { gemBoxAdjusted = 0 }
      if (gemBoxAdjusted > gemBoxYMax) { gemBoxAdjusted = gemBoxYMax}
      this.setState({ mouseTop: e.clientY })
      this.props.setGemBoxY(gemBoxAdjusted); // could limit calls with if-already-at-range logic


      // const leftMod = e.clientX - (e.clientX - this.state.mouseLeft)/2
      // const leftRatio = leftMod/this.state.mouseLeft
      // console.log('leftRatio', leftRatio)
      // const newZoomY = (this.props.zoomY * leftRatio) // multiplier to adjust zoom speed? tricky... try subtracting (e.clientX-this.state.mouseLeft)/2
      // console.log('newZoomY', newZoomY)
      // const newZYAdj = Math.floor(newZoomY*1000)/1000
      // console.log('newZYAdj', newZYAdj)
      // if (newZYAdj >= 1 && newZYAdj <= 4) {
      //   this.props.setZoomY(newZYAdj)
      //   this.setState({mouseLeft: e.clientX}) //, ()=>console.log('newMouseLeft', this.state.mouseLeft))


      // }
      //   console.log('maxScrollPixelsOnScreen * yScale / this.props.zoomY', maxScrollPixelsOnScreen * yScale / this.props.zoomY)
    }
  }

  handleOnMouseUp = () => {
    if (this.state.adjustingVerticalZoom) {
      console.log('up')
      this.togglePianoBarZoomAndScroll()
    }
  }


  render() {
    // console.log('App.js rendering')
    return (
      <Wrapper
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleOnMouseUp}
      >

        <BrowserRouter>
          {/*<div>*/}

            <Header />
            <Route exact path="/" component={Landing} />
            <Route
              exact path="/compose"
              component={passPropsToEmbededComponent({
                setCanvasHeight: this.setCanvasHeight,
                togglePianoBarZoomAndScroll: this.togglePianoBarZoomAndScroll,
              })(Compose)}
            />
            <Route exact path="/community" component={Community} />
            <Route exact path="/wander" component={Wander} />
            <Route exact path="/profile" component={Profile} />

          {/*</div>*/}
        </BrowserRouter>

      </Wrapper>
    );
  }
}


const mapStateToProps = state => {
  return {
    octavePx: state.octavePx,
    gemBoxX: state.gemBoxX,
    gemBoxY: state.gemBoxY,
    gemBoxWidth: state.gemBoxWidth,
    gemBoxHeight: state.gemBoxHeight
  };
};


export default connect(
  mapStateToProps,
  {
    fetchUser,
    updateOctavePx,
    setGemBoxX,
    setGemBoxY,
    setGemBoxWidth,
    setGemBoxHeight
  }
)(App);



/*

// NOTE: though you are measuring onscreen pixels, the actual scroll value is calculated for the offscreen,
//   so transforms are needed for mouse movement as well as boundaries
const offscreenHeight = offscreenOctavePx*octaves
const yScale = offscreenHeight / this.state.canvasHeight
const onscreenOctavePx = offscreenOctavePx / yScale * this.props.zoomY
const scrollTopAdjust = (e.clientY - this.state.mouseTop) * yScale / this.props.zoomY
const newPianoRollScrollTop = this.props.scrollTop + scrollTopAdjust
const maxScrollPixelsOnScreen = onscreenOctavePx * octaves - this.state.canvasHeight
// console.log('onscreenOctavePx', onscreenOctavePx)
// console.log('e.clientY', e.clientY, 'mouseTop', this.state.mouseTop)
// console.log('scrollTopAdjust', scrollTopAdjust)
// console.log('newPianoRollScrollTop', newPianoRollScrollTop)
// console.log('maxScrollPixelsOnScreen', maxScrollPixelsOnScreen)
// console.log('maxScrollPixelsOnScreen * yScale / this.props.zoomY', maxScrollPixelsOnScreen * yScale / this.props.zoomY)
if (newPianoRollScrollTop >=0 && newPianoRollScrollTop <= maxScrollPixelsOnScreen * yScale / this.props.zoomY) {
  // if (newPianoRollScrollTop >=0) {
  this.setState({
    mouseTop: e.clientY
  })
  this.props.setScrollTop(newPianoRollScrollTop);
}


const leftMod = e.clientX - (e.clientX - this.state.mouseLeft)/2
const leftRatio = leftMod/this.state.mouseLeft
console.log('leftRatio', leftRatio)
const newZoomY = (this.props.zoomY * leftRatio) // multiplier to adjust zoom speed? tricky... try subtracting (e.clientX-this.state.mouseLeft)/2
console.log('newZoomY', newZoomY)
const newZYAdj = Math.floor(newZoomY*1000)/1000
console.log('newZYAdj', newZYAdj)
if (newZYAdj >= 1 && newZYAdj <= 4) {
  this.props.setZoomY(newZYAdj)
  this.setState({mouseLeft: e.clientX}) //, ()=>console.log('newMouseLeft', this.state.mouseLeft))


}
console.log('maxScrollPixelsOnScreen * yScale / this.props.zoomY', maxScrollPixelsOnScreen * yScale / this.props.zoomY)
}


 */