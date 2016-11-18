'use strict'
//__________Import Modules
const express    = require( 'express' )
const router     = express.Router(  )
const session    =  require( 'express-session' )
const bodyParser =  require( 'body-parser' )
const Sequelize  =  require( 'sequelize' )
const bcrypt     =  require( 'bcrypt-nodejs' )
const db         =  new Sequelize('nodeblog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD,{
	host: 'localhost',
	dialect: 'postgres'
});

//___________Define db's
let User  = db.define( 'user', {
	name: Sequelize.STRING,
	lastname: Sequelize.STRING,
	birthday: Sequelize.STRING,
	email: { type: Sequelize.STRING, unique: true },
	password: Sequelize.STRING
} )

//___________Middleware
router.use (bodyParser.urlencoded({     
	extended: true
})); 

router.use(session({
	secret: 'hushhush',
	resave: true,
	saveUninitialized: false
}));

//__________Homepage
router.get( '/', ( req, res ) => {
	console.log(req.query.message)
	res.render( 'index', {
		message: req.query.message,
		user: req.session.user
	} )
} )

//__________Login 

router.post ( '/login', ( req, respond) => {
	console.log("joehoe")
	let Password = req.body.password

	if(req.body.email.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your email address."));
		return;
	}
	if(req.body.password.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(function (user) {
		bcrypt.compare(Password, user.password, function(err, res) {
			console.log(res)
			if (user !== null && res === true) {
				req.session.user = user;
				respond.redirect('/myposts');
			} else {
				console.log(user.password)
				respond.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
			}
		}, function (error) {
			respond.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
		})
	})
}
)

//__________Logout

router.get('/logout', function (req, res) {
	req.session.destroy(function(error) {
		if(error) {
			throw error;
		}
		res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});

//__________Export module
module.exports = router