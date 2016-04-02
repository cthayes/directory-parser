var assert = require('chai').assert
var parse = require('../lib/parser.js')
var path = require('path')
var sizeof = require ('object-sizeof')

describe('directory-parser', function() {
	
	describe('parse()', function() {
		this.data = null
		this.timeout(10000)
		
		before(function() {
			var start = process.hrtime();

			this.data = parse(path.join(__dirname, 'content'))
			//console.log(`\tData Size: ${sizeof(this.data)} bytes`)
			//console.log(JSON.stringify(this.data))
			
			var end = process.hrtime(start);
			console.info("\tExecution time: %ds %dms", end[0], end[1]/1000000);
		})
		
		it('Should parse the subfolder', function() {
			assert.isObject(this.data.subfolder)
		})
		
		it('Should convert the Markdown file', function() {
			assert.include(this.data.testcontent, '<h1')
		})
		
		it('Should convert the Yaml file', function() {
			assert.equal(this.data.testdata.title, 'Testing Directory Parser')
			assert.equal(this.data.testdata.number, 44)
		})
		
		
	})	
	
	describe('parse() failure', function() {
		this.data = null
		before(function() {
			this.data = parse(path.join(__dirname, 'doesNotExist'))
		})
		
		it ('Should return null', function() {
			assert.isNull(this.data)
		})
	})
})
