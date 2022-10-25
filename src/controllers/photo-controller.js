const Photo = require('../models/Photo')
const User = require('../models/User')
const mongoose = require('mongoose')

class PhotoController {
  async insertPhoto(req, res) {
    const { subtitle } = req.body
    const image = req.file.filename
    const reqUser = req.user
    const user = await User.findById(reqUser._id)
    
    try {
      const newPhoto = await Photo.create({
        image,
        subtitle,
        userId: user._id,
        userName: user.userName
      })

      return res.status(201).json(newPhoto)
    } catch (error) {
      return res.status(422).json({ errors: ['Erro no servidor. Por favor, tente novamente mais tarde.'] })
    }
  }

  async getAll (req, res) {
    try {
      const photos = await Photo.find({}).sort([['createdAt', -1]]).exec()
      return res.status(200).json(photos)      
    } catch (error) {
      return res.status(511).json({ errors: ['Erro no servidor. Por favor, tente novamente mais tarde'] })
    }
  }

  async getByUser (req, res) {
    try {
      const { id } = req.params
      const photos = await Photo.find({ userId: id }).sort([['createdAt', -1]]).exec()
      if(!photos) {
        res.status(404).json({ errors: ['Nenhuma foto registrada para esse usuário.']})
        return
      }
      return res.status(200).json(photos)

    } catch (error) {
      return res.status(404).json({ errors: ['Nenhuma foto registrada para esse usuário.']})
    }
    
  }
  
  async getById (req, res) {
    try {
      const { id } = req.params
      const photo = await Photo.findById(mongoose.Types.ObjectId(id))
      
      return res.status(202).json(photo)

    } catch (error) {
      return res.status(404).json({ errors: ['Foto não encontrada.'] })
    }    
  }
  
  async update (req, res) {
    const { id } = req.params
    const { subtitle } = req.body
    const reqUser = req.user
    const photo = await Photo.findById(mongoose.Types.ObjectId(id))

    if(!photo) {
      res.status(404).json({ errors: ['Foto não encontrada.'] })
      return
    }
    if(!photo.userId.equals(reqUser._id)) {
      res.status(511).json({ errors: ['Erro no servidor. Por favor, tente novamente mais tarde.'] })
      return
    }
    photo.subtitle = subtitle

    await photo.save()

    res.status(200).json({ photo, message: 'Foto atualizada com sucesso!' })

  }
  
  async deletePhoto(req, res) {
    try {
      const { id } = req.params
      const reqUser = req.user
      const photo = await Photo.findById(mongoose.Types.ObjectId(id))

      if (!photo.userId.equals(reqUser._id)) {
        res.status(511).json({ errors: ['Erro no servidor. Por favor, tente novamente mais tarde.'] })
        return
      }

      await Photo.findByIdAndDelete(photo._id)
      return res.status(200).json({ id: photo._id, message: 'Foto excluída com sucesso!' })
      
    } catch (error) {
      return res.status(404).json({ errors: ['Foto não encontrada.'] })
    }
  }
  async like (req, res) {
    const { id } = req.params
    const reqUser = req.user
    const photo = await Photo.findById(mongoose.Types.ObjectId(id))

    if (!photo) {
      res.status(404).json({ errors: ['Foto não encontrada.'] })
      return
    }
    if (photo.likes.includes(reqUser._id)) {
      const findLike = photo.likes.findIndex(id => id === reqUser._id)
      photo.likes.splice(findLike)
    } else {
      photo.likes.push(reqUser._id)
    }
    await photo.save()
    res.status(200).json({ like: photo.likes, userName: reqUser.userName })
  }
  async comment (req, res) {
    const { id } = req.params
    const { comment } = req.body
    const reqUser = req.user
    const user = await User.findById(mongoose.Types.ObjectId(reqUser._id))
    const photo = await Photo.findById(mongoose.Types.ObjectId(id))

    if (!photo) {
      res.status(404).json({ errors: ['Foto não encontrada.'] })
      return
    }

    const userComment = {
      comment,
      name: user.userName,
      avatar: user.userAvatar,
      userId: user._id
    }

    photo.comments.push(userComment)

    await photo.save()
    res.status(200).json(photo.comments)

  }

  async search (req, res) {
    const { q } =req.query
    const photos = await Photo.find({ subtitle: new RegExp(q, "i") }).exec()

    res.status(200).json(photos)
  }
}

module.exports = new PhotoController()