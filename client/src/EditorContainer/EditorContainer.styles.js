import styled from 'styled-components/macro';

// const thing = props => `${props.thing || 50p}px`;
// https://github.com/styled-components/babel-plugin-styled-components

export const Wrapper = styled.div`
  
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column-start: 2;
  grid-column-end: 3;  

  // width: 100%;
  // height: 100%;

  overflow: auto;
  background: #aaa;
  
  display: grid;
  grid-template-rows: 1fr 8fr 1fr;
  grid-template-columns: 1fr 8fr 1fr;


`;



