'use strict'
//import modules
const express    = require ( 'express' )
const app        = express( )
const bodyParser = require('body-parser')
const Sequelize  = require('sequelize');
const session    = require('express-session')
const db         = new Sequelize('nodeblog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD,{
	host: 'localhost',
	dialect: 'postgres'
});

//set views
app.set('views', './views');
app.set('view engine', 'pug');

//middlewares
app.use (express.static(__dirname + '/public'))
app.use (bodyParser.urlencoded({     
  extended: true
})); 
app.use(session({
	secret: 'hushhush',
	resave: true,
	saveUninitialized: false
}));

//Define database structure
let User  = db.define( 'user', {
	name: Sequelize.STRING,
	lastname: Sequelize.STRING,
	birthday: Sequelize.STRING,
	email: { type: Sequelize.STRING, unique: true },
	password: Sequelize.STRING
} )

let Post = db.define( 'post', {
	title: Sequelize.STRING,
	body: Sequelize.STRING,
} )

//___________Define relations______________
User.hasMany ( Post )
Post.belongsTo ( User )

//____________Set express routers________________

app.get( '/', ( req, res ) => {
	res.render( 'index1', {
		message: req.query.message,
		user: req.session.user
	} )
} )

app.get( '/myposts', ( req, res ) => {
	var user = req.session.user;
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		res.render('myposts1', {
			user: user
		});
	}
} )

app.post('/login', function (request, response) {
	if(request.body.email.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your email address."));
		return;
	}

	if(request.body.password.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}

	User.findOne({
		where: {
			email: request.body.email
		}
	}).then(function (user) {
		if (user !== null && request.body.password === user.password) {
			request.session.user = user;
			response.redirect('/myposts');
		} else {
			response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
		}
	}, function (error) {
		response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
	});
});

app.get('/logout', function (request, response) {
	request.session.destroy(function(error) {
		if(error) {
			throw error;
		}
		response.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});

//Register route, after registering redirect to login
app.get( '/register', ( req, res ) => {
	res.render( 'register' )
} )

app.post( '/register', ( req, res ) => {
	db.sync({force: false}).then( ()=> {
		User.create( {
			name: req.body.firstName,
			lastname: req.body.lastName,
			birthday: req.body.birthDay,
			email: req.body.emailAddress,
			password: req.body.pswrd
		} ).then( ()=> {
		res.redirect( '/' )
		throw 'error'
		} ).catch((err)=>{
			var error="Error"
		res.render('register',{error, usedemail: req.body.emailAddress, })
		console.log(req.body.emailAddress+"already exists")
		})
	} )
} )

app.listen(3000, function () {
			console.log('Example app listening')
} )