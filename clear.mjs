import { connect } from './db/index.mjs';

const server = await connect();

const db = server.db();
const receipes = db.collection('receipes');

await receipes.deleteMany({});

await server.close();

