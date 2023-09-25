import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import _ from 'lodash';
import 'dotenv/config';

import apiRoute from './routes/api/index.mjs';
import metaRoute from './routes/meta/index.mjs';

const port = process.env.PORT;
const address = process.env.ADDRESS;
const dbAdress = process.env.DATABASE_ADDRESS;

const main = async () => {
	await mongoose.connect(dbAdress, {
		dbName: 'data'
	});

	const app = express();

	app.use(express.json());

	app.use('/', (req, res, next) => {
		console.log("req:", _.pick(req, ['method', 'protocol', 'originalUrl', 'body']))
		console.log("Time: ", Date.now());

		next();
	});

	app.use('/public', express.static(path.resolve('./public')));

	app.use('/api', apiRoute);
	app.use('/meta', metaRoute);

	app.listen(port, address, () => {
		console.log(`api listening on ${address}:${port}`);
	});
}

main();
