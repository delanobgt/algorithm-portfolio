import styled from "styled-components";

export const OuterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  min-height: 100vh;
`;

export const GridWrapper = styled.div`
  max-width: 450px;
  width: 100%;
`;

export const Cell = styled.div`
  background: black;
  box-sizing: border-box;

  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

export const ControlPanel = styled.div`
  display: block;
  position: fixed;
  bottom: 0;
  width: 100vw;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 180, 0.75);
`;
