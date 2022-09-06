import { MongoClient } from 'mongodb';
import dbConfig from './config/db.config.js';

export default class Mongo {
    constructor() {
        const url = `mongodb+srv://${dbConfig.dbUsername}:${dbConfig.dbPassword}@cluster0.qcf7o.mongodb.net/${dbConfig.dbName}?retryWrites=true&w=majority`;

        this.client = new MongoClient(url, { useNewUrlParser: true });
    }
    async init() {
        await this.client.connect();
        console.log('connected');

        this.db = this.client.db("blackjackDB").collection("lobbydatas");
    }
}

const mongo = new Mongo();
await mongo.init();
const db = mongo.db;

export { db };

