const {Schema,model} = require("mongoose");
const {handleMongooseError} = require('../helpers')
const Joi = require("joi");


const userSchema = new Schema({

    password: {
        type: String,
        required: [true, 'Password is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
      },
      avatarURL:{
        type: String,
        required: true,
        },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      token: {
        type: String,
        default: null,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      }
}, { versionKey: false, timestamps: true })

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  
  const subscriptionSchema = Joi.any().valid("starter", "pro", "business");
  
  const schemas = { 
     registerSchema,
     loginSchema, 
     subscriptionSchema
     };
  
  const User = model("user", userSchema);
  
  module.exports = { User, schemas };