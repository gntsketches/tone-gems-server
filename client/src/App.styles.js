import styled from 'styled-components/macro';

// const thing = props => `${props.thing || 50p}px`;
// https://github.com/styled-components/babel-plugin-styled-components

export const Wrapper = styled.div`
  
  width: 100vw;
  height: 100vh;
  text-align: center;
  background: #306745;
  
  display: grid;
  grid-template-rows: 1fr 8fr 1fr;
  grid-template-columns: 1fr 8fr 1fr;

`;



