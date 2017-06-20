var db = require("../Core/db");
var httpMsgs = require("../Core/httpMsgs");
var util = require("util"); // built-in util package from nodejs

exports.getList = function (req, resp) {
    db.executeSql("SELECT * FROM qs_Product", function (data, err) {
		if (err) {
			httpMsgs.show500(req, resp, err);
		}
		else {
			httpMsgs.sendJson(req, resp, data);
		}	
	});
};

exports.get = function (req, resp, reqBody) {
    db.executeSql("SELECT * FROM qs_Product WHERE ProductCode=" + ProductCode, function (data, err) {
    //NEED TO SEE HOW TO DO QUERY 
        //SELECT qs.ProductCode, qs.ProductGroup, qs.ProductDescription, qs.ProductID from qs_Product AS qs;
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
            var sql = "INSERT INTO qs_Customer($CustomerNumber, $Name, $Surname, $CellNumber, $HouseNumber, $Street, $Area )VALUES";
            sql+=util.format("(%d, %s, %s, %d, %d, %s, %s)", data.$CustomerNumber, data.$Name, data.$Surname, data.$CellNumber, data.$HouseNumber, data.Street, data.$Area);
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
            
            if(!data.$CustomerNumber) throw new Error("Quickspaza customer number not provided  ");
            
            var sql = "UPDATE qs_Customer SET  ";
            var isDataProvided = false;
            
            if (data.$Name){
                sql += " $Name = '" + data.$Name + "', ";
                isDataProvided = true;
            }
            
            if (data.$Surname){
                sql += " $Surname = '" + data.$Surname + "', ";
                isDataProvided = true;
            }
            
            if (data.$CellNumber){
                sql += " $CellNumber = " + data.$CellNumber + ", ";
                isDataProvided = true;
            }
            
            if (data.$HouseNumber){
                sql += " $HouseNumber = " + data.$HouseNumber + ", ";
                isDataProvided = true;
            }
            
            if (data.$Street){
                sql += " $Street = '" + data.$Street + "', ";
                isDataProvided = true;
            }
            
            if (data.$Area){
                sql += " $Area = '" + data.$Area + "', ";
                isDataProvided = true;
            }
            
            sql = sql.splice(0, -1); //To Remove comma from end of QS data sets
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