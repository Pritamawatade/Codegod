import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import problemRouter from './routes/problems.routes.js';
import executionRoute from './routes/executeCode.route.js';
import playlistRouter from './routes/playlist.routes.js';
import submissionRoute from './routes/submission.routes.js';
import cors from 'cors';
import streakRouter from './routes/streak.routes.js';
import discussionRouter from './routes/discussion.routes.js';

const app = express();
dotenv.config();
console.log("env================>",process.env.CLIENT_URL);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use('/api/v1/users', authRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/execute-code', executionRoute);
app.use('/api/v1/submission', submissionRoute);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/streak', streakRouter);
app.use('/api/v1/discussion', discussionRouter);
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
