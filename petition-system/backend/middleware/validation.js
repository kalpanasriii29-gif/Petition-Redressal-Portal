import Joi from 'joi';

export const petitionSchema = Joi.object({
  from_name: Joi.string().max(100).required(),
  to_department: Joi.string().max(100).required(),
  whatsapp_number: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  petition_text: Joi.string().min(10).required(),
  priority: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal')
});

export const statusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in_progress', 'resolved', 'rejected').required()
});

export const responseSchema = Joi.object({
  response_text: Joi.string().min(3).required(),
  is_final: Joi.boolean().default(false)
});

export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });
    req.body = value;
    next();
  };
}