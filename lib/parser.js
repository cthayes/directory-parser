var sync_fs = require('fs')
var yaml = require ('js-yaml')
var marked = require ('marked')
var pathjs = require ('path')

module.exports = function parse(path) {
	var directoryItemObject = {}
	var directoryItemsArray = null
	
	try {
		directoryItemsArray = sync_fs.readdirSync(path)
	}
	catch (err) {
		console.log(`Could not find file or directory: ${path}`)
	}
	
	var regex = /([^\\]*)\.(\w+)$/
	
	for (x in directoryItemsArray) {
		var name = directoryItemsArray[x]
		var stats = sync_fs.statSync(pathjs.join(path, name))
		
		if (stats.isDirectory()) {
			//console.log(`Directory: ${name}`)
			// Recurisve function call
			directoryItemObject[name] = parse(pathjs.join(path, name))
		}
		else if (stats.isFile()) {
			//console.log(`File: ${name}`)
			var matches = name.match(regex);
			if (matches) {
			    var filename = matches[1];
			    var extension = matches[2];
	
			    var rawData = sync_fs.readFileSync(pathjs.join(path, name), 'utf8')
			    var data = '';
			    
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
			    
			    directoryItemObject[filename] = data
			}
			else {
				//console.log('no matches')
			}
		}
		else {
			//console.log(`Not a file or directory? What is ${name} ?`)
		}	
	}
		
	return directoryItemObject
}