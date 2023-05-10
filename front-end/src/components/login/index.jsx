import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { loginResolver } from "../../schema/login";
import styled, { css } from "styled-components";
import { useMutation } from "react-query";
// import post from "../../service/post/index";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import username from "../../store/userName";
import put from "../../service/put";
import idUser from "../../store/idUser";

const Div = styled.div`
  color: white;
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  user-select: none;
  .showPass {
    // display:none;
  }

  ${(props) =>
    !props.showIcon
      ? css`
          .showPass {
            display: block;
          }
        `
      : css`
          .showPass {
            display: none;
          }
        `}

  ${(props) =>
    !props.showIcon
      ? css`
          .hiddenPass {
            display: none;
          }
        `
      : css`
          .hiddenPass {
            display: block;
          }
        `}
`;

const TextError = styled.p`
  color: crimson;
  text-align: center;
  font-size: 18px;
  border: none;
  margin-top: 5px;
`;

const InputRegister = styled.input`
  color: black;
  outline: none;
  border: none;
  border-radius: 10px;
  width: 100%;
  padding: 10px;
  font-size: 18px;
  // background-color: rgb(190, 190, 190);
  // color: grey;
`;
const Button = styled.button`
  font-weight: bold;
  outline: none;
  border: 1px solid white;
  background: #000;
  color: white;
  border-radius: 10px;
  width: 100%;
  padding: 10px;
  font-size: 18px;
  transition: all 0.3s;
  margin-top: 10px;
  :hover {
    background: white;
    color: black;
  }
`;

const ButtonGoToRegister = styled.a`
  cursor:pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 20px;
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
  :hover {
    background: white;
    color: black;
  }
`;

const Login = () => {
  const [showIconPass, setShowIconPass] = useState(false);
  const navigate = useNavigate();
  const setUserName = useSetRecoilState(username);
  const setOwnerId = useSetRecoilState(idUser);

  // useEffect(() => {
  //   setOwnerId(userId)
  // },[])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: loginResolver,
  });

  // useEffect( () => {
  //   console.log(x)
  //   toast.success(x)
  // } , [])

  const submitLogin = useMutation((command) => put.postDataLogin(command), {
    onSuccess: (response) => {
      if (response?.data?.message === "User not found!") {
        toast.error("User not found! 🤷‍♀️");
      } else if (response?.data?.message === "Incorrect password!") {
        toast.error("Incorrect password!");
      } else {
        toast.success("welcome to insper");
        setOwnerId(response?.data?.userId);
        setUserName(response?.data?.username);
        navigate(`/user/${response?.data?.userId}`);
      }
    },
  });

  const onSubmit = (data) => {
    submitLogin.mutate(data);
  };

  return (
    <Box
      component={"form"}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        background: "black",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <ButtonGoToRegister onClick={() => navigate("../register")}>
        <p>Register</p>
        <span class="material-symbols-outlined">how_to_reg</span>
      </ButtonGoToRegister>

      <Typography
        variant="h1"
        sx={{
          margin: "50px",
          color: "white",
          fontSize: "50px",
          fontFamily: "Dancing Script, cursive",
          userSelect: "none",
        }}
      >
        insper
      </Typography>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "40px",
          width: "500px",
          boxShadow: "0 0 10px 0 rgb(70 , 70 ,70)",
          background: "black",
          borderRadius: "15px",
        }}
      >
        <Div>
          <label
            for="userName"
            style={{ fontSize: "19px", marginBottom: "10px" }}
          >
            user name / email
          </label>
          <InputRegister
            type="text"
            {...register("user_email")}
            name="user_email"
          />
          {errors?.user_email ? (
            <TextError>{errors?.user_email?.message}</TextError>
          ) : (
            ""
          )}
        </Div>

        <Div style={{ position: "relative" }} showIcon={showIconPass}>
          <label for="pass" style={{ marginBottom: "10px", fontSize: "19px" }}>
            password
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <InputRegister
              type={showIconPass ? "text" : "password"}
              {...register("password")}
              name="password"
            />
            <span
              style={{
                position: "absolute",
                right: "-30px",
                cursor: "pointer",
              }}
              onClick={() => setShowIconPass(true)}
              className="material-symbols-outlined showPass"
            >
              visibility
            </span>
            <span
              style={{
                position: "absolute",
                right: "-30px",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowIconPass(false);
              }}
              className="material-symbols-outlined hiddenPass"
            >
              visibility_off
            </span>
          </div>
          {errors?.password ? (
            <TextError>{errors?.password?.message}</TextError>
          ) : (
            ""
          )}
        </Div>

        <Button type="submit">Login</Button>
      </Grid>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
};

export default Login;
