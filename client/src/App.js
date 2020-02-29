/* eslint-disable */
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { Wrapper } from './App.styles'
import {
  fetchUser,
  setGemBoxX, setGemBoxY, setGemBoxWidth, setGemBoxHeight
} from './redux/actions'

import Compose from './containers/Compose'
import passPropsToEmbededComponent from "./HOCS/passPropsToEmbededComponent"
import Header from "./components/Header/Header"
import Landing from './components/Landing';
import { octaves, offscreenOctavePx, offscreenCellWidth, maxZoom } from "./config/constants";

const Community = () => <h2>Other people who do this</h2>
const Wander = () => <h2>Explore stuff people have made</h2>
const Profile = () => <h2>Personal details and settings</h2>


class App extends Component {
  constructor() {
    super()
    this.state = {
      adjustingZoomY: false, // rename that
      adjustingScrollY: false,
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

  // THIS IS NEEDED to prevent re-render on click
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false
  }

  activateXZoomAndScroll = (x, y) => {
    console.log('xzs')
    this.setState({
      adjustingScrollX: true,
      adjustingZoomX: true,
      mouseLeft: x,
      mouseTop: y,
    })
  }

  activateYZoomAndScroll = (x, y) => {
    this.setState({
      adjustingScrollY: true,
      adjustingZoomY: true,
      mouseLeft: x,
      mouseTop: y,
    })
  }

  handleMouseMove = e => {
    const {
      setGemBoxX, setGemBoxWidth, setGemBoxY, setGemBoxHeight
    } = this.props;

    const deltaX = e.clientX - this.state.mouseLeft
    const deltaY = e.clientY - this.state.mouseTop

    if (this.state.adjustingScrollX) {
      setGemBoxX(deltaX)
      this.setState({mouseLeft: e.clientX})
    }
    if (this.state.adjustingZoomX) {
      setGemBoxWidth(deltaY)
      this.setState({mouseTop: e.clientY})
    }
    if (this.state.adjustingScrollY) {
      setGemBoxY(deltaY)
      this.setState({mouseTop: e.clientY})
    }
    if (this.state.adjustingZoomY) {
      setGemBoxHeight(deltaX)
      this.setState({mouseLeft: e.clientX})
    }
  }

  handleOnMouseUp = () => {
    // console.log('up')
    this.setState({
      adjustingScrollX: false,
      adjustingZoomX: false,
      adjustingScrollY: false,
      adjustingZoomY: false,
    })
  }


  render() {
    // console.log('App.js rendering')
    return (
      <Wrapper
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleOnMouseUp}
        onMouseLeave={this.handleOnMouseUp}
      >

        <BrowserRouter>
          {/*<div>*/}

            <Header />
            <Route exact path="/" component={Landing} />
            <Route
              exact path="/compose"
              component={passPropsToEmbededComponent({
                activateXZoomAndScroll: this.activateXZoomAndScroll,
                activateYZoomAndScroll: this.activateYZoomAndScroll,
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