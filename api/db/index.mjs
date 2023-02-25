import { MongoClient, ObjectId } from 'mongodb';

export const MongoId = ObjectId;

export const recipeCollection = 'recipes';

const configPROD = {
    "Host": "0.0.0.0",
    "Port": 27017,
    "Name": 'recipes',  //db, not the collection
    "UserName": "dbUser",
    "Password": "W!llK0mmen!"
};

const configTEST = {
    "Host": "0.0.0.0",
    "Port": 27017,
    "Name": 'recipesTEST',  //db, not the collection
    "UserName": "dbTESTUser",
    "Password": "W!llK0mmen!"
};

function getUri(config){
    const user = encodeURIComponent(config.UserName);
    const password = encodeURIComponent(config.Password);
    
    // Connection URL
    var url = `mongodb://${user}:${password}@${config.Host}:${config.Port}/${config.Name}`;
    return url;
}

export async function connect(){ 
    const uri = getUri(configTEST);
    const client = new MongoClient(uri);
    return client.connect();
}

export async function collection(name) {

    const client = await connect();
    const db = client.db();

    return db.collection(name);
}
