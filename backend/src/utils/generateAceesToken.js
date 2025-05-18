import jwt from 'jsonwebtoken';


const generatedAccessToken = (user) => {
      return jwt.sign(
        {
            _id: user.id,
            email: user.email,
            username: user.username,
            name: user.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export default generatedAccessToken;