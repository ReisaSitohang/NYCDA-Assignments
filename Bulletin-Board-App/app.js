'use strict'
const express = require ( 'express' )
const fs      = require ( 'fs' )
const app     = express( )
const pg      = require('pg')
const bodyParser = require('body-parser')

app.set ( 'view engine', 'pug' )
app.set ( 'views', __dirname+'/views')

let connectionString =('postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard')


app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.get('/', (req, res)=>{
	console.log('Opened home page')
		res.render('index')
	})

app.post('/messages', (req, res)=>{
	console.log("Title :"+req.body.title)
	console.log("Message :"+req.body.message)
	
	pg.connect(connectionString, (err, client, done)=>{
		console.log("Connected To DB")
		client.query( ("insert into messages (title, body) values ('"+req.body.title+"','"+req.body.message+"')" ),
		(err, result)=>{
			done()
			pg.end()
		})
	})
	res.redirect('/messages')
})

app.get('/messages', (req, res)=>{
	console.log('opened messages page')
	pg.connect(connectionString, (err, client, done)=>{
		console.log("connected to DB again")
		client.query("select title, body from messages", (err, result)=>{
			console.log(result.rows)
			res.render('messages', { result : result.rows })
			done()
		})
	})
})

app.listen (8000, () => {
	console.log('server is running')
})