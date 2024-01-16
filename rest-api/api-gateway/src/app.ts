import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { routerV1 } from './endpoints/v1/routesv1';
import  connectDB  from './dbConnection'
import * as dotenv from 'dotenv';
import { errorHandlerMiddleware } from './middlewares/errorMiddleware';
import morgan from 'morgan';
import logger from './logger';
import connectCache from './cacheConnection';
//For env File 

dotenv.config({ path: 'src/config/.env' });


// Database connection
connectDB();

connectCache();

const app: Express = express();
console.log(process.env.JWT_SECRET)
//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(errorHandlerMiddleware)


//v1 routes
routerV1(app);

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

export { app }