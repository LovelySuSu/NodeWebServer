const http = require('http')
const chalk = require('chalk')
const path = require('path')
const route = require('./util/route')
const config = require('./config/defaultConfig')


const server = http.createServer((req,res) => {
	const url = req.url
	const filePath = path.join(config.root,url)
	route(req,res,filePath)
})

server.listen(config.port,config.hostname,()=>{
	const addr = `http://${config.hostname}:${config.port}`
	console.log(`Server running at ${chalk.red(addr)}`)
})
