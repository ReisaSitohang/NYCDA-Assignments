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

app.post('/', (req, res)=>{
	console.log("Title :"+req.body.title)
	console.log("Message :"+req.body.message)
	pg.connect(connectionString, (err, client, done)=>{
		console.log("connected to db YOO!")
		// client.query( ('insert into messages (title, body) values ('+req.body.title+','+req.body.body+')' ),
		// (err, result)=>{
		// 	console.log(result)
		// 	done()
		// 	pg.end()
		// })
	})
})

app.listen (8000, () => {
	console.log('server is running')
})