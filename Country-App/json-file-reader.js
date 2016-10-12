var fs = require('fs');

ReadAndParse = function (filename, callback) {
	fs.readFile(filename, 'utf-8', function (err, content){
		if (err) throw err
			var jsonContent = JSON.parse(content)
		callback(jsonContent)
	})
}

module.exports = ReadAndParse



