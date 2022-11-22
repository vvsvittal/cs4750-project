import 'bootstrap';

const db = require('./static/database.js')

const path = require('path')
const express = require('express')
const app = express()
const router = express.Router()
const port = 3000

app.use(express.urlencoded({ extended: true }));
// EXPRESS SERVER CONFIG
app.use('/', router)

app.use(express.static(path.join(__dirname, 'static')));


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})



//URL ROUTES

router.get('/test', (req,res) => {
    res.sendFile(__dirname+"/index.html")
})

router.get('/', (req, res) => {
    res.send("hello world")
})

router.get('/home', (req, res) => {
  res.sendFile(__dirname+"/welcome.html")
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


