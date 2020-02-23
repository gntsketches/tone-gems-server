/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeTitle, setScrollTop } from '../actions';
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
    // console.log('mounted scrollTop', this.props.scrollTop)
    // this.pianoRollWrapRef.current.scrollTop = this.props.scrollTop;
  }

  componentDidUpdate() {
    // what, what actually does UPDATE mean?
      // note that loads of rerenders happen in the piano roll without this ever being called...
    // console.log('updated scrollTop', this.props.scrollTop)
    // this.pianoRollWrapRef.current.scrollTop = this.props.scrollTop;
  }



  handleOnScroll = (e) => {
    // console.log('onScroll in Editor Container', e.target.scrollTop)
    this.props.setScrollTop(e.target.scrollTop);
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
    notes: state.notes,
    title: state.title,
    scrollTop: state.scrollTop,
  };
};


export default connect(
  mapStateToProps,
  {
    changeTitle: changeTitle,
    setScrollTop: setScrollTop,
  }
)(EditorContainer);
