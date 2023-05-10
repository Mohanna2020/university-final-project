const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../Schema/User.js");
const Comment = require("../Schema/Comment.js");
const Follower = require("../Schema/follower.js");
const Following = require("../Schema/following.js");
const mongoose = require("mongoose");
const hash = require("password-hash");
const nodemailer = require("nodemailer");
const path = require("path");

let rand = Number;
let id = String;
let name = String;
let username = String;
let password = String;
let email = String;
let followerCount = Number;
let followingCount = Number;
let comentCounter = Number;
let likeCounter = Number;

async function main() {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mohann.shirnegar@gmail.com",
      pass: "zmnngxakicscrdzk",
    },
  });
  let info = await transporter.sendMail({
    from: '"insper" <insper@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "verification code", // Subject line
    text: `Hello Dear ${name} welcome to Insper 😊 Your authentication code is${rand}     The validity of the code is 2 minutes`, // plain text body
    html: `‍‍<div style="margin: 10px auto 0">
   <p style="margin: 0; text-align: justify; font-size: 20px">
      Hello Dear ${name}
    </p>
    <p style="margin: 0; text-align: justify; font-size: 20px">
      welcome to Insper 😊
    </p>
    <p style="margin: 0; text-align: justify; font-size: 20px">
      Your authentication code is
      <span style="font-weight: bold">${rand}</span>
    </p>
    <br />
    <p style="margin: 0; text-align: justify; font-size: 15px">
    The validity of the code is 2 minutes
    </p>
  </div>`, // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/session/:userId", async (req, res) => {
  try {
    const session1 = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.userId),
    });
    let login = true;
    let session = await session1.session[0]?.cookie?.expires;
    let time = new Date();
    let date;
    session ? (date = time.getTime() - session) : (date = time.getTime());

    if (date <= 0) {
      // login = true;
      res.json({ login: true });
    } else {
      res.json({ login: false });
    }
  } catch (e) {
    console.log(e);
  }
}); //session

router.get("/userInfo/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    })
      .populate("User")
      .sort({ createdAt: -1 });

    res.json({
      username: user.username,
      _id: user._id,
      post: user.post,
      name: user.name,
      followingCount: user.followingCount,
      followerCount: user.followerCount,
      profImg: user.profImg,
      bio: user.bio,
    });
  } catch (e) {
    res.json();
  }
});

router.get("/userInfo/:ownerId/:userId", async (req, res) => {
  try {
    let ownerFollow;
    let userFollow;
    const following = await Following.findOne({ _id: req.params.ownerId });
    const follower = await Follower.findOne({ _id: req.params.ownerId });
    if (following.userId.includes(req.params.userId)) {
      ownerFollow = true;
    } else {
      ownerFollow = false;
    }
    if (follower.userId.includes(req.params.userId)) {
      userFollow = true;
    } else {
      userFollow = false;
    }
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.userId),
    });
    res.json({
      username: user.username,
      _id: user._id,
      post: user.post,
      name: user.name,
      followingCount: user.followingCount,
      followerCount: user.followerCount,
      profImg: user.profImg,
      bio: user.bio,
      userFollow: userFollow,
      ownerFollow: ownerFollow,
    });
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.post("/register", async (req, res) => {
  try {
    let rnd = Math.floor(Math.random() * 10000 + 1);
    if (rnd < 1000) {
      rnd = Math.floor(Math.random() * 10000 + 1);
    } else {
      rand = rnd;
    }
    const usn1 = await User.findOne({
      username: req.body.username,
    });
    const usn2 = await User.findOne({
      email: req.body.email,
    });
    if (usn1 === null && usn2 === null) {
      const us = await User.insertMany({
        name: req.body.name,
        username: req.body.username,
        password: hash.generate(req.body.password),
        email: req.body.email,
        followerCount: 0,
        followingCount: 0,
        valid: false,
      }).then(async () => {
        const user = await User.findOne({ username: req.body.username });
        id = user._id.toString();
        name = req.body.name;
        username = req.body.username;
        password = hash.generate(req.body.password);
        email = req.body.email;
        followerCount = 0;
        followingCount = 0;
        const follower = await Follower.insertMany({ _id: id });
        const following = await Following.insertMany({ _id: id });
        main().catch((error) => {
          res.status(500).json("email error");
        });
        console.log("code", rnd);

        setTimeout(() => {
          rand = 0;
        }, 1000 * 60 * 2);

        res
          .status(200)
          .json({ message: "registered!", userId: user._id.toString() });
      });
    } else if (
      usn1?.username === req.body.username ||
      usn2?.email === req.body.email
    ) {
      res.json({ message: "username is available!" });
    }
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.get("/valid/:ownerId", async (req, res) => {
  try {
    let state;
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.ownerId),
    });
    if (Boolean(user) === false) {
      state = "register";
    } else if (user.valid) {
      state = "login";
    } else {
      state = "valid";
    }
    res.json({ state: state });
  } catch (e) {
    console.log(e);
  }
});

