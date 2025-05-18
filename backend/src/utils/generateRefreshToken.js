const generateRefreshToken = (user) =>{
     return jwt.sign(
        {
            _id: user.id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default generateRefreshToken