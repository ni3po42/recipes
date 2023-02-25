import express from 'express';

import { collection, MongoId, recipeCollection } from '../db/index.mjs';

const router = express.Router();

const typeCheckRegex = /^([\/'"])(.*)\1([igm]{0,3})$|^[^\/'"]+$/;

async function getQuery(reqQuery) {
    return Object.keys(reqQuery).map(key=>{

        if (reqQuery[key] === '') {
            return  { [key]: true };    
        }

        const matches = typeCheckRegex.exec(reqQuery[key]);

        if (!matches) {
            throw new Error(`${reqQuery[key]} value for ${key} is not a valid value`);
        }

        const type = matches[1];
        let value;
        let op;
        switch (type) {
            case '/':
                value = new RegExp(matches[2], matches[3]); 
                op = '$regex';
                break;
            case `'`:
            case `"`:
                if (matches[3]) {
                    throw new Error(`${reqQuery[key]} value for ${key} is not a valid value`);
                }
                value = matches[2];
                op = '$eq'; 
                break;
            default:
                value = decodeURIComponent(matches[0])
                op = '$eq';
                break;
        }

        return  { [key]: { [op]: value } };
    });
}


router
    .get('/', async (req, res) => {

        const query = await getQuery(req.query).catch(e => {
            res.status(400).send(e);
        });

        if (!query) {
            return;
        }

        (await collection(recipeCollection))
            .find(query.length > 0 ? {
                "$and": query
            } : undefined)
            .map(doc => ({ ...doc, _id: doc._id.toString() }))
            .toArray()
            .then(recipes =>
                res
                    .status(200)
                    .send(recipes)
            );

})
    .get('/before/:year(\\d+)/:month(\\d+)/:day(\\d+)', async (req, res) => {

        const { year, month, day} = req.params; 
        const ticks = Date.parse(`${year}/${month}/${day}`);

        if (Number.isNaN(ticks)) {
            res.status(400).send('invalid date');
            return;
        }
        const date = new Date(ticks);
        const query = await getQuery(req.query).catch(e => {
            res.status(400).send(e);
        });

        if (!query) {
            return;
        }

        (await collection(recipeCollection))
            .find(query.length > 0 ? {
                "$and": [{'lastMade': { '$lt': date }},...query]
            } : undefined)
            .map(doc => {
                const { _id, ...obj } = doc;
                return { _id: _id.toString(), ...obj };
            })
            .toArray()
            .then(recipes =>
                res
                    .status(200)
                    .send(recipes)
            );

})
    .put('/', async (req, res) => {

        const recipe = req.body;
        
        recipe.attrs = recipe.attrs || {};
        recipe.ingredients = recipe.ingredients || [];

        (await collection(recipeCollection))
            .insertOne(recipe)
            .then(result => {
                res.status(201).send({
                    _id: result.insertedId
                });
            });
            
    
})
    .delete('/:id', async (req, res) => {
        const { id } = req.params;
        
        const _id = MongoId(id);

        (await collection(recipeCollection))
            .deleteOne({ _id })
            .then(result => {
                res.status(200).send('deleted');
            });
        
})
    .put('/:id/attrs/:attr', async (req, res) => {
        const { id, attr } = req.params;
        const _id = MongoId(id);
        const value = req.body;

        (await collection(recipeCollection))
            .updateOne({ _id }, { '$set': { [`attrs.${attr}`]: value }})
            .then(result => {
                res.status(200).send('updated');
            });

    })
    .delete('/:id/attrs/:attr', async (req, res) => {
        const { id, attr } = req.params;
        const _id = MongoId(id);

        (await collection(recipeCollection))
            .updateOne({ _id }, { '$unset': { [`attrs.${attr}`]: '' }})
            .then(result => {
                res.status(200).send('deleted');
            });

    })
    .put('/:id/ingredients', async (req, res) => {
        const { id } = req.params;
        const _id = MongoId(id);

        const value = req.body;

        (await collection(recipeCollection))
            .updateOne({ _id }, { '$push': { ingredients: value }})
            .then(result => {
                res.status(201).send('inserted');
            });

    })
    .delete('/:id/ingredients/:itemName', async (req, res) => {
        const { id, itemName } = req.params;
        const _id = MongoId(id);

        (await collection(recipeCollection))
            .updateOne({ _id }, { '$pull': { 'ingredients.itemName': itemName }})
            .then(result => {
                res.status(200).send('deleted');
            });

    })
    .post('/:id/:prop', async (req, res) => {
        const { id, prop } = req.params;
        const _id = MongoId(id);
        const value = req.body;

        (await collection(recipeCollection))
            .updateOne({ _id }, { '$set': { [prop]: value }})
            .then(result => {
                res.status(200).send('updated');
            });

    });

export { router as recipesRoute };