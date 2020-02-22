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
      // console.log('newOctavePx', newOctavePx)
      if (newOctavePx > 400/7 && newOctavePx < 500) {
        this.props.updateOctavePx(newOctavePx)
        this.setState({mouseLeft: e.clientX}) //, ()=>console.log('newMouseLeft', this.state.mouseLeft))
      }

      const scrollTopAdjust = - (e.clientY - this.state.mouseTop)
      console.log('scrollTopAdjust', scrollTopAdjust)
      const newPianoRollScrollTop = this.props.scrollTop + scrollTopAdjust
      if (newPianoRollScrollTop >=0 && newPianoRollScrollTop <= newOctavePx*7) {
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




