require('./helpers.js');
let Message = require('../dto/message.js');
let Type = require('../dto/type.js');
let Author = require('../dto/author.js');
let Issue = require('../dto/issue.js');
let DecomposingError = require('./errors/decomposing_error.js');
let MaxLengthExceeded = require('./errors/max_length_exceeded.js');
let MalformedString = require('./errors/malformed_string.js');
let InvalidType = require('./errors/invalid_type.js');
let InvalidScope = require('./errors/invalid_scope.js');
let InvalidAuthor = require('./errors/invalid_author.js');

let _czrc = null;
let _headers = null;
let _message_splits = null;

/**
 * Format the git commit message from given answers.
 *
 * @param {String} Formated git commit message
 * @return {Message} Message object containing message segments
 */
function format(message_string) {
    _message_splits = message_string.replaceAll('\r\n', '\n').trimAny('\n').split('\n\n');
    let message = new Message();
    checkRequired();
	let types = getTypes();
    message.setSubject(getSubject(types)).setTypes(types);
    for(let i=2; i<_message_splits.length; i++) {
        let split = _message_splits[i];
        if(split.startsWith(_headers.scopes)) message.setScopes(getScopes(split));
        else if(split.startsWith(_headers.why)) message.setWhy(split.replace(_headers.why, ''));
        else if(split.startsWith(_headers.what)) message.setWhat(split.replace(_headers.what, ''));
        else if(split.startsWith(_headers.issues + _czrc.bullet)) message.setIssues(getIssues(split));
        else if(split.startsWith(_headers.references + _czrc.bullet)) message.setReferences(getReferences(split));
        else if(split.startsWith(_headers.co_authors + _czrc.bullet)) message.setCoAuthors(getAuthors(split));
        else throw new MalformedString("Invalid section containing: " + split);
    }
    return message;
}

function checkRequired() {
    if(_message_splits.length < 2) {
        throw new MalformedString("At least 2 section (subject and types) must be present");
    }
    if(!_message_splits[1].startsWith(_headers.types)) {
        throw new MalformedString("Type(s) must be present in second section, found: " + _message_splits[1]);
    }
}

function getSubject(types) {
	let subject = _message_splits[0];
	if(subject.length > _czrc.subjectMaxLength) throw new MaxLengthExceeded(subject, _czrc.subjectMaxLength);
	if(subject.endsWith('.') || subject.endsWith(',')) throw new DecomposingError("Punctuations not allowed for subject line ending.");
	/*for(let i=0; i<types.length; i++) {
		if(!subject.startsWith(types[i].emoji)) throw new DecomposingError("Type emoji does not match for type: " + types[i].name);
		subject = subject.replace(types[i].emoji, '').trim();
	}
	if(subject[0] !== subject[0].toUpperCase()) throw new DecomposingError("Subject must be capitalized");*/
	return subject;
}

function getTypes() {
    let types = _message_splits[1].replace(_headers.types, '').split(_czrc.inlineSeparator);
    for(let i=0; i<types.length; i++) {
        let type = _czrc.getTypeByName(types[i]);
        if(type == null) throw new InvalidType(types[i]);
        types[i] = new Type(type);
    }
    return types;
}

function getScopes(split) {
    let scopes = split.replace(_headers.scopes, '').split(_czrc.inlineSeparator);
    for(let i=0; i<scopes.length; i++) {
        if(!_czrc.isValidScope(scopes[i])) throw new InvalidScope(scopes[i]);
    }
    return scopes;
}

function getReferences(split) {
    let references = split.replace(_headers.references + _czrc.bullet, '').split('\n' + _czrc.bullet);
    for(let i=0; i<references.length; i++) {
        if(!references[i]) throw new DecomposingError("Empty reference is not allowed.");
    }
    return references;
}

function getIssues(split) {
    let issues = split.replace(_headers.issues + _czrc.bullet, '').split('\n' + _czrc.bullet);
	let issue_objects = [];
    for(let i=0; i<issues.length; i++) {
        let issues_splited = issues[i].split(_czrc.issueTrackerIdSeparator);
		if(issues_splited.length != 2) throw new MalformedString("Could not parse issue: " + issues[i]);
		let tracker = issues_splited[0];
        if(!_czrc.isValidIssueTracker(tracker)) throw new InvalidIssueTracker(tracker);
		let issue_ids = issues_splited[1].split(_czrc.inlineSeparator);
		for(let j=0; j<issue_ids.length; j++) {
			if(!issue_ids[j]) throw new DecomposingError("Empty issue id is not allowed.");
        	issue_objects.push(new Issue(tracker, issue_ids[i]));
		}
    }
    return issue_objects;
}

function getAuthors(split) {
	let authors = split.replace(_headers.co_authors + _czrc.bullet, '').split('\n' + _czrc.bullet);
	for(let i=0; i<authors.length; i++) {
		try {
			let author_split = authors[i].split(_czrc.authorEmailTag.start);
			let author = _czrc.getAuthorByName(author_split[0]);
			if(author.email != author_split[1].trimAny(_czrc.authorEmailTag.end)) {
				throw new InvalidAuthor(authors[i], "Name and email does not match.");
			}
			authors[i] = new Author(author.name, author.email);
		} catch (e) {
			if (e instanceof InvalidAuthor) throw e;
			else throw new InvalidAuthor(authors[i], "Not found.");
		}
	}
	return authors;
}

module.exports = function(czrc) {
    _czrc = czrc;
    _headers = czrc.sectionHeaders;
    return format;
};
