import mongoose from "mongoose";
import _ from "lodash";

export const objectIdInjector = (object, key = "_id") => {
	return {
		...object,
		[key]: new mongoose.Types.ObjectId(object[key])
	}
}

export const objectIdRemover = (object, key = "_id") => {
	return _.omit(object, key)
}