var express = require('express');
var app = express();
var cors = require('cors');

var rtg   = require("url").parse(process.env.REDISTOGO_URL);
var redis = require('heroku-redis-client').redis.createClient(rtg.port, rtg.hostname);

redis.auth(rtg.auth.split(":")[1]);

redis.set('pedals', 0);
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(express.static(__dirname + '/public'));


app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

app.get('/pedals', function (req, res, next) {
	redis.get("pedals", function (err, reply) {
        res.json({ some: reply });
    });
});

app.get('/increment_pedals/:pedals', function (req, res, next) {
	pedals = req.param("pedals")

	redis.get("pedals", function (err, reply) {
		redis.set('pedals', parseInt(reply) + parseInt(pedals));
        res.json({ some: reply });
    });
});

//comment
