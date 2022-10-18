const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { passwordHash } = require('../utils/password-hash')
const generateToken = require('../utils/token')
const mongoose = require('mongoose')

class UserController {
  
  async register (req, res) {
    const { userName, email, password } = req.body
    const userByEmail = await User.findOne({ email })
    const userByName = await User.findOne({ userName })

    if (userByEmail) {
      res.status(422).json({ errors: ['Endereço de email já cadastrado.']})
      return
    }
    if (userByName) {
      res.status(422).json({ errors: ['Nome de usuário já cadastrado.']})
      return
    }

    
    const newUser = await User.create({
      userName,
      email,
      password: await passwordHash(password),
    })

    if (!newUser) {
      res.status(422).json({errors: ['Error on server.']})
      return
    }

    res.status(201).json({
      _id: newUser._id,
      token: generateToken(newUser._id)
    })
  }

  async login (req,res) {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if(!user) {
      res.status(422).json({ errors: ['Usuário não encontrado.']})
      return
    }

    const decrypt = await bcrypt.compare(password, user.password)

    if (!decrypt) {
      res.status(422).json({ errors: ['Senha inválida.']})
      return
    }

    res.status(201).json({
      _id: user._id,
      userAvatar: user.userAvatar,
      token: generateToken(user._id)
    })
   }
  
  async getUser (req, res) {
    const user = req.user

    res.status(200).json(user)
  }

  async getById (req, res) {
    const { id } = req.params
    try {
      const user = await User.findById(mongoose.Types.ObjectId(id)).select('-password')    
      res.status(200).json(user)
    } catch (error) {
      res.status(404).json({ errors: ['User not found.']})
      return
    }
  }

  async getByUserName (req, res) {
    const { userName } = req.params
    try {
      const user = await User.findOne({ userName }).select('-password')
      if(!user) {
        res.status(404).json({ errors: ['User not found.']})
        return  
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(404).json({ errors: ['User not found.']})
      return
    }
  }

  async updateUser (req, res) {
    const { userName, password, bio, link } = req.body
    let userAvatar = null

    if (req.file) {
      userAvatar = req.file.filename
    }

    
    
    const userId = req.user
    const user = await User.findById(mongoose.Types.ObjectId(userId)).select('-password')
    const userByName = await User.findOne({ userName })
    
    if(userByName && !userByName.equals(user)) {
      res.status(422).json({ errors: ['Nome de usuário já está em uso.']})
      return
    }
    
    if (userName?.includes('.')) {
      res.status(422).json({ errors: ['não é possível adicionar "." ao nome de usuário.']})
      return
    }

    
    
    
    if (userName) user.userName = userName
    if (password) {
      if (password.length < 6) {
        res.status(422).json({ errors: ['A senha deve conter no mínimo 6 caracteres']})
        return
      }

      user.password = await passwordHash(password)
    }
    if (userAvatar) user.userAvatar = userAvatar
    if (bio) user.bio = bio
    if(bio === '') user.bio = ''
    if (link) user.link = link
    if(link === '') user.link = ''

    await user.save()

    res.status(200).json(user)
  }

  async search (req, res) {
    const { q } =req.query
      const users = await User.find({ userName: new RegExp(q, "i") }).exec()
      res.status(200).json(users)
  }
}

module.exports = new UserController()