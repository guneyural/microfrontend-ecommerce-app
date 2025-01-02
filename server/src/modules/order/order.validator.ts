import Joi from "joi";

export const validateCreateOrder = (data: any) => {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
          quantity: Joi.number().min(1).required(),
          image: Joi.string().required(),
        })
      )
      .min(1)
      .required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
  });

  return schema.validate(data);
};
