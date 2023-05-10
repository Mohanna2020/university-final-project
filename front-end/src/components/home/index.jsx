import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Skeleton,
} from "@mui/material";
import styled, { css } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import idUser from "../../store/idUser";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import Carousel from "react-material-ui-carousel";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import styles from "../../styles/home/style.module.css";
import SendIcon from "@mui/icons-material/Send";
import { commentResolver } from "../../schema/comment";
import avatarUser from "../../images/user.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import get from "../../service/get";
import put from "../../service/put";

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 90%;
  // background: blue;
`;

const PostOfMain = styled.div`
  // margin: auto;
  width: 68%;
  height: 750px;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  // box-shadow: 0 0 10px 0 rgb(90, 90, 90);
  border-radius: 10px;
  color: white;
  padding: 40px;
  padding-left: 70px;
  overflow-y: auto;
  background: black;
  // padding:
  direction: rtl;
  ::-webkit-scrollbar {
    direction: rtl;
  }
`;

const ListFollowed = styled.div`
  width: 100%;
  height: 115px;
  // box-shadow: 0 0 10px 0 rgb(90, 90, 90);
  // border-radius: 10px;
  // background-color: red;
  // padding: 8px 10px;
  direction: ltr;
  overflow-x: auto;
  display: flex;
  ::-webkit-scrollbar {
    width: 2px;
    height: 7px;
  }
  // align-items:center;
  div {
    text-align: center;
    width: 90px;
    height: 105px;
    // border-radius: 50%;
    margin-right: 17px;
    // overflow: hidden;
    flex: 0 0 80px;
  }
  div img {
    background: rgb(70, 70, 70);
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    padding: 2px;
    border: 2px solid rgb(150, 0, 87);
    cursor: pointer;
  }
`;

const PostsFollowers = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  direction: ltr;
`;

const Post = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  // height:700px;
  // background: green;
  margin: 10px 0 60px;
`;

const HeaderPost = styled.div`
  user-select: none;
  display: flex;
  justify-content: space-between;
  // justify-content:center;
  align-items: center;
  padding: 12px;
  // padding-right:0;
  div:nth-child(1) {
    display: flex;
    align-items: center;
  }
  div:nth-child(1) img {
    width: 55px;
    height: 55px;
    object-fit: cover;
    border-radius: 50%;
    padding: 1px;
    border: 2px solid rgb(150, 0, 87);
    cursor: pointer;
  }

  div:nth-child(1) div {
    margin-left: 10px;
  }
