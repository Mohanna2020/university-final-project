import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bg from "../../images/Error-Page.gif";

const Main = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: black;
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

const Button = styled.button`
  outline: none;
  border-radius: 7px;
  border: 2px solid white;
  background-color: white;
  padding: 10px 10px;
  font-weight: bold;
  font-size: 18px;
  position: absolute;
  bottom: 180px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s;
  :hover {
    background-color: black;
    color: white;
  }
`;

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <Main>
      <Button onClick={() => navigate("/")}>back to Home</Button>
    </Main>
  );
};

export default Error404;
