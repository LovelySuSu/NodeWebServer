const { cache } = require('../config/defaultConfig')

function refreshRes(stats,res) {
	const { maxAge,expires,cacheControl,etag,lastModified } = cache
	if (expires) {
		res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString()) // 转化为毫秒
	}
	if (cacheControl) {
		res.setHeader('Cache-Control',`public,maxAge=${ maxAge }`)
	}
	if (lastModified) {
		res.setHeader('Last-Modified',stats.mtime.toUTCString())
	}
	if (etag) {
		res.setHeader('ETag', `${stats.size}-${stats.mtime}`)
	}
}

module.exports = function isFresh(stats,req,res) {
	refreshRes(stats,res)

	const lastModified = req.headers['if-modified-since']
	console.log(lastModified)
	const etag = req.headers['if-none-match']
	console.log(etag)
	if (!lastModified && !etag) {
		return false
	}
	if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
		return false
	}
	if (etag && etag !== res.getHeader('ETag')) {
		return false
	}
	return true
}
