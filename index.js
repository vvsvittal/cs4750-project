
const db = require('./static/database.js')

const path = require('path')
const express = require('express')
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

router.get('/test', (req,res) => {
    res.sendFile(__dirname+"/index.html")
})

router.get('/', (req, res) => {
    res.send("hello world")
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


