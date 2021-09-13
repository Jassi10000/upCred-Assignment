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

 module.exports = contactBook;

