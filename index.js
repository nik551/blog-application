const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");

const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;
mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then((e) => console.log("mongoDb connected"));
//setting ejs as template engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"));
//whatever is there in public use it as statically stored orels it wiill thing it as route
app.use(express.static(path.resolve('./public')))

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  console.log(`only user: ${JSON.stringify(req.user)}`);
  res.render("home", {
    user: req.user,
    blogs:allBlogs
  });
});
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));
