/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeTitle } from '../redux/actions';
import { Wrapper } from './EditorContainer.styles';
import TimeScroll from "./TimeScroll/TimeScroll"
// import ReferenceRoll from './WesternReference/WesternReference';
import MicrotoneReference from './MicrotoneReference/MicrotoneReference';
import PianoRoll from './PianoRoll/PianoRoll';

class EditorContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    // what, what actually does UPDATE mean?
      // note that loads of rerenders happen in the piano roll without this ever being called...
  }


  render() {
    // console.log('EditorContainer.js rendering')
    const { title } = this.props
    // console.log('title', title)
    return (
      <Wrapper>
        <TimeScroll
          activateXZoomAndScroll={this.props.activateXZoomAndScroll}
        />
        <MicrotoneReference
          activateYZoomAndScroll={this.props.activateYZoomAndScroll}
        />
        <PianoRoll />
      </Wrapper>
    );
  }
}

// <div THAT FORMERLY WRAPPED THE REFERENCE AND PIANO-ROLLS
//   className="pianoRollWrap"
//   ref={this.pianoRollWrapRef}
//   onScroll={this.handleOnScroll}
// >
  const mapStateToProps = state => {
  // console.log('state', state)
  return {
    title: state.title,
  };
};


export default connect(
  mapStateToProps,
  {
    changeTitle: changeTitle,
  }
)(EditorContainer);
