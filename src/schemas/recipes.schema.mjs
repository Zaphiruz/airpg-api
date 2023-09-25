import { Schema, model as Model } from 'mongoose';

export const structure = {
	_id: Schema.Types.ObjectId,
	item: Schema.Types.ObjectId,
	materials: [Schema.Types.ObjectId],
	tags: [String]
}

export const schema = Schema(structure);

export const model = Model('recipe', schema);