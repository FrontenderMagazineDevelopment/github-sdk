import Joi from 'joi';

const constructorSchema = Joi.string().trim().token().min(1, 'utf8').required();

export default constructorSchema;
