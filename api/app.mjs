import express from 'express';

import { recipesRoute } from './routes/recipes.mjs';
import { serverErrorHandler } from './middleware/error.mjs'

import { exec } from 'node:child_process';

exec('sudo systemctl start mongod', (error)=> {
    if (error) {
        console.log(error);
    }
    else {

        const app = express();
        
        const port = 8080;
        
        app.use(express.json());
        app.use('/api/recipes', recipesRoute, serverErrorHandler);
        
        app.listen(port, ()=>{
            console.log('chef api start');
        });
        
    }
});