router.post("/validationEmail/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    const code = Number(req.body.code);
    if (rand === code) {
      req.session.user = user._id;
      await User.findByIdAndUpdate(
        { _id: user._id },
        { session: req.session, valid: true },
        { new: true }
      );
      rand = 0;
      res.json({ message: "Successfull", username: user.username });
    } else {
      res.json({ message: "Incorrect code!" });
    }
  } catch (e) {
    console.log("error", e);
  }
});

router.post("/resend/:ownerId", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.ownerId),
    });
    email = user.email;
    name = user.name;
    rand = 0;
    let rnd = Math.floor(Math.random() * 10000 + 1);
    if (rnd < 1000) {
      rnd = Math.floor(Math.random() * 10000 + 1);
    } else {
      rand = rnd;
    }
    console.log("code", rnd);
    main().catch((error) => {
      console.log(error);
    });
    setTimeout(() => {
      rand = 0;
    }, 1000 * 60 * 2);
    res.json("ok");
  } catch (e) {
    console.log("error", e);
  }
});

router.put("/create/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });

    let postArray = [...user.post];
    let newArray = [...req.body.files];
    if (newArray.length === 1) {
      let type = path.extname(req?.body?.files[0]?.filePath);
      if (type === ".mp4") {
        newArray[0].extType = 0;
      } else if (type === ".mp3") {
        newArray[0].extType = 1;
      } else {
        newArray[0].extType = 2;
      }
      let text = req.body.caption;
      let images = [req?.body?.files[0]?.fileUrl];

      let location = req.body.location;
      const post = await User.findByIdAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
        {
          post: [
            { text: text, location: location, images: images },
            ...postArray,
          ],
        },
        { new: true }
      ).then(async () => {
        const post1 = await User.findOne({
          _id: mongoose.Types.ObjectId(req.params.id),
        });
        const postId = post1?.post[0]?._id;
        const comment = await Comment.insertMany({
          _id: postId,
        });
        const cmnt = await Comment.findOne({ _id: req.params.id });
        comentCounter = cmnt?.comment?.length;
        post1.post[0].commentCount = comentCounter;

        res.json({ message: "ok" });
      });
    } else {
      let flag = 0;
      let checkArrayImages = req?.body?.files;
      let len = checkArrayImages.length;
      for (let i = 0; i < len; i++) {
        if (
          path.extname(checkArrayImages[i].filePath) === ".mp4" ||
          path.extname(checkArrayImages[i].filePath) === ".mp3"
        ) {
          flag = 1;
        }
      }
      if (flag === 1) {
        return res.json({
          message: "In one post, there can be only one mp4 or mp3 file",
        });
      } else {
        let text = req.body.caption;
        let images = [];

        req.body.files?.map((item) => {
          images.push(item.fileUrl);
        });
        let location = req.body.location;
        const post = await User.findByIdAndUpdate(
          {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
          {
            post: [
              { text: text, location: location, images: images },
              ...postArray,
            ],
          },
          { new: true }
        ).then(async () => {
          const post1 = await User.findOne({
            _id: mongoose.Types.ObjectId(req.params.id),
          });
          const postId = post1?.post[0]?._id;
          const comment = await Comment.insertMany({
            _id: postId,
          });
          const cmnt = await Comment.findOne({ _id: req.params.id });
          comentCounter = cmnt?.comment?.length;
          post1.post.commentCount = comentCounter;

          return res.json({ message: "ok" });
        });
      }
    }
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.post("/search", async (req, res) => {
  try {
    let i;
    let filterUser = [];
    const wrd = req.body.username;
    const users = await User.find({ username: { $regex: wrd, $options: "i" } });
    if (users.length === 0) {
      throw new Error();
    }
    for (i = 0; i < users.length; i++) {
      let userObject = {
        username: users[i].username,
        name: users[i].name,
        _id: users[i]._id,
        profImg: users[i].profImg,
      };
      filterUser.push(userObject);
    }
    res.json(filterUser);
  } catch {
    res.status(500).json("User not found!");
  }
}); //complete

router.put("/login", async (req, res) => {
  try {
    const us1 = await User.findOne({
      email: req.body.user_email,
    });
    const us2 = await User.findOne({
      username: req.body.user_email,
    });

    if (us1 || us2) {
      if (
        hash.verify(req.body.password, us1?.password) ||
        hash.verify(req.body.password, us2?.password)
      ) {
        const user = us1
          ? await User.findOne({ email: req.body.user_email })
          : await User.findOne({ username: req.body.user_email });
        req.session.user = user._id;
        const s = await User.findByIdAndUpdate(
          { _id: user._id },
          { $set: { session: req.session } },
          { new: true }
        );
        res.json({
          message: "Successfull",
          userId: user._id.toString(),
          username: user.username,
        });
      } else {
        res.json({ message: "Incorrect password!" });
      }
    } else {
      res.json({ message: "User not found!" });
    }
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.put("/logout/:userId", async (req, res) => {
  try {
    const s = await User.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.userId) },
      { $set: { session: [] } },
      { new: true }
    );
    res.json({ message: "logout success!" });
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.get("/detailPost/:postId/:userId", async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.postId })
      .populate("comment")
      .sort({ createdAt: -1 });

    let coment = [];
    let i;
    for (i = 0; i < comment?.comment?.length; i++) {
      const user = await User.findOne({ _id: comment.comment[i]._id });
      let cArray = {
        username: user.username,
        profImg: user.profImg,
        _id: comment.comment[i]._id,
        text: comment.comment[i].text,
        createdDate: comment.comment[i].createdDate,
        // upNow: comment.comment[i].upNow,
      };
      coment.push(cArray);
    }
    let mainComment = {};
    mainComment.comment = coment;
    mainComment.userLiked = comment?.userLiked;

    res.json(mainComment);
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.put("/detailPost/:postId", async (req, res) => {
  try {
    const comments = await Comment.findOne({ _id: req.params.postId });
    const usr = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.idUser),
    });
    const username = usr.username;
    const profImg = usr.profImg;
    const comment = req.body.comment;
    const id = req.body.idUser;
    const cmntArray = [...comments?.comment];
    const comment1 = await Comment.findByIdAndUpdate(
      { _id: req.params.postId },
      {
        comment: [
          {
            text: comment,
            username: username,
            profImg: profImg,
            _id: id.toString(),
          },
          ...cmntArray,
        ],
      },
      { new: true }
    )
      .then(async () => {
        const cmnt = await Comment.findOne({ _id: req.params.postId });
        const usr = await User.findOne({
          _id: mongoose.Types.ObjectId(req.body.userId),
        });

        comentCounter = cmnt?.comment?.length;
        let i;
        for (i = 0; i < usr.post.length; i++) {
          if (usr.post[i]._id.toString() === req.params.postId) {
            await User.updateOne(
              {
                _id: mongoose.Types.ObjectId(req.body.userId),
                "post._id": mongoose.Types.ObjectId(req.params.postId),
              },
              { $set: { "post.$.commentCount": comentCounter } }
            );
          } else {
            console.log("");
          }
        }

        res.json({ message: "comment sent successfully" });
      })
      .catch((e) => {
        console.log("error", e);
      });
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.delete("/deletePost/:ownerId/:postId", async (req, res) => {
  try {
    const post = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.ownerId),
    });
    const user = post._id;
    const postArray = [...post.post];
    const pArray = [];
    const postArray1 = [];
    let i;
    for (i = 0; i < post.post.length; i++) {
      pArray.push(post.post[i]._id.toString());
    }
    if (pArray.includes(req.params.postId)) {
      pArray.splice(pArray.indexOf(req.params.postId), 1);
    }
    for (i = 0; i < pArray.length; i++) {
      for (j = 0; j < postArray.length; j++) {
        if (postArray[j]._id.toString() === pArray[i]) {
          postArray1.push(postArray[j]);
        }
      }
    }

    const posts = await User.findOneAndUpdate(
      { _id: user },
      { post: [...postArray1] }
    );
    res.json(posts);
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.put("/likePost/:postId", async (req, res) => {
  try {
    let like;
    const comments = await Comment.findOne({ _id: req.params.postId });

    // const usr = await User.findOne({
    //   _id: mongoose.Types.ObjectId(req.body.idUser),
    // });

    const cmntArray = [...comments?.userLiked];

    if (cmntArray.includes(req.body.idUser)) {
      like = false;
      cmntArray?.splice(cmntArray.indexOf(req.body.idUser), 1);
    } else {
      like = true;
      cmntArray?.push(req.body.idUser);
    }

    const comment1 = await Comment.findByIdAndUpdate(
      { _id: req.params.postId }, //id of photo
      { userLiked: [...cmntArray] },
      { new: true }
    ).then(async () => {
      const cmnt = await Comment.findOne({ _id: req.params.postId });
      const user = await User.findOne({
        _id: mongoose.Types.ObjectId(req.body.userId),
      });

      likeCounter = cmnt?.userLiked?.length;
      let i;
      for (i = 0; i < user.post.length; i++) {
        if (user.post[i]._id.toString() === req.params.postId) {
          await User.updateOne(
            {
              _id: mongoose.Types.ObjectId(req.body.userId),
              "post._id": mongoose.Types.ObjectId(req.params.postId),
            },
            { $set: { "post.$.likeCount": likeCounter } }
          );
        }
      }
      res.json({ message: "like sent successfully", like: like });
    });
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.put("/settings/:userId", async (req, res) => {
  try {
    const sUser = await User.findOne({ username: req.body.username });
    const password = req.body.password;
    if (password) {
      if (sUser === null) {
        const user = await User.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(req.params.userId) },
          {
            profImg: req.body.profImg,
            bio: req.body.bio,
            name: req.body.name,
            username: req.body.username,
            password: hash.generate(req.body.password),
          },
          { new: true }
        )
          .then(async () => {
            res.json({ message: "saved!" });
          })
          .catch((e) => {
            console.log("error", e);
          });
      } else if (sUser._id.toString() === req.params.userId) {
        await User.findByIdAndUpdate(
          { _id: req.params.userId },
          {
            profImg: req.body.profImg,
            bio: req.body.bio,
            name: req.body.name,
            username: req.body.username,
            password: hash.generate(req.body.password),
          },
          { new: true }
        )
          .then(async () => {
            res.json({ message: "saved!" });
          })
          .catch((e) => {
            console.log("error", e);
          });
      } else {
        res.json({ message: "Username is available!" });
      }
    } else {
      if (sUser === null) {
        const user = await User.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(req.params.userId) },
          {
            profImg: req.body.profImg,
            bio: req.body.bio,
            name: req.body.name,
            username: req.body.username,
          },
          { new: true }
        )
          .then(async () => {
            res.json({ message: "saved!" });
          })
          .catch((e) => {
            console.log("error", e);
          });
      } else if (sUser._id.toString() === req.params.userId) {
        await User.findByIdAndUpdate(
          { _id: req.params.userId },
          {
            profImg: req.body.profImg,
            bio: req.body.bio,
            name: req.body.name,
            username: req.body.username,
          },
          { new: true }
        )
          .then(async () => {
            res.json({ message: "saved!" });
          })
          .catch((e) => {
            console.log("error", e);
          });
      } else {
        res.json({ message: "Username is available!" });
      }
    }
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.get("/settings/:userId", async (req, res) => {
  try {
    const info = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.userId),
    });
    res.json({
      name: info.name,
      username: info.username,
      email: info.email,
      profImg: info.profImg,
      bio: info.bio,
      // password:info.password
    });
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.put("/follow/:ownerId/:userId", async (req, res) => {
  try {
    const follow = {};
    const follower = await Follower.findOne({ _id: req.params.userId });
    const following = await Following.findOne({ _id: req.params.ownerId });
    const followerArray = [...follower?.userId];
    const followingArray = [...following?.userId];
    if (followerArray.includes(req.params.ownerId)) {
      followerArray?.splice(followerArray.indexOf(req.params.ownerId), 1);
    } else {
      followerArray?.unshift(req.params.ownerId);
    }

    if (followingArray.includes(req.params.userId)) {
      followingArray?.splice(followingArray.indexOf(req.params.userId), 1);
      follow.follow = false;
    } else {
      followingArray?.unshift(req.params.userId);
      follow.follow = true;
    }
    const following1 = await Following.findByIdAndUpdate(
      { _id: req.params.ownerId },
      { userId: [...followingArray] },
      { new: true }
    ).then(async () => {
      const flwing = await Following.findOne({ _id: req.params.ownerId });
      followingCount = flwing?.userId?.length;

      await User.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.params.ownerId),
        },
        { followingCount: followingCount }
      );
    });

    const follower1 = await Follower.findByIdAndUpdate(
      { _id: req.params.userId },
      { userId: [...followerArray] },
      { new: true }
    ).then(async () => {
      const flwer = await Follower.findOne({ _id: req.params.userId });
      followerCount = flwer?.userId?.length;

      await User.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.params.userId),
        },
        { followerCount: followerCount }
      );
    });

    res.json(follow);
  } catch (e) {
    console.log("error", e);
  }
}); //complete

