import Joi from 'joi';

const keywordsSchema = Joi.array().items(Joi.string().required()).min(1).required();

export default keywordsSchema;
