import { Box, Chip, Divider, Grid, Skeleton } from "@mui/material";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import Navbar from "../navbar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Carousel from "react-material-ui-carousel";
import avatarUser from "../../images/user.png";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { commentResolver } from "../../schema/comment";
import get from "../../service/get";
import put from "../../service/put";
import { ToastContainer, toast } from "react-toastify";

// import img1 from "../../images/image1.jpg";
// import img2 from "../../images/image2.jpg";
// import img3 from "../../images/image3.jpg";
// import img4 from "../../images/image4.jpg";
// import img5 from "../../images/image5.jpg";
// import img6 from "../../images/image6.jpg";

const MianExplore = styled.div`
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, auto));
  gap: 40px 0;
`;

const Post = styled.div`
  min-height: 280px;
  max-height: 280px;
  border-radius: 10px;
  width: 320px;
  // max-width: 100%;
  background: rgb(30, 30, 30);
  text-align: center;
  // box-shadow: 0 0 10px 0 rgb(60, 60, 60);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  position: relative;

  .coverPost {
    transform: translateY(20%);
    opacity: 0;
  }
  :hover .coverPost {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ImgPost = styled(LazyLoadImage)`
  width: 320px;
  // max-width: 100%;
  object-fit: cover;
  min-height: 280px;
  max-height: 280px;
  border-radius: 10px;
  //   background:rgba(30,30,30);
  //   object-fit: cover;
  //   border-radius: 5px;
  //   width: 100%;
  //   height: 100%;
`;
const CoverPost = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(50, 50, 50, 0.8);
  transition: all 0.3s;
`;

const TypePost = styled.span`
  position: absolute;
  top: 7px;
  right: 7px;
  color: white;
  z-index: 15;
`;

const ModalCustom = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.open
      ? css`
          z-index: 30;
        `
      : css`
          // z-index: 30;
          z-index: -30;
        `}
`;

const BackModal = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  cursor: pointer;
  // background-color: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(5px);
  transition: all 0.3s;
  ${(props) =>
    props.open
      ? css`
          z-index: 30;
        `
      : css`
          // z-index: 30;
          z-index: -30;
        `}
`;

const ContentModal = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 65%;
  height: 85%;
  z-index: 40;
  background-color: rgb(50, 50, 50);
  color: white;
  overflow-y: hidden;
  border-radius: 7px;
  transition: all 0.3s;
  text-align: center;

  ${(props) =>
    props.open
      ? css`
          transform: translateY(0%);
        `
      : css`
          // transform: translateY(0%);
          transform: translateY(-200%);
        `}
`;

const TextDetailPost = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  align-items: flex-start;
  border-left: 2px solid #404040;
  // background: red;
  padding: 20px;
`;

const PostOwnerInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  // background: red;
  max-height: 29%;
  div:nth-child(1) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  div img {
    border-radius: 100%;
    border: 2px solid #9b9b9b;
    width: 65px;
    height: 65px;
    object-fit: cover;
    padding: 2px;
    display: inline-flex;
    margin-right: 7px;
  }
`;

const Caption = styled.p`
  margin: 10px 0;
  text-align: justify;
  max-height: 100%;
  overflow-y: auto;
  padding-right: 7px;
`;

const Comments = styled.div`
  width: 100%;
  overflow-y: auto;
  max-height: 55%;
  text-align: justify;
  margin: 10px 0;
  padding-right: 7px;
`;

const Comment = styled.div`
  width: 100%;
  // overflow-y: auto;
  // max-height: 55%;
  // text-align: justify;
  // margin: 10px 0 0;
  // padding-right: 7px;
  display: flex;
  // font-size:10px;
  flex-direction: column;
  justify-content: flex-start;
  // align-items: center;

  div:nth-child(1) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 10px;
  }

  div:nth-child(2) {
    word-wrap: break-word;
    width: 100%;
  }

  div:nth-child(2) p {
    margin-top: 7px;
    font-size: 20px;
  }

  div:nth-child(1) img {
    border-radius: 100%;
    border: 2px solid #9b9b9b;
    width: 55px;
    height: 55px;
    object-fit: cover;
    padding: 2px;
    display: inline-flex;
    margin-right: 7px;
  }
