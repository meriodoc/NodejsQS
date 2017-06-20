var db = require("../Core/db");
var httpMsgs = require("../Core/httpMsgs");
var util = require("util"); // built-in util package from nodejs I'm using

exports.getList = function (req, resp) {
    db.executeSql("SELECT * FROM qs_Customer", function (data, err) {
		if (err) {
			httpMsgs.show500(req, resp, err);
		}
		else {
			httpMsgs.sendJson(req, resp, data);
		}	
	});
};

exports.get = function (req, resp, CustomerCode) {
    db.executeSql("SELECT * FROM qs_Customer WHERE CustomerCode=" + CustomerCode, function (data, err) {
        //NEED TO LOOK AT BILALS QUERIES OR ASK ANDREA
    //db.executeSql("SELECT qs.CustomerCode, qs.CustomerName, qs.FirstName, qs.LastName from qs_Customer AS qs WHERE qs.CustomerCode=" + qs.CustomerCode, function (data, err) {
        //SELECT qs.CustomerCode, qs.CustomerName, qs.FirstName, qs.LastName from qs_Customer AS qs;
        // do a left outer join on qs_CustomerAddress to get street etc
            //Ask Andrea about the stored procedures and queries
            //Only GET is important for now until i do add with geo locations
		if (err) {
			httpMsgs.show500(req, resp, err);
		}
		else {
			httpMsgs.sendJson(req, resp, data);
		}	
	});
};

exports.add = function (req, resp, reqBody) {
    try{
        if(!reqBody) throw new Error("Input not valid");
        var data = JSON.parse(reqBody);
        if (data){
            var sql = "INSERT INTO qs_Customer(CustomerCode, CustomerName, FirstName, LastName, MobileNumber, HouseNumber, Street, Area )VALUES";
            // sort out the second placeholder format %d:%s for nvarchar from qs db
            // do a left outer join on qs_CustomerAddress to get street etc
            //Ask Andrea about the stroed procedures and queries
            //Only GET is important for now until i do add with geo locations
            //
            sql+=util.format("( %s:%d, %s, %s, %d, %d, %s, %s)", data.$CustomerNumber, data.$Name, data.$Surname, data.$CellNumber, data.$HouseNumber, data.Street, data.$Area);
            db.executeSql(sql, function (data, err){
                if (err){
                    httpMsgs.show500(req, resp, err);
                }
                else{
                    httpMsgs.send200(req, resp);
                }
            });
        }
        else {
            throw new Error("Input not valid");
            
        }
    }
    catch (ex) {
        httpMsgs.show500(req, resp, ex);      
    }
};

exports.update = function (req, resp, reqBody) {
    try{
        if(!reqBody) throw new Error("Input not valid");
        var data = JSON.parse(reqBody);
        if (data){
            
            if(!data.CustomerCode) throw new Error("Quickspaza customer number not provided  ");
            
            var sql = "UPDATE qs_Customer SET  ";
            var isDataProvided = false;
            
            if (data.CustomerName){
                sql += " CustomerName = '" + data.CustomerName + "', ";
                isDataProvided = true;
            }
            
            if (data.FirstName){
                sql += " FirstName = '" + data.FirstName + "', ";
                isDataProvided = true;
            }
            
            
            if (data.LastName){
                sql += " LastName = '" + data.LastName + "', ";
                isDataProvided = true;
            }
            
            if (data.MobileNumber){
                sql += " MobileNumber = " + data.MobileNumber + ", ";
                isDataProvided = true;
            }
            
            if (data.HouseNumber){
                sql += " HouseNumber = " + data.HouseNumber + ", ";
                isDataProvided = true;
            }
            
            if (data.Street){
                sql += " Street = '" + data.Street + "', ";
                isDataProvided = true;
            }
            
            if (data.Area){
                sql += " Area = '" + data.Area + "', ";
                isDataProvided = true;
            }
            
            sql = sql.splice(0, -1); //To Remove comma from end of QS data sets
            sql += "WHERE CustomerNumber = " + data.CustomerNumber;
            
            db.executeSql(sql, function (data, err){
                if (err){
                    httpMsgs.show500(req, resp, err);
                }
                else{
                    httpMsgs.send200(req, resp);
                }
            });
        }
        else {
            throw new Error("Input not valid");
            
        }
    }
    catch (ex) {
        httpMsgs.show500(req, resp, ex);      
    }
};

exports.delete = function (req, resp, reqBody) {
    try{
        if(!reqBody) throw new Error("Input not valid");
        var data = JSON.parse(reqBody);
        if (data){
            
            if(!data.$CustomerNumber) throw new Error("Quickspaza customer number not provided  ");
            
            var sql = "DELETE from qs_Customer ";
            
            sql += "WHERE $CustomerNumber = " + data.$CustomerNumber;
            
            db.executeSql(sql, function (data, err){
                if (err){
                    httpMsgs.show500(req, resp, err);
                }
                else{
                    httpMsgs.send200(req, resp);
                }
            });
        }
        else {
            throw new Error("Input not valid");
            
        }
    }
    catch (ex) {
        httpMsgs.show500(req, resp, ex);      
    }
};