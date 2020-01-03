import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditorContainer from "../EditorContainer/EditorContainer"
import {Wrapper} from "../App.styles"

class Compose extends Component {
  render() {
    return (
      <div>
        <EditorContainer
          togglePianoBarZoomAndScroll={this.props.togglePianoBarZoomAndScroll}
          scrollTop={this.props.scrollTop}
        />
      </div>
    )
  }
}

function mapStateToProps() {}

export default connect(mapStateToProps)(Compose);