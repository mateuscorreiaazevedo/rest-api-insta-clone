const { body } = require('express-validator')

const photoValidation = {
  insertValidate: () => [
    body('subtitle')
      .isString(),
    body('image')
      .custom((value, { req }) => {
        if(!req.file) throw new Error('A imagem é obrigatória.')
        return true
      })
  ],
  updateValidation: () => [
    body('subtitle')
      .isString()
  ],
  commentValidation: () => [
    body('comment')
      .isString()
  ]
}

module.exports = photoValidation