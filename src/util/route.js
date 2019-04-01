const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const config = require('../config/defaultConfig')
const mime = require('./mime')
const compress = require('./compress')
const range = require('./range')


module.exports = async function (req,res,filePath) {
	const source = fs.readFileSync(path.join(__dirname,'../template/dir.tpl'))
	const template = Handlebars.compile(source.toString())
	try {
		const stats = await stat(filePath)
		if(stats.isFile()) {
			const contentType = mime(filePath)
			res.setHeader('Content-Type',mime(contentType))
            let readStream  = fs.createReadStream(filePath)
            const { code,start,end } = range(stats.size,req,res)
            if (code === 200) {
                readStream = fs.createReadStream(filePath)
            } else {
                readStream = fs.createReadStream(filePath,{
                    start,
                    end
                })
            }
            res.statusCode = code
			if (filePath.match(config.compress)) {
				readStream = compress(readStream,req,res)
			}
			readStream.pipe(res)
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
