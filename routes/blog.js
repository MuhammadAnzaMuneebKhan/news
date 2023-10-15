/** @format */

const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const comment = require('../models/comment');
const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
router.get('/addBlogNew', (req, res) => {
  return res.render('addBlog', {
    user: req.user,
  });
});
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  console.log(blog);
  const comments = await comment
    .find({ blogId: req.params.id })
    .populate('createdBy');
  console.log('comment', comments);
  return res.render('blog', {
    user: req.user,
    blog: blog,
    comments,
  });
});
router.post('/comment/:blogId', async (req, res) => {
  await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
router.post('/', upload.single('coverImg'), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});
module.exports = router;