router.get("/following/:ownerId/:userId", async (req, res) => {
  try {
    const userFollowing = await Following.findOne({ _id: req.params.userId });
    const ownerFollowing = await Following.findOne({ _id: req.params.ownerId });
    const ownflw = [...ownerFollowing?.userId];
    let flwing = [];
    let i;
    for (i = 0; i < userFollowing.userId.length; i++) {
      let follow = false;

      const user = await User.findOne({
        _id: mongoose.Types.ObjectId(userFollowing.userId[i]),
      });
      if (ownflw.includes(userFollowing.userId[i])) {
        follow = true;
      }
      let flwingArray = {
        username: user?.username,
        profImg: user?.profImg,
        _id: userFollowing.userId[i],
        name: user?.name,
        follow: follow,
      };
      flwing.push(flwingArray);
    }

    res.json(flwing);
  } catch (e) {
    console.log("error", e);
  }
});

router.get("/follower/:ownerId/:userId", async (req, res) => {
  try {
    console.log(req.params);
    const userFollower = await Follower.findOne({ _id: req.params.userId });
    const ownerFollower = await Following.findOne({ _id: req.params.ownerId });
    console.log(ownerFollower);
    const ownflw = [...ownerFollower?.userId];
    console.log(ownflw);
    let flwer = [];
    let i;

    for (i = 0; i < userFollower.userId.length; i++) {
      let follow = false;

      const user = await User.findOne({
        _id: mongoose.Types.ObjectId(userFollower.userId[i]),
      });
      if (ownerFollower?.userId?.includes(userFollower.userId[i])) {
        // if (ownflw.includes(userFollower.userId[i])) {
        follow = true;
      }
      let flwerArray = {
        username: user?.username,
        profImg: user?.profImg,
        _id: userFollower.userId[i],
        name: user?.name,
        follow: follow,
      };
      flwer.push(flwerArray);
    }

    res.json(flwer);
  } catch (e) {
    console.log("error", e);
  }
});

