'use strict'
//Including necesarry modules
const express = require ( 'express' )
const fs      = require ( 'fs' )
const app     = express( )
const bodyParser = require('body-parser')

app.set ( 'view engine', 'pug' )
app.set ( 'views', __dirname+'/views')

app.use(express.static(__dirname + '/public'))
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//route0
app.get('/', (req, res)=>{
	console.log('Opened home page')
		res.render('index')
	})

//route1
app.get('/allusers', (req, res)=>{
	console.log('Opened all users')
	fs.readFile(__dirname+'/users.json', (error, data) => {
		if ( error ) throw ( error )
			let parsedData = JSON.parse( data )
		console.log( parsedData )
		res.render('allusers', {data: parsedData})
	})
})

// route2
app.get('/searchbar', (req, res)=>{
	console.log('Opened searchBar')
	res.render('search')
})

// route3

app.post('/result', function(req, res){  
	let name = req.body.searchedname
	fs.readFile(__dirname+'/users.json', (error, data) => {
		if ( error ) throw ( error )
			let parsedData = JSON.parse( data )
		var checkbox = 0
		for (let i = 0; i < parsedData.length; i++ ){
			if ( (parsedData[i].name.toUpperCase()=== name.toUpperCase() ) || (parsedData[i].lastname.toUpperCase() === name.toUpperCase()) ){
				checkbox = 1
				console.log("Found user: "+parsedData[i].name+" "+parsedData[i].lastname)  
				res.render('result',{data: parsedData[i]})
			} 
		}
		if (checkbox == 0) {
			console.log("Who is "+name+"? I don\'t know this person.")
			res.render('error',{name: name})
		}
		})
})

// route4
app.get('/adduser', (req, res)=>{
	console.log("Opened add user")
	res.render('adduser')
})


app.post('/adduser', (req, res)=>{
	console.log("Adding user :"+req.body.addname) 
	fs.readFile(__dirname+'/users.json', (error, data) => {
		if ( error ) throw ( error )
		let users = JSON.parse( data )
		users.push({"name":req.body.addname,"lastname":req.body.addlastname,"email":req.body.addemail});
		data = JSON.stringify(users)
        fs.writeFile(__dirname+'/users.json', data)
	})
	res.redirect ('/allusers')
})

app.listen (8000, () => {
	console.log('server is running')
})