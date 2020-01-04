import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { Wrapper } from './App.styles'
import { fetchUser, updateOctavePx } from './actions'

import Compose from './containers/Compose'
import passPropsToEmbededComponent from "./HOCS/passPropsToEmbededComponent"
import Header from "./components/Header/Header"

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
      pianoRollScrollTop: 0,
    }
  };

  componentDidMount() {
    this.props.fetchUser()
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

        <BrowserRouter>
          <div>

            <Header />
            <Route
              exact path="/compose"
              component={passPropsToEmbededComponent({
                togglePianoBarZoomAndScroll: this.togglePianoBarZoomAndScroll,
                scrollTop: this.state.pianoRollScrollTop
              })(Compose)}
            />
            <Route exact path="/community" component={Community} />
            <Route exact path="/wander" component={Wander} />
            <Route exact path="/profile" component={Profile} />

          </div>
        </BrowserRouter>

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
  {
    fetchUser: fetchUser,
    updateOctavePx: updateOctavePx
  }
)(App);




{/*<Compose*/} {/*  togglePianoBarZoomAndScroll={this.togglePianoBarZoomAndScroll}*/} {/*  scrollTop={this.state.pianoRollScrollTop}*/} {/*/>*/}
