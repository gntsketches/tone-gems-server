import styled from 'styled-components/macro';

export const NavWrapper = styled.nav`

  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 4;  
  
  // height: 5vh;
  display: flex;
  justify-content: space-between;
  background: #444;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: white;
 
  >div {
    padding: 0 1rem; 
  
    a {
      color: white;
    }
    
    ul {
      list-style: none;
    }

  }

`;



