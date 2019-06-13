const truncate = require('cli-truncate');
const wrap = require('wrap-ansi');
require('./helpers.js');

let _czrc = null;
let _message = null;

let wrap_body = function(s) {
	return wrap(s, _czrc.bodyMaxLength);
};

/**
 * Format the git commit message from given answers.
 *
 * @param {Message} Message object containing message segments 
 * @return {String} Formated git commit message
 */
function format(message) {
    _message = message;
    let message_segments = [];
    let headers = _czrc.sectionHeaders;
    message_segments.push(formatSubject());
    message_segments.push(headers.types + formatTypes());
    if(_message.scopes && _message.scopes.length) {
        let s = formatScopes(); 
        if(s) message_segments.push(headers.scopes + s);
    }
    if(_message.why) message_segments.push(headers.why + wrap_body(_message.why));
    if(_message.what) message_segments.push(headers.what + wrap_body(_message.what));

    if(_message.issues && _message.issues.length) {
        let t = formatIssues();
        if(t) message_segments.push(headers.issues.trimAny('\n') + t);
    }
    if(_message.references && _message.references.length) {
        let r = formatReferences(); 
        if(r) message_segments.push(headers.references.trimAny('\n') + r);
    }
    if(_message.coAuthors && _message.coAuthors.length) {
        let a = formatCoAuthors(); 
        if(a) message_segments.push(headers.co_authors.trimAny('\n') + a);
    }
    return message_segments.join('\n\n');
}

function formatSubject() {
    let emojis = '';
    _message.types.forEach(function(type) {
        emojis += type.emoji + (type.emoji.length == 1 ? ' ' : '  ');
    });
    let subject = emojis + _message.subject.trimAny('. ').ucFirst();
    return truncate(subject, _czrc.subjectMaxLength);
}

function formatTypes() {
    let types = '';
    _message.types.forEach(function(type) {
        types += type.name + _czrc.inlineSeparator;
    });
    return types.trimAny(_czrc.inlineSeparator);
}

function formatScopes() {
	let scopes = '';
	_message.scopes.forEach(function(scope) {
        if(scope) scopes += scope + _czrc.inlineSeparator;
    });
	return scopes.trimAny(_czrc.inlineSeparator);
}

function formatIssues() {
    let trackers = {};
	_message.issues.forEach(function(issue) {
        let tracker = issue.tracker;
        if(!trackers.hasOwnProperty(tracker)) trackers[tracker] = '';
        trackers[tracker] += issue.issueId + _czrc.inlineSeparator; 
	});
	let issues = '';
    for(tracker in trackers) {
        issues += '\n' + _czrc.bullet + tracker + _czrc.issueTrackerIdSeparator + trackers[tracker].trimAny(_czrc.inlineSeparator);
    }
	return issues;
}

function formatCoAuthors() {
	let co_authors = '';
    let email_tag = _czrc.authorEmailTag;
	_message.coAuthors.forEach(function(author) {
		co_authors += '\n' + _czrc.bullet + author.name + email_tag.start + author.email + email_tag.end;
	});
	return co_authors;
}

function formatReferences() {
	let references = '';
	_message.references.forEach(function(reference) {
		references += '\n' + wrap_body(_czrc.bullet + reference);
	});
	return references;
}

module.exports = function(czrc) {
    _czrc = czrc;
    return format;
};
