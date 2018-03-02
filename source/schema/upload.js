import Joi from 'joi';
const uploadSchema = Joi.object().keys({
  owner: Joi.string().trim().min(1, 'utf8').required(),
  repo: Joi.string().trim().min(1, 'utf8').required(),
  path: Joi.string().trim().min(1, 'utf8').uri({ allowRelative: true, relativeOnly: true }).required(),
  message: Joi.string().trim().min(1, 'utf8').required(),
  content: Joi.string().trim().min(1, 'base64').required(),
  branch: Joi.string().default('master'),
});

export default uploadSchema;
