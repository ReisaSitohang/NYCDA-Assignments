'use strict'
//__________Import modules
const express    = require( 'express' )
const router     = express.Router(  )
const bodyParser =  require( 'body-parser' )
const bcrypt     =  require( 'bcrypt-nodejs' )
const Sequelize  =  require( 'sequelize' )
const db         =  new Sequelize('nodeblog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD,{
						host: 'localhost',
						dialect: 'postgres'
					});

//__________Define db's
let User  = db.define( 'user', {
	name: Sequelize.STRING,
	lastname: Sequelize.STRING,
	birthday: Sequelize.STRING,
	email: { type: Sequelize.STRING, unique: true },
	password: Sequelize.STRING
} )

db.sync({force: false}).then( ()=> {
	console.log("N-sync")
})

//__________Routes

router.get( '/register', ( req, res ) => {
	res.render( 'register', {
		message: req.query.message
		} )
} )

router.post( '/register', ( req, res ) => {
	let password = req.body.pswrd

	console.log(req.body)

	if(req.body.firstName.length === 0) {
		res.redirect('/register?message=' + encodeURIComponent("Please fill out your name."));
		return;
	}
	if(req.body.lastName.length === 0) {
		res.redirect('/register?message=' + encodeURIComponent("Please fill out your last name."));
		return;
	}
	if(req.body.birthDay.length === 0) {
	res.redirect('/register?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}
	if(req.body.emailAddress.length === 0) {
		res.redirect('/register?message=' + encodeURIComponent("Please fill out your email address."));
		return;
	}
	if(req.body.pswrd.length === 0) {
		res.redirect('/register?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}
	if(req.body.pswrd2.length === 0) {
		res.redirect('/register?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}
	if(req.body.pswrd2 !== req.body.pswrd) {
		res.redirect('/register?message=' + encodeURIComponent("Your passwords don't match, please re-enter."));
		return;
	}

	bcrypt.hash(password, null, null, (err, hash)=> {
		User.create( {
			name: req.body.firstName,
			lastname: req.body.lastName,
			birthday: req.body.birthDay,
			email: req.body.emailAddress,
			password: hash
		} ).then( ()=> {
			res.redirect( '/' )
			throw 'error'
		} ).catch((err)=>{
			var error="Error"
			res.render('register',{error, usedemail: req.body.emailAddress, })
			console.log(req.body.emailAddress+"already exists")
		})
	})
} )

//__________Export module
module.exports = router