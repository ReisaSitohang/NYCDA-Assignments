'use strict'
//__________Import modules
const express    = require( 'express' )
const router     = express.Router(  )
const session    =  require( 'express-session' )
const bodyParser =  require( 'body-parser' )
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

let Post = db.define( 'post', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT,
} )


//__________Define relations

User.hasMany ( Post )
Post.belongsTo ( User )


//__________Set Routes

router.get( '/createpost', ( req, res ) => {
	var user = req.session.user;
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		res.render('createpost', {
			user: user
		});
	}
} )

router.post( '/redirectcreatepost', ( req, res ) => {
	var user = req.session.user;
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		User.findOne({
			where: {
				id: user.id
			}
		}).then	( user =>{
			user.createPost({
				title: req.body.title,
				body: req.body.bericht
			})
		}).then ( post =>{
			console.log(post)
			res.redirect('myposts')
		})	
	}
} )

module.exports = router