`;

const ImgPost = styled.div`
  width: 500px;
  height: 550px;
  margin: auto;
  display: flex;
  justify-content: center;
  background: rgb(200, 200, 200);
  img {
    margin: auto;

    max-width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FooterPost = styled.div`
  padding: 10px 0;
  // width: 30%;
  // background: yellow;
  display: flex;
  flex-direction: column;
  div:nth-child(1) {
    display: flex;
    align-items: center;
  }
`;

const ButtonUnfollow = styled.button`
  outline: none;
  border: 2px solid white;
  width: 75px;
  text-align: center;
  margin-left: 35px;
  padding: 7px 0;
  border-radius: 7px;
  font-weight: bold;
  font-size: 15px;
  transition: all 0.3s;
  :hover {
    color: white;
    font-weight: 500;
    background: black;
  }
`;

const InfoUser = styled.div`
  // background: red;
  user-select: none;
  color: white;
  width: 30%;
  // padding:25px;
  padding: 25px 0 25px 5px;
  div:nth-child(1) {
    // background: yellow;
    display: flex;
    align-items: center;
  }

  div:nth-child(1) div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  div:nth-child(2) {
    // margin: 25px 0;
    // display: flex;
    // justify-content: "flex-start";
  }
`;

const ImgProf = styled.img`
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 50%;
  padding: 1px;
  border: 2px solid rgb(150, 0, 87);
  cursor: pointer;
  background: rgb(70, 70, 70);
`;

const CoverLike = styled.div`
  // position: absolute;
  // top: 0;
  // right: 0;
  // width: 100%;
  // height: 500px;
  width: 0;
  height: 0;
  top: 50%;
  // background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  // animation-name: like;
  // animation-duration: 4s;

  // @keyframes like {
  //   0% {
  //     font-size: 0;
  //   }
  //   50% {
  //     font-size: 125px;
  //   }
  //   100% {
  //     font-size: 0;
  //   }
  // }
`;

// const MenuTooltip = styled.div`
//   position: absolute;
//   top: -4px;
//   // background:green;
//   right: -105px;
//   border-radius: 7px;
//   background-color: white;
//   width: 90px;
//   height: 34px;
//   padding: 5px 10px 0;

//   ${(props) =>
//     props.opened
//       ? css`
//           display: block;
//         `
//       : css`
//           display: none;
//         `}
//   ::before {
//     content: "";
//     background-color: white;
//     position: absolute;
//     top: 12px;
//     left: -4px;
//     width: 10px;
//     height: 10px;
//     transform: rotate(45deg);
//   }
//   button {
//     margin: auto;
//     outline: none;
//     border: none;
//     font-weight: bold;
//     background: white;
//     cursor: pointer;
//   }
// `;

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

const Home = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [postSelected, setPostSelected] = useState({});
  const setOwnerId = useSetRecoilState(idUser);
  const [valueComment, setValueComment] = useState("");
  const [posts, setPosts] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [suggests, setSuggests] = useState([]);
  const [info, setInfo] = useState({});
  const [commentOfPost, setCommentOfPost] = useState({});
  const [stateLike, setStateLike] = useState(true);
  const [likeId, setLikeId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: commentResolver,
  });

  useEffect(() => {
    setOwnerId(userId);
  }, []);

  const {} = useQuery("getSessions", () => get.checkSession(userId), {
    onSuccess: (response) => {
      if (!response.data.login) {
        navigate("/login");
      }
    },
    // enabled: !!userId,
  });

  // const test =
  //   "loremffsdfvskv  njn fn df nndf ndf nd nnf jn nnnnnnnnnn n  j jjjj kk u bb bjb b jb jbj bjbjb jbjkjb jbkiuudsvw v wrv ev ev e v eevev ebet etbe betb b bjb resf eeeggnern ";
  // const isLoading = false;

  const { isLoading, refetch: refechInfoHome } = useQuery(
    "getInfosHome",
    () => get.infoHome(userId),
    {
      onSuccess: (response) => {
        setSuggests(response?.data?.suggest);
        setPosts(response?.data?.posts);
        setFollowings(response?.data?.followings);
        setInfo(response?.data?.userInfo);
      },
    }
  );

  const handleFollows = useMutation((id) => put.handleFollow(userId, id), {
    onSuccess: (response) => {
      refechInfoHome();
    },
  });

  const { refetch } = useQuery(
    "getCommentsHome",
    () => get.comments(postSelected?._id, postSelected.id),
    {
      onSuccess: (response) => {
        // response?.data?.userLiked?.includes(url.pathname.split("/")[2])
        //   ? setLiked(true)
        //   : setLiked(false);
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

  const handleLikeHome = useMutation((command) => put.like(likeId, command), {
    onSuccess: (response) => {
      setStateLike(response?.data?.like);
      refechInfoHome();
    },
    onError: (error) => {
      // console.log("dislike", error);
    },
    // enabled: Boolean(postSelected.length),
  });

  const sendComment = (data) => {
    createComment.mutate({
      idUser: userId,
      userId: postSelected.id,
      comment: data.comment,
    });
    setValueComment("");
  };

  const handleFollow = (id) => {
    handleFollows.mutate(id);
  };

  const handleLike = async (e, id, likeCount) => {
    const command = {
      idUser: userId,
      userId: id,
    };

    await handleLikeHome.mutate(command);

    // stateLike
    //   ? (e.target.className = "fas fa-heart")
    //   : (e.target.className = "far fa-heart");
    // stateLike
    //   ? (e.target.style.color = "red")
    //   : (e.target.style.color = "white");
    // stateLike
    //   ? (e.target.parentElement.nextSibling.innerText=Number(e.target.parentElement.nextSibling.innerText) + 1 + "like")
    //   : (e.target.parentElement.nextSibling.innerText = likeCount);
  };

  // const handleDisLike = (e) => {
  //   console.log("okkkk");
  //   e.target.style.color = "blue";
  // };

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
          <div>
            <h1>Home</h1>
          </div>
          <Main>
            <PostOfMain>
              <ListFollowed>
                {isLoading ? (
                  <CircularProgress
                    color="inherit"
                    style={{ margin: "auto" }}
                  />
                ) : !followings.length ? (
                  <p
                    style={{
                      // color: "red",
                      color: "rgb(200,200,200)",
                      margin: "auto",
                      fontSize: "20px",
                    }}
                  >
                    You have not followed any user
                  </p>
                ) : (
                  followings?.map((item) => {
                    return (
                      <div
                        key={item._id}
                        onClick={() => navigate(`/users/${userId}/${item._id}`)}
                      >
                        <img
                          src={item?.profImg ? item?.profImg : avatarUser}
                          alt={`${item.username}`}
                        />
                        <p
                          style={{
                            color: "white",
                            userSelect: "none",
                            cursor: "pointer",
                          }}
                        >
                          {item?.username?.length < 9
                            ? item?.username
                            : `${item?.username?.substring(0, 6)}...`}
                        </p>
                      </div>
                    );
                  })
                )}
              </ListFollowed>
              <PostsFollowers>
                {/* <List height={800} itemCount={5} itemSize={35} width={"100%"}> */}
                {/* {() => (
                    <>
                      <div>
                        <p>2222</p>
                      </div>
                    </>
                    
                  )} */}

                {/* {() => */}
                {posts?.map((item) => (
                  <Post key={item._id}>
                    <HeaderPost>
                      <div>
                        {isLoading ? (
                          <Skeleton
                            sx={{ bgcolor: "rgb(100,100,100)" }}
                            variant="circular"
                            width={"55px"}
                            height={"55px"}
                          />
                        ) : (
                          <img
                            src={item.profImg ? item.profImg : avatarUser}
                            style={{ background: "rgb(70, 70, 70)" }}
                            alt=""
                            onClick={() =>
                              navigate(`/users/${userId}/${item.id}`)
                            }
                          />
                        )}
                        <div>
                          {isLoading ? (
                            <Skeleton
                              sx={{
                                bgcolor: "rgb(100,100,100)",
                                marginBottom: "5px",
                              }}
                              variant="rounded"
                              width={"80px"}
                              height={"15px"}
                            />
                          ) : (
                            <p
                              style={{
                                fontSize: "17px",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                navigate(`/users/${userId}/${item.id}`)
                              }
                            >
                              {item.username}
                            </p>
                          )}

                          {isLoading ? (
                            <Skeleton
                              sx={{ bgcolor: "rgb(100,100,100)" }}
                              variant="rounded"
                              width={"55px"}
                              height={"12px"}
                            />
                          ) : item.location ? (
                            <p
                              style={{
                                fontSize: "16px",
                                marginTop: "3px",
                                color: "rgb(170,170,170)",
                              }}
                            >
                              <i
                                className="fas fa-map-pin"
                                style={{
                                  marginRight: "7px",
                                  color: "rgb(250,250,250)",
                                }}
                              ></i>
                              {item.location}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div style={{ position: "relative" }}>
                        {isLoading ? (
                          <Skeleton
                            sx={{ bgcolor: "rgb(100,100,100)" }}
                            variant="rounded"
                            width={"80px"}
                            height={"35px"}
                          />
                        ) : (
                          <ButtonUnfollow onClick={() => handleFollow(item.id)}>
                            unfollow
                          </ButtonUnfollow>
                        )}
                        {/* <i
                                        style={{
                                          fontSize: "25px",
                                          cursor: "pointer",
                                          position: "relative",
                                        }}
                                        className="fas fa-ellipsis-v"
                                        onClick={() => setOpenTooltip((prev) => !prev)}
                                      ></i>
                                      <MenuTooltip
                                        style={
                                          true ? { display: "block" } : { display: "none" }
                                        }
                                      >
                                        <button>
                                          <i className="fas fa-trash"></i>
                                          <span style={{ marginLeft: "5px", fontSize: "15px" }}>
                                            unfollow
                                          </span>
                                        </button>
                                      </MenuTooltip> */}
                      </div>
                    </HeaderPost>
                    {/* <ContainerPost> */}
                    {/* <ImgPost>
                                    <img src={img2} alt="" />
                                  </ImgPost> */}
                    <div
                      style={{
                        background: "rgba(200,200,200,0.2)",
                        margin: "0 auto",
                        width: "100%",
                        height: "500px",
                        textAlign: "center",
                        // display:'flex',
                        // justifyContent:'center'
                      }}
                    >
                      {isLoading ? (
                        <Skeleton
                          sx={{ bgcolor: "rgb(100,100,100)" }}
                          variant="rectangular"
                          width={"100%"}
                          height={"100%"}
                        />
                      ) : (
                        <Carousel
                          // NavButton={{position:'relative'}}
                          indicatorContainerProps={{
                            // Move the buttons to the bottom. Unsetting top here to override default style.
                            style: {
                              // zIndex:100,
                              // background:'red',
                              width: "100%",
                              height: "100%",
                              // display:'inline',
                              // margin:'auto',
                              // textAlign:'center',
                              // position:'absolute',
                              // margin:'100px',
                              // bottom: "-105px",
                              // left:'50%',
                              // transform:'translateX(-50%)'
                              // top: "unset",
                            },
                          }}
                          // next={() => (numberImage = numberImage + 1)}
                          // prev={() => (numberImage = numberImage - 1)}
                          autoPlay={false}
                          animation={"slide"}
                          duration={400}
                          navButtonsAlwaysVisible={false}
                          // navButtonsAlwaysVisible={array_img?.length === 1 ? false : true}
                          // navButtonsAlwaysVisible={false}
                          navButtonsAlwaysInvisible={
                            item?.images?.length === 1 ? true : false
                            // false
                          }
                          indicators={item?.images?.length !== 1 ? true : false}
                        >
                          {/* <div></div> */}
                          {item?.images?.map((item, index) => {
                            // {array_img.map((item, index) => {
                            return (
                              <div
                                key={index}
                                style={
                                  {
                                    // position: "relative",
                                  }
                                }
                              >
                                <img
                                  src={item}
                                  alt=""
                                  style={{
                                    margin: "auto",
                                    maxWidth: "100%",
                                    height: "500px",
                                    objectFit: "cover",
                                  }}
                                />
                                {/* <CoverLike className="coverLike">
                                            <FavoriteOutlinedIcon
                                              sx={{
                                                color: "white",
                                                // cursor: "pointer",
                                                fontSize: "150px",
                                                // marginRight: "10px",
                                              }}
                                            />
                                          </CoverLike> */}
                              </div>
                            );
                          })}
                        </Carousel>
                      )}
                    </div>
                    {/* </ContainerPost> */}

                    <FooterPost>
                      <div>
                        {/* {true  */}
                        {/* {item?.like  ? ( */}
                        <i
                          style={
                            item.like
                              ? {
                                  cursor: "pointer",
                                  fontSize: "30px",
                                  marginRight: "10px",
                                  zIndex: "15",
                                  color: "red",
                                }
                              : {
                                  cursor: "pointer",
                                  fontSize: "30px",
                                  marginRight: "10px",
                                  zIndex: "15",
                                  color: "white",
                                }
                          }
                          className={
                            item.like ? "fas fa-heart" : "far fa-heart"
                          }
                          onClick={async (e) => {
                            await setLikeId(item._id);
                            handleLike(e, item.id, item.likeCount);
                          }}
                        ></i>
                        {/* ) : ( */}
                        {/* <i
                            style={{
                              cursor: "pointer",
                              fontSize: "30px",
                              marginRight: "10px",
                              zIndex: "15",
                            }}
                            className="far fa-heart"
                            onClick={(e) => handleDisLike(e)}
                          ></i> */}
                        {/* )} */}

                        {/* <i className="fa-regular fa-heart"></i> */}
                        {/* <i
                          style={{
                            cursor: "pointer",
                            fontSize: "30px",
                            marginRight: "10px",
                            zIndex: "15",
                          }}
                          className={
                            false ? "fas fa-heart" : "far fa-heart"
                          }
                        ></i> */}
                        {/* <FavoriteBorderIcon
                          onClick={(e) => {
                            console.log("okkkkkk", (e.target.color = "red"));
                          }}
                          sx={{
                            cursor: "pointer",
                            fontSize: "35px",
                            marginRight: "10px",
                            zIndex: "15",
                          }}
                        /> */}
                        <ChatBubbleIcon
                          sx={{
                            cursor: "pointer",
                            fontSize: "32px",
                            zIndex: "15",
                          }}
                          onClick={async () => {
                            await setPostSelected(item);
                            setOpenModal(true);
                            refetch();
                          }}
                        />
                      </div>
                      <div>
                        {isLoading ? (
                          <Skeleton
                            sx={{
                              bgcolor: "rgb(100,100,100)",
                              margin: "5px 0",
                            }}
                            variant="rounded"
                            width={"100px"}
                            height={"18px"}
                          />
                        ) : (
                          <p
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              margin: "5px 0",
                            }}
                          >
                            {`${item?.likeCount} likes`}
                          </p>
                        )}
                      </div>
                      <div>
                        {isLoading ? (
                          <Skeleton
                            sx={{
                              bgcolor: "rgb(100,100,100)",
                              marginBottom: "5px",
                            }}
                            variant="rounded"
                            width={"100px"}
                            height={"18px"}
                          />
                        ) : (
                          <p
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              margin: "5px 0",
                            }}
                          >
                            {`${item?.commentCount} comments`}
                          </p>
                        )}
                      </div>
                      <div>
                        {isLoading ? (
                          <Skeleton
                            sx={{ bgcolor: "rgb(100,100,100)" }}
                            variant="rounded"
                            width={"95%"}
                            height={"50px"}
                          />
                        ) : (
                          <>
                            <p style={{ display: "inline-block" }}>
                              <>
                                {item?.caption?.length < 50
                                  ? item?.caption
                                  : `${item?.caption?.substring(0, 50)} `}

                                {/* {item?.caption.length < 21
                              ? item?.caption
                              : showCaption
                              ? item?.caption
                              : item?.caption.substr(0, 21)}
                            {showCaption ? (
                              <span style={{ color: "grey" }}> less</span>
                            ) : (
                              <span style={{ color: "grey" }}>more ...</span>
                            )} */}
                              </>
                            </p>

                            {item?.caption?.length < 50 ? (
                              ""
                            ) : (
                              <>
                                <span
                                  style={{
                                    color: "grey",
                                    userSelect: "none",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                    fontWeight: "bold",
                                  }}
                                  onClick={(e) => {
                                    if (e.target.innerText == "more...") {
                                      e.target.innerText = "less";
                                      e.target.previousSibling.innerText =
                                        item?.caption;
                                    } else {
                                      e.target.previousSibling.innerText =
                                        item?.caption?.substring(0, 50);
                                      e.target.innerText = "more...";
                                    }
                                  }}
                                >
                                  more...
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          color: "grey",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        <p>{item?.date}</p>
                      </div>
                    </FooterPost>
                  </Post>
                ))}
                {/* } */}
                {/* </List> */}
              </PostsFollowers>
            </PostOfMain>

            <InfoUser>
              <div>
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "rgb(100,100,100)" }}
                    variant="circular"
                    width={"80px"}
                    height={"80px"}
                  />
                ) : (
                  <ImgProf
                    src={info?.profImg ? info?.profImg : avatarUser}
                    alt=""
                    onClick={() => navigate(`/user/${userId}`)}
                  />
                )}
                <div>
                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "rgb(100,100,100)", marginBottom: "7px" }}
                      variant="rounded"
                      width={"100px"}
                      height={"18px"}
                    />
                  ) : (
                    <p
                      style={{
                        fontWeight: "600",
                        fontSize: "19px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/user/${userId}`)}
                    >
                      {info?.username}
                    </p>
                  )}

                  {isLoading ? (
                    <Skeleton
                      sx={{ bgcolor: "rgb(100,100,100)" }}
                      variant="rounded"
                      width={"85px"}
                      height={"14px"}
                    />
                  ) : (
                    <p>{info?.name}</p>
                  )}
                </div>
              </div>
              <div
                style={{
                  margin: "25px 0 35px 0",
                  display: "flex",
                  justifyContent: "flex-start",
                  userSelect: "none",
                }}
              >
                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "rgb(100,100,100)" }}
                    variant="rounded"
                    width={"80px"}
                    height={"15px"}
                  />
                ) : (
                  <p style={{ marginRight: "25px", fontWeight: "600" }}>
                    {info?.followerCount} followers
                  </p>
                )}

                {isLoading ? (
                  <Skeleton
                    sx={{ bgcolor: "rgb(100,100,100)", marginLeft: "15px" }}
                    variant="rounded"
                    width={"80px"}
                    height={"15px"}
                  />
                ) : (
                  <p style={{ fontWeight: "600" }}>
                    {info?.followingCount} followings
                  </p>
                )}
              </div>
              <div
                style={{
                  // background: "",
                  // boxShadow:'0 0 10px 0 grey',
                  width: "85%",
                  borderRadius: "7px",
                  // padding: "10px 15px",
                }}
              >
                {suggests?.map((item) => {
                  return (
                    <div
                      className={styles.cartSearch}
                      key={item._id}
                      // onClick={() => navigate(`/user/${owner_id}/${item._id}`)}
                      onClick={() =>
                        // showUser
                        // ? navigate(
                        //     `/users/${url.pathname.split("/")[2]}/${item._id}`
                        //   )
                        // :
                        navigate(`/users/${userId}/${item._id}`)
                      }
                    >
                      {isLoading ? (
                        <Skeleton
                          sx={{ bgcolor: "rgb(100,100,100)" }}
                          variant="circular"
                          width={"65px"}
                          height={"65px"}
                        />
                      ) : (
                        <img
                          src={item?.profImg ? item?.profImg : avatarUser}
                          alt={item.name}
                          className={styles.imgSearch}
                          onClick={() =>
                            navigate(`/users/${userId}/${item.id}`)
                          }
                        />
                      )}

                      <div className={styles.textCartSearch}>
                        {isLoading ? (
                          <Skeleton
                            sx={{
                              bgcolor: "rgb(100,100,100)",
                              marginBottom: "10px",
                            }}
                            variant="rounded"
                            width={"90px"}
                            height={"20px"}
                          />
                        ) : (
                          <p
                            className={styles.userNameSearch}
                            onClick={() =>
                              navigate(`/users/${userId}/${item.id}`)
                            }
                          >
                            {item.username}
                          </p>
                        )}

                        {isLoading ? (
                          <Skeleton
                            sx={{ bgcolor: "rgb(100,100,100)" }}
                            variant="rounded"
                            width={"65px"}
                            height={"15px"}
                          />
                        ) : (
                          <p className={styles.nameSearch}>{item.name}</p>
                        )}

                        {/* <p className={styles.userNameSearch}>
                          {item.username}ggggg
                        </p>
                        <p className={styles.nameSearch}>{item.name}gggg</p> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfoUser>
          </Main>
        </Grid>
      </Grid>

      <ModalCustom open={openModal /*true*/} center>
        <BackModal
          open={openModal}
          onClick={() => {
            setOpenModal(false);
            refechInfoHome();
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
              // navButtonsAlwaysVisible={falseS}
              navButtonsAlwaysVisible={
                postSelected?.images?.length === 1 ? false : true
              }
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
                    key={index}
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
                    src={info?.profImg ? info?.profImg : avatarUser}
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
                {/* <div
                  onClick={() => {
                    const command = {
                      idUser: url.pathname.split("/")[2],
                      userId: userId,
                    };
                    handleLike.mutate(command);
                  }}
                >
                  {
                    liked ? (
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
                    )
                  }
                </div>  */}
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
                  <Comment key={item._id}>
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
                            postSelected?.id === item._id
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
                        {postSelected?.id === item.id && (
                          <>
                            {/* <i
                              className="fas fa-star"
                              style={{
                                color: "yellow",
                                fontSize: "13px",
                                margin: "10px 0 0 10px",
                              }}
                            ></i> */}
                            <i
                              className="fas fa-certificate"
                              style={{
                                color: "yellow",
                                fontSize: "13px",
                                margin: "10px 0 0 10px",
                              }}
                            ></i>
                          </>
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

export default Home;
