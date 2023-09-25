import { Schema } from 'mongoose';

export const structure = {
	_id: Schema.Types.ObjectId,
	name: String,
	description: String,
	tags: [String]
}

export const schema = Schema(structure);
