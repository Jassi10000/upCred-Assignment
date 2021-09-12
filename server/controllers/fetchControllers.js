var contactBook  = require('../models/Contacts');
module.exports={
 
    fetchData:function(req, res){
      
      contactBook.fetchData(function(data){
          res.render('update.ejs',{userData:data});
      })
    }
}
