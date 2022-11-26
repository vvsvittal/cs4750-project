

const db = require('./static/database.js')

const path = require('path')
const express = require('express')
const session = require('express-session')
const hasher = require('bcrypt')

const app = express()
const router = express.Router()
const port = 3000

app.use(session({
	secret: 'authSecret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
// EXPRESS SERVER CONFIG
app.use('/', router)
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(express.static(path.join(__dirname, 'static')));


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

//URL ROUTES

router.get('/', (req,res) => {
    res.sendFile(__dirname+"/index.html")
})

router.get('/signup', (req, res) => {
  res.sendFile(__dirname+"/signup.html")
})

router.get('/home', (req, res) => {
  if(req.session.loggedin)
    res.sendFile(__dirname+"/welcome.html")
  else
    res.send("Please Log in before trying this action")
})

router.get('/home/newlist', (req, res) => {
  res.sendFile(__dirname+"/new_list.html")
})

router.post('/home/newlist', (req, res) => {
  let stringified = JSON.stringify(req.body);
  let body = JSON.parse(stringified);
  var todayDate = new Date().toISOString().slice(0, 10);
  console.log(req.session.username)
  db.addList(body.list_name,parseInt(0),todayDate,parseInt(req.session.userid));
  res.redirect('/home')
  res.end();
})

router.get('/home/newitem/:listID', (req, res) => {
  res.sendFile(__dirname+"/new_item.html")
})

router.post('/home/newitem', (req, res) => { //description, price, quantity, purchaseDate, expirationDate, category,  belongsTo
  let stringified = JSON.stringify(req.body);
  let body = JSON.parse(stringified);
  db.addItem(body.description,body.price,body.quantity,body.purchase_date, body.expiration_date, body.category, body.belongs_to);
  var todayDate = new Date().toISOString().slice(0, 10);
  db.getTotalItems(body.belongs_to).then(curCount => {
    let updatedCount = parseInt(curCount)+parseInt(body.quantity);
    db.updateList(updatedCount, todayDate, body.belongs_to);
    db.addAddress(body.street_number, body.street, body.city, body.state, body.zip, body.unit);
    db.getAddressID(body.street_number, body.street, body.city, body.state, body.zip, body.unit).then(addyId => {
      db.addStore(body.store_name, addyId);
      db.getStoreID(body.store_name, addyId).then(storeID => {
        db.getItemId(body.description, body.belongs_to).then(itemid => {
           db.addSoldBy(storeID, itemid)
        })
      })
    })
    res.redirect('/home')
    res.end();
  })

})

router.get('/list/:listID', (req, res) => {
  // res.send("List ID is " + req.params.listID);
  res.sendFile(__dirname+"/listView.html")
})

router.post('/login/validate', (req,res) => {
  let str = JSON.stringify(req.body);
  let parsed = JSON.parse(str), user=parsed.username, pw=parsed.password;
  db.getIdByEmail(user).then(val => {
    db.getPwdByEmail(user).then(out => {
      hasher.compare(pw, out).then(isValid => {
        if (isValid){
          req.session.loggedin = true;
          req.session.username = user;
          req.session.userid = val;
          res.redirect('/home')
          return
        }
        else
          res.send("Incorrect Username/Password");
      })
  })
  }) 

});
router.get('/favorites', (req, res) => {
  res.sendFile(__dirname+"/favorites.html")
})

router.get('/about', (req, res) => {
  res.sendFile(__dirname+"/about.html")
})

router.get('/getFavorites', (req,res) => {
  db.viewFavorites(320).then(favs => {
    console.log(favs);
    res.send(JSON.stringify(favs));
  })
})

router.get('/getMyLists', (req, res) => {
  db.viewListsByUser(req.session.userid).then(lists => {
    res.send(JSON.stringify(lists))
  })
})

router.get('/getMyItems/:listID', (req, res) => {
  console.log(req.params.listID);
  db.viewItems(req.params.listID).then(items => {
    res.send(JSON.stringify(items))
  })
})

router.get('/logout', (req,res) => {
  if(req.session.loggedin){
    req.session.loggedin = false;
    res.redirect('/')
  }
  else
    res.send("Please Log in before trying this action")

})

router.post('/signup', (req, res) => {
  let stringified = JSON.stringify(req.body)
  let body = JSON.parse(stringified);
  console.log(body)
  db.addName(body.firstName, body.middleName, body.lastName);
  db.addAddress(body.houseNumber, body.street, body.city, body.state, body.zipcode, body.aptNumber);
  db.getNameID(body.firstName, body.middleName, body.lastName).then(nameID => {
    db.getAddressID(body.houseNumber, body.street, body.city, body.state, body.zipcode, body.aptNumber).then(addrID => {
      db.addUser(nameID, addrID, body.phoneNum, body.email, body.birthday, body.pwd);
    })
  })
  res.redirect('/')
  res.end();
})
