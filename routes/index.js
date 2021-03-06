var express =  require('express');
var knex = require('../config/knex');
// Init app
const app = express();


// Profile Page
app.get('/profile',isLoggedIn,(req,res)=>{
   var user_id = req.session.passport.user;
   knex('user')
             .where('userid',user_id)
             .then(tupple=>{
               res.render('dashboard_profile',{user:tupple[0]});
             });
});

// Trips Of A User
app.get('/trips',isLoggedIn,(req,res)=>{
   var user_id = req.session.passport.user;
       knex('trip')
             .where('userid',user_id)
             .then(tupple=>{
              res.render('dashboard_trips',{trip:tupple});
              //res.send(tupple);
          }); 
});


// filter trips 
app.post('/trips/filter',isLoggedIn,(req,res)=>{
    
   var user_id = req.session.passport.user; 
   console.log(req.body.date);
   knex('trip')
             .where('userid',user_id).andWhere('date',req.body.date).andWhere('modetype',req.body.type)
             .then(tupple=>{
              res.render('dashboard_trips',{trip:tupple,layout:false})
              //res.send(tupple);
          }); 
});

// sort trips 
app.post('/trips/sort',isLoggedIn,(req,res)=>{
   var user_id = req.session.passport.user; 
   var type = req.body.type;
   console.log(type);
   if(type == 'date')
   {
    knex('trip')
             .where('userid',user_id)
             .orderBy('date')
             .then(tupple=>{
              res.render('dashboard_trips',{trip:tupple,layout:false})
          }); 
   }
   else if(type == 'fared')
   {
    knex('trip')
             .where('userid',user_id)
             .orderBy('fare','desc')
             .then(tupple=>{
              res.render('dashboard_trips',{trip:tupple,layout:false})
             // res.send(tupple);
          });
   }
   else
   {
    knex('trip')
             .where('userid',user_id)
             .orderBy('fare')
             .then(tupple=>{
              res.render('dashboard_trips',{trip:tupple,layout:false})
              //res.send(tupple);
          });
   }
});

// Card Details
app.get('/card',isLoggedIn,(req,res)=>{
   var user_id = req.session.passport.user;
    knex('card')
       .where('userid',user_id)
       .then(tupple=>{
            res.render('dashboard_card',{card :tupple[0]});
       });
});

// add money to your card
app.post('/addmoney',isLoggedIn,(req,res)=>{
    res.send({amount :req.body.amount});
});

// Recharge History
app.get('/history',isLoggedIn,(req,res)=>{
   var user_id = req.session.passport.user;
    knex('rechargedby')
      .where('userid',user_id)
      .then(tupple=>{
        //res.send(tupple);
         res.render('dashboard_recharges',{history : tupple});
      });
});

// filter recharge history
app.post('/history/filter',isLoggedIn,(req,res)=>{
    
   var user_id = req.session.passport.user; 
   knex('rechargedby')
             .where('userid',user_id).andWhere('rechargedate',req.body.date)
             .then(tupple=>{
              res.render('dashboard_recharges',{history:tupple,layout:false})
              //res.send(tupple);
          }); 
});

// sort Recharge History
app.post('/history/sort',isLoggedIn,(req,res)=>{
    
   var user_id = req.session.passport.user; 
   var type = req.body.type;
   if(type == 'date')
   {
    knex('rechargedby')
             .where('userid',user_id)
             .orderBy('rechargedate')
             .then(tupple=>{
              res.render('dashboard_recharges',{history:tupple,layout:false})
              //res.send(tupple);
          }); 
   }
   else if(type == 'amountd')
   {
    knex('rechargedby')
             .where('userid',user_id)
             .orderBy('amount','desc')
             .then(tupple=>{
              res.render('dashboard_recharges',{history:tupple,layout:false})
              //res.send(tupple);
          });
   }
   else
   {
    knex('rechargedby')
             .where('userid',user_id)
             .orderBy('amount')
             .then(tupple=>{
              res.render('dashboard_recharges',{history:tupple,layout:false})
              //res.send(tupple);
          });
   }
});

module.exports = function(passport){
	return app;
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
		return next();
  res.redirect('/');
}