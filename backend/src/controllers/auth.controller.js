import { ApiError } from '../utils/api-error.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../libs/db.js';
import { UserRole } from '../../generated/prisma/index.js';
import { ApiResponse } from '../utils/api-response.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import generatedAccessToken from '../utils/generateAceesToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import Mailgen from 'mailgen';
import sendMail from '../utils/sendMail.js';
import pkg from 'google-auth-library';
const { OAuth2Client } = pkg;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    const accessToken = generatedAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await db.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      'Something went wrong while generating referesh and access token'
    );
  }
};

const register = async (req, res) => {
  const { name, password, email, username } = req.body;
  try {
    if (!name || !email || !password || !username) {
      throw new ApiError(400, 'Invalid data');
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json(new ApiError(400, 'User already exists').toJSON());
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, 'Avatar file is required');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    try {
      newUser = await db.User.create({
        data: {
          name,
          password: hashedPassword,
          email,
          role: UserRole.USER,
          image: avatar.url,
          username,
        },
      });
    } catch (error) {
      console.error('Error inserting user in DB:', error);
      return res
        .status(400)
        .json(new ApiError(400, 'Error inserting user in DB').toJSON());
    }

    if (!newUser) {
      return res
        .status(400)
        .json(new ApiError(400, 'Error inserting user in DB').toJSON());
    }

    // const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    //   expiresIn: '7d',
    // });

    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   sameSite: 'strict',
    //   secure: process.env.NODE_ENV !== 'development',
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    // });

     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser.id
    );



    var mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        // Appears in header & footer of e-mails
        name: 'Codegod',
        link: 'https://codegod.in',
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
      },
    });

    const link = `${process.env.CLIENT_URL}/verify/${newUser.emailVerificationToken}`;

    var emailSetup = {
      body: {
        name: name,
        intro: "Welcome to Codegod! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Codegod, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: link,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(emailSetup);

    const options = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: newUser.email, // list of receivers
      subject: 'verfify your email', // Subject line
      text: 'Hello world?', // plain text body
      html: emailBody, // html body
    };

   const isSent = await sendMail(options);

   if(!isSent){
    console.log('email not sent');
   }

   const cookieOption = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 1000 * 60 * 60 * 24 * 7
   }

    return res.status(200)
    .cookie('accessToken', accessToken, cookieOption)
    .cookie('refreshToken', refreshToken, cookieOption)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            image: newUser.image,
            username: newUser.username
          },
        },
        'User created successfully'
      )
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Internal Server Error').toJSON());
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json(new ApiError(400, 'Invalid credentials'));
    }

    const user = await db.User.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json(new ApiError(400, 'User not exist'));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json(new ApiError(401, 'Wrong password'));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user.id
    );

    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== 'development',
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    //   sameSite: 'strict',
    // });

    // return res.status(200).json(
    //   new ApiResponse(
    //     200,
    //     {
    //       user: {
    //         id: user.id,
    //         email: user.email,
    //         name: user.name,
    //         role: user.role,
    //         image: user.image,
    //       },
    //     },
    //     'user logged in successfully'
    //   )
    // );

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
              username: user.username,
            },
          },
          'user logged in successfully'
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, 'Internal Server Error'));
  }
};

const logout = async (req, res) => {
  try {
    await db.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        refreshToken: null,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(new ApiResponse(200, null, 'User logged out successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, 'Internal Server Error'));
  }
};

const refresAceesToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json(new ApiError(401, 'Unauthorized'));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user || !user.refreshToken) {
      return res.status(401).json(new ApiError(401, 'Unauthorized'));
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json(new ApiError(401, 'Unauthorized access '));
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefereshTokens(user.id);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(new ApiResponse(200, null, 'Access token refreshed successfully'));
  } catch (error) {
    console.log("error in refresAceesToken", error);
    return res.status(500).json(new ApiError(500, 'Internal Server Error'));
  }
};

const changeCurrentPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json(new ApiError(400, 'Invalid credentials'));
  }

  const user = await db.User.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return res.status(404).json(new ApiError(404, 'User not found'));
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json(new ApiError(401, 'Wrong password'));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.User.update({
    where: {
      id: req.user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Password changed successfully'));
};

const updateAccountDetails = async (req, res) => {
  const { name, username, email } = req.body;

  if (!fullName || !email || !username) {
    throw new ApiError(400, 'All fields are required');
  }
  const user = await db.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      name,
      email,
      username,
    },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
      },
      'Account details updated successfully'
    )
  );
};

const updateUserAvatar = async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is missing');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, 'Error while uploading avatar');
  }

  const user = await db.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      image: avatar.url,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Avatar image updated successfully'));
};

const check = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, 'User authenticated successfully'));
  } catch (error) {
    console.error('Error during user authentication:', error);
    return res.status(500).json(new ApiError(500, 'Internal Server Error'));
  }
};

const googleAuthController = async (req, res) => {
   const { credential } = req.body; // coming from Google login on frontend

    try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture, sub: googleId } = payload;

    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // User doesn't exist, create them
      user = await db.user.create({
        data: {
          name,
          email,
          image: picture,
          password: `google_${googleId.slice(0, 8)} ${email}`,
          role: 'USER',
          provider: 'google',
          googleId,
          username: `google_${googleId.slice(0, 8)}`,
        },
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user.id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
            },
          },
          'Google login successful'
        )
      );
  } catch (error) {
    console.error('Google login error:', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Google login failed').toJSON());
  }
};

export {
  register,
  login,
  logout,
  check,
  refresAceesToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  googleAuthController,
};
