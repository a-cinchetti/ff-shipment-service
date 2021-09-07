import express from 'express';
import mongoose from "mongoose";
import jwt_decode from "jwt-decode";
import { json } from 'body-parser';
import schema from "./schema";
import {ApolloServer} from "apollo-server-express";
import {companyRouter} from "./routes/company";
import {storeRouter} from "./routes/store";

const app = express();
const keysJsonFile = require("./utils/keys.json");

const server = new ApolloServer({
    schema,
    playground: true,
});

require('dotenv').config();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.use(json())
app.use(companyRouter)
app.use(storeRouter)
app.use(function (err: any, req: any, res: any, next: any) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});
app.use(function logErrors(err: any, req: any, res: any, next: any) {
    console.error(err.stack);
    next(err);
});
app.use(function clientErrorHandler(err: any, req: any, res: any, next: any) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
});
app.use(function errorHandler(err: any, req: any, res: any, next: any) {
    res.status(500);
    res.render('error', { error: err });
});

const port = Number(process.env.PORT) || 4000;
const host = '0.0.0.0';

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:admin@fiorfor-cluster.umc5q.mongodb.net/app-shipping?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connected to db');
})

app.get('/', (req, res, err ) => {
    const token = req.headers?.authorization?.split(" ")[1] || '';
    console.log(jwt_decode(token));
    res.send('Express + TypeScript Server')
});

app.get('/auth/.well-known/jwks.json', (req, res, err ) => {
    res.send(keysJsonFile);
})

app.get('/stores', (req, res, error) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(['store1', 'store2', 'store3']);
})

app.listen(port, host)
console.log(`Running on http://${host}:${port}`);
