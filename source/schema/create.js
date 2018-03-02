import Joi from 'joi';

const createSchema = Joi.object().required().keys({
  name: Joi.string()
    .trim()
    .min(1, 'utf8')
    .required(),
  org: Joi.string()
    .trim()
    .min(1, 'utf8')
    .required(),
  description: Joi.string()
    .trim()
    .min(1, 'utf8')
    .default(null),
  homepage: Joi.string()
    .trim()
    .min(1, 'utf8')
    .uri()
    .default(null),
});

export default createSchema;
