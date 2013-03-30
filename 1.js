var http = require('http');

/**
 * Get forum page content.
 * @param {function(err: Object, text?: String)} callback
 */
function getForumPage(callback) {
	http.get("http://forum.academ.org/index.php?showforum=573", function (res) {
		console.log("Got response: " + res.statusCode);
		if (res.statusCode != 200) {
			callback({no_page: true});
			return;
		}

		var result = [];

		res.on('data', function (chunk) {
			result.push(chunk);
		});
		res.on('end', function () {
			callback(null, result.join(''));
		});
	}).on('error', function (e) {
		console.log("Got error: " + e.message);
		callback({request_error: e});
	});
}

getForumPage(function(err, text){
	console.log('err:');
	console.log(err);
	console.log('text:');
	console.log(text.slice(0, 300) + '... and so on');
});
