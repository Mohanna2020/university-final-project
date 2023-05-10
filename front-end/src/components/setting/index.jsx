import React, { useState } from "react";
import Navbar from "../navbar";
import { ToastContainer, toast } from "react-toastify";
import { Box, Grid, Skeleton, Tooltip, tooltipClasses } from "@mui/material";
import styledd, { css } from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import get from "../../service/get";
import avatarUser from "../../images/user.png";
import { UploadButton } from "react-uploader";
import { Uploader } from "uploader";
import { settingSchema, settingResolver } from "../../schema/setting";
import put from "../../service/put";
import userInfo from "../../store/userInfo";
import { useNavigate, useParams } from "react-router-dom";
import idUser from "../../store/idUser";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";

import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import ReportIcon from "@mui/icons-material/Report";

const ToolTipEdited = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    // backgroundColor: theme.palette.common.white,
    // color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 14.5,
  },
}));

const uploader = Uploader({
  apiKey: "public_12a1yBu7nvbFaYQEWQnJ4PmPaGJ1",
});

const options = {
  styles: {
    colors: {
      primary: "#fff",
      shade600: "#fff",
      shade700: "#000",
      shade800: "rgb(196, 196, 196)",
      shade900: "#000",
    },
  },
  multi: false,
  maxFileCount: 1,
  maxFileSizeBytes: 50 * 1024 * 1024,
  cropShape: "circ",
  mimeTypes: ["image/jpeg", "image/jpg", "image/png"],
  onValidate: async (file) => console.log(file),
};

const TitlePage = styledd.h1`
  color: white;
  font-size: 40px;
  letter-spacing: 1px;
  margin-top: 10px;
  margin-bottom: 20px;
  user-select: none;
`;

const ButtonLogOut = styledd.button`
  outline: none;
  border: 1px solid crimson;
  background: #000;
  color: crimson;
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 18px;
  transition: all 0.3s;
  margin-top: 10px;
  :hover {
    background: crimson;
    color: white;
  }
  //   font-weight: bold;
  //   width: 100%;
`;

const Div = styledd.div`
  width: 100%;
  margin: 40px 0;
  background: rgb(37, 37, 37);
  color: white;
  padding: 20px 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  p {
    font-size: 20px;
    // margin-bottom: 10px;
  }
  div.inputs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
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

const BoxImgProf = styledd.div`
  position: relative;
  top: 0;
  border-radius: 100%;
  width: 200px;
  height: 200px;
  overflow: hidden;
  :hover div {
    transform: translateY(0%);
  }
`;

const ImgProf = styledd.img`
  border-radius: 100%;
  width: 200px;
  height: 200px;
  object-fit: cover;
  border: 3px solid rgb(150, 0, 87);
  cursor: pointer;
  ${(props) =>
    props.proImg
      ? css`
          padding: 2px;
          background: none;
        `
      : css`
          padding: 0px;
          background: grey;
        `}
`;

const CoverImgProf = styledd.div`
  position: absolute;
  border-radius: 100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
  transform: translateY(100%);
  color: white;
  margin: 0;
`;

const TextAreInput = styledd.textarea`
  color: black;
  outline: none;
  border: none;
  border-radius: 10px;
  width: 90%;
  padding: 10px;
  font-size: 18px;
  // background-color: rgb(190, 190, 190);
  // color: grey;
  resize: none;
  :disabled {
    color: white;
  }
  :disabled::placeholder {
    color: white;
  }
`;

const Input = styledd.input`
  color: black;
  outline: none;
  border: none;
  border-radius: 10px;
  padding: 10px;
  font-size: 18px;
  // background-color: rgb(190, 190, 190);
  // color: grey;
  :disabled {
    color: white;
  }
  ::selection{
    color:white;
    background:black;
  }

  ${(props) =>
    props.password
      ? css`
          width: 92%;
        `
      : css`
          width: 90%;
        `}
`;

const TextError = styledd.p`
  color: crimson;
  text-align: center;
  font-size: 18px;
  border: none;
  margin-top: 5px;
