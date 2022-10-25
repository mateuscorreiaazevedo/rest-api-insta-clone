const express = require('express')
const route = express.Router()
const { register, login, getUser, updateUser, getById, search, getByUserName, updateAvatar } = require('../controllers/user-controller')
const validate = require('../middlewares/validation')
const userValidation = require('../middlewares/user-validation')
const authValidation = require('../middlewares/auth-validation')
const { imageUpload } = require('../middlewares/image-upload')

route.post(
  '/register',
  userValidation.createValidation(),
  validate,
  register
)

route.post(
  '/login',
  userValidation.loginValidation(),
  validate,
  login
)

route.get(
  '/search',
  authValidation,
  search
)

route.get(
  '/user',
  authValidation,
  getUser
)

route.get(
  '/:userName',
  getByUserName
)

route.get(
  '/user/:id',
  getById
)

route.put(
  '/',
  authValidation,
  validate,
  imageUpload.single('userAvatar'),
  updateUser
)

module.exports = route