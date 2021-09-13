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
const users = require("./models/Users");

app.set('views', __dirname + '/views');

// allows the data from frontend to come in json format
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// the connection of database and backend
mongoose.connect("mongodb+srv://upcredUser:upcred@cluster0.dbnu5.mongodb.net/UpCred-Application?retryWrites=true&w=majority" , {
    useNewUrlParser: true , useUnifiedTopology: true}
);



app.get('/login' , (req,res) => {
    res.render("login.ejs");
})

app.post('/login' , (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    users.findOne({email: email}).then((user) => {
        if(!user){
            res.redirect("/signup")
        }
        else{
            if(user.password === password){
                res.redirect("/")
            }else{
                res.redirect("/login");
            }
        }
    })
})

app.get('/signup' , (req,res) => {
    res.render("signup.ejs");
})

app.post('/signup' , async ( req,res) => {
    const user = new users(req.body);
    try {
        const result = await user.save();
        res.redirect('/');
    } catch (error) {
        res.send(error);
    }

    // res.send("Signup completed");
   
})

app.get('/' , (req,res) => {

    res.render("details.ejs")
});

app.post('/newdetails' , async (req,res) => {
    const contact = new contactBook(req.body);
    try {
        const result = await contact.save();
        res.redirect('/');
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
           res.redirect('/search')
        }
    })
});

// delete the contact
app.post('/delete/:id' ,(req,res) => {
    var id = req.params.id;
    contactBook.deleteOne({"_id": mongoose.Types.ObjectId(id) }).then( () => {
        res.redirect("..");
    }).catch( (err) => 
    {
       res.send("err");
    });
});

// for searching 
app.get('/search' , async (req,res) => {    
    contactBook.find().limit(10).then((result) => {
        res.render("search.ejs", { userData : result });
    });
})

// pagination
app.get('/search/:limitValue', (req,res) => {
    var limitValue = req.params.limitValue;
    contactBook.find().limit(10).skip(limitValue > 0 ? ( ( limitValue - 1 ) * 10 ) : 0).then((result) => {
        res.render("search.ejs", { userData : result  ,  });
    });
})

app.post('/search' , (req,res) => {

    if(req.body.userEmail !== null || req.body.userName !== null){
        if(req.body.userEmail !== null) {
            contactBook.find({"userEmail": req.body.userEmail}).then((result) => {
                res.render("search.ejs", { userData : result });
            });
        }else if(req.body.userName !== null && req.body.userEmail !== null){
            contactBook.find({"userEmail": req.body.userEmail} , {"userName": req.body.userName}).then((result) => {
                res.render("search.ejs", { userData : result });
            });
        }else{
            contactBook.find({"userName": req.body.userName}).then((result) => {
                res.render("search.ejs", { userData : result });
            }).catch((err) => {
                res.send(err);
            });
        }
    }else{
        res.send("please enter atleast one field");
    }
});


app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

module.exports = router;