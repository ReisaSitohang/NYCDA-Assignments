'use strict'
// importing necessary modules
const fs = require ( 'fs' )

//Helper functions
var roundDecimal = (number) => {
	return Math.round(number * 100) / 100
}

function numberWithCommas(x) {
    return x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
}

let prettyNr = ( number ) => {
	return numberWithCommas (roundDecimal( number))
}

//Read the customer data json
//New syntax
fs.readFile(__dirname+'/customer.json', 'utf-8', ( err, data) => {
		//parsed the file to a readable object
		let parsedData = JSON.parse( data );
		calcCompound( parsedData )
	});

// Function to calculate compound interest from a customer object
var calcCompound = ( customer ) => {

	//Set end amount prop and calculate total duration
	customer.pension.endamount = {
		pessimistic : customer.finances.startcapital,
		average : customer.finances.startcapital,
		optimistic : customer.finances.startcapital
	}
	customer.pension.duration = ( customer.pension.age-customer.age )

	//Do the interest math
	for (var i = customer.pension.duration - 1; i >= 0; i--) {
	//Add monthly spend to all scenarios
	customer.pension.endamount.pessimistic += ( customer.finances.monthyadd * 12 )
	customer.pension.endamount.average += ( customer.finances.monthyadd * 12 )
	customer.pension.endamount.optimistic += ( customer.finances.monthyadd * 12 )
	//Calculate the added interest
	customer.pension.endamount.pessimistic *= customer.pension.interest.pessimistic
	customer.pension.endamount.average *= customer.pension.interest.average
	customer.pension.endamount.optimistic *= customer.pension.interest.optimistic
	
	}
	// Welcome the customer
	console.log("Welcome " + customer.name + " to our advanced pesion planner!")
	console.log("You are starting with € " + customer.finances.startcapital + " and add a monthly amount of " + customer.finances.monthyadd )
	console.log("When you retire at age € " + customer.pension.age + " you will have the following:")
	//Output the manipulated data:
	console.log ("In a pessimistic scenario: €" + prettyNr(customer.pension.endamount.pessimistic))
	console.log ("In a average scenario: €" + prettyNr(customer.pension.endamount.average))
	console.log ("In a optimistic scenario: €" + prettyNr(customer.pension.endamount.optimistic))
}