`;

const InputCommand = styled.input`
  // position:absolute;
  // bottom:0;
  outline: none;
  border: none;
  width: 90%;
  background:white
  color: white;
  padding: 10px 7px 10px 10px;
  // height:100px;
  font-size: 15px;
  border-radius: 18px;
`;

const ButtonFollow = styled.button`
  outline: none;
  border: 2px solid white;
  // width: 100px;
  text-align: center;
  // margin-left: 35px;
  padding: 7px 7px;
  border-radius: 7px;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s;
  :hover {
    color: white;
    background-color: rgb(50, 50, 50);
    // background: black;
  }
`;

const Explore = () => {
  const [postSelected, setPostSelected] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [commentOfPost, setCommentOfPost] = useState({});
  const [valueComment, setValueComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [postsExplore, setPostsExplore] = useState([]);
  const [followState, setFolloeState] = useState(false);

  const { id: userId } = useParams();
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: commentResolver,
  });

  const {} = useQuery("getSessions", () => get.checkSession(userId), {
    onSuccess: (response) => {
      if (!response.data.login) {
        navigate("/login");
      }
    },
    // enabled: !!userId,
  });

  const { isLoading, refetch: refetchExplore } = useQuery(
    "getInfoExplore",
    () => get.infoExplore(userId),
    {
      onSuccess: (response) => {
        console.log(response?.data);
        setPostsExplore(response?.data?.posts);
      },
    }
  );

  // const { refetchgetUser } = useQuery(
  //   "getUserInfo",
  //   () => get.userInfoSearch(userId, postSelected.id),
  //   {
  //     onSuccess: (response) => {
  //       // console.log(response);
  //       if (response?.data) {
  //         setUserInfo(response?.data);
  //         // setUserInfo(response?.data?.docs[0]);
  //         // setOwnerRecoil(
  //         //   // response?.data?.docs[response?.data?.docs.length - 1]
  //         //   response?.data
  //         // );
  //       } else {
  //         // navigate("/register");
  //       }
  //     },
  //   }
  // );

  const {} = useQuery("getSessions", () => get.checkSession(userId), {
    onSuccess: (response) => {
      if (!response.data.login) {
        navigate("/login");
      }
    },
    // enabled: !!userId,
  });

  const { refetch } = useQuery(
    "getComment",
    () => get.comments(postSelected?._id, userId),
    {
      onSuccess: (response) => {
        response?.data?.userLiked?.includes(userId)
          ? setLiked(true)
          : setLiked(false);
        setCommentOfPost(response?.data);
      },
      enabled: Boolean(postSelected.length),
    }
  );

  const createComment = useMutation(
    (command) => put.createComment(postSelected?._id, command),
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        refetch();
        // refetchgetUser();
      },
      // enabled: Boolean(postSelected.length),
    }
  );

  const handleLike = useMutation(
    (command) => put.like(postSelected?._id, command),
    {
      onSuccess: (response) => {
        // console.log("like", response);
        setLiked(response?.data);
        refetch();
        // refetchgetUser();
      },
      onError: (error) => {},
      // enabled: Boolean(postSelected.length),
    }
  );

  const handleFollows = useMutation(
    () => put.handleFollow(userId, postSelected.id),
    {
      onSuccess: (response) => {
        console.log(response);
        setFolloeState(response?.data?.follow);
      },
    }
  );

  const sendComment = (data) => {
    createComment.mutate({
      idUser: userId,
      // idUser: url.pathname.split("/")[2],
      userId: postSelected.id,
      comment: data.comment,
    });
    reset({ comment: "" });
  };

  const handleFollow = () => {
    handleFollows.mutate();
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
          <MianExplore>
            {
              /*userInfo?.post?*/ postsExplore.map((item, index) => {
                return isLoading ? (
                  <Skeleton
                    sx={{
                      bgcolor: "grey.800",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                    variant="rounded"
                    width={"100%"}
                    height={"280px"}
                  />
                ) : (
                  <Post
                    key={index}
                    onClick={async () => {
                      await setPostSelected(item);
                      refetch();
                      setOpenModal(true);
                      // const command = { id: owner._id };
                    }}
                  >
                    <ImgPost
                      alt={"post"}
                      height={"100%"}
                      effect="blur"
                      // src={item}
                      src={item?.images[0]}
                      width={"100%"}
                    />
                    <CoverPost className="coverPost">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        <FavoriteIcon
                          sx={{ color: "white", marginRight: "7px" }}
                        />
                        {/* <p style={{ fontWeight: "bold", fontSize: "18px" }}>10</p> */}
                        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                          {item?.likeCount}
                        </p>
                      </div>
                      <div
                        style={{
                          marginTop: "7px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        <ChatBubbleIcon
                          sx={{ color: "white", marginRight: "7px" }}
                        />
                        {/* <p style={{ fontWeight: "bold", fontSize: "18px" }}>100</p> */}
                        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                          {item?.commentCount}
                        </p>
                      </div>
                    </CoverPost>

                    <TypePost className="material-symbols-outlined">
                      {item?.images?.length > 1
                        ? "filter_none"
                        : item?.extType === 0
                        ? "movie"
                        : item?.extType === 1
                        ? "music_note"
                        : ""}
                    </TypePost>
                  </Post>
                );
              })
            }
          </MianExplore>
        </Grid>
      </Grid>

      <ModalCustom open={openModal /*true*/} center>
        <BackModal
          open={openModal}
          onClick={() => {
            setOpenModal(false);
            refetchExplore();
          }}
        ></BackModal>

        <ContentModal open={openModal /*true*/}>
          <div style={{ width: "50%" }}>
            <Carousel
              // next={() => (numberImage = numberImage + 1)}
              // prev={() => (numberImage = numberImage - 1)}
              autoPlay={false}
              animation={"slide"}
              duration={400}
              navButtonsAlwaysVisible={true}
              // navButtonsAlwaysVisible={array_img?.length === 1 ? false : true}
              // navButtonsAlwaysVisible={false}
              navButtonsAlwaysInvisible={
                postSelected?.images?.length === 1 ? true : false
              }
              indicators={false}
            >
              {postSelected?.images?.map((item, index) => {
                // {array_img.map((item, index) => {
                return (
                  <img
                    key={index}
                    src={item}
                    alt=""
                    style={{
                      maxWidth: "100%",
                      minHeight: "400px",
                      maxHeight: "700px",
                      objectFit: "cover",
                    }}
                  />
                );
              })}
            </Carousel>
            {/* <CounterImg>{`${index} / ${array_img.length}`}</CounterImg> */}
          </div>
          <TextDetailPost>
            <PostOwnerInfo>
              <div>
                <div>
                  <img
                    src={
                      postSelected?.profImg ? postSelected?.profImg : avatarUser
                    }
                    alt=""
                    onClick={() =>
                      navigate(`/users/${userId}/${postSelected.id}`)
                    }
                  />
                  <p
                    style={{
                      letterSpacing: "0.5px",
                      fontWeight: "600",
                      fontSize: "17px",
                    }}
                    onClick={() =>
                      navigate(`/users/${userId}/${postSelected.id}`)
                    }
                  >
                    {`${postSelected?.username}`}
                  </p>
                </div>
                <div
                  onClick={() => {
                    const command = {
                      idUser: userId,
                      userId: postSelected.id,
                    };
                    handleLike.mutate(command);
                  }}
                >
                  {liked ? (
                    <FavoriteIcon
                      sx={{
                        color: "red",
                        marginRight: "20px",
                        cursor: "pointer",
                        userSelect: "none",
                        fontSize: "40px",
                      }}
                    />
                  ) : (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        cursor: "pointer",
                        userSelect: "none",
                        marginRight: "20px",
                        fontSize: "40px",
                      }}
                    >
                      favorite
                    </span>
                  )}
                </div>
                <ButtonFollow onClick={() => handleFollow()}>
                  {followState ? "unfollow" : "follow"}
                </ButtonFollow>
              </div>

              <Caption>{postSelected?.caption}</Caption>
            </PostOwnerInfo>

            <div style={{ width: "100%" }}>
              <Divider
                // flexItem
                textAlign="left"
                sx={{
                  margin: "15px 0 0",
                  "&::before, &::after": {
                    borderColor: "white",
                  },
                  width: "100%",
                }}
              >
                <Chip
                  icon={<KeyboardArrowDownIcon />}
                  size="small"
                  label="comments"
                  sx={{
                    paddingRight: "10px",
                    paddingLeft: "5px",
                    direction: "rtl",
                    color: "black",
                    background: "white",
                    fontSize: "18px",
                  }}
                />
              </Divider>
            </div>

            <Comments>
              {commentOfPost?.comment?.map((item) => (
                <>
                  <Comment>
                    <div>
                      <img
                        src={item?.profImg ? item?.profImg : avatarUser}
                        alt="profile image"
                      />
                      {/* <p
                        style={{
                          // letterSpacing: "0.5px",
                          fontWeight: "500",
                          fontSize: "17px",
                        }}
                      >
                        {item?.username}
                      </p> */}
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={
                            postSelected.id === item._id
                              ? {
                                  fontWeight: "500",
                                  fontSize: "17.5px",
                                  fontWeight: "bold",
                                }
                              : {
                                  // letterSpacing: "0.5px",
                                  fontWeight: "500",
                                  fontSize: "17px",
                                }
                          }
                        >
                          {item?.username}
                        </p>
                        {postSelected.id === item._id && (
                          // <>
                          <i
                            className="fas fa-star"
                            style={{
                              color: "yellow",
                              fontSize: "13px",
                              margin: "10px 0 0 10px",
                            }}
                          ></i>
                          // <i
                          //   className="fas fa-certificate"
                          //   style={{
                          //     color: "yellow",
                          //     fontSize: "13px",
                          //     margin: "10px 0 0 10px",
                          //   }}
                          // ></i>
                          // </>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "5px 0 0 50px",
                        width: "80%",
                      }}
                    >
                      <p>{item?.text}</p>
                    </div>
                  </Comment>
                  <hr style={{ width: "85%", margin: "12px auto" }} />
                </>
              ))}
            </Comments>

            <Box
              component={"form"}
              noValidate
              onSubmit={handleSubmit(sendComment)}
              style={{
                position: "absolute",
                bottom: "25px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "95%",
                // margin: "100px 0",
              }}
            >
              <InputCommand
                type="text"
                placeholder="write comment ..."
                {...register("comment")}
                // value={valueComment}
                // onChange={(event) => setValueComment(event.target.value)}
              />
              {errors?.comment ? (
                <p
                  style={{
                    position: "absolute",
                    bottom: "-22px",
                    color: "#F80000",
                    fontWeight: "bold",
                  }}
                >
                  {errors?.comment?.message}
                </p>
              ) : (
                ""
              )}

              <button
                type="submit"
                style={{
                  outline: "none",
                  border: "none",
                  background: "none",
                  color: "white",
                }}
              >
                <SendIcon sx={{ fontSize: "35px", cursor: "pointer" }} />
              </button>
            </Box>
          </TextDetailPost>
        </ContentModal>
      </ModalCustom>

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

export default Explore;
