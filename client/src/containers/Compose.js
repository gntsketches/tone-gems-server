import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditorContainer from "../EditorContainer/EditorContainer"

class Compose extends Component {
  render() {
    return (
      <div>
        <EditorContainer
          togglePianoBarZoomAndScroll={this.props.togglePianoBarZoomAndScroll}
          handlePianoRollScroll={this.props.handlePianoRollScroll}
          scrollTop={this.props.scrollTop}
        />
      </div>
    )
  }
}

function mapStateToProps({}) {}

export default connect()(Compose);