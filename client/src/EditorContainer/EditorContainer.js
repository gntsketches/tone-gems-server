import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeTitle } from '../actions';
import { Wrapper } from './EditorContainer.styles';
import ReferenceRoll from './WesternReference/WesternReference';
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
    console.log('mounted scrollTop', this.props.scrollTop)
    this.pianoRollWrapRef.current.scrollTop = this.props.scrollTop;
  }

  // componentDidUpdate() {
  //   console.log('scrollTop prop', this.props.scrollTop)
  //   this.pianoRollWrapRef.current.scrollTop = this.props.scrollTop;
  // }

  handleTitleChange = (e) => {
    console.log(this.props.changeTitle(e.target.value));
  }

  handleOnScroll = (e) => {
    console.log('onScroll in Editor Container', e.target.scrollTop)
    this.props.handlePianoRollScroll(e.target.scrollTop)
  }

  render() {
    const { toggleAdjustingVerticalZoom } = this.props
    return (
      <Wrapper>
        <span>Title: </span>
        <input
          type="text"
          value={this.props.title}
          onChange={(e)=>this.handleTitleChange(e)}
        />
        <div
          className="pianoRollWrap"
          ref={this.pianoRollWrapRef}
          onScroll={this.handleOnScroll}
        >
          {/*<ReferenceRoll />*/}
          <MicrotoneReference
            togglePianoBarZoomAndScroll={this.props.togglePianoBarZoomAndScroll}
          />
          {/*<PianoRoll  />*/}
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    notes: state.notes,
    title: state.title
  };
};


export default connect(
  mapStateToProps,
  { changeTitle: changeTitle }
)(EditorContainer);
