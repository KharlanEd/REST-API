const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const {User} = require('../models/user');
const {nanoid}= require('nanoid')
const {ctrlWrapper,sendEmail} = require('../middlewares')
const {HttpError} = require('../helpers');
const {SECRET_KEY,PROJECT_URL} = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");


const register = async(req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid()
    const newUser = await User.create({...req.body, password: hashPassword,avatarURL,verificationCode})

    const verifyEmail = {
      to: email,
      subject:"Verify email",
      html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

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

const verifyEmail = async (req,res)=>{
  const {verificationCode}= req.params;
  const user = await User.findOne({verificationCode})
  if(!user){
    throw HttpError(404,"User not found")
  }
  await User.findByIdAndUpdate(user._id, {verify:true, verificationCode:"",});

  res.status(200).json({
      message: "Verification successful"
})
}

const resendVerifyEmail = async(req,res)=>{
  const {email}= req.body;
  const user = await User.findOne({email})
  if(!user){
    throw HttpError(404,"Email not found")
  }
  if(user.verify){
    throw HttpError(400,"Verification has already been passed")
  }

  const verifyEmail = {
    to: email,
    subject:"Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`
  }

  await sendEmail(verifyEmail);

  res.json({
    message:"Verification email sent"
  })
}

const login = async (req,res)=>{
    const {email,password}= req.body
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401,"Email or password invalid.");
    }
    if(!user.verify){
      throw HttpError(401,"Email not verify.")
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

  const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
  
    const image = await Jimp.read(tempUpload);
    image.resize(250, 250).write(tempUpload);
  
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
  
    res.json({
      avatarURL,
    });
  };

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail:ctrlWrapper(verifyEmail),
    resendVerifyEmail:ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateUser:ctrlWrapper(updateUser),
    updateAvatar:ctrlWrapper(updateAvatar),

};