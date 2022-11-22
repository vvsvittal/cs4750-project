const database = require('mysql')

const sql = database.createConnection({
    host: "35.245.66.156",
    database: "grocerylist-cs4750",
    user: "root",
    password: "cs4750project"
})

sql.connect(function(err){
    if (err) throw error;
    console.log("Connected to database");
})

sql.query('SELECT * FROM Address', function(error, result){
    if (error)
        throw error;
    
    result.forEach(r => {
        console.log(r);
    })
})

sql.end(() => {
    console.log("DB Connection Closed");
});