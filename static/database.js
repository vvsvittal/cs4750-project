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

addStore: function (name, addressID){
    let queryString = `INSERT INTO Store(name, address_id) VALUES("${name}", ${addressID});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
    console.log(name + " added");
    })
},

getStoreID: function(storename, addyId){
   return new Promise((resolve, reject) => {
        let queryString = `SELECT store_id FROM Store WHERE name="${storename}" AND address_id=${addyId};`
        sql.query(queryString, function (error, result){
            if (error)
                return reject(error);
            resolve(JSON.stringify(result[0].store_id))
        });
    });
},


getItemId: function(desc, belongs){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT item_id FROM Item WHERE description="${desc}" AND belongs_to=${belongs};`
        sql.query(queryString, function (error, result){
            if (error)
                return reject(error);
            resolve(JSON.stringify(result[0].item_id))
        });
    });
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

addSoldBy: function(storeID, itemid){
    let queryString = `INSERT INTO Sold_By(store_id, item_id) VALUES (${storeID}, ${itemid});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;      
    })
    console.log("item "+itemid+ " associated with store "+ storeID);
},

addList: function (listName, totalItems, lastUpdate, belongsTo){
    let queryString = `INSERT INTO Grocery_List(list_name, total_items, last_update, belongs_to) VALUES("${listName}", ${totalItems}, "${lastUpdate}", ${belongsTo});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;      
    })
    console.log("List added with user id", belongsTo);
},

getTotalItems: function(listID){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT total_items FROM Grocery_List WHERE list_id = ${listID};`;

        sql.query(queryString, function(error, result){
            if (error)
                return reject(error);
            resolve(result[0].total_items);      
    })
    })
},

updateList: function (totalItems, lastUpdate, list_id){
    let queryString = `UPDATE Grocery_List SET total_items=${totalItems}, last_update="${lastUpdate}" WHERE list_id=${list_id};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;      
    })
    console.log("List updated with list id", list_id);
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

viewListsByUser: function (userid){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT * FROM Grocery_List WHERE belongs_to =${userid};`;

        sql.query(queryString, function(error, result){
            if (error)
                return reject(error);
            if(result.length == 0)
                resolve(null)
            else{
                resolve(result);
            }
        })
    })
},

addItem: function (description, price, quantity, purchaseDate, expirationDate, category,  belongsTo){
    let queryString = `INSERT INTO Item(description, price, quantity, purchase_date, expiration_date, category, belongs_to) VALUES("${description}", ${price}, ${quantity}, "${purchaseDate}", "${expirationDate}", "${category}", ${belongsTo});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;    
    console.log("Item added with list id", belongsTo);
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

viewItems: function (listID){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT * FROM Item WHERE belongs_to=${listID};`;

        sql.query(queryString, function(error, result){
            if (error)
                return reject(error);
            if(result.length == 0)
                resolve(null)
            else{
                resolve(result);
            }
        })
    })
},

viewFavorites: function (userID){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT * FROM Favorites WHERE user_id=${userID};`;

        sql.query(queryString, function(error, result){
            if (error)
                return reject(error);
            if(result.length == 0)
                resolve(null)
            else{
                resolve(result);
            }
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

addCreates: function(userID, listid){
    let queryString = `INSERT INTO Creates(user_id, list_id) VALUES(${userID}, ${listid});`
    sql.query(queryString, function(error, result){
        if(error)
            throw error;
    })
},

getListId: function(listname, user_id){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT list_id FROM Grocery_List WHERE list_name="${listname}" AND belongs_to=${user_id};`;

        sql.query(queryString, function(error, result){
            if (error)
                return reject(error)
            resolve(result[0].list_id);
        })
    })
},

viewBelongsTo: function (listID) {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT item_id FROM Belongs_To WHERE list_id=${listID};`;

        sql.query(queryString, function(error, result){
            if (error)
                return reject(error);
            if(result.length == 0)
                resolve(null)
            else{
                resolve(result);
            }
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
