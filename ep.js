var email = require('emailjs');
var http = require('http');
var querystring = require('querystring');
var url = require('url');

var username = process.env.EP_USERNAME;
var password = process.env.EP_PASSWORD;
var destinationEmail = process.env.EP_DEST || username;
var port = parseInt(process.env.EP_PORT, 10) || 3001;

if (!username || !password) {
    console.log("Please specify EP_USERNAME and EP_PASSWORD for your Gmail account");
    process.exit(1);
}

http.createServer(function(req, res) {
    var data = '';

    req.on('data', function(chunk) {
        data += chunk.toString();
    });

    req.on('end', function() {
        if (req.url.indexOf('/set_dest') === 0) {
            var urlParts = url.parse(req.url).query;
            destinationEmail = querystring.parse(urlParts)["email"]
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Set to ' + destinationEmail);
            return;
        }

        var server = email.server.connect({
            user: username,
            password: password,
            host: 'smtp.gmail.com',
            ssl: true
        });

        server.send({
            text: data,
            from: username,
            to: destinationEmail,
            subject: "A POST for you"
        }, function(err, message) {
            if (err) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(JSON.stringify(arguments));
                return;
            }
            console.log("Sent!!");

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('OK\n');
         });
        console.log("Received a request");
        console.log(data);
        console.log("Sending to " + destinationEmail + "...");
   });

}).listen(port, '0.0.0.0');
console.log('Listening on port ' + port + '...');
