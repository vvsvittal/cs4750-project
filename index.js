

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
  let newlst = JSON.stringify(req.body);
  let parsed = JSON.parse(newlst);
  var todayDate = new Date().toISOString().slice(0, 10);
  console.log(req.session.username)
  db.addList(parsed.list_name,todayDate,req.session.userid);
  res.end();
})

router.get('/lists', (req, res) => {
  res.sendFile(__dirname+"/lists.html")
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

