'use strict'
//import modules
const express    = require ( 'express' )
const fs         = require ( 'fs' )
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

//Set express routers
app.get( '/ping', ( req, res ) => {
	res.send( 'pong' )
} )

app.get( '/', ( req, res ) => {
	res.render( 'index' )
} )

app.get( '/register', ( req, res ) => {
	res.render( 'register' )
} )

app.get( '/login', ( req, res ) => {
	res.render( 'register' )
} )



app.listen( 8000, (  ) => {
	console.log( 'server running' )
} )