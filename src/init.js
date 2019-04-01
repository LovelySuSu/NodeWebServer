const yargs = require('yargs')
const Server = require('./index')

const argv = yargs.usage('anywhere [options]')
	.options('p',{
		alias: 'port',
		describe: '端口号',
		default: 1314
	})
	.options('h',{
		alias: 'host',
		describe: 'host',
		default: '127.0.0.1'
	})
	.options('d',{
		alias: 'root',
		describe: 'root path',
		default: process.cwd()
	})
	.version()
	.alias('v','version')
	.help()
	.argv

const server = new Server(argv)
server.start()
