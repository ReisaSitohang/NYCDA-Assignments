'use strict'
//Import modules
const express    =  require ( 'express' )
const app        =  express( )
const bodyParser =  require('body-parser')
const Sequelize  =  require('sequelize')
const session    =  require('express-session')
const bcrypt     =  require('bcrypt-nodejs')
const db         =  new Sequelize('nodeblog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD,{
						host: 'localhost',
						dialect: 'postgres'
					});


//Set views
app.set('views', './views')
app.set('view engine', 'pug')

//Use static folder
app.use (express.static(__dirname + '/public'))


//Setting Routes
let loginlogoutRouter = require( __dirname+'/routes/login' )
let registerRouter = require( __dirname+'/routes/register' )
let mypostsRouter = require( __dirname+'/routes/myposts' )
let createpostRouter = require( __dirname+'/routes/createpost' )
let allpostsRouter = require( __dirname+'/routes/allposts' )

app.use('/', loginlogoutRouter )
app.use('/', registerRouter )
app.use('/',  mypostsRouter )
app.use('/', createpostRouter )
app.use('/', allpostsRouter )

//Set port

app.listen(3000, function () {
	console.log('3000 is a beautiful song')
} )