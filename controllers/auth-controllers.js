const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User} = require('../models/users');
const {ctrlWrapper} = require('../middlewares')
const {HttpError} = require('../helpers');
const {SECRET_KEY} = process.env;


const register = async(req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword})

    const {_id: id} = newUser;

    const payload = {
        id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});

    res.status(201).json({
        token,
        user: {
            name: newUser.name,
            email: newUser.email,
        }
    })
   
}

const login = async (req,res)=>{
    const {email,password}= req.body
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401,"Email or password invalid.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw HttpError(401, "Email or password invalid.");
    }

    const payload = {
        id: user._id,
      };
    
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
      await User.findByIdAndUpdate(user._id, { token });
    
      res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
}

const getCurrent = async(req,res)=>{
    const { email, subscription } = req.user;

  res.json({ email, subscription });
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
  
    res.status(204).json();
  };
  
  const updateUser = async (req, res) => {
    const { _id } = req.user;
  
    const { subscription } = req.params;
  
    await User.findByIdAndUpdate(_id, { subscription });
  
    res.status(201).json({ message: "Contact updated" });
  };

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateUser:ctrlWrapper(updateUser)

};