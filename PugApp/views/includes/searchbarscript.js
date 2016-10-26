script.
		//- $( document ).ready(()=> {
		//- 	$('#search').keyup('click', function(){
		//- 		let typed = ($('#search').val())
		//- 		console.log(typed)
		//- 		if(typed.length > 0){
		//- 			$.post("/Autocomplete", typed, (res)=>{
		//- 				console.log("hello")
		//- 			})
		//- 		}
		//- 	})
		//- })

		$('#searchbutton').on('click', function(e) { 
			e.preventDefault()
			console.log("clicked button")
			let typed = ($('#search').val())
			var showData = $('#show-data')
			//- showData.text('Loading.......')

			$.post("/results", { searchedname: typed }, (res)=>{
					$.each(res, (i, name)=>{
					showData.append('<li> Name: '+res[i].name+'</li>'+'<li> Lastname: '+res[i].lastname+'</li>'+'<li> Email: '+res[i].email+'</li>'+'<p></p>')
					}
					) 	
			})
		})