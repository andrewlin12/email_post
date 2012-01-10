var email = require('emailjs');
var http = require('http');

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
                console.log(arguments);
                return;
            }
            console.log("Sent!!");
        });
        console.log("Received a request");
        console.log(data);
        console.log("Sending to " + destinationEmail + "...");

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('OK\n');
    });

}).listen(port, '0.0.0.0');
console.log('Listening on port ' + port + '...');
