const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const usr = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    profImg: {
      type: String,
      default: "",
    }, 

    followingCount: {
      type: Number,
    },
    followerCount: {
      type: Number,
    },
    post: [
      {
        text: String,
        images: [],
         extType: Number,
        commentCount: {
          type: Number,
          default: 0,
        },
        likeCount: {
          type: Number,
          default: 0,
        },
        location: String,
        createdDate: {
          type: Date,
          default: Date.now,
        },
        upNow: {
          type: Number,
        },
      },
    ],
    // likedPost: [],

    bio: {
      type: String,
    },
   
    session: [],
    valid: Boolean,
  },
  { timestamps: true }
);
usr.plugin(aggregatePaginate);

const User = mongoose.model("User", usr);
module.exports = User;
