const mongoose = require('mongoose');



const app = require('./app')
// zleQfKN91Y82lgYY

const DB_HOST = "mongodb+srv://Kharlan:zleQfKN91Y82lgYY@cluster0.k6abhpk.mongodb.net/my_contacts?retryWrites=true&w=majority"

mongoose.connect(DB_HOST)
.then(()=>{
  app.listen(3000)
  console.log("Database connection successful");
})
.catch(error =>{
console.log(error.message);
process.exit(1)

})
