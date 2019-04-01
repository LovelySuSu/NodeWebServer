const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const config = require('../config/defaultConfig')
const mime = require('./mime')

module.exports = async function (req,res,filePath) {
	const source = fs.readFileSync(path.join(__dirname,'../template/dir.tpl'))
	const template = Handlebars.compile(source.toString())
	try {
		const stats = await stat(filePath)
		if(stats.isFile()) {
			res.statusCode = 200
			res.setHeader('Content-Type',mime(filePath))
			fs.createReadStream(filePath).pipe(res)
			return
		} else if(stats.isDirectory()) {
			const files = await readdir(filePath)
			res.statusCode = 200
			res.setHeader('Content-Type','text/html')
			const dir = path.relative(config.root,filePath)
			const data = {
				title: path.basename(filePath),
				dir: dir ? `/${dir}` : '',
				files
			}
			res.end(template(data))
		}
	} catch (e) {
		res.statusCode = 404
		res.setHeader('Content-Type','text/plain')
		res.end(`${filePath} is not a dictionary or file`)
	}
}
