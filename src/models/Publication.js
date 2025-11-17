import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  authors: [{
    type: String,
    required: true
  }],
  publishDate: {
    type: Date,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['research', 'article', 'book', 'conference', 'journal']
  },
  tags: [String],
  
  // Cloudinary file fields
  fileUrl: {
    type: String, // Cloudinary URL for the main file (PDF/DOC)
  },
  thumbnail: {
    type: String, // Cloudinary URL for thumbnail image
  },
  filePublicId: {
    type: String, // Cloudinary public_id for the main file
  },
  thumbnailPublicId: {
    type: String, // Cloudinary public_id for the thumbnail
  },
  fileSize: {
    type: Number, // File size in bytes
  },
  fileFormat: {
    type: String, // File format (pdf, doc, etc.)
  },
  
  downloadCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Publication', publicationSchema);