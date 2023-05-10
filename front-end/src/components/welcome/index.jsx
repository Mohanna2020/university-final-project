import { Instagram } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Div = styled.div`
    width:100vw;
    height:100vh;
    background:black;
    color:white;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    user-select:none;
  }
`;

const TitleProject = styled.h1`
margin: 280px 0 40px;
display: flex;
align-items: center;
  span {
    font-size: 70px;
    font-family: "Dancing Script", cursive;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: space-around;
  align-items: center;
  outline: none;
  border: 1px solid white;
  background: #000;
  color: white;
  border-radius: 7px;
  width: 125px;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s;
  margin-top: 10px;
  margin: 0 10px;
  :hover {
    background: white;
    color: black;
  }
`;

const Footer = styled.p`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgb(211, 211, 211);
  font-size: 25px;
`;

const Span = styled.span`
  font-family: "Dancing Script", cursive;
`;

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <Div>
      <TitleProject><Instagram sx={{ fontSize: "45px" , margin:'18px 15px 0 0' }}></Instagram>
        <span>insper</span> 
      </TitleProject>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onClick={() => navigate("/register")}>
          <p>Register</p>
          <span class="material-symbols-outlined">how_to_reg</span>
        </Button>

        <Button onClick={() => navigate("/login")}>
          <p>Login</p>
          <span class="material-symbols-outlined">login</span>
        </Button>
      </div>

      <Footer style={{ fontFamily: "Dancing Script, cursive" }}>
        Developed by Ms. Shirnegar and Mr. Khodapanah
      </Footer>

      {/* <Footer style={{ bottom: "60px" }}>
        Developed by Ms. Shirnegar and Mr. Khodapanah
      </Footer>

      <Footer style={{ bottom: "90px" }}>
        Developed by <Span>Ms. Shirnegar</Span> and <Span>Mr. Khodapanah</Span>
      </Footer> */}
    </Div>
  );
};

export default Welcome;
