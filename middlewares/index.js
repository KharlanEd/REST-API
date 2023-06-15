const isValidId = require('./isValided');
const validateBody = require('./validateBody')
const autenticate = require('./autenticate')
const ctrlWrapper = require('./ctrlWrapper')
const isValidIdSubscription = require('./isValidIdSubscription')
const upload = require('./upload')
const sendEmail = require('./sendEmail')

module.exports = {
    isValidId,
    validateBody,
    autenticate,
    ctrlWrapper,
    isValidIdSubscription,
    upload,
    sendEmail
   
}