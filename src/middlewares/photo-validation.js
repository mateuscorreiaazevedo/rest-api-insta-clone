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
      .isLength({min: 1}).withMessage('O comentário não pode estar vazio.')
  ]
}

module.exports = photoValidation