'use strict'

const express    = require( 'express' )
const router     = express.Router(  )
const session    =  require( 'express-session' )
const bodyParser =  require( 'body-parser' )
const Sequelize  =  require( 'sequelize' )
const db         =  new Sequelize('nodeblog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD,{
						host: 'localhost',
						dialect: 'postgres'
					});

//_________Define db____________
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

let Comment = db.define( 'comment', {
	body: Sequelize.TEXT,
} )

//___________Define relations______________
User.hasMany ( Post )
Post.belongsTo ( User )

Post.hasMany( Comment )
Comment.belongsTo( Post )

User.hasMany( Comment )
Comment.belongsTo( User )

db.sync({force: false}).then( ()=> {
	console.log("N-sync")
})

//__________All posts page_______________

router.get( '/allposts', ( req, res ) => {
	var user = req.session.user;
	if (user === undefined) {
		res.redirect('/');
	} else {
		Post.findAll({
			include: [
			{
				model: User,
				attributes:['name', 'lastname']
			},
			{
				model: Comment,
				attributes:['body'],
				include: [{
					model: User,
					attributes:['name', 'lastname']
				}]
			}]
		}).then( post =>{
			console.log( post[0].comments )
	 	res.render('allposts', {result: post, user:user})
	 })
	}
} )

//Adding comment to comment model in db

router.post( '/commentonpost', ( req, res ) => {
	var user = req.session.user;
	if (user === undefined) {
		res.redirect('/');
	} else {
		User.findOne({
			where: {
				id: user.id
			}
		}).then( user =>{
			user.createComment({
				body: req.body.bericht,
				postId: req.body.postId
			}).then ( comment =>{
				res.redirect('allposts')
			})
		})		
	}
} )

module.exports = router