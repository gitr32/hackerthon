// modules =================================================
const express        = require('express');
const app            = express();

const bodyParser     = require('body-parser');
const methodOverride = require('method-override');

const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// configuration ===========================================
	
// config files
//var db = require('./config/db');

const port = process.env.PORT || 8080; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
  
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);

      //Push message to connected clients that are listening in.     
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
      ws.send(message);
    });
  
    //ws.send('helloworld');
  });
  
  server.listen(8081, function listening() {
    console.log('Listening on %d', server.address().port);
  });