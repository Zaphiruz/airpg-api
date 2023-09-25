import mongoose from 'mongoose';
import express from 'express';
import { setupGenericCrudOperations } from './api/generateCrudEndpoints.mjs';

import { model as entitiesModel } from '../schemas/entities.schema.mjs';
import { model as itemsModel } from '../schemas/items.schema.mjs';
import { model as placesModel } from '../schemas/places.schema.mjs';
import { model as recipesModel } from '../schemas/recipes.schema.mjs';
import { model as spellsModel } from '../schemas/spells.schema.mjs';

export const router = express.Router();
export default router;

router.use('/', (req, res, next) => {
	console.log('Database status: ', mongoose.STATES[mongoose.connection.readyState]);
	next();
})

setupGenericCrudOperations(router, entitiesModel);
setupGenericCrudOperations(router, itemsModel);
setupGenericCrudOperations(router, placesModel);
setupGenericCrudOperations(router, recipesModel);
setupGenericCrudOperations(router, spellsModel);
