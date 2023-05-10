const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const cmnt = new mongoose.Schema(
  {
    _id: String,
    comment: [
      {
        text: String,
        profImg: "", //type should change
        username: String,
        _id: String,
        createdDate: {
          type: Date,
          default: Date.now,
        },
        upNow: {
          type: Number,
          default: 0,
        },
      },
    ],
    userLiked: [],
  },
  { timestamps: true }
);
cmnt.plugin(aggregatePaginate);

const Comment = mongoose.model("Comment", cmnt);
module.exports = Comment;
