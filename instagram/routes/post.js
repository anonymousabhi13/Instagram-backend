const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


const postSchema = mongoose.Schema({
    post: String,
    image: String,
    tags:String,
    desc:String,
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "insta"
    },
    like:[{
        type: Array, 
        default: 0
    }],
    Comment:[{
       type:Array,
       ref:"insta"
    }]

});


module.exports = mongoose.model("upost", postSchema);
