import { Schema, model as Model } from 'mongoose';
import autoPopulatePlugin from 'mongoose-autopopulate';

export const structure = {
	_id: Schema.Types.ObjectId,
	item: {
		type: Schema.Types.ObjectId,
		ref: 'item',
		autopopulate: true
	},
	materials: [{
		type: Schema.Types.ObjectId,
		ref: 'item',
		autopopulate: true
	}],
	tags: [String]
}

export const schema = Schema(structure);
schema.plugin(autoPopulatePlugin);

export const model = Model('recipe', schema);