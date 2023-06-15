const express = require('express');
const {validateBody, autenticate,upload} = require('../../middlewares');
const {schemas} = require('../../models/user');
const ctrl = require('../../controllers/auth-controllers');
const {isValidIdSubscription} = require('../../middlewares');

const router = express.Router();


router.post("/register", validateBody(schemas.registerSchema),ctrl.register)

router.get("/verify/:verificationCode", ctrl.verifyEmail)

router.post("/verify",validateBody(schemas.emailSchema),ctrl.resendVerifyEmail)

router.post("/login",validateBody(schemas.loginSchema), ctrl.login)

router.get("/current",autenticate,ctrl.getCurrent)

router.patch(
  "/avatars",
  autenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

router.patch(
    "/:subscription",
    autenticate,
    isValidIdSubscription,
    ctrl.updateUser
  );
  
  router.post(
    "/logout",
    autenticate,
    validateBody(schemas.loginSchema),
    ctrl.logout
  );

module.exports = router;