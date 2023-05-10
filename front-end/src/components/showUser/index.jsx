import { Box, Chip, Divider, Grid, Skeleton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Navbar from "../navbar";
import get from "../../service/get";
import put from "../../service/put";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import avatarUser from "../../images/user.png";
import styled, { css } from "styled-components";
import userInfoRecoil from "../../store/userInfo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import Carousel from "react-material-ui-carousel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SendIcon from "@mui/icons-material/Send";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { commentResolver } from "../../schema/comment";
import idUser from "../../store/idUser";
import ModalFollow from "../ModalFollow";

// import img1 from "../../images/image1.jpg";
// import img2 from "../../images/image2.jpg";
// import img3 from "../../images/image3.jpg";
// import img4 from "../../images/image4.jpg";
// import img5 from "../../images/image5.jpg";

// let numberImage;
// const array_img = [img1, img2, img3, img4, img5];

const ImgProf = styled.img`
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

const ButtonFollow = styled.button`
  outline: none;
  border: 2px solid white;
  width: 100px;
  text-align: center;
  margin-left: 35px;
  padding: 5px 0;
  border-radius: 7px;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s;
  :hover {
    color: white;
    background: black;
  }
`;

const PartPosts = styled.div`
  width: 100%;
  padding: 50px 0;

  ${(props) =>
    props.posts
      ? css`
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, auto));
          gap: 25px;
        `
      : css`
          display: block;
        `}
`;

const Post = styled.div`
  box-shadow: 0 0 10px 0 rgb(110, 110, 110);
  border-radius: 5px;
  position: relative;
  height: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
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
  object-fit: cover;
  border-radius: 5px;
  width: 100%;
  height: 100%;
`;

const ImgPost2 = styled.img`
  object-fit: cover;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const TypePost = styled.span`
  position: absolute;
  top: 7px;
  right: 7px;
  color: white;
  z-index: 15;
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

const CounterImg = styled.div`
  position: absolute;
  bottom: 7px;
  left: 25%;
  transform: translateX(-50%);
  margin: auto;
  z-index: 40;
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

const ShowUser = () => {
  const [userInfo, setUserInfo] = useState({});
  const { userId: userId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwnerRecoil] = useRecoilState(userInfoRecoil);
  const [postSelected, setPostSelected] = useState({});
  const [commentOfPost, setCommentOfPost] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [valueComment, setValueComment] = useState("");
  const [liked, setLiked] = useState({});
  const [ownerFollow, setOwnerFollow] = useState(false);
  const [userFollow, setUserFollow] = useState(false);
  const [listUsersFollowing, setListUsersFollowing] = useState([]);
  const [listUsersFollower, setListUsersFollower] = useState([]);
  const [openModalFollowing, setOpenModalFollowing] = useState(false);
  const [openModalFollower, setOpenModalFollower] = useState(false);
  const url = useLocation();
  const setOwnerId = useSetRecoilState(idUser);

  useEffect(() => {
    setOwnerId(url.pathname.split("/")[2]);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: commentResolver,
  });

  const {} = useQuery(
    "getSessions",
    () => get.checkSession(url.pathname.split("/")[2]),
    {
      onSuccess: (response) => {
        if (!response.data.login) {
          navigate("/login");
        }
      },
      // enabled: !!userId,
    }
  );

  const { isLoading, refetch: refetchgetUser } = useQuery(
    "getUserInfo",
    () => get.userInfoSearch(url.pathname.split("/")[2], userId),
    {
      onSuccess: (response) => {
        // console.log(response);
        if (response?.data) {
          setUserInfo(response?.data);
          setOwnerFollow(response?.data?.ownerFollow);
          setUserFollow(response?.data?.userFollow);
          // setUserInfo(response?.data?.docs[0]);
          // setOwnerRecoil(
          //   // response?.data?.docs[response?.data?.docs.length - 1]
          //   response?.data
          // );
        } else {
          // navigate("/register");
        }
      },
    }
  );

  const { refetch } = useQuery(
    "getComment",
    () => get.comments(postSelected?._id, userId),
    {
      onSuccess: (response) => {
        response?.data?.userLiked?.includes(url.pathname.split("/")[2])
          ? setLiked(true)
          : setLiked(false);
        setCommentOfPost(response?.data);
      },
      enabled: Boolean(postSelected.length),
    }
  );

  const { isLoading: loadGetListFollowing, refetch: refetchListFollowing } =
    useQuery(
      "getListFollowing",
      () => get.getListFollowings(url.pathname.split("/")[2], userId),
      {
        onSuccess: (response) => {
          setListUsersFollowing(response?.data);
        },
        onError: () => {},
        enabled: !!openModalFollowing,
      }
    );

  const { isLoading: loadGetListFollower, refetch: refetchListFollower } =
    useQuery(
      "getListFollower",
      () => get.getListFollowers(url.pathname.split("/")[2], userId),
      {
        onSuccess: (response) => {
          setListUsersFollower(response?.data);
        },
        onError: () => {},
        enabled: !!openModalFollower,
      }
    );

  const createComment = useMutation(
    (command) => put.createComment(postSelected?._id, command),
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        refetch();
        refetchgetUser();
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
        refetchgetUser();
      },
      onError: (error) => {},
      // enabled: Boolean(postSelected.length),
    }
  );

  const handleFollows = useMutation(
    () => put.handleFollow(url.pathname.split("/")[2], userId),
    {
      onSuccess: (response) => {
        refetchgetUser();
      },
    }
  );

  useEffect(() => {
    refetchgetUser();
  }, [userId]);

  const sendComment = (data) => {
    createComment.mutate({
      idUser: url.pathname.split("/")[2],
      userId: userId,
      comment: data.comment,
    });
    setValueComment("");
  };

  const handleFollow = () => {
    handleFollows.mutate();
  };

  const showFollowing = () => {
    refetchListFollowing();
    setOpenModalFollowing(true);
  };

  const showFollowers = () => {
    refetchListFollower();
    setOpenModalFollower(true);
  };

  return (
    <Box component={"section"}>
      <Grid container overflow={"visible"}>
        <Grid item xs={2} position={"sticky"} top={"0"}>
          <Navbar showUser={true} />
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
          <div
            style={{
              width: "100%",
              background: "black",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "25px 0 50px",
              }}
            >
              <div
                style={{
                  width: "30%",
                  background: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="circular"
                    width={200}
                    height={200}
                  />
                ) : (
                  <ImgProf
                    proImg={userInfo?.profImg}
                    src={userInfo?.profImg ? userInfo?.profImg : avatarUser}
                  />
                )}
              </div>
              {/* {isLoading ? (
                <Skeleton
                  sx={{ bgcolor: "grey.900" }}
                  variant="rounded"
                  width={500}
                  height={100}
                />
              ) : ( */}
              {/* <Skeleton variant="rounded" width={600} height={60} /> */}

              <div
                style={{
                  width: "60%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "flex-start",
                  color: "white",
                }}
              >
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    variant="rounded"
                    width={500}
                    height={30}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      // background: "red",
                      marginTop: "-40px",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "30px",
                        fontWeight: "500",
                        letterSpacing: "1px",

                        color: "white",
                      }}
                    >
                      {`${userInfo?.username}`}
                    </h1>
                    {url.pathname.split("/")[2] === userId ? (
                      ""
                    ) : ownerFollow ? (
                      <ButtonFollow onClick={() => handleFollow()}>
                        unfollow
                      </ButtonFollow>
                    ) : (
                      <ButtonFollow onClick={() => handleFollow()}>
                        follow
                      </ButtonFollow>
                    )}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    margin: "25px 0",
                    fontSize: "20px",
                  }}
                >
                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900", marginRight: "15px" }}
                      variant="rounded"
                      width={120}
                      height={30}
                    />
                  ) : (
                    <p
                      style={{ marginRight: "55px" }}
                    >{`${userInfo?.post?.length} posts`}</p>
                  )}

                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900", marginRight: "15px" }}
                      variant="rounded"
                      width={120}
                      height={30}
                    />
                  ) : (
                    <p
                      style={{ marginRight: "55px", cursor: "pointer" }}
                      onClick={() => showFollowers()}
                    >{`${userInfo?.followerCount} followers`}</p>
                  )}

                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "grey.900", marginRight: "15px" }}
                      variant="rounded"
                      width={120}
                      height={30}
                    />
                  ) : (
                    <p
                      style={{ marginRight: "55px", cursor: "pointer" }}
                      onClick={() => showFollowing()}
                    >{`${userInfo?.followingCount} following`}</p>
                  )}
                </div>
                {/* <p style={{ fontWeight: "bold", fontSize: "18px" }}></p> */}
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900", marginRight: "15px" }}
                    variant="rounded"
                    width={120}
                    height={20}
                  />
                ) : (
                  <p>{`${userInfo?.name}`}</p>
                )}
              </div>
            </div>

            {userFollow && (
              <div style={{ margin: "-15px 0 10px 117px " }}>
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "grey.900", marginRight: "15px" }}
                    variant="rounded"
                    width={200}
                    height={20}
                  />
                ) : (
                  <p
                    style={{ color: "rgb(211, 211, 211)" }}
                  >{`${userInfo?.username} is following you`}</p>
                )}
              </div>
            )}

            <Divider
              sx={{
                "&::before, &::after": {
                  borderColor: "white",
                },
              }}
            >
              <Chip
                label="Posts"
                sx={{ color: "black", background: "white", fontSize: "18px" }}
              />
            </Divider>

            <PartPosts posts={userInfo?.post?.length}>
              {userInfo?.post?.length ? (
                userInfo?.post?.map((item, index) => {
                  return isLoading ? (
                    <Skeleton
                      sx={{
                        bgcolor: "grey.900",
                        margin: "15px 15px",
                        display: "inline-block",
                      }}
                      variant="rounded"
                      width={300}
                      height={270}
                    />
                  ) : (
                    <Post
                      onClick={async () => {
                        await setPostSelected(item);
                        setOpenModal(true);
                        refetch();
                        const command = { id: owner._id };
                      }}
                    >
                      <ImgPost
                        alt={"post"}
                        height={"100%"}
                        effect="blur"
                        // src={img1}
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
              ) : (
                <p
                  style={{
                    color: "grey",
                    fontSize: "50px",
                    textAlign: "center",
                    marginTop: "100px",
                  }}
                >
                  No Post
                </p>
              )}
            </PartPosts>
          </div>
        </Grid>
      </Grid>

      <ModalCustom open={openModal /*true*/} center>
        <BackModal
          open={openModal}
          onClick={() => setOpenModal(false)}
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
                    src={item}
                    alt=""
                    style={{
                      maxWidth: "100%",
                      // height: "400px",
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
                    src={userInfo?.profImg ? userInfo?.profImg : avatarUser}
                    alt=""
                  />
                  <p
                    style={{
                      letterSpacing: "0.5px",
                      fontWeight: "600",
                      fontSize: "17px",
                    }}
                  >
                    {`${userInfo?.username}`}
                  </p>
                </div>
                <div
                  onClick={() => {
                    const command = {
                      idUser: url.pathname.split("/")[2],
                      userId: userId,
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
              </div>

              <Caption>{postSelected?.text}</Caption>
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
                            userId === item._id
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
                        {userId === item._id && (
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
                value={valueComment}
                onChange={(event) => setValueComment(event.target.value)}
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

      <ModalFollow
        openModal={openModalFollowing}
        isLoading={loadGetListFollowing}
        showUser={true}
        name={"following"}
        users={listUsersFollowing}
        handleOpenModal={setOpenModalFollowing}
        refetchFollow={refetchListFollowing}
      />

      <ModalFollow
        openModal={openModalFollower}
        isLoading={loadGetListFollower}
        showUser={true}
        name={"follower"}
        users={listUsersFollower}
        handleOpenModal={setOpenModalFollower}
        refetchFollow={refetchListFollower}
      />

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

export default ShowUser;
