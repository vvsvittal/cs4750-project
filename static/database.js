const database = require('mysql')
const bcrypt = require("bcrypt")

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

addAddress: function (houseNumber, street, city, state, zipCode, aptNumber){
    let queryString = `INSERT INTO Address(house_number, street, city, state, zip_code, apt_number) VALUES(${houseNumber}, "${street}", "${city}", "${state}", ${zipCode}, "${aptNumber}");`;
    sql.query(queryString, function(error, result){
        if (error)
            throw error;
    })
},

getAddressID: function(houseNumber, street, city, state, zipCode, aptNumber){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT address_id FROM Address WHERE house_number = ${houseNumber} AND street = "${street}" AND city = "${city}" AND state = "${state}" AND zip_code = "${zipCode}" AND apt_number = "${aptNumber}";`;
        sql.query(queryString, function(error, result){
        if (error)
            return reject(error);
        resolve(JSON.stringify(result[0].address_id));
    });
});
    
},

addName: function (firstName, middleName, lastName){

    let queryString = `INSERT INTO Name(first_name, middle_name, last_name) VALUES("${firstName}", "${middleName}", "${lastName}");`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
    })
},

getNameID: function(firstName, middleName, lastName){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT name_id FROM Name WHERE first_name = "${firstName}" AND middle_name = "${middleName}" AND last_name = "${lastName}";`
        sql.query(queryString, function (error, result){
            if (error)
                return reject(error);
            resolve(JSON.stringify(result[0].name_id))
        });
    });
},

addUser: function (nameID, addressID, phoneNum, emailAddr, birthday, pwd){

    bcrypt.hash(pwd, 10).then(hashed => {
        let queryString = `INSERT INTO User(name_id, address_id, phone_number, email, birthdate, pwd) VALUES(${nameID}, ${addressID}, "${phoneNum}", "${emailAddr}", "${birthday}", "${hashed}");`;
    
        sql.query(queryString, function(error, result){
            if (error)
                throw error;
    })
        console.log("User added with pass", hashed);
});
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

getPwdByEmail: function(emailAddr){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT pwd FROM User WHERE email = "${emailAddr}";`
        sql.query(queryString, function(error, result){
            if (error)
                return reject(null);
            if(result.length != 0)
                resolve(result[0].pwd);
            else
                resolve(null)
        })
    });
},

getIdByEmail: function(emailAddr){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT user_id FROM User WHERE email = "${emailAddr}";`
        sql.query(queryString, function(error, result){
            if (error)
                return reject(null);
            if(result.length != 0) {
                console.log(result[0].user_id)
                resolve(result[0].user_id);
            }
            else
                resolve(null)
        })
    });
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

addList: function (listName, totalItems, lastUpdate, belongsTo){
    let queryString = `INSERT INTO Grocery_List(list_name, total_items, last_update, belongs_to) VALUES("${listName}", ${totalItems}, "${lastUpdate}", ${belongsTo});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;      
    })
    console.log("List added with user id", belongsTo);
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

addItem: function (description, price, quantity, purchaseDate, expirationDate, category,  belongsTo){
    let queryString = `INSERT INTO Item(description, price, quantity, purchase_date, expiration_date, category, belongs_to) VALUES(${description}, ${price}, ${quantity}, ${purchaseDate}, ${expirationDate}, ${category}, ${belongsTo});`;

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
