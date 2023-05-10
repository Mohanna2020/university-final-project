import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import styles from "../../styles/navbar/style.module.css";
import {
  Home,
  SettingsSuggestOutlined,
  AccountCircleOutlined,
  AddBoxOutlined,
  MailOutlined,
  SearchOutlined,
  Instagram,
} from "@mui/icons-material";
import styled, { css } from "styled-components";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import post from "../../service/post/index";
import { useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import idUser from "../../store/idUser";
import avatarUser from "../../images/user.png";

const Logo = styled.h1`
  color: white;
  font-size: 50px;
  font-family: "Dancing Script", cursive;
  margin-left: 15px;
  margin-bottom: 40px;
  ${(props) =>
    props.show
      ? css`
          display: block;
          // display: none;
        `
      : css`
          display: block;
        `}
`;

const IconInsta = styled.span`
  margin-bottom: 56px;
  ${(props) =>
    props.show
      ? css`
          display: none;
          // display: block;
        `
      : css`
          display: none;
        `}
`;

const IconClose = styled.span`
  position: absolute;
  top: 53px;
  right: 17px;
  font-size: 35px;
  font-weight: bold;
  cursor: pointer;
`;

const SearchSlide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  // left: 80px;
  height: 100vh;
  background: black;
  border-right: 2px solid grey;
  border-left: 2px solid grey;
  display: flex;
  flex-direction: column;
  z-index: 10;
  width: 400px;
  padding: 25px 0;
  transition: all 0.3s;

  h2 {
    font-size: 35px;
    margin: 20px 0 50px 25px;
  }

  div:nth-child(2) span {
    color: grey;
    cursor: pointer;
    font-size: 30px;
    :hover {
      color: white;
    }
  }

  div:nth-child(3) input {
    outline: none;
    border: none;
    width: 90%;
    background: rgb(51, 51, 51);
    color: white;
    padding: 10px 7px;
    // height:100px;
    font-size: 18px;
    border-radius: 5px;
  }

  ${(props) =>
    !props.showSearch
      ? css`
          // display: none;
          transform: translateX(-150%);
        `
      : css`
          // display: block;
          transform: translateX(0%);
        `}
`;

const Navbar = ({ showUser }) => {
  const navigate = useNavigate();
  // const [hiddenTitle, setHiddenTitle] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [cartSearch, setCartSearch] = useState([]);
  const [error, setError] = useState(false);
  const inputSearch = useRef(null);
  const { id: userId } = useParams();
  const [owner_id, setOwnerId] = useRecoilState(idUser);
  const url = useLocation();

  useEffect(() => {
    setOwnerId(url.pathname.split("/")[2]);
  }, []);

  const SearchRequest = useMutation(
    (command) => {
      return post.search(command);
    },
    {
      onSuccess: (response) => {
        setError(false);
        response === "" ? setCartSearch([]) : setCartSearch(response.data);
      },
      onError: () => {
        setError(true);
      },
    }
  );

  useEffect(() => {
    if (valueSearch === "") {
      setError(false);
    }
  }, [valueSearch]);

  const handleSearch = (data) => {
    setError(false);
    setValueSearch(data);
    const command = {};
    command.username = data;
    data ? SearchRequest.mutate(command) : setCartSearch([]);
  };

  return (
    <Box component={"nav"} className={styles.navbar}>
      <Grid
        container
        sx={{ paddingRight: "20px", position: "relative", height: "100%" }}
      >
        <Stack
          direction={"column"}
          width={"100%"}
          justifyContent={"space-between"}
        >
          <Stack direction={"column"} width={"100%"}>
            <Grid item>
              <Logo show={showSearch}>insper</Logo>

              <IconInsta show={showSearch}>
                <Instagram sx={{ fontSize: "40px", marginLeft: "15px" }} />
              </IconInsta>
            </Grid>

            <Grid
              item
              className={styles.items_nav}
              mb={"25px"}
              // onClick={() => navigate("/home")}
              onClick={() =>
                showUser
                  ? navigate(`/home/${url.pathname.split("/")[2]}`)
                  : navigate(`/home/${userId}`)
              }
            >
              <NavLink
                to={
                  showUser
                    ? `/home/${url.pathname.split("/")[2]}`
                    : `/home/${userId}`
                }
                style={({ isActive }) => {
                  return {
                    background: isActive && "rgb(24, 24, 24)",
                  };
                }}
              >
                <Home
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />

                <span>Home</span>
              </NavLink>
              {/* <button type="button" className={styles.items_nav_text}>
                <Home
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />

                <span>Home</span>
              </button> */}
            </Grid>

            <Grid
              item
              className={styles.items_nav}
              mb={"25px"}
              onClick={() => {
                // setHiddenTitle((prev) => !prev);
                setShowSearch((prev) => !prev);
                inputSearch.current.focus();
              }}
            >
              <button type="button" className={styles.items_nav_text}>
                <SearchOutlined
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />
                <span>Search</span>
              </button>
            </Grid>

            <Grid item className={styles.items_nav} mb={"25px"}>
              <button type="button" className={styles.items_nav_text}>
                <MailOutlined
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />
                <span>
                  Message{" "}
                  <span style={{ fontSize: "10px" }}>(comming soon)</span>
                </span>
              </button>
            </Grid>

            <Grid
              item
              className={styles.items_nav}
              mb={"25px"}
              // onClick={() => navigate(`/createPost/${userId}`)}
              onClick={() =>
                showUser
                  ? navigate(`/explore/${url.pathname.split("/")[2]}`)
                  : navigate(`/explore/${userId}`)
              }
            >
              <NavLink
                to={
                  showUser
                    ? `/explore/${url.pathname.split("/")[2]}`
                    : `/explore/${userId}`
                }
                style={({ isActive }) => {
                  return {
                    background: isActive && "rgb(24, 24, 24)",
                  };
                }}
              >
                <i
                  className={`${styles.items_nav_icon} fab fa-wpexplorer`}
                  style={{
                    transition: "all .3s",
                    fontSize: "40px",
                    marginRight: "15px",
                  }}
                ></i>
                <span>Explore</span>
              </NavLink>
              {/* <button type="button" className={styles.items_nav_text}>
                <AddBoxOutlined
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />
                <span>Create</span>
              </button> */}
            </Grid>

            <Grid
              item
              className={styles.items_nav}
              mb={"25px"}
              // onClick={() => navigate(`/createPost/${userId}`)}
              onClick={() =>
                showUser
                  ? navigate(`/createPost/${url.pathname.split("/")[2]}`)
                  : navigate(`/createPost/${userId}`)
              }
            >
              <NavLink
                to={
                  showUser
                    ? `/createPost/${url.pathname.split("/")[2]}`
                    : `/createPost/${userId}`
                }
                style={({ isActive }) => {
                  return {
                    background: isActive && "rgb(24, 24, 24)",
                  };
                }}
              >
                <AddBoxOutlined
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />
                <span>Create</span>
              </NavLink>
              {/* <button type="button" className={styles.items_nav_text}>
                <AddBoxOutlined
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />
                <span>Create</span>
              </button> */}
            </Grid>

            <Grid
              item
              className={styles.items_nav}
              mb={"25px"}
              onClick={() =>
                showUser
                  ? navigate(`/user/${url.pathname.split("/")[2]}`)
                  : navigate(`/user/${userId}`)
              }
            >
              <NavLink
                to={
                  showUser
                    ? `/user/${url.pathname.split("/")[2]}`
                    : `/user/${userId}`
                }
                style={({ isActive }) => {
                  return {
                    background: isActive && "rgb(24, 24, 24)",
                  };
                }}
              >
                <AccountCircleOutlined
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />
                <span>Profile</span>
              </NavLink>
              {/* <button type="button" className={styles.items_nav_text}>
                <AccountCircleOutlined
                  className={styles.items_nav_icon}
                  sx={{ transition: "all .3s", fontSize: "40px" }}
                />
                <span>Profile</span>
              </button> */}
            </Grid>
          </Stack>

          <Grid
            item
            className={styles.items_nav}
            mb={"25px"}
            onClick={() =>
              showUser
                ? navigate(`/setting/${url.pathname.split("/")[2]}`)
                : navigate(`/setting/${userId}`)
            }
          >
            <NavLink
              to={
                showUser
                  ? `/setting/${url.pathname.split("/")[2]}`
                  : `/setting/${userId}`
              }
              style={({ isActive }) => {
                return {
                  background: isActive && "rgb(24, 24, 24)",
                };
              }}
            >
              <SettingsSuggestOutlined
                className={styles.items_nav_icon}
                sx={{ transition: "all .3s", fontSize: "40px" }}
              />
              <span>Setting</span>
            </NavLink>
            {/* <button type="button" className={styles.items_nav_text}>
              <SettingsSuggestOutlined
                className={styles.items_nav_icon}
                sx={{ transition: "all .3s", fontSize: "40px" }}
              />
              <span>Setting</span>
            </button> */}
          </Grid>
        </Stack>
      </Grid>

      <SearchSlide showSearch={showSearch}>
        <IconClose
          className="material-symbols-outlined"
          onClick={() => setShowSearch(false)}
        >
          close
        </IconClose>
        <h2>Search</h2>
        <div className={styles.inputSearch}>
          <input
            ref={inputSearch}
            type="text"
            placeholder="Search ..."
            value={valueSearch}
            onChange={(event) => handleSearch(event.target.value)}
          />
          <span
            style={{ cursor: "pointer", userSelect: "none" }}
            className="material-symbols-outlined"
            onClick={() => {
              setValueSearch("");
              setCartSearch([]);
            }}
          >
            cancel
          </span>
        </div>
        <div className={styles.cartsSearch}>
          {SearchRequest.isLoading ? (
            <Stack
              width={"100%"}
              direction={"row"}
              justifyContent={"center"}
              mt={4}
            >
              <CircularProgress color="inherit" />
            </Stack>
          ) : error ? (
            <h3 style={{ color: "crimson", textAlign: "center" }}>
              user not found
            </h3>
          ) : (
            cartSearch?.map((item) => {
              return (
                <div
                  className={styles.cartSearch}
                  key={item._id}
                  // onClick={() => navigate(`/user/${owner_id}/${item._id}`)}
                  onClick={() =>
                    showUser
                      ? navigate(
                          `/users/${url.pathname.split("/")[2]}/${item._id}`
                        )
                      : navigate(`/users/${userId}/${item._id}`)
                  }
                >
                  <img
                    src={item?.profImg ? item?.profImg : avatarUser}
                    alt="image of user"
                    className={styles.imgSearch}
                  />
                  <div className={styles.textCartSearch}>
                    <p className={styles.userNameSearch}>{item.username}</p>
                    <p className={styles.nameSearch}>{item.name}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SearchSlide>
      {/* <Toaster position="top-left" reverseOrder={true} /> */}
    </Box>
  );
};

Navbar.defaultProps = {
  showUser: false,
};

export default Navbar;
