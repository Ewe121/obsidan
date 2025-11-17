import cloudinary from '../config/cloudinary.js';
import Publication from '../models/Publication.js';

// @desc    Upload file to Cloudinary
// @route   POST /api/upload/file
// @access  Private/Admin
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: req.file.path,
        public_id: req.file.filename,
        format: req.file.format,
        size: req.file.size,
        originalname: req.file.originalname
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

// @desc    Upload thumbnail image
// @route   POST /api/upload/thumbnail
// @access  Private/Admin
export const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    res.json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: {
        url: req.file.path,
        public_id: req.file.filename,
        format: req.file.format,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading thumbnail',
      error: error.message
    });
  }
};

// @desc    Delete file from Cloudinary
// @route   DELETE /api/upload/:public_id
// @access  Private/Admin
export const deleteFile = async (req, res) => {
  try {
    const { public_id } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      // Remove file references from any publications
      await Publication.updateMany(
        {
          $or: [
            { filePublicId: public_id },
            { thumbnailPublicId: public_id }
          ]
        },
        {
          $unset: {
            fileUrl: "",
            thumbnail: "",
            filePublicId: "",
            thumbnailPublicId: ""
          }
        }
      );

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

// @desc    Get Cloudinary upload signature (for direct frontend upload)
// @route   GET /api/upload/signature
// @access  Private/Admin
export const getSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'spent-digital-lab'
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating signature',
      error: error.message
    });
  }
};