import styled from 'styled-components/macro';

// const thing = props => `${props.thing || 50p}px`;
// https://github.com/styled-components/babel-plugin-styled-components

export const Wrapper = styled.div`
  
  width: 90%;
  height: 100%;

  background: #666;
  color: #ccc;

  >.pianoRollWrap {
    box-sizing: border-box;   
    display: flex;
    overflow: auto;
    // height: 400px;
    height: 100%;
    // width: 600px;
    width: 100%;
  }

`;



