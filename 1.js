var http = require('http');

/**
 * Get forum page content.
 * @param {function(Object, String?)} callback
 */
function getForumPage(callback) {
	http.get("http://forum.academ.org/index.php?showforum=573", function (res) {
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
	if (err || !text) {
		console.log('err:');
		console.log(err);
		return;
	}
	console.log(extractForumPageTopicsAsTexts(text));
});

/**
 * Parse forum page as topics.
 * @param {String} text
 * @return {Array.<String>}
 */
function extractForumPageTopicsAsTexts(text) {
	var re = /<!-- Begin Topic Entry (\d+) -->([\s\S]*?)<!-- End Topic Entry \1 -->/g;
	var match;
	var matches = [];
	while (match = re.exec(text)) {
		matches.push([match[1], match[2]])
	}
	return matches;
}
