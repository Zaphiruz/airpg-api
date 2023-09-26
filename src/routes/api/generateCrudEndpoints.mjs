import { objectIdInjector, objectIdRemover } from '../../utils/mongooseUtils.mjs';
import { formatError } from '../../utils/expressUtils.mjs';
import express from 'express';
import _ from 'lodash';

const buildTagParams = (query) => {
	let tags = query.tags.split(',')
	let tagFilterMode = query.tagFilterMode?.toUpperCase?.() ?? 'ALL';
	let modifier = (tagFilterMode === 'IN' || tagFilterMode === 'OR')
		? '$in'
		: '$all'

	return 	{
		tags: {
			[modifier]: tags
		}
	}
}

export const listRecords = (model) => async (req, res) => {
	console.log('listRecords', model.collection.collectionName, req.query);

	let queryParams = _.isEmpty(req.query) ? {} : req.query;

	if ("tags" in queryParams) {
		queryParams = {
			...queryParams,
			...buildTagParams(queryParams)
		}
	}

	try {
		let collection = await model.find(queryParams);
		res.send(collection);
	} catch(error) {
		return res.status(500).send(formatError(error));
	}
}

export const getRecord = (model) => async (req, res) => {
	console.log('getRecord', model.collection.collectionName, req.params.id);

	var id = req.params.id;

	if (_.isEmpty(id)) {
		return res.status(400).send(formatError(new Error('Bad parameters')));
	}

	try {
		if (!(await model.exists({ _id: id }))) {
			return res.status(404).send(formatError(new Error('Record does not exist')));
		}

		let record = await model.findById({ _id: id });
		return res.send(record);
	} catch(error) {
		return res.status(500).send(formatError(error));
	}
}

export const createRecord = (model) => async (req, res) => {
	console.log('createRecord', model.collection.collectionName, req.body);

	if (_.isEmpty(req.body)) {
		return res.status(400).send(formatError(new Error('Bad parameters')));
	}

	let record = new model(objectIdInjector(req.body));

	if (req.body._id && (await model.exists({ _id: req.body._id }))) {
		return res.status(409).send(formatError(new Error('Record already exist')));
	}

	try {
		await record.save();
		return res.status(201).send(record);
	} catch(error) {
		return res.status(500).send(formatError(error));
	}
}

export const deleteRecord = (model) => async (req, res) => {
	console.log('deleteRecord', model.collection.collectionName, req.params.id);

	if (_.isEmpty(req.params.id)) {
		return res.status(400).send(formatError(new Error('Bad parameters')));
	}

	var id = req.params.id;
	if (!(await model.exists({ _id: id }))) {
		return res.status(410).send(formatError(new Error('Record does not exist')));
	}

	try {
		await model.findByIdAndDelete(id);
		return res.status(204).send();
	} catch(error) {
		return res.status(500).send(formatError(error));
	}
}

export const updateRecord = (model) => async (req, res) => {
	console.log('updateRecord', model.collection.collectionName, req.params.id);

	if (_.isEmpty(req.params.id)) {
		return res.status(400).send(formatError(new Error('Bad parameters')));
	}

	var id = req.params.id;
	if (!(await model.exists({ _id: id }))) {
		return res.status(410).send(formatError(new Error('Record does not exist')));
	}

	try {
		let record = await model.findByIdAndUpdate(id, objectIdRemover(req.body), { new: true });
		return res.send(record);
	} catch(error) {
		return res.status(500).send(formatError(error));
	}
}

export const findByTags = (model) => async (req, res) => {
	console.log('findByTags', model.collection.collectionName, req.query);

	if (_.isEmpty(req.query.tags)) {
		return res.status(400).send(formatError(new Error('Bad parameters')));
	}

	let queryParams = buildTagParams(req.query);

	try {
		let collection = await model.find(queryParams);
		res.send(collection);
	} catch(error) {
		return res.status(500).send(formatError(error));
	}
}

export const setupGenericCrudOperations = (router, model) => {
	let collectionName = model.collection.collectionName;
	let collectionRouter = express.Router();

	collectionRouter.get(`/tags`, findByTags(model));
	collectionRouter.get('/', listRecords(model));
	collectionRouter.post('/', createRecord(model));
	collectionRouter.get(`/:id`, getRecord(model));
	collectionRouter.delete(`/:id`, deleteRecord(model));
	collectionRouter.put(`/:id`, updateRecord(model));

	router.use(`/${collectionName}`, collectionRouter);
}