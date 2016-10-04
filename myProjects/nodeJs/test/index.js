/**
 * Created by hubert lin2 on 2016/9/28.
 */

var http = require("http");

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(1234);