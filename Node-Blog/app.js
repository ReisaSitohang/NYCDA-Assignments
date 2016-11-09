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

app.set ( 'view engine', 'pug' )
app.set ( 'views', __dirname+'/views')

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

//Define models
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

//Define relations
User.hasMany ( Post )
Post.belongsTo ( User )

//Set express routers
//Homepage/Login-page
app.get( '/', ( req, res ) => {
	res.render( 'index', {
		message: req.query.message,
		user: req.session.user
	} )
} )

//Login route
app.post( '/login', ( req, res ) => {
	if(request.body.emailAddress.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your email address."));
		return;
	}

	if(request.body.pswrd.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}

	User.findOne({
		where: {
			email: request.body.emailAddress
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
} )


//My posts, viewable after login success
app.get( '/myposts', ( req, res ) => {
	var user = request.session.user;
	if (user === undefined) {
		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		response.render('myposts', {
			user: user
		});
	}
} )




//Register route redirect to login
app.get( '/register', ( req, res ) => {
	res.render( 'register' )
} )

app.post( '/register', ( req, res ) => {
	db.sync({force: true}).then( ()=> {
		User.create( {
			name: req.body.firstName,
			lastname: req.body.lastName,
			birthday: req.body.birthDay,
			email: req.body.emailAddress,
			password: req.body.pswrd
		} ).then( ()=> {
		res.redirect( '/' )
		} )
	} )
} )

app.listen( 8000, (  ) => {
	console.log( 'server running' )
} )