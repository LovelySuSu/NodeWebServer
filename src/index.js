const http = require('http')
const chalk = require('chalk')
const path = require('path')
const route = require('./util/route')
const config = require('./config/defaultConfig')

class Server {
	constructor(conf) {
		this.config = Object.assign({},config,conf)
	}
	start() {
		const server = http.createServer((req,res) => {
			const url = req.url
			const filePath = path.join(this.config.root,url)
			route(req,res,filePath,this.config)
		})

		server.listen(this.config.port,this.config.hostname,()=>{
			const addr = `http://${this.config.hostname}:${this.config.port}`
			console.log(`Server running at ${chalk.red(addr)}`)
		})
	}
}

module.exports = Server


