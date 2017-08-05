import mongoose, { Schema } from 'mongoose';


const BlogPostSchema = new Schema({
  title: String,
  content: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment',
  }],
});

const BlogPost = mongoose.model('blogpost', BlogPostSchema);

module.exports = BlogPost;