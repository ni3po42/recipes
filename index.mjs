import { connect, recipeCollection } from './api/db/index.mjs';

import process, { getuid } from 'process';
import readline from 'readline/promises';

import fs from 'fs/promises';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

import { attributes, books, choose, getDate, getText, getUntil, units, yesOrNo } from './util.mjs';

const r = await connect();

const db = r.db();

const receipes = db.collection(recipeCollection);

const date = await getDate(rl, 'show recipes used before');

// let i = 0;
// await results.forEach(doc => {
//     console.log(doc);
//     i++;
// })

// console.log(i);


await getUntil(async ()=>{

    const results = receipes.find({'lastMade': { '$lt': date }, '$or': [ {'attrs.bad':false }, {'attrs.bad':null }]});//, '$and': [{'attrs.isSlowCook': true}]});

    const names = [];

    const recipes = await results
        .toArray();

    const prepWeek = await getDate(rl, 'prep week');

    await getUntil(async ()=>{
        const name = await choose(rl, 'recipe', recipes, { 
            selector: (obj)=> obj.name, 
            cancel: true,
            display: (obj)=> `${obj.name} - ${obj.lastMade.toLocaleDateString()}${obj.attrs.isSlowCook ? ' (sc)' : ''}`
        });
        
        if (name !== undefined) {
            names.push(name);
        }
        
    
    }, ()=>yesOrNo(rl, 'pick another recipe'));
    
    if (names.length === 0) {
        return;
    }

    const selected = receipes.find({ '$or': names.map(name => ({name}))});
    const ingredients = await selected
        .map(x=> x.ingredients)
        .toArray();
    
    const grouped = ingredients
        .flat()
        .reduce((acc, rr)=> {
            if (rr.itemName in acc) {
                acc[rr.itemName].push(rr);
            } else {
                acc[rr.itemName] = [rr];
            }
            return acc;
        }, {});
    
    var data = [];
    
    Object.keys(grouped).forEach(x=> {
        console.log(x);
        data.push(x);
        grouped[x].map(y=> `\t${y.size} ${y.unit} - ${y.note || ''}`).forEach(y=> {
            data.push(y)
            console.log(y);
        });
    });
    
    const timestamp = `${prepWeek.getFullYear()}${prepWeek.getMonth()+1}${prepWeek.getDate()}${prepWeek.getTime() % (60 * 60 * 24 * 1000)}`;
    
    const selectedArray = await selected.clone().toArray();

    const notes = selectedArray
        .map(x=> x.note || '');
    
    const recipeNames = selectedArray
        .map(x=> `\t${x.name} - ${x.book} - p${x.page}`);

    console.log(notes.filter(x=> x).join('\n'));
    
    const fileData = [
        `prep list for week of: ${prepWeek.toLocaleDateString()}\n`,
        ...data, 
        '\nrecipes',
        ...recipeNames,
        '\nnotes',
        ...notes.filter(x=>x).map(x=>`\t${x}`), 
        '\n'
    ];
    
    await fs.writeFile(`dinners-${timestamp}.txt`, fileData.join('\n'));
    
    if (await yesOrNo(rl, 'update last made?')) {
        await receipes.updateMany({ '$or': names.map(name => ({name}))}, { '$set': { 'lastMade': prepWeek }});
        console.log('updated');
    }

}, ()=>yesOrNo(rl, 'add a week'));

rl.close();
r.close();