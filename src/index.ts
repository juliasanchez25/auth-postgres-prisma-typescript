import express from 'express';
import dotenv from 'dotenv';
import routes from './Routes/Routes';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', routes);

app.listen(port, () => console.log(`App is running on port ${port}`));
