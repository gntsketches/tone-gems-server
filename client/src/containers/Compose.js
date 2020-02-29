/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Wrapper } from './Compose.styles'
import EditorContainer from "../EditorContainer/EditorContainer"
import {changeTitle } from "../redux/actions"

class Compose extends Component {
  render() {
    const { title } = this.props;
    return (
      <Wrapper>

        <div className="title">
          <span>Title: </span>
          <input
            type="text"
            value={title}
            onChange={(e)=>this.handleTitleChange(e)}
          />
        </div>

        <EditorContainer
          activateXZoomAndScroll={this.props.activateXZoomAndScroll}
          activateYZoomAndScroll={this.props.activateYZoomAndScroll}
        />
      </Wrapper>
    )
  }


  handleTitleChange = (e) => {
    const { changeTitle } = this.props;
    // console.log(e.target.value);
    changeTitle(e.target.value)
  }
}

const mapStateToProps = state => {
  // console.log('state', state)
  return { title: state.title };
};


export default connect(
  mapStateToProps,
  { changeTitle: changeTitle }
)(Compose);


