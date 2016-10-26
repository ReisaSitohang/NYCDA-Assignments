'use strict'
//Including necesarry modules
const express = require ( 'express' )
const fs      = require ( 'fs' )
const app     = express( )
const bodyParser = require('body-parser')
// const Autocomplete = require('./Autocomplete')


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

// route1
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

app.post('/results', (req, res)=>{  
	let Name = req.body.searchedname
	console.log(req.body.searchedname)
	fs.readFile(__dirname+'/users.json', (error, data) => {
		if ( error ) throw ( error )
			let parsedData = JSON.parse( data )
		var checkbox = 0
		var results = [];
		for (let i = 0; i < parsedData.length; i++ ){
			if ( (parsedData[i].name.toUpperCase().indexOf(Name.toUpperCase())=== 0 ) || (parsedData[i].lastname.toUpperCase().indexOf(Name)=== 0 ) ){
				checkbox = 1
				console.log("Found user: "+parsedData[i].name+" "+parsedData[i].lastname)  
				results.push(parsedData[i])
			} 

		}
		if (results.length > 0){
			console.log(results)
			res.send(results)
		}
		if (checkbox == 0) {
			console.log("Who is "+Name+"? I don\'t know this person.")
			res.send('error',{Name: Name})
		}
	})
})

//route autocomplete

app.post('/Autocomplete', (req, res)=>{  
	let Typing = req.body.typing
	console.log(Typing)
	fs.readFile(__dirname+'/users.json', (error, data) => {
		if ( error ) throw ( error )
		let parsedData = JSON.parse( data )	
		console.log(parsedData)
		let jsonList = []
		for (let i = 0; i < parsedData.length; i++ ){
			jsonList.push(parsedData[i].name+" "+parsedData[i].lastname)
		}
		res.send(jsonList)	
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