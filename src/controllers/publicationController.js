import Publication from '../models/Publication.js';
import cloudinary from '../config/cloudinary.js';

export const getPublications = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { authors: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const publications = await Publication.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Publication.countDocuments(query);

    res.json({
      success: true,
      count: publications.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: publications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching publications',
      error: error.message
    });
  }
};

export const getPublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    publication.downloadCount += 1;
    await publication.save();

    res.json({
      success: true,
      data: publication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching publication',
      error: error.message
    });
  }
};

export const createPublication = async (req, res) => {
  try {
    // Handle file upload data if files were uploaded
    if (req.files) {
      if (req.files.file) {
        req.body.fileUrl = req.files.file[0].path;
        req.body.filePublicId = req.files.file[0].filename;
        req.body.fileSize = req.files.file[0].size;
        req.body.fileFormat = req.files.file[0].mimetype;
      }
      if (req.files.thumbnail) {
        req.body.thumbnail = req.files.thumbnail[0].path;
        req.body.thumbnailPublicId = req.files.thumbnail[0].filename;
      }
    }

    req.body.createdBy = req.user.id;
    
    const publication = await Publication.create(req.body);

    res.status(201).json({
      success: true,
      data: publication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating publication',
      error: error.message
    });
  }
};

export const updatePublication = async (req, res) => {
  try {
    let publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    // Handle file upload data if files were uploaded
    if (req.files) {
      // Delete old files from Cloudinary if new ones are uploaded
      if (req.files.file && publication.filePublicId) {
        await cloudinary.uploader.destroy(publication.filePublicId);
      }
      if (req.files.thumbnail && publication.thumbnailPublicId) {
        await cloudinary.uploader.destroy(publication.thumbnailPublicId);
      }

      if (req.files.file) {
        req.body.fileUrl = req.files.file[0].path;
        req.body.filePublicId = req.files.file[0].filename;
        req.body.fileSize = req.files.file[0].size;
        req.body.fileFormat = req.files.file[0].mimetype;
      }
      if (req.files.thumbnail) {
        req.body.thumbnail = req.files.thumbnail[0].path;
        req.body.thumbnailPublicId = req.files.thumbnail[0].filename;
      }
    }

    publication = await Publication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: publication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating publication',
      error: error.message
    });
  }
};

export const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    // Delete files from Cloudinary
    if (publication.filePublicId) {
      await cloudinary.uploader.destroy(publication.filePublicId);
    }
    if (publication.thumbnailPublicId) {
      await cloudinary.uploader.destroy(publication.thumbnailPublicId);
    }

    await Publication.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Publication deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting publication',
      error: error.message
    });
  }
};