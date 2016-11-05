'use strict'
const express = require ( 'express' )
const fs      = require ( 'fs' )
const app     = express( )
const bodyParser = require('body-parser')
const Sequelize = require('sequelize');
const db = new Sequelize('bulletinboard', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD,{
	host: 'localhost',
	dialect: 'postgres'
});

app.set ( 'view engine', 'pug' )
app.set ( 'views', __dirname+'/views')

// let connectionString =('postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.get('/', (req, res)=>{
	console.log('Opened home page')
		res.render('index')
	})

//make table
	//create table
	let Message = db.define('seq-message',{
 	title: Sequelize.STRING,
 	body: Sequelize.TEXT,
	});

app.post('/messages', (req, res)=>{
	console.log("Title :"+req.body.title)
	console.log("The Message :"+req.body.bericht)
	//create messages
  	db.sync({force: true}).then( ()=> {
	 	console.log('sync succesfully')
	 	Message.create({
		 	title: req.body.title,
		 	body: req.body.bericht
		})
		.then ( message =>{
		console.log('created new message')
		res.redirect('/messages')
		})
 	})
})

app.get('/messages', (req, res)=>{
	console.log('opened messages page')
	Message.findAll().then( messages =>{
 	console.log( messages )
 	res.render('messages', {result: messages})
 	})
})

app.listen (8000, () => {
	console.log('server is running')
})