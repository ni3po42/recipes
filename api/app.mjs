import express from 'express';

import { recipesRoute } from './routes/recipes.mjs';
import { serverErrorHandler } from './middleware/error.mjs'

const app = express();

const port = 8080;

app.use(express.json());
app.use('/api/recipes', recipesRoute, serverErrorHandler);


app.listen(port, ()=>{
    console.log('chef api start');
});