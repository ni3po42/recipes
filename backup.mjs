import { connect } from './db/index.mjs';

const r = await connect();

const db = r.db();

const receipes = db.collection('receipes');

const results = receipes.find({ });
// let i = 0;
await results.forEach(doc => {
    const {_id, ...rest} = doc;
    console.log(JSON.stringify(rest));
    
})

r.close();