import axios from "axios";

function userInfo(userId) {
  return axios.get(`http://localhost:5000/userInfo/${userId}`);
}

function userInfoSearch(idUser, userId) {
  return axios.get(`http://localhost:5000/userInfo/${idUser}/${userId}`);
}

function comments(postId, userId) {
  return axios.get(`http://localhost:5000/detailPost/${postId}/${userId}`);
}

function userInfoSetting(userId) {
  return axios.get(`http://localhost:5000/settings/${userId}`);
}

function checkSession(userId) {
  return axios.get(`http://localhost:5000/session/${userId}`);
}

function getListFollowers(ownerId, userId) {
  return axios.get(`http://localhost:5000/follower/${ownerId}/${userId}`);
}

function getListFollowings(ownerId, userId) {
  return axios.get(`http://localhost:5000/following/${ownerId}/${userId}`);
}

function infoHome(ownerId) {
  return axios.get(`http://localhost:5000/home/${ownerId}`);
}

function checkValidUser(id) {
  return axios.get(`http://localhost:5000/valid/${id}`);
}

function infoExplore(id) {
  return axios.get(`http://localhost:5000/explore/${id}`);
}

const get = {
  userInfo,
  userInfoSearch,
  comments,
  userInfoSetting,
  checkSession,
  getListFollowers,
  getListFollowings,
  infoHome,
  checkValidUser,
  infoExplore,
};

export default get;
