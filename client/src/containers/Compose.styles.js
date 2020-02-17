import styled from 'styled-components/macro';

export const Wrapper = styled.div`



  background: skyblue;
  
  display: grid;
  grid-template-rows: 1fr 8fr 1fr;
  grid-template-columns: 1fr 8fr 1fr;
  
  overflow: auto;
  
  .title {
    background: #adadcf;
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 2;
    grid-column-end: 3;  
  }

`;





