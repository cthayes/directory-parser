var sync_fs = require('fs')
var yaml = require ('js-yaml')
var marked = require ('marked')
var pathjs = require ('path')

module.exports = function parseSync(path) {
	var directoryItemObject = {}
	var directoryItemsArray = []
	var regex = /([^\\]*)\.(\w+)$/
	
	try {
		directoryItemsArray = sync_fs.readdirSync(path)
	}
	catch (err) {
		//console.log(`Could not find file or directory: ${path}`)
		return null
	}
	
	for (x in directoryItemsArray) {
		var name = directoryItemsArray[x]
		if (name === '' || name.charAt(0) === '.') {		
			//console.log(`Name: ${name}`)
			continue
		}
		
		var filepath = pathjs.join(path, name)
		var stats = sync_fs.lstatSync(filepath)
		
		if (stats.isDirectory()) {
			//console.log(`Directory: ${name}`)
			// Recurisve function call
			stats = undefined
			directoryItemObject[name] = parseSync(filepath)
		}
		else if (stats.isFile()) {
			//console.log(`File: ${name}`)
			
			var rawData = sync_fs.readFileSync(filepath, 'utf8')
			var data = ''
			var filename
			    
			var matches = name.match(regex)
			if (matches) {
			    filename = matches[1]
			    var extension = matches[2]
			    
			    switch(extension) {
				    case 'yml':
				    	data = yaml.load(rawData)
						break
					case 'md':
						data = marked(rawData)
						break
					default:
						//console.log(`Unknown file type: ${extension}`)
						data = rawData
			    }
			}
			else {
				//console.log('no matches')
				data = rawData
				filename = name
			}
			
		    directoryItemObject[filename] = data			
		}
		else {
			console.log(`Not a file or directory? What is ${name} ?`)
		}	
	}
		
	return directoryItemObject
}