const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fetchController = require("./controllers/fetchControllers");
const router = require("./routes/routes");
const objectId = require("mongodb").ObjectID;

// initialising an express app
const app = express();

// the database model that contains the schema
const contactBook = require("./models/Contacts");

app.set('views', __dirname + '/views');

// allows the data from frontend to come in json format
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// the connection of database and backend
mongoose.connect("mongodb+srv://upcredUser:upcred@cluster0.dbnu5.mongodb.net/UpCred-Application?retryWrites=true&w=majority" , {
    useNewUrlParser: true , useUnifiedTopology: true}
);

app.get('/' , (req,res) => {
    res.render("details.ejs")
});

app.post('/newdetails' , async (req,res) => {
    const contact = new contactBook(req.body);
    try {
        const result = await contact.save();
        res.json(result);
    } catch (error) {
        res.send(error);
    }
})

app.get('/update/:id' , function(req,res){
    var id = req.params.id;
    contactBook.find({"_id": mongoose.Types.ObjectId(id)}).then( (result) => {
        res.render("update.ejs", { userData : result });
    });
});

// update the details of the contact
app.post('/update/:id' , (req,res) => {
    var id = req.params.id;
    contactBook.updateOne({"_id": mongoose.Types.ObjectId(id)} , {$set: req.body }, function (err, result) {
        if(err) {
            res.send(err);
        } else {
            res.send("updated details");
        }
    })
});

// delete the contact
app.delete('/delete/:id' ,(req,res) => {
    var id = req.params.id;
    contactBook.deleteOne({"_id": mongoose.Types.ObjectId(id) }).then( () => {
        res.send("deleted");
    }).catch( (err) => 
    {
       res.send("err");
    });
});


app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

module.exports = router;