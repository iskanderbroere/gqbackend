const jwt = require('jsonwebtoken')

function getUserId (ctx) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    console.log('token', token)
    if (token.length > 7) {
      const { userId } = jwt.verify(token, process.env.APP_SECRET)
      return userId
    }
  }

  throw new Error('Not authorized')
}

// class AuthError extends Error {
//   constructor () {
//     super('Not authorized')
//   }
// }

module.exports = {
  getUserId
  // AuthError
}
