const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost/instagram");

const createrSchema = mongoose.Schema({
    user : String,
    username : String,
    password : String,
mypost:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"upost"
}],
mycomment:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"upost"
}]
});

createrSchema.plugin(plm);

module.exports = mongoose.model("insta", createrSchema);
