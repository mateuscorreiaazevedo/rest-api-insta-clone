const express = require('express')
const route = express.Router()
const { insertValidate, updateValidation, commentValidation } = require('../middlewares/photo-validation')
const authValidation = require('../middlewares/auth-validation')
const { 
  insertPhoto,
  deletePhoto,
  getAll,
  getByUser,
  getById,
  update,
  like,
  comment,
  search
} = require('../controllers/photo-controller')
const { imageUpload } = require('../middlewares/image-upload')
const validate = require('../middlewares/validation')


route.post(
  '/',
  authValidation,
  imageUpload.single('image'),
  insertValidate(),
  validate,
  insertPhoto
)

route.get(
  '/',
  authValidation,
  getAll
)

route.get(
  '/user/:id',
  authValidation,
  getByUser
)

route.get(
  '/search',
  authValidation,
  search
)

route.get(
  '/:id',
  authValidation,
  getById
)

route.put(
  '/:id',
  authValidation,
  updateValidation(),
  validate,
  update
)

route.delete(
  '/:id',
  authValidation,
  deletePhoto
)

route.put(
  '/like/:id',
  authValidation,
  like
)

route.put(
  '/comment/:id',
  authValidation,
  commentValidation(),
  validate,
  comment
)

module.exports = route