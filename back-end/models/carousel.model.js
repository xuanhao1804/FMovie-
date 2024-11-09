const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carouselSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie'  // Liên kết với model Movie nếu carousel là cho phim
  },
  status: {
    type: String,
    enum: ['active', 'inactive','deleted'],
    default: 'active'
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  linkType: {
    type: String,
    enum: ['movie', 'external', 'none'],
    default: 'movie'
  },
  linkUrl: {
    type: String  
  },
  description: {
    type: String
  }
}, { timestamps: true });

const Carousel = mongoose.model('carousel', carouselSchema);

module.exports = Carousel;