router.get("/home/:ownerId", async (req, res) => {
  try {
    let i;
    let followings = [];
    let suggests = [];
    let post = [];
    let suggestions = [];
    let userInfo = {};
    let date;
    let liked;
    const users = await Following.findOne({ _id: req.params.ownerId });
    const owner = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.ownerId),
    });
    userInfo = {
      username: owner.username,
      profImg: owner.profImg,
      name: owner.name,
      followingCount: owner.followingCount,
      followerCount: owner.followerCount,
    };

    for (i = 0; i < users.userId.length; i++) {
      const user = await User.findOne({
        _id: mongoose.Types.ObjectId(users.userId[i]),
      });
      let followingObj = {
        username: user?.username,
        profImg: user?.profImg,
        _id: user?._id,
      };

      followings.push(followingObj);
      if (followings.length > 7) {
        followings.splice(7, followings.length - 7);
      }

      const following = await Following.findOne({ _id: users.userId[i] });
      for (let k = 0; k < following.userId.length; k++) {
        if (users.userId.includes(following.userId[k])) {
          continue;
        } else if (users._id === following.userId[k]) {
          continue;
        } else {
          suggests.push(following.userId[k]);
        }
      }
      for (let j = 0; j < user?.post?.length; j++) {
        let time = new Date() - user.post[j].createdDate;
        let second = 1000;
        let day = 24 * 60 * 60 * 1000;
        let hour = 60 * 60 * 1000;
        let week = 7 * 24 * 60 * 60 * 1000;
        let minute = 1000 * 60;
        if (time < minute) {
          if (Math.floor(time / second) === 1) {
            date = "a second ago";
          } else {
            date = Math.floor(time / second) + " seconds ago";
          }
        } else if (minute <= time && time < hour) {
          if (Math.floor(time / minute) === 1) {
            date = "a minute ago";
          } else {
            date = Math.floor(time / minute) + " minutes ago";
          }
        } else if (hour <= time && time < day) {
          if (Math.floor(time / hour) === 1) {
            date = "an hour ago";
          } else {
            date = Math.floor(time / hour) + " hours ago";
          }
        } else if (day <= time && time < week) {
          if (Math.floor(time / day) === 1) {
            date = "a day ago";
          } else {
            date = Math.floor(time / day) + " days ago";
          }
        } else if (week <= time) {
          if (Math.floor(time / week) === 1) {
            date = "a week ago";
          } else {
            date = Math.floor(time / week) + " weeks ago";
          }
        }
        const comment = await Comment.findOne({
          _id: user?.post[j]?._id?.toString(),
        });
        if (comment?.userLiked?.includes(req.params.ownerId)) {
          liked = true;
        } else {
          liked = false;
        }
        let postObj = {
          id: user._id,
          images: user?.post[j].images,
          caption: user?.post[j].text,
          // likeCount: comment?.userLiked?.length,
          likeCount: user?.post[j].likeCount,
          commentCount: user?.post[j].commentCount,
          location: user?.post[j].location,
          _id: user?.post[j]._id,
          createdDate: user?.post[j].createdDate,
          profImg: user?.profImg,
          username: user?.username,
          date: date,
          like: liked,
        };
        post.push(postObj);
      }
    }
    post.sort(function (a, b) {
      return b.createdDate - a.createdDate;
    });
    if (suggests.length <= 5) {
      for (i = 0; i < suggests.length; i++) {
        const usr = await User.findOne({
          _id: mongoose.Types.ObjectId(suggests[i]),
        });
        let suggestObj = {
          username: usr?.username,
          _id: usr?._id.toString(),
          followerCount: usr?.followerCount,
          followingCount: usr?.followingCount,
          name: usr?.name,
          profImg: usr?.profImg,
        };
        suggestions.push(suggestObj);

        for (let j = 0; j < suggestions.length; j++) {
          for (let h = 0; h < j; h++) {
            if (suggestions[j]?._id === suggestions[h]?._id) {
              suggestions.splice(j, 1);
            }
          }
        }
      }
    } else {
      let setRand = [];

      // for (let j = 0; j < suggestions.length; j++) {
      //   for (let h = 0; h < j; h++) {
      //     if (suggestions[j]?._id === suggestions[h]?._id) {
      //       suggestions.splice(j, 1);
      //     }
      //   }
      // }

      for (let l = 0; l < 5; l++) {
        let rnd = Math.floor(Math.random() * suggests.length);
        // while (true) {
        //   if (!setRand.includes(rnd)) {
        //     setRand.push(rnd);
        //     break;
        //   }
        // }
        if (rnd < suggests.length) {
          // for (let j = 0; j < suggests.length; j++) {
          const sUser = await User.findOne({
            _id: mongoose.Types.ObjectId(suggests[rnd]),
          });
          let suggestObj = {
            username: sUser?.username,
            _id: sUser?._id.toString(),
            followerCount: sUser?.followerCount,
            followingCount: sUser?.followingCount,
            name: sUser?.name,
            profImg: sUser?.profImg,
          };
          suggestions.push(suggestObj);

          for (let j = 0; j < suggestions.length; j++) {
            for (let h = 0; h < j; h++) {
              if (suggestions[j]?._id === suggestions[h]?._id) {
                suggestions.splice(j, 1);
              }
            }
          }
          // }
        }
      }
    }

    res.json({
      posts: post,
      followings: followings,
      suggest: suggestions,
      userInfo: userInfo,
    });
  } catch (e) {
    console.log("error", e);
  }
});

