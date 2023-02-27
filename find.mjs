import { connect, recipeCollection } from './api/db/index.mjs';

import process from 'process';
import * as readline from 'readline/promises';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

import { getText } from './util.mjs';

const path = process.argv[2] || 'name';
const single = process.argv[3] || 'multi';
const r = await connect();

const db = r.db();

const receipes = db.collection(recipeCollection);

const pattern = await getText(rl, 'regex');

const results = receipes.find({ '$and': [{[path]: {'$regex': pattern}}]});
// let i = 0;
// await results.forEach(doc => {
//     console.log(doc);
//     i++;
// })

var t = await results.toArray();
if (single == 'single') {
    console.log(t[0]);
} else {
    console.log(t);
}


rl.close();
r.close();