import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { validationEmailResolver } from "../../schema/validationEmail";
import styled, { css } from "styled-components";
import { useMutation, useQueries, useQuery } from "react-query";
import post from "../../service/post/index";
// import toast, { Toaster } from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import username from "../../store/userName";
// import idUser from "../../store/idUser";
import get from "../../service/get";

const Div = styled.div`
  color: white;
  width: 100%;
  margin: 15px 0;
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

// const ButtonGoToRegister = styled.button`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   outline: none;
//   border: 1px solid white;
//   background: #000;
//   color: white;
//   border-radius: 7px;
//   width: 125px;
//   padding: 10px;
//   font-size: 18px;
//   font-weight: bold;
//   transition: all 0.3s;
//   margin-top: 10px;
//   :hover {
//     background: white;
//     color: black;
//   }
// `;

const ValidationEmail = () => {
  // const [showIconPass, setShowIconPass] = useState(false);
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const setUserName = useSetRecoilState(username);
  // const setOwnerId = useSetRecoilState(idUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: validationEmailResolver,
  });

  useEffect(() => {
    toast.success("welcome to insper 😊");
  }, []);

  const {} = useQuery("checkValid", () => get.checkValidUser(userId), {
    onSuccess: (response) => {
      console.log("ffffff" , response)
      if (response?.data?.state == "register") {
        navigate("/register");
      } else if (response?.data?.state == "login") {
        navigate("/login");
      } else {
      }
    },
  });

  const validationEmail = useMutation(
    (command) => post.postValidationEmail(userId, command),
    {
      onSuccess: (response) => {
        if (response?.data?.message === "Incorrect code!") {
          toast.error(response?.data?.message);
        } else {
          setUserName(response?.data?.username);
          // setOwnerId(userId);
          navigate(`/setting/${userId}`, { replace: true });
        }
      },
      onError: (error) => {
        toast.error(error?.data?.message);
      },
    }
  );

  const resendCode = useMutation(() => post.resend(userId), {
    onSuccess: () => {
      toast("✔ Code sent again!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "colored",
      });
    },
  });

  const onSubmit = (data) => {
    validationEmail.mutate(data);
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
          paddingBottom: "20px",
          // padding: "40px 40px 20px 40px ",
          width: "500px",
          boxShadow: "0 0 10px 0 rgb(70 , 70 ,70)",
          background: "black",
          borderRadius: "15px",
        }}
      >
        <Typography variant="h6" color="white">
          Enter the code sent to your email
        </Typography>
        <Div>
          <InputRegister
            placeholder="enter code ..."
            type="text"
            {...register("code")}
            name="code"
          />
          {errors?.code ? <TextError>{errors?.code?.message}</TextError> : ""}
        </Div>

        <Button type="submit">
          {validationEmail.isLoading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            "Validation Email"
          )}
        </Button>
        <p
          // href="javascript:;"
          onClick={() => {
            resendCode.mutate()}}
          style={{
            color: "white",
            marginTop: "25px",
            fontSize: "18px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          resend code
        </p>
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

export default ValidationEmail;
