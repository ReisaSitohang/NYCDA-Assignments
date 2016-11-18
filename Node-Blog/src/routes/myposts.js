'use strict'
//__________Import modules
const express    = require( 'express' )
const router     = express.Router(  )
const session    =  require( 'express-session' )
const Sequelize  =  require( 'sequelize' )
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

let Post = db.define( 'post', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT,
} )

let Comment = db.define( 'comment', {
	body: Sequelize.TEXT,
} )

//___________Define relations
User.hasMany ( Post )
Post.belongsTo ( User )

Post.hasMany( Comment )
Comment.belongsTo( Post )

User.hasMany( Comment )
Comment.belongsTo( User )

db.sync({force: false}).then( ()=> {
	console.log("N-sync")
})

//___________Routes
//___________My posts, viewable after login success
router.get( '/myposts', ( req, res ) => {
	var user = req.session.user;
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		Post.findAll({
			include: [{
				model: Comment,
				include: [{
					model: User,
					attributes:['name', 'lastname']
				}]
			}]
		}).then( ( post ) => {
			res.render('myposts', {result: post, user:user})
		})
	}
} )

//___________Export modules
module.exports = router