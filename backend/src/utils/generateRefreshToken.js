import jwt from 'jsonwebtoken'
const generateRefreshToken = (user) =>{
     return jwt.sign(
        {
            id: user.id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default generateRefreshToken