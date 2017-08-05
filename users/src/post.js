import mongoose, { Schema } from 'mongoose';


const PostSchema = new Schema({
  title: String,
});

module.exports = PostSchema;
