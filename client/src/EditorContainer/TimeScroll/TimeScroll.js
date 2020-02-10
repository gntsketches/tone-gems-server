import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Wrapper } from './TimeScroll.styles';


class TimeScroll extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      mouseDown: false
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
  }

  componentDidUpdate() {
  }



  handleOnMouseDown(e) {
    console.log('scrollTop', e.target.scrollTop)
    // this.props.togglePianoBarZoomAndScroll(e.clientX, e.clientY)
  }


  render() {
    // console.log('MicrotoneReference.js rendering')
    let { octavePx } = this.props
    // octavePx = octavePx/2
    // console.log('octavePx', octavePx)
    const height = octavePx * 7
    // console.log('height', height)
    return (
      <Wrapper>
        <canvas
          style={{background: 'green'}}
          ref={this.canvasRef}
          onMouseDown={(e) => this.handleOnMouseDown(e)}
        />
      </Wrapper>
    );
  }

}

const mapStateToProps = state => {
  return {
    octavePx: state.octavePx
  };
};


export default connect(
  mapStateToProps,
  // { addRemoveNote: addRemoveNote }
)(TimeScroll);
