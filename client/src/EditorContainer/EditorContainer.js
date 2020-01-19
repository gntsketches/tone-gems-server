import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeTitle, setScrollTop } from '../actions';
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
    // console.log('mounted scrollTop', this.props.scrollTop)
    this.pianoRollWrapRef.current.scrollTop = this.props.scrollTop;
  }

  componentDidUpdate() {
    // what, what actually does UPDATE mean?
      // note that loads of rerenders happen in the piano roll without this ever being called...
    console.log('updated scrollTop', this.props.scrollTop)
    this.pianoRollWrapRef.current.scrollTop = this.props.scrollTop;
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false
  }

  handleTitleChange = (e) => {
    console.log(this.props.changeTitle(e.target.value));
  }


  handleOnScroll = (e) => {
    // console.log('onScroll in Editor Container', e.target.scrollTop)
    this.props.setScrollTop(e.target.scrollTop);
  }

  render() {
    console.log('editor container rendering')
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
          <PianoRoll  />
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
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
