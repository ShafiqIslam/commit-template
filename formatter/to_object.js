require('./helpers.js');
let Message = require('../dto/message.js');
let Type = require('../dto/type.js');
let Author = require('../dto/author.js');
let Issue = require('../dto/Issue.js');
let MalformedString = require('./errors/malformed_string.js');
let InvalidType = require('./errors/invalid_type.js');

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
    message.setSubject(_message_splits[0]).setTypes(getTypes());
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

function getTypes() {
    let types = _message_splits[1].replace(_headers.types, '').split(_czrc.inlineSeparator);
    for(let i=0; i<types.length; i++) {
        let type = _czrc.getTypeByName(types[i]);
        if(type == null) throw new InvalidType(types[i]);
        types[i] = new Type(type.name, type.emoji, type.code, type.description);
    }
    return types;
}

module.exports = function(czrc) {
    _czrc = czrc;
    _headers = czrc.sectionHeaders;
    return format;
};