//router.delete("/deleteAccount/:ownerId", async (req, res) => {
// await User.deleteOne({ _id: mongoose.Types.ObjectId(req.params.ownerId) });
// res.json({ message: "successfull" });
//});

router.get("/explore/:ownerId", async (req, res) => {
  try {
    let followings = [];
    let posts = [];
    let usr = [];
    const users = await Following.findOne({ _id: req.params.ownerId });
    for (let i = 0; i < users.userId.length; i++) {
      const following = await Following.findOne({ _id: users.userId[i] });
      for (let l = 0; l < following.userId.length; l++) {
        if (users.userId.includes(following.userId[l])) {
          continue;
        } else if (followings.includes(following.userId[l])) {
          continue;
        } else if (following.userId[l] === users._id) {
          continue;
        } else {
          followings.push(following.userId[l]);
        }
      }
    }
    for (let i = 0; i < followings.length; i++) {
      const post = await User.findOne({
        _id: mongoose.Types.ObjectId(followings[i]),
      });
      for (let j = 0; j < post?.post?.length; j++) {
        let postObj = {
          id: post?._id,
          images: post?.post[j]?.images,
          caption: post?.post[j]?.text,
          likeCount: post?.post[j]?.likeCount,
          commentCount: post?.post[j]?.commentCount,
          location: post?.post[j]?.location,
          _id: post?.post[j]?._id,
          createdDate: post?.post[j]?.createdDate,
          profImg: post?.profImg,
          username: post?.username,
          name: post?.name,
          // date: date,
        };
        posts.push(postObj);
      }
    }

    posts.sort(function (a, b) {
      return b.createdDate - a.createdDate;
    });
    res.json({ posts: posts });
  } catch (e) {
    console.log("error", e);
  }
});

module.exports = router;
