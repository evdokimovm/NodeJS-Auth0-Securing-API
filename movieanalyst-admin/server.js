var express = require('express');
var request = require('superagent');

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

app.use(express.static(__dirname + '/public'));

var NON_INTERACTIVE_CLIENT_ID = 'YOUR-AUTH0-CLIENT-ID';
var NON_INTERACTIVE_CLIENT_SECRET = 'YOUR-AUTH0-CLIENT-SECRET';

var authData = {
	client_id: NON_INTERACTIVE_CLIENT_ID,
	client_secret: NON_INTERACTIVE_CLIENT_SECRET,
	grant_type: 'client_credentials',
	audience: 'https://example.com/'
}

function getAccessToken(req, res, next) {
	request
		.post('https://YOUR-AUTH0-DOMAIN.auth0.com/oauth/token')
		.send(authData)
		.end(function(err, res) {
			if (res.body.access_token) {
				req.access_token = res.body.access_token;
				next();
			} else {
				res.send(401, 'Unauthorized');
			}
		})
}

app.get('/', function(req, res) {
	res.render('index');
})

app.get('/movies', getAccessToken, function(req, res) {
	request
		.get('http://localhost:8080/movies')
		.set('Authorization', 'Bearer ' + req.access_token)
		.end(function(err, data) {
			if (data.status == 403) {
				res.send(403, '403 Forbidden');
			} else {
				var movies = data.body;
				res.render('movies', { movies: movies });
			}
		})
})

app.get('/authors', getAccessToken, function(req, res) {
	request
		.get('http://localhost:8080/reviewers')
		.set('Authorization', 'Bearer ' + req.access_token)
		.end(function(err, data) {
			if (data.status == 403) {
				res.send(403, '403 Forbidden');
			} else {
				var authors = data.body;
				res.render('authors', { authors: authors });
			}
		})
})

app.get('/publications', getAccessToken, function(req, res) {
	request
		.get('http://localhost:8080/publications')
		.set('Authorization', 'Bearer ' + req.access_token)
		.end(function(err, data) {
			if (data.status == 403) {
				res.send(403, '403 Forbidden');
			} else {
				var publications = data.body;
				res.render('publications', { publications: publications });
			}
		})
})

app.get('/pending', getAccessToken, function(req, res) {
	request
		.get('http://localhost:8080/pending')
		.set('Authorization', 'Bearer ' + req.access_token)
		.end(function(err, data) {
			if (data.status == 403) {
				res.send(403, '403 Forbidden');
			} else {
				var movies = data.body;
				res.render('pending', { movies: movies });
			}
		})
})

var port = process.env.PORT || 4000
app.listen(port, function() {
	console.log('Node.js listening on port ' + port)
})
