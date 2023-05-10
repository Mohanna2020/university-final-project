import axios from "axios";

function removePost(userId , postId) {
  return axios.delete(`http://localhost:5000/deletePost/${userId}/${postId}`);
}

const deleted = {
  removePost,
};

export default deleted;
