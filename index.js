
const db = require('./static/database.js')

const path = require('path')
const express = require('express')
const passport = require('passport')
const { getAddressID } = require('./static/database.js')
const app = express()
const router = express.Router()
const port = 3000

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
  res.sendFile(__dirname+"/welcome.html")
})

router.get('/lists', (req, res) => {
  res.sendFile(__dirname+"/lists.html")
})



// TO GET USERS?
// router.get('/users', (req,res) => {
//   res.send(db.viewUsers());
// })

router.post('/api/select', (req,res) => {
  console.log(req.body.textbox);
  db.selectAny(req.body.textbox);
  res.end();
})

router.post('/login/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));

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
  res.end();
})