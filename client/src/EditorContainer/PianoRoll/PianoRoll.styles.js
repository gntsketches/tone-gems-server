import styled from 'styled-components/macro';

// const thing = props => `${props.thing || 50p}px`;
// https://github.com/styled-components/babel-plugin-styled-components

export const Wrapper = styled.div`

  grid-row-start: 2;
  grid-row-end: 4;
  grid-column-start: 2;
  grid-column-end: 4;  
  
  overflow: auto;
  
  canvas {
    z-index: 10;
    // width: 100%;
    // height: 100%;
   }


`;



