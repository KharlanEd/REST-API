const express = require('express')
const Joi = require("joi");
const router = express.Router()


const {Contact} = require('../../models/contacts')



const {HttpError}= require('../../helpers')

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),

})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "Missing field favorite" }),
});

router.get('/', async (req, res, next) => {
  try{
    const result = await Contact.find({},"name phone")
    res.json(result)
  }
  catch(error){
  next(error)
}})

router.get('/:contactId', async (req, res, next) => {
  try{
    const {contactId}= req.params
    const result = await Contact.findById(contactId)
    if(!result){
     throw HttpError(404, `Contact with ${contactId} not found`)
    }
    res.json(result)
  }
  catch (error){
    next(error)
  }

 
})

router.post('/', async (req, res, next) => {
  try{
    const {error} = contactAddSchema.validate(req.body)
    if(error) {
      throw HttpError(400, error.message)
  }
  const result = await Contact.create(req.body)
  res.status(201).json(result)

  }
  catch(error){
    next(error)
  }

})

router.patch('/', async (req, res, next) => {
  try{
    const {error} = updateFavoriteSchema.validate(req.body)
    if(error) {
      throw HttpError(400, error.message)
  }
  const result = await Contact.create(req.body)
  res.status(201).json(result)

  }
  catch(error){
    next(error)
  }

})

router.delete('/:contactId', async (req, res, next) => {
  try{
    const {contactId} = req.params;
    const result = await Contact.findByIdAndDelete(contactId)
    if(!result){
      throw HttpError(404, `Contact with ${contactId} not found`)
     }
     res.json(result)
  }
  catch(error){
    next(error)
  }
  

})

router.put('/:contactId', async (req, res, next) => {
  try{
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.json(result);
  }
  catch(error){
    next(error)
  }
})

module.exports = router
