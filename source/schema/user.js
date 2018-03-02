import Joi from 'joi';

const userSchema = Joi.string().trim().min(1, 'utf8').required();

export default userSchema;
