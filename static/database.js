const database = require('mysql')

var sql = database.createConnection({
    host: "35.245.66.156",
    database: "grocerylist-cs4750",
    user: "root",
    password: "cs4750project"
})

sql.connect(function(err){
    if (err) throw error;
    console.log("Connected to database");
})

module.exports ={
closeConnection: function (){
    sql.end(() => {
    console.log("DB Connection Closed");
});
},

addAddress: function (addressID, houseNumber, street, city, state, zipCode, aptNumber){
    let queryString = `INSERT INTO Address VALUES(${addressID}, ${houseNumber}, ${street}, ${city}, ${state}, ${zipCode}, ${aptNumber});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

addName: function (nameID, firstName, middleName, lastName){
    let queryString = `INSERT INTO Name VALUES(${nameID}, ${firstName}, ${middleName}, ${lastName});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

addUser: function (userID, nameID, addressID, phoneNum, emailAddr, birthday){
    let queryString = `INSERT INTO User VALUES(${userID}, ${nameID}, ${addressID}, ${phoneNum}, ${emailAddr}, ${birthday});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

deleteUser: function (userID){
    let queryString = `DELETE FROM User WHERE user_id=(${userID});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewUsers: function (){
    let queryString = `SELECT * FROM User;`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

addStore: function (storeID, name, addressID){
    let queryString = `INSERT INTO Store VALUES(${storeID}, ${name}, ${addressID});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

deleteStore: function (storeID){
    let queryString = `DELETE FROM Store WHERE store_id=(${storeID});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewStores: function (){
    let queryString = `SELECT * FROM Store;`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

addList: function (listID, listName, totalItems, lastUpdate, belongsTo){
    let queryString = `INSERT INTO Grocery_List VALUES(${listID}, ${listName}, ${totalItems}, ${lastUpdate}, ${belongsTo});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

deleteList: function (listID){
    let queryString = `DELETE FROM Grocery_List WHERE list_id=(${listID});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewLists: function (){
    let queryString = `SELECT * FROM Grocery_List;`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

addItem: function (itemID, description, price, quantity, purchaseDate, expirationDate, category,  belongsTo){
    let queryString = `INSERT INTO Item VALUES(${itemID}, ${description}, ${price}, ${quantity}, ${purchaseDate}, ${expirationDate}, ${category}, ${belongsTo});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

deleteItem: function (itemID){
    let queryString = `DELETE FROM Item WHERE list_id=(${itemID});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewItems: function (){
    let queryString = `SELECT * FROM Item;`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewFavorites: function (userID){
    let queryString = `SELECT * FROM Favorites WHERE user_id=${userID};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewBuys: function (userID){
    let queryString = `SELECT * FROM Buys WHERE user_id=${userID};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewCreates: function (userID){
    let queryString = `SELECT * FROM Creates WHERE user_id=${userID};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewBelongsTo: function (listID){
    let queryString = `SELECT * FROM Belongs_To WHERE list_id=${listID};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

viewSoldBy: function (storeID){
    let queryString = `SELECT * FROM Sold_By WHERE store_id=${storeID};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},

selectAny: function (tableName){
    let queryString = `SELECT * FROM ${tableName};`

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
        result.forEach(r => {
            console.log(r);
        })
    })
},


}

//selectAny("Creates");
//closeConnection();
