const express = require('express')

const router = express()

router.use('/api/users', require('./user-route'))
router.use('/api/photos', require('./photo-route'))

router.get('/', (req, res) => {
  res.send('api working')
})

module.exports = router