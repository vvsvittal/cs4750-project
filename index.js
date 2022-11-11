const express = require('express')
const app = express()
const router = express.Router()
const port = 3000

app.use('/', router)

router.get('/test', (req,res) => {
    res.sendFile(__dirname+"/index.html")
})

router.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


