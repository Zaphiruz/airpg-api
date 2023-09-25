import { Schema, model as Model } from 'mongoose';
import { structure } from "./_base.schema.mjs";

export const schema = Schema(structure);

export const model = Model('entity', schema);