`;

const Button = styledd.button`
  outline: none;
  border: 1px solid white;
  background: #000;
  color: white;
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 18px;
  transition: all 0.3s;
  margin-top: 10px;
  :hover {
    background: white;
    color: black;
  }
  //   font-weight: bold;
  //   width: 100%;
`;

const Setting = () => {
  const [showIconPass, setShowIconPass] = useState(false);
  const [nameSetting, setNameSetting] = useState(false);
  const [userNameSetting, setUserNameSetting] = useState(false);
  const [password, setPassword] = useState(false);
  const [bio, setBio] = useState(false);
  const [proImg, setProImg] = useState("");
  const { id: userId } = useParams();
  const navigate = useNavigate();
  //   const [nameSetting, setNameSetting] = useState(false);
  const setOwnerId = useSetRecoilState(idUser);

  useEffect(() => {
    setOwnerId(userId);
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: settingResolver,
    // defaultValues: {
    //   email: "svwwcc@ee.scw",
    //   username: "eeeee4",
    //   password: "eeeee4",
    // },
  });

  // useEffect(() => {
  //   setValue("againPass", watch("password"));
  // }, [watch("password")]);


  const {} = useQuery("getSessions", () => get.checkSession(userId), {
    onSuccess: (response) => {
      if (!response.data.login) {
        navigate("/login");
      }
    },
    // enabled: !!userId,
  });

  const { isLoading } = useQuery(
    "userInfoSetting",
    () => get.userInfoSetting(userId),
    {
      onSuccess: (response) => {
        setProImg(response?.data?.profImg);

        reset({
          // profImg: response?.data?.profImg,
          bio: response?.data?.bio,
          name: response?.data?.name,
          username: response?.data?.username,
          // password: response?.data?.password,
          email: response?.data?.email,
          bio: response?.data?.bio,
        });
      },
      onError: (error) => {
      },
    }
  );

  const submitChanges = useMutation(
    (command) => put.submitChanges(userId, command),
    {
      onSuccess: (response) => {
        if (response?.data?.message === "Username is available!") {
          toast.error(response?.data?.message);
        } else {
          navigate(`/user/${userId}`, {
            message: "Information changed successfully",
          });
        }
      },
    }
  );

  const logOut = useMutation(() => put.logOut(userId), {
    onSuccess: () => {
      setOwnerId("");
      navigate(`/login`, { replace: true, message: "Exit was successful" });
    },
  });

  const onSubmit = (data) => {
    data.profImg = proImg;
    if (watch("password")) {
      if (watch("password").length < 5) {
        toast.error("The minimum number of password is 5");
        return true;
      }
    }
    if (watch("password") === watch("confirmPassword")) {
      submitChanges.mutate(data);
    } else {
      toast.error("Password and confirm password are not the same !!!");
    }
  };

  const changeImg = () => {
    setProImg("");
    toast.info(
      "You must click on the `submit changes` button to save the changes"
    );
  };

  return (
    <Box component={"section"}>
      <Grid container overflow={"visible"}>
        <Grid item xs={2} position={"sticky"} top={"0"}>
          <Navbar />
        </Grid>
        <Grid
          item
          xs={10}
          sx={{
            background: "black",
            minHeight: "100vh",
            padding: "50px 100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TitlePage>Setting</TitlePage>
            <ButtonLogOut type="button" onClick={() => logOut.mutate()}>
              Log out
            </ButtonLogOut>
          </div>
          <Box
            component={"form"}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            style={{ width: "80%" }}
          >
            <Div
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {isLoading ? (
                <Skeleton
                  sx={{ bgcolor: "grey.900" }}
                  variant="circular"
                  width={"200px"}
                  height={"200px"}
                />
              ) : (
                <BoxImgProf>
                  <ImgProf proImg={proImg} src={proImg ? proImg : avatarUser} />

                  <UploadButton
                    uploader={uploader} // Required.
                    options={options} // Optional.
                    onComplete={(files) => {
                      // Optional.
                      if (files.length === 0) {
                        console.log("No files selected.");
                      } else {
                        // console.log("Files uploaded:");
                        // console.log(files);
                        // console.log(files[0]?.fileUrl);
                        setProImg(files[0]?.fileUrl);
                      }
                    }}
                  >
                    {({ onClick }) => (
                      <CoverImgProf>
                        <p onClick={onClick}>change profile</p>
                        <p onClick={changeImg}>remove Image</p>
                      </CoverImgProf>
                    )}
                  </UploadButton>
                </BoxImgProf>
              )}

              <div style={{ width: "75%", marginRight: "0px" }}>
                <p style={{ marginTop: "7px" }}>bio</p>
                <div className="inputs" style={{ width: "100%" }}>
                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900" }}
                      variant="rounded"
                      width={"650px"}
                      height={"150px"}
                    />
                  ) : bio ? (
                    <TextAreInput
                      className="not-disable"
                      rows="5"
                      placeholder="write bio ..."
                      type="text"
                      {...register("bio")}
                    />
                  ) : (
                    <TextAreInput
                      className="disable"
                      type="text"
                      rows="5"
                      disabled
                      {...register("bio")}
                    />
                  )}
                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900" }}
                      variant="circular"
                      width={"50px"}
                      height={"50px"}
                    />
                  ) : (
                    <EditIcon
                      sx={{ color: "white", cursor: "pointer" }}
                      onClick={() => setBio(true)}
                    />
                  )}
                </div>
                {errors?.bio ? (
                  <TextError>{errors?.bio?.message}</TextError>
                ) : (
                  ""
                )}
              </div>
            </Div>

            <Div>
              <p>name</p>
              <div className="inputs">
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="rounded"
                    width={"90%"}
                    height={"px"}
                  />
                ) : nameSetting ? (
                  <Input type="text" {...register("name")} />
                ) : (
                  <Input type="text" disabled {...register("name")} />
                )}
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={"50px"}
                    height={"50px"}
                  />
                ) : (
                  <EditIcon
                    sx={{ color: "white", cursor: "pointer" }}
                    onClick={() => setNameSetting(true)}
                  />
                )}
              </div>
              {errors?.name ? (
                <TextError>{errors?.name?.message}</TextError>
              ) : (
                ""
              )}
            </Div>

            <Div>
              <p>user name</p>
              <div className="inputs">
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="rounded"
                    width={"90%"}
                    height={"25px"}
                  />
                ) : userNameSetting ? (
                  <Input type="text" {...register("username")} />
                ) : (
                  <Input type="text" disabled {...register("username")} />
                )}
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={"50px"}
                    height={"50px"}
                  />
                ) : (
                  <EditIcon
                    sx={{ color: "white", cursor: "pointer" }}
                    onClick={() => setUserNameSetting(true)}
                  />
                )}
              </div>
              {errors?.username ? (
                <TextError>{errors?.username?.message}</TextError>
              ) : (
                ""
              )}
            </Div>

            <Div style showIcon={showIconPass}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <p style={{ marginRight: "10px" }}>password</p>
                <ToolTipEdited
                  arrow
                  title="If you do not want to change the password, leave the password blank and confirm the password."
                  placement="right"
                  // sx={{marginLeft:'10px'}}
                >
                  <ReportIcon />
                </ToolTipEdited>
              </div>

              <div className="inputs">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    // justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900" }}
                      variant="rounded"
                      width={"90%"}
                      height={"25px"}
                    />
                  ) : password ? (
                    <Input
                      password={true}
                      type={showIconPass ? "text" : "password"}
                      {...register("password")}
                    />
                  ) : (
                    <Input
                      password={true}
                      type={showIconPass ? "text" : "password"}
                      disabled
                      {...register("password")}
                    />
                  )}
                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900", marginLeft: "10px" }}
                      variant="circular"
                      width={"50px"}
                      height={"50px"}
                    />
                  ) : (
                    <>
                      <span
                        style={{
                          userSelect: "none",
                          position: "absolute",
                          right: "25px",
                          cursor: "pointer",
                        }}
                        onClick={() => setShowIconPass(true)}
                        className="material-symbols-outlined showPass"
                      >
                        visibility
                      </span>
                      <span
                        style={{
                          userSelect: "none",
                          position: "absolute",
                          right: "25px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setShowIconPass(false);
                        }}
                        className="material-symbols-outlined hiddenPass"
                      >
                        visibility_off
                      </span>
                    </>
                  )}
                </div>
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={"50px"}
                    height={"50px"}
                  />
                ) : (
                  <EditIcon
                    sx={{ color: "white", cursor: "pointer" }}
                    onClick={() => setPassword(true)}
                  />
                )}
                {/* {nameSetting ? (
                  <Input
                    type={showIconPass ? "text" : "password"}
                    {...register("password")}
                  />
                ) : (
                  <Input type="text" disabled {...register("name")} />
                )} */}
              </div>
              {errors?.password ? (
                <TextError>{errors?.password?.message}</TextError>
              ) : (
                ""
              )}
            </Div>

            {/* *************** start test for confirm password */}

            <Div style showIcon={showIconPass}>
              <p>confirm password</p>
              <div className="inputs">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    // justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900" }}
                      variant="rounded"
                      width={"90%"}
                      height={"25px"}
                    />
                  ) : password ? (
                    <Input
                      password={true}
                      type={showIconPass ? "text" : "password"}
                      {...register("confirmPassword")}
                    />
                  ) : (
                    <Input
                      password={true}
                      type={showIconPass ? "text" : "password"}
                      disabled
                      {...register("confirmPassword")}
                    />
                  )}
                  {/* {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900", marginLeft: "10px" }}
                      variant="circular"
                      width={"50px"}
                      height={"50px"}
                    />
                  ) : (
                    <>
                      <span
                        style={{
                          userSelect: "none",
                          position: "absolute",
                          right: "25px",
                          cursor: "pointer",
                        }}
                        onClick={() => setShowIconPass(true)}
                        className="material-symbols-outlined showPass"
                      >
                        visibility
                      </span>
                      <span
                        style={{
                          userSelect: "none",
                          position: "absolute",
                          right: "25px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setShowIconPass(false);
                        }}
                        className="material-symbols-outlined hiddenPass"
                      >
                        visibility_off
                      </span>
                    </>
                  )} */}
                </div>
                {/* {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={"50px"}
                    height={"50px"}
                  />
                ) : (
                  <EditIcon
                    sx={{ color: "white", cursor: "pointer" }}
                    onClick={() => setPassword(true)}
                  />
                )} */}
                {/* {nameSetting ? (
                  <Input
                    type={showIconPass ? "text" : "password"}
                    {...register("password")}
                  />
                ) : (
                  <Input type="text" disabled {...register("name")} />
                )} */}
              </div>
              {errors?.confirmPassword ? (
                <TextError>{errors?.confirmPassword?.message}</TextError>
              ) : (
                ""
              )}
            </Div>

            {/* *************** end test for confirm password */}

            <Div>
              <p>email</p>
              <div className="inputs">
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="rounded"
                    width={"90%"}
                    height={"25px"}
                  />
                ) : (
                  <Input type="email" {...register("email")} disabled />
                )}
                {/* {emailSetting ? (
                  <Input type="text" {...register("email")} />
                ) : (
                  <Input type="text" disabled {...register("email")} />
                )}
                <EditIcon
                  sx={{ color: "white", cursor: "pointer" }}
                  onClick={() => setEmailSetting(true)}
                /> */}
              </div>
            </Div>

            <Button type="submit">submit changes</Button>
          </Box>
        </Grid>
      </Grid>

      {/* <UploadButton
        uploader={uploader} // Required.
        options={options} // Optional.
        onComplete={(files) => {
          // Optional.
          if (files.length === 0) {
            console.log("No files selected.");
          } else {
            console.log("Files uploaded:");
            console.log(files.map((f) => f.fileUrl));
          }
        }}
      >
        {({ onClick }) => <button onClick={onClick}>Upload a file...</button>}
      </UploadButton> */}

      <ToastContainer
        position="bottom-center"
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

export default Setting;
