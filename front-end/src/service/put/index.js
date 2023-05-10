import axios from "axios";

function createComment(postId, command) {
  return axios.put(`http://localhost:5000/detailPost/${postId}`, command);
}

function like(postId, command) {
  return axios.put(`http://localhost:5000/likePost/${postId}`, command);
}

function createPost(userId, command) {
  return axios.put(`http://localhost:5000/create/${userId}`, command);
}

function postDataLogin(command) {
  return axios.put("http://localhost:5000/login", command);
}

function logOut(userId) {
  return axios.put(`http://localhost:5000/logout/${userId}`);
}

function submitChanges(userId, command) {
  return axios.put(`http://localhost:5000/settings/${userId}`, command);
}

function handleFollow(ownerId, userId) {
  return axios.put(`http://localhost:5000/follow/${ownerId}/${userId}`);
}

const put = {
  createComment,
  like,
  createPost,
  postDataLogin,
  logOut,
  submitChanges,
  handleFollow,
};

export default put;
