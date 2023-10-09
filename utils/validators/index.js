const { validationResult } = require('express-validator');

const runValidation = async (req, res, next) => {
  const errors = validationResult(req)

  if(errors.array().length > 0) {
    return res.status(400).json({
      status: 'error',
      message: errors.array()
    })
  }
  
  next()
}

module.exports = { runValidation }