import Joi from "joi";
const eventSchema = Joi.object({
    name: Joi.string().min(1).required(),
    date: Joi.string()
        .pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/)
        .required()
        .messages({
        "string.pattern.base": "date: must be in mm/dd/yyyy format",
    }),
    url: Joi.string().min(1).required(),
});
const animalSchema = Joi.object({
    name: Joi.string().min(1).required(),
    sciName: Joi.string().min(1).required(),
    description: Joi.array().items(Joi.string()).min(2).required(),
    images: Joi.array().items(Joi.string()).min(1).required(),
    events: Joi.array().items(eventSchema).min(1).required(),
});
export function validateAnimal(animal) {
    const result = animalSchema.validate(animal, { abortEarly: false });
    return result.error?.details?.[0]?.message || null;
}
