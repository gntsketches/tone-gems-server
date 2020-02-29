/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeTitle } from '../actions';
import { Wrapper } from './EditorContainer.styles';
import TimeScroll from "./TimeScroll/TimeScroll"
// import ReferenceRoll from './WesternReference/WesternReference';
import MicrotoneReference from './MicrotoneReference/MicrotoneReference';
import PianoRoll from './PianoRoll/PianoRoll';

class EditorContainer extends Component {
  constructor(props) {
    super(props);

    this.pianoRollWrapRef = React.createRef();
    this.state = {
    };
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
        <TimeScroll />
        <MicrotoneReference
          togglePianoBarZoomAndScroll={this.props.togglePianoBarZoomAndScroll}
        />
        <PianoRoll
          setCanvasHeight={this.props.setCanvasHeight}
        />
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
    notes: state.notes,
    title: state.title,
  };
};


export default connect(
  mapStateToProps,
  {
    changeTitle: changeTitle,
  }
)(EditorContainer);
