var http = require("http");
var qs_Customer = require("../Controllers/customers");
var qs_Products = require("../products");
var settings = require("../settings");
var httpMsgs = require("../httpMsgs");

http.createServer(function(req, resp){
	switch (req.method){
		case "GET":
			if (req.url === "/") {
                httpMsgs.showHome(req, resp);
				
			}
			else if (req.url === "/qs_Customer") {
			    qs_Customer.getList(req, resp);
			}
            else{
                var customerNumberPattern = "[0-9]+"; // $CustomerNumber = Cell Number
                var Pattern = new RegExp("/qs_Customer/" + customerNumberPattern);
                if (Pattern.test(req.url)) {
                    Pattern = new RegExp(customerNumberPattern);
                    var CustomerNumber =
                        Pattern.exec(req.url);
                    qs_Customer.get(req, resp, CustomerNumber);
                }
                else{
                    httpMsgs.show404(req, resp);
                }
            }
			break;
		case "POST":
            if (req.url === "/qs_Customer"){
            var reqBody = '';
            req.on("data", function (data){
                reqBody += data;
                if(reqBody.length > 1e7) // 10MB
                {  
                    httpMsgs.show413(req, resp);   
                }
                   
            });
            req.on("end", function(){
                qs_Customer.add(req, resp, reqBody);
            });    
            }
            else{
                httpMsgs.show404(req, resp);
            }
			break;
		case "PUT":
		    if (req.url === "/qs_Customer") {
             var reqBody = '';
            req.on("data", function (data){
                reqBody += data;
                if(reqBody.length > 1e7) // 10MB
                {  
                    httpMsgs.show413(req, resp);   
                }
                   
            });
            req.on("end", function(){
                qs_Customer.update(req, resp, reqBody);
            });    
            }
            else{
                httpMsgs.show404(req, resp);   
            }
			break;
		case "DELETE":
		    if (req.url === "/qs_Customer") {
            var reqBody = '';
            req.on("data", function (data){
                reqBody += data;
                if(reqBody.length > 1e7) // 10MB
                {  
                    httpMsgs.show413(req, resp);   
                }
                   
            });
            req.on("end", function(){
                qs_Customer .delete(req, resp, reqBody);
            });        
            }
            else{
                httpMsgs.show404(req, resp);
            }
			break;
		default:
            httpMsgs.show405(req, resp);
			break;
	}
}).listen(settings.webPort, function (){
	console.log("Quickspaza listening at;" + settings.webport);
});