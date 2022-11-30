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

getItemCount: function(itemID) {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT quantity FROM Item WHERE item_id="${itemID}";`
        sql.query(queryString, function (error, result){
            if (error)
                return reject(error);
            // console.log(JSON.stringify(result[0].quantity))
            resolve(JSON.stringify(result[0].quantity))
        });
    });
},
getItem: function(itemID) {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT * From Item WHERE item_id = ${itemID};`
        sql.query(queryString, function(error, result){
            if(error)
                return reject(error);
            resolve(result[0])
        })
    })

},

getStore: function(storeID){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT * From Store WHERE store_id = ${storeID};`
        sql.query(queryString, function(error, result){
            if(error)
                return reject(error);
            resolve(result[0])
        })
    })

},


getStoreIDByItem: function(itemID) {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT store_id From Sold_By WHERE item_id = ${itemID};`
        sql.query(queryString, function(error, result){
            if(error)
                return reject(error);
            if(result.length == 0){
                resolve(null)
            }
            resolve(result[0].store_id)
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

addSoldBy: function(storeID, itemid){
    let queryString = `INSERT INTO Sold_By(store_id, item_id) VALUES (${storeID}, ${itemid});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;      
    })
    console.log("item "+itemid+ " associated with store "+ storeID);
},

deleteSoldBy: function(itemid){
    let queryString = `DELETE FROM Sold_By WHERE item_id=${itemid};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;      
    })
    console.log("item "+itemid+ " deleted from SoldBy ");
},
/*
deleteSoldByForList: function(listid){
    let queryString = `DECLARE @cnt INT = 0;
    WHILE @cnt < (SELECT COUNT(*) FROM Grocery_List WHERE list_id=${listid})
    BEGIN
    DELETE FROM Sold_By WHERE item_id=${itemid}
       SET @cnt = @cnt + 1;
    END; `;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;      
    })
    console.log("item "+itemid+ " deleted from SoldBy ");
},*/

deleteCreates: function(listid){
    let queryString = `DELETE FROM Creates WHERE list_id=${listid};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;      
    })
    console.log("list "+listid+ " deleted from Creates ");
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
        
        
    })
},
getFavoriteInfo: function(listid){
    return new Promise((resolve, reject) => {
        let QueryString = `SELECT list_id,list_name,last_update FROM Grocery_List WHERE list_id=${listid};`
        sql.query(QueryString, function(error, result){
            if (error)
                reject(error)
            resolve(result)
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

updateItem: function (itemID, description, price, quantity, purchaseDate, expirationDate, category,  belongsTo){
    let queryString = `UPDATE Item SET description="${description}", price=${price}, quantity=${quantity}, purchase_date="${purchaseDate}", expiration_date="${expirationDate}", category="${category}", belongs_to=${belongsTo} WHERE item_id=${itemID};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;    
    console.log("Item added with list id", belongsTo);
    })
},

deleteItem: function (itemID){
    let queryString = `DELETE FROM Item WHERE item_id=(${itemID});`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
    })
},

deleteItemWithListID: function (listid){
    let queryString = `DELETE FROM Item WHERE belongs_to=${listid};`;

    sql.query(queryString, function(error, result){
        if (error)
            throw error;
        
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

addFavorites: function(userID, listid){
    let queryString = `INSERT INTO Favorites(user_id, list_id) VALUES(${userID}, ${listid});`
    //`INSERT INTO Favorites (user_id, item_id)
      //  SELECT (description, price, quantity, purchase_date, expiration_date, category, belongs_to) FROM Item WHERE Item.item_id=${itemID};`
    sql.query(queryString, function(error, result){
        if(error)
            throw error;
    })
    console.log("list "+listid+ " added to favorites ");
},

deleteFavorites: function(listid){
    let queryString = `DELETE FROM Favorites WHERE list_id=${listid};`;
    sql.query(queryString, function(error, result){
        if(error)
            throw error;
    })
    console.log("list "+listid+ " deleted from favorites ");
},

viewFavorites: function (userID){
    return new Promise((resolve, reject) => {
        let queryString = `SELECT DISTINCT * FROM Favorites WHERE user_id=${userID};`;

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

viewBelongsTo: function (itemID) {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT list_id FROM Belongs_To WHERE item_id=${itemID};`;

        sql.query(queryString, function(error, result){
            if (error)
                return reject(error);
            if(result.length == 0)
                resolve(null)
            else{
                resolve(JSON.stringify(result[0].list_id));
            }
        })
    })
},

addBelongsTo: function(listid, itemid){
    let queryString = `INSERT INTO Belongs_To(list_id,item_id) VALUES(${listid}, ${itemid});`
    sql.query(queryString, function(error, result){
        if(error)
            throw error;
    })
    console.log("Added into BelongsTo");
},

deleteBelongsToWithItemID: function(itemid){
    let queryString = `DELETE FROM Belongs_To WHERE item_id=${itemid};`
    sql.query(queryString, function(error, result){
        if(error)
            throw error;
    })
    console.log("Deleted from BelongsTo");
},

deleteBelongsToWithListID: function(listid){
    let queryString = `DELETE FROM Belongs_To WHERE list_id=${listid};`
    sql.query(queryString, function(error, result){
        if(error)
            throw error;
    })
    console.log("Deleted from BelongsTo");
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
