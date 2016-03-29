var assert = require('chai').assert
var parse = require('../lib/parser.js')
var path = require('path')

var data = parse(path.join(__dirname, 'content'))

//console.log(JSON.stringify(data))

describe('directory-parser', function() {
	
	describe('parse()', function() {
		
		it('Should parse the subfolder', function() {
			assert.isObject(data.subfolder)
		})
		
		it('Should convert the Markdown file', function() {
			assert.include(data.testcontent, '<h1')
		})
		
		it('Should convert the Yaml file', function() {
			assert.equal(data.testdata.title, 'Testing Directory Parser')
			assert.equal(data.testdata.number, 44)
		})
		
		
	})	
})
