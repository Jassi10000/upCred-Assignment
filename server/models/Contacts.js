const mongoose = require("mongoose");
const contactSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail:{
        type: String,
        required: true
    },
    userPhoneNo: {
        type: Number,
        required: true
    }
});

const contactBook = mongoose.model("contactData" , contactSchema);

// module.exports =  {
//     fetchData:function(callback){
//        var userData=contactBook.find({userName: "JaskeeratSingh"});
//        userData.exec(function(err, data){
//            if(err) throw err;
//            return callback(data);
//        })
       
//     }
//  };

 module.exports = contactBook;

