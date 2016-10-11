var namecountry = process.argv[2]
var fs = require('fs');

fs.readFile(__dirname+'/countries.json', 'utf-8', function(err, content){
    if (err) {
        throw err
    }
    var jsonContent = JSON.parse(content)
    for (var i = 0; i < jsonContent.length; i++ ){
    	if (jsonContent[i].name === namecountry){
    		console.log("Country:"+jsonContent[i].name+'\n'+"Top level domain:"+jsonContent[i].topLevelDomain)
    }
}
})





