import express from 'express';
import { executeCode } from '../controllers/executeCode.controller';

const executionRoute = express.Router();


executionRoute.post("/", executeCode)

export default executionRoute;
