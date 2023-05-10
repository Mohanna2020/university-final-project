import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { registerResolver } from "../../schema/register";
import styled, { css } from "styled-components";
import { useMutation } from "react-query";
import post from "../../service/post/index";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import idUser from "../../store/idUser";
import { useSetRecoilState } from "recoil";

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

const ButtonGoToLogin = styled.a`
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
  width: 100px;
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

const Register = () => {
  const [showIconPass, setShowIconPass] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: registerResolver,
  });

  const submitRegister = useMutation(
    (command) => post.postDataRegister(command),
    {
      onSuccess: (response) => {
        if (response?.data?.message === "username is available!") {
          toast.error(response?.data?.message);
        } else {
          navigate(`/validationEmail/${response?.data?.userId}`);
        }
      },
      onError: (error) => {
        // console.log("error", error);
        toast.error(error.message);
      },
    }
  );

  const onSubmit = (data) => {
    if (watch("password") === watch("confirmPass")) {
      // console.log(data);
      submitRegister.mutate(data);
      // toast.success("welcome to insper ");
      // navigate("/validationEmail");
    } else {
      toast.error("Password and confirm password are not the same !!!");
    }
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
      <ButtonGoToLogin onClick={() => navigate("../login")}>
        <p>Login</p>
        <span class="material-symbols-outlined">login</span>
      </ButtonGoToLogin>

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
            htmlFor="username"
            style={{ fontSize: "19px", marginBottom: "10px" }}
          >
            user name
          </label>
          <InputRegister
            id="username"
            type="text"
            {...register("username")}
            name="username"
          />
          {errors?.username ? (
            <TextError>{errors?.username?.message}</TextError>
          ) : (
            ""
          )}
        </Div>

        <Div>
          <label
            htmlFor="name"
            style={{ marginBottom: "10px", fontSize: "19px" }}
          >
            name
          </label>
          <InputRegister
            id="name"
            type="text"
            {...register("name")}
            name="name"
          />
          {errors?.name ? <TextError>{errors?.name?.message}</TextError> : ""}
        </Div>

        <Div>
          <label
            htmlFor="email"
            style={{ marginBottom: "10px", fontSize: "19px" }}
          >
            email
          </label>
          <InputRegister
            id="email"
            type="email"
            {...register("email")}
            name="email"
          />
          {errors?.email ? <TextError>{errors?.email?.message}</TextError> : ""}
        </Div>

        <Div style={{ position: "relative" }} showIcon={showIconPass}>
          <label
            htmlFor="pass"
            style={{ marginBottom: "10px", fontSize: "19px" }}
          >
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
              id="pass"
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

        <Div style={{}}>
          <label
            htmlFor="confirmPass"
            style={{ marginBottom: "10px", fontSize: "19px" }}
          >
            confirm password
          </label>
          <InputRegister
            id="confirmPass"
            type={showIconPass ? "text" : "password"}
            {...register("confirmPass")}
            name="confirmPass"
          />
          {errors?.confirmPass ? (
            <TextError>{errors?.confirmPass?.message}</TextError>
          ) : (
            ""
          )}
        </Div>

        <Button type="submit">register</Button>
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

export default Register;
