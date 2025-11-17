import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

export const validatePublication = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  body('authors')
    .isArray({ min: 1 })
    .withMessage('At least one author is required'),
  body('publishDate')
    .isISO8601()
    .withMessage('Valid publish date is required'),
  body('publisher')
    .notEmpty()
    .withMessage('Publisher is required'),
  body('category')
    .isIn(['research', 'article', 'book', 'conference', 'journal'])
    .withMessage('Invalid category'),
  handleValidationErrors
];

export const validateUserRegistration = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required'),
  handleValidationErrors
];