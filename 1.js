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
	var topics_texts = extractForumPageTopics(text);
	var i;
	for (i = 0; i < topics_texts.length; i++) {
		console.log('-------------------------');
		console.log(topics_texts[i]);
		console.log(parseTopicHeaderText(topics_texts[i]));
	}
});

/**
 * Parse forum page as topics.
 * @param {String} text
 * @return {Array.<{id: String, text: String}>}
 */
function extractForumPageTopics(text) {
	var re = /<!-- Begin Topic Entry (\d+) -->([\s\S]*?)<!-- End Topic Entry \1 -->/g;
	var match;
	var matches = [];
	while (match = re.exec(text)) {
		matches.push({id:match[1], text:match[2]})
	}
	return matches;
}

/**
 * @param {String} text
 * @param {{tag: String, id: String}} element
 * @return {String}
 */
function parseElementContent(text, element) {
	var re = new RegExp('<' + element.tag + '\\s[^>]*id=("|\')' + element.id + '\\1[^>]*?>([\\s\\S]*?)<', '');
	var match = re.exec(text);
	return match ? match[2] : '';
}

/**
 *
 * @param {{id: String, text: String}} header
 * @return {Object}
 */
function parseTopicHeaderText(header) {
	return {
		link: parseElementContent(header.text, {tag: 'a', id: 'tid-link-' + header.id}),
		desc: parseElementContent(header.text, {tag: 'span', id: 'tid-desc-' + header.id})
	};
}
