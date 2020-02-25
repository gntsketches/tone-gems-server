/* eslint-disable */
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { Wrapper } from './App.styles'
import { fetchUser, updateOctavePx, setScrollTop } from './actions'

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
      adjustingVerticalZoom: false,
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

  setCanvasHeight = height => {
    this.setState({canvasHeight: height })
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const newOctavePx = this.props.octavePx !== nextProps.octavePx
    const newScrollTop = this.props.octavePx !== nextProps.scrollTop
    // console.log('nextProps.scrollTop', nextProps.scrollTop)
    return false
  }

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
      if (newOctavePx > 400/octaves && newOctavePx < 500) {
        // this.props.updateOctavePx(newOctavePx)
        // this.setState({mouseLeft: e.clientX}) //, ()=>console.log('newMouseLeft', this.state.mouseLeft))
      }

      // NOTE: though you are measuring onscreen pixels, the actual scroll value is calculated for the offscreen,
      //   so transforms are needed for mouse movement as well as boundaries
      const offscreenHeight = offscreenOctavePx*octaves
      const yScale = offscreenHeight / this.state.canvasHeight
      const onscreenOctavePx = offscreenOctavePx / yScale * this.props.zoomY
      const scrollTopAdjust = - (e.clientY - this.state.mouseTop) * yScale / this.props.zoomY
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
    scrollTop: state.scrollTop,
    zoomX: state.zoomX,
    zoomY: state.zoomY
  };
};


export default connect(
  mapStateToProps,
  {
    fetchUser,
    updateOctavePx,
    setScrollTop,
  }
)(App);




