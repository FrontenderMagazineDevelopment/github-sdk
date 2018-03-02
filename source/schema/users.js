import Joi from 'joi';

const usersSchema = Joi.string().trim().min(1, 'utf8').required();

export default usersSchema;
