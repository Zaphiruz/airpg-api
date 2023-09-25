import express from 'express';
import mongoose from 'mongoose';

export const router = express.Router();
export default router;

router.get('/collectionNames', async (req, res) => {
	let collections = await mongoose.connection.db.listCollections().toArray()
	let names = collections.map(collection => collection.name);
	res.send(names);
})
