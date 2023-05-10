const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const flwr = new mongoose.Schema(
  {
    _id: String,
    userId: [""],
  },
  { timestamps: true }
);
flwr.plugin(aggregatePaginate);

const follower = mongoose.model("follower", flwr);
module.exports = follower;
