require('./database.js')
const express = require('express')
const app = express()
const router = express.Router()
const port = 3000

// EXPRESS SERVER CONFIG
app.use('/', router)

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




