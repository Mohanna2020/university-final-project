const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/main.js");
const errorhandler = require("./helper/handeller");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);

const port = process.env.PORT || 5000;
const oneDay = 1000 * 60 * 60;
// const oneDay = 1000 * 60 * 60;
const morgan = require("morgan");
const app = express();
mongoose.set("strictQuery", true);
mongoose.set("strictPopulate", false);
mongoose.connect("mongodb://127.0.0.1:27017/FPro", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection.once("open", () => {
  console.log("connected");
});
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: oneDay, secure: false },
    // store: new MongoStore({ mongooseConnection:db}),
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(router);
app.use(errorhandler.handeller404);
app.use(errorhandler.handellerServer);
app.listen(port);
