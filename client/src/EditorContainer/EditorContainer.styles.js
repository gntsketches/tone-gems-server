import styled from 'styled-components/macro';

// const thing = props => `${props.thing || 50p}px`;
// https://github.com/styled-components/babel-plugin-styled-components

export const Wrapper = styled.div`
  
  width: 100%;

  background: #222;
  color: #ccc;

  >.pianoRollWrap {   
    display: flex;
    overflow: auto;
    height: 400px;
    width: 600px;
    background: #333;
    color: white;
  }


`;



