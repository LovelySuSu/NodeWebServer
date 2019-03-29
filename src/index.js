const http = require('http')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const config = require('./config/defaultConfig')

const server = http.createServer((req,res) => {
	const url = req.url
	const filePath = path.join(config.root,url)
	fs.stat(filePath,(error,stats) => {
		if (error) {
			res.statusCode = 404
			res.setHeader('Content-Type','text/plain')
			res.end(`${filePath} is not a dictionary or file`)
			return
		}
		if(stats.isFile()) {
			res.statusCode = 200
			res.setHeader('Content-Type','text/plain')
			fs.createWriteStream(filePath).pipe(res)
			return
		} else if(stats.isDirectory()) {
			fs.readdir(filePath,(error,files) => {
                res.statusCode = 200
                res.setHeader('Content-Type','text/plain')
                res.end(files.join(','))
			})
		}
	})
})

server.listen(config.port,config.hostname,()=>{
	const addr = `http://${config.hostname}:${config.port}`
	console.log(`Server running at ${chalk.red(addr)}`)
})
