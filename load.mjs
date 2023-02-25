import { connect, recipeCollection } from './api/db/index.mjs';

import process from 'process';
import readline from 'readline/promises';

import { attributes, books, choose, getText, getUntil, units, yesOrNo } from './util.mjs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const server = await connect();
const db = server.db();
const receipes = db.collection(recipeCollection);


async function addAttribute(rl) {

    const attNames = Object.keys(attributes);
    const attribute = await choose(rl, 'attribute', attNames);

    const type = attributes[attribute];
    let value;
    switch(type) {
        case 'bool':
            value = await yesOrNo(rl, attribute);
            break;
        default:
            value = await getText(rl, attribute);
            break;
    }

    return [ attribute, value ];
}

await getUntil(async () => {
    const name = await getText(rl, 'name');

    const book = await choose(rl, 'book', books);
    const page = await getText(rl, 'page');
    const lastMade = new Date(Date.parse(await getText(rl, 'last made')));

    const attrs = {};

    await getUntil(async () => {
        const [attr, value] = await addAttribute(rl);
        attrs[attr] = value;
    }, () => yesOrNo(rl, 'Add another attribute?'))

    const ingredients = [];

    await getUntil(async ()=>{
        const itemName = await getText(rl, 'ingredient');
        const unit = await choose(rl, 'unit', units);
        const amount = await getText(rl, 'amount? (#)', '1');
        const note = await getText(rl, 'note');
        const ingredient = { itemName, size: +amount, unit, note }
        ingredients.push(ingredient);
    }, 
    () => yesOrNo(rl, 'Add another ingredient?'));
    
    const note = await getText(rl, 'note');
    const receipe = {
        name, book, page, ingredients, note, lastMade, attrs
    };

    await receipes.insertOne(receipe);
}, () => yesOrNo(rl, 'Add another receipe?'));

rl.close();

await server.close();

