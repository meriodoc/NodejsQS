// Quickspaza Messages

var settings = require("../settings");

// 500 Internal Error
exports.show500 = function (req, resp, err) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(500, "QS Internal Error occurred", { "Content-Type": "text/html" });
        resp.write("<html><head><title>500</title></head><body>500 Internal Error. Details: " + err + "</body></html>");
    }
    else {
        resp.writeHead(500, "QS Internal Error occurred", {"Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "ERROR occurred:" + err}));
    }
    resp.end();
};

exports.sendJson = function (req, resp, data) {
    resp.writeHead(200, { "Content-Type": "application/json" });
    if (data) {
        resp.write(JSON.stringify(data));
    }
    resp.end();
};

// 405 Method Not supported
exports.show405 = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(405, "QS Method not supported", { "Content-Type": "text/html" });
        resp.write("<html><head><title>405</title></head><body>405: QS Method not supported </body></html>");
    }
    else {
        resp.writeHead(405, "QS Method not supported", {"Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "QS Method not supported"}));
    }
    resp.end();
};

// 404 Not found
exports.show404 = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(404, "QS Resource not found", { "Content-Type": "text/html" });
        resp.write("<html><head><title>404</title></head><body>404: QS Resource not found </body></html>");
    }
    else {
        resp.writeHead(404, "QS Resource not found", {"Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "QS Resource not found"}));
    }
    resp.end();
};

// 413 QS REQUEST Entity too large - Overload
exports.show413 = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(413, "QS Request Entity too large", { "Content-Type": "text/html" });
        resp.write("<html><head><title>413</title></head><body>413: QS Request Entity too large </body></html>");
    }
    else {
        resp.writeHead(413, "QS Request Entity too large", {"Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "QS Request Entity too large"}));
    }
    resp.end();
};

// This is to be able to see when CRUD operations are done  - No data in it
exports.send200 = function (req, resp) {
        resp.writeHead(200, { "Content-Type": "application/json" });
        resp.end();
};

// Show home page - this is just to help the QS user. I will use this for customer lookup/Search at confirm order page to be implemented into that DIV

exports.showHome = function(req, resp);
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(200, { "Content-Type": "text/html" });
        resp.write("<html><head><title>Home</title></head><body>Valid endpoints: <br> /Customers - GET - To list all customers<br>/customers/cusno - GET - To search for a customer with 'cusno'</body></html>");
    }
    else {
        resp.writeHead(200, {"Content-Type": "application/json" });
        resp.write(JSON.stringify([
            { url: "/customers", operation: "GET", description: "To list all customers" },
            { url: "/customers/<cusno>", operation: "GET", description: "Search for a customer" }
        ]));
    }
    resp.end();
};
