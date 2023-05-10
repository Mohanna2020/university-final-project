import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import avatarUser from "../../images/user.png";
import styles from "../../styles/modalFollow/style.module.css";
import { Skeleton } from "@mui/material";
import { useEffect } from "react";
import put from "../../service/put";
import { useMutation } from "react-query";

const ModalCustom = styled.div`
  position: fixed;
  top: 0;
  // left: 50%;
  // transform: translateX(-50%);
  width: 100%;
  height: 100vh;
  // margin: auto;
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
  flex-direction: column;
  // align-items: center;
  width: 25%;
  height: 70%;
  z-index: 40;
  background-color: rgb(50, 50, 50);
  color: white;
  overflow-y: auto;
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

const HeaderModal = styled.div`
  position: sticky;
  top: 0;
  right: 0;
  width: 100%;
  background-color: rgb(40, 40, 40);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 10px 20px;
  p {
    font-size: 22px;
  }

  span {
    cursor: pointer;
    font-size: 25px;
  }
`;

const Card = styled.div`
  width: 100%;
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(24, 24, 24);
  border-radius: 7px;
  padding: 10px 17px;
  cursor: pointer;
  margin: 7px auto;
  .imgText{
    display:flex;
    justify-content: space-between;
    align-items: center;
    j
  }
`;

const ButtonFollow = styled.button`
  outline: none;
  border: 2px solid white;
  // width: 80px;
  text-align: center;
  margin-left: 35px;
  padding: 5px 7px;
  border-radius: 7px;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s;
  :hover {
    color: white;
    background: rgb(24, 24, 24);
  }
`;

const ModalFollow = ({
  name,
  openModal,
  isLoading,
  showUser,
  users,
  handleOpenModal,
  refetchFollow,
}) => {
  const navigate = useNavigate();
  const url = useLocation();
  const { id: userId } = useParams();
  console.log("uuuuuuuuuuuuuu", users);
  const handleFollows = useMutation(
    (command) => put.handleFollow(command.ownerId, command.id),
    {
      onSuccess: (response) => {
        // refetchgetUser();
        // name === "follower" ? refetchFollower() : refetchFollowing()
        refetchFollow();
      },
    }
  );

  const follow = (id) => {
    const command = {
      id: id,
      ownerId: showUser ? url.pathname.split("/")[2] : userId,
    };
    handleFollows.mutate(command);
  };

  return (
    <ModalCustom open={openModal} center>
      <BackModal
        open={openModal}
        onClick={() => handleOpenModal(false)}
      ></BackModal>
      <ContentModal open={openModal}>
        <HeaderModal>
          <p>{`${name}s`}</p>
          <span
            className="fas fa-times"
            onClick={() => handleOpenModal(false)}
          ></span>
        </HeaderModal>
        <hr style={{ marginBottom: "10px" }} />
        {users?.map((item, index) => {
          return isLoading ? (
            <Skeleton
              sx={{ bgcolor: "grey.900", margin: "7px auto" }}
              variant="rounded"
              width={"95%"}
              height={70}
            />
          ) : (
            <Card
              className="card"
              key={index}
              // onClick={() => navigate(`/user/${owner_id}/${item._id}`)}
            >
              <div className="imgText">
                <img
                  onClick={() =>
                    showUser
                      ? navigate(
                          `/users/${url.pathname.split("/")[2]}/${item._id}`
                        )
                      : navigate(`/users/${userId}/${item._id}`)
                  }
                  src={item?.profImg ? item?.profImg : avatarUser}
                  alt={styles.nameSearch}
                  className={styles.imgSearch}
                />
                <div className={styles.textCartSearch}>
                  <p
                    className={styles.userNameSearch}
                    onClick={() =>
                      showUser
                        ? navigate(
                            `/users/${url.pathname.split("/")[2]}/${item._id}`
                          )
                        : navigate(`/users/${userId}/${item._id}`)
                    }
                  >
                    {item.username}
                  </p>
                  <p className={styles.nameSearch}>{item.name}</p>
                </div>
              </div>

              {showUser ? (
                item._id === url.pathname.split("/")[2] ? (
                  ""
                ) : item.follow ? (
                  <ButtonFollow onClick={() => follow(item._id)}>
                    unfollow
                  </ButtonFollow>
                ) : (
                  <ButtonFollow onClick={() => follow(item._id)}>
                    follow
                  </ButtonFollow>
                )
              ) : name === "follower" ? (
                item.follow ? (
                  <ButtonFollow onClick={() => follow(item._id)}>
                    unfollow
                  </ButtonFollow>
                ) : (
                  <ButtonFollow onClick={() => follow(item._id)}>
                    follow
                  </ButtonFollow>
                )
              ) : (
                ""
              )}
            </Card>
          );
        })}
      </ContentModal>
    </ModalCustom>
  );
};

export default ModalFollow;
