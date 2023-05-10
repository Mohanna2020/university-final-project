import React, { useState } from "react";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { UploadDropzone } from "react-uploader";
import { Box, Grid } from "@mui/material";
import Navbar from "../navbar";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { createPostResolver } from "../../schema/createPost";
import { useNavigate, useParams } from "react-router-dom";
import userInfoRecoil from "../../store/userInfo";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useMutation, useQuery } from "react-query";
import put from "../../service/put";
import idUser from "../../store/idUser";
import { useEffect } from "react";
import get from "../../service/get";
// import Upload from "rc-upload";

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
  multi: true,
  maxFileCount: 3,
  maxFileSizeBytes: 50 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/jpg", "image/png", "music/mp3", "video/mp4"],
  // onValidate: async (file) => console.log(file),
};

const BoxCreate = styled(Box)`
  margin: auto;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px 0 rgb(90, 90, 90);
  border-radius: 10px;
  color: white;
  padding: 40px;
`;

const Div = styled.div`
  color: white;
  width: 80%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  user-select: none;
`;

const TextAreInput = styled.textarea`
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

const Input = styled.input`
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

const TextError = styled.p`
  color: crimson;
  text-align: center;
  font-size: 18px;
  border: none;
  margin-top: 5px;
`;

const ButtonUpload = styled.button`
  display: flex;
  justify-content: center;
  // justify-content: space-between;
  width: 50%;
  // align-items: center;
  // position: absolute;
  // top: 20px;
  // right: 20px;
  outline: none;
  border: 1px solid white;
  background: #000;
  color: white;
  border-radius: 7px;
  // width: 125px;
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

const UploadPost = styled.button`
  display: flex;
  justify-content: center;
  margin: auto;
  // justify-content: space-between;
  width: 80%;
  // align-items: center;
  // position: absolute;
  // top: 20px;
  // right: 20px;
  outline: none;
  border: 1px solid white;
  background: #000;
  color: white;
  border-radius: 7px;
  // width: 125px;
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

const CreatePost = () => {
  const [images, setImages] = useState([]);
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwnerRecoil] = useRecoilState(userInfoRecoil);
  const setOwnerId = useSetRecoilState(idUser);

  useEffect(() => {
    setOwnerId(userId);
  }, []);

  const {
    trigger,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: createPostResolver,
  });

  const {} = useQuery("getSessions", () => get.checkSession(userId), {
    onSuccess: (response) => {
      if (!response.data.login) {
        navigate("/login");
      }
    },
    // enabled: !!userId,
  });

  const sendPost = useMutation((command) => put.createPost(userId, command), {
    onSuccess: (response) => {
      navigate(`/user/${userId}`, {
        message: "Post successfully created",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (isValid) {
      if (images.length === 0) {
        toast.error("upload is required.");
      } else {
        const command = { ...data, files: images };
        sendPost.mutate(command);
      }
    }
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
          }}
        >
          <BoxCreate component={"form"} onSubmit={handleSubmit(onSubmit)}>
            {/* <UploadButton
              uploader={uploader} // Required.
              options={options} // Optional.
              onComplete={(files) => {
                // Optional.
                if (files.length === 0) {
                  toast.error("No files selected.");
                } else {
                  console.log("Files uploaded:");
                  console.log(files.map((f) => f.fileUrl));
                }
              }}
            >
              {({ onClick }) => (
                <ButtonUpload onClick={onClick}>Upload a file...</ButtonUpload>
              )}
            </UploadButton> */}

            <Div>
              <label
                for="location"
                style={{ fontSize: "19px", marginBottom: "10px" }}
              >
                loaction
              </label>
              <Input
                id="location"
                placeholder="country or province or city"
                type="text"
                {...register("location")}
                name="location"
              />
              {errors?.location ? (
                <TextError>{errors?.location?.message}</TextError>
              ) : (
                ""
              )}
            </Div>

            <Div>
              <label
                for="caption"
                style={{ fontSize: "19px", marginBottom: "10px" }}
              >
                caption
              </label>
              <TextAreInput
                id="caption"
                rows="7"
                placeholder="The maximum number of comment is 600"
                type="text"
                {...register("caption")}
                name="caption"
              />
              {errors?.caption ? (
                <TextError>{errors?.caption?.message}</TextError>
              ) : (
                ""
              )}
            </Div>

            <UploadDropzone
              // {...register("upload")}
              uploader={uploader} // Required.
              options={options} // Optional.
              width="83%" // Optional.
              height="270px" // Optional.
              onUpdate={(files) => {
                // Optional.
                if (files.length === 0) {
                  toast.error("No files selected.");
                } else {
                  setImages(files);
                }
              }}
            />
            <p style={{ margin: "15px 0", fontSize: "18px" }}>
              Supported files : jpg , jpeg , png
            </p>

            <UploadPost type="submit">Create Post</UploadPost>
          </BoxCreate>
        </Grid>
      </Grid>

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

export default CreatePost;
