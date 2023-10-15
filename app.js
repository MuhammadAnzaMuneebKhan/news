/** @format */
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const UserRoute = require('./routes/user');
const BlogRoute = require('./routes/blog');
const cookieParse = require('cookie-parser');
const { checkAuthCookie } = require('./middlewares/Auth');
const Blog = require('./models/blog');
const app = express();
const PORT = process.env.PORT || 8000;
// mongodb://127.0.0.1:27017/blogfy
mongoose
  .connect(process.env.MongoUrl)
  .then(() => console.log('mongoose connected'));
//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParse());
app.use(checkAuthCookie('token'));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.static(path.resolve('./public')));
app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render('home', {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use('/user', UserRoute);
app.use('/blog', BlogRoute);
app.listen(PORT, () => console.log(`server started at port:${PORT}`));
