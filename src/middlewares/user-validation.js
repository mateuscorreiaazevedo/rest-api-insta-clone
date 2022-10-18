const { body } = require('express-validator')

const userValidation = {
  createValidation: () => [
    body('userName')
      .isString().withMessage('O nome de usuário é obrigatório.'),
    body('email')
      .isString().withMessage('O email é obrigatório.')
      .isEmail().withMessage('Insira um endereço de email válido.'),
    body('password')
      .isString().withMessage('A senha é obrigatória.')
      .isLength({ min: 6 }).withMessage('A senha deve conter no mínimo 6 caracteres.'),
    body('confirmPassword')
      .isString().withMessage('A confirmação de senha é obrigatória.')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('A senha e a confirmação de senha devem ser iguais.')
        }
        return true
      })
  ],
  loginValidation: () => [
    body('email')
      .isString().withMessage('O email é obrigatório.')
      .isEmail().withMessage('Insira um endereço de email válido.'),
    body('password')
      .isString().withMessage('A senha é obrigatória.')
  ],
}

module.exports = userValidation