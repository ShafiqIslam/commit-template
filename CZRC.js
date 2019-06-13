const pad = require('pad');
const fuzzy = require('fuzzy');
const fs = require('fs');
const read = fs.readFileSync;
const rc_file_name = ".czrc.json";

function CZRC(czrc) {
    this.loadFromObject(czrc);
}

CZRC.prototype.loadFromObject = function (czrc) {
    this.types = czrc ? czrc.types : [];
    this.issueTrackers = czrc ? czrc.issue_trackers : [];
    this.authors = czrc ? czrc.authors : [];
    this.scopes = czrc ? czrc.scopes : [];
    this.subjectMaxLength = czrc ? czrc.subject_max_length : 72;
    this.bodyMaxLength = czrc ? czrc.body_max_length : 80;
    this.sectionHeaders = czrc ? czrc.section_headers : {};
    this.bullet = czrc ? czrc.bullet : '- ';
    this.inlineSeparator = czrc ? czrc.inline_separator : ', ';
    this.issueTrackerIdSeparator = czrc ? czrc.issue_tracker_id_separator : ': ';
    this.authorEmailTag = czrc ? czrc.author_email_tag : { start: ' <', end: '>' };
};

CZRC.prototype.load = function() {
    const homeDir = require('home-dir');
    this.loadFromFile(homeDir(rc_file_name));
    this.loadScopesFromProject();
};

CZRC.prototype.loadFromFile = function(file) {
    let czrc = read(file, 'utf8');
    czrc = czrc && JSON.parse(czrc) || null;
    this.loadFromObject(czrc);
};

CZRC.prototype.loadScopesFromProject = function() {
    this.scopes = [];
    let own_rc = __dirname + '/' + rc_file_name;
    let project_rc = __dirname + '../../../' + rc_file_name;
    if(fs.existsSync(project_rc)) {
        this.loadScopesFromFile(project_rc);
        return;
    }

    if(fs.existsSync(own_rc)) this.loadScopesFromFile(own_rc);
};

CZRC.prototype.loadScopesFromFile = function(file) {
    this.scopes = JSON.parse(read(file, 'utf8')).scopes;
};

CZRC.prototype.getPromise = function() {
    return new Promise(resolve => resolve(this));
};

CZRC.prototype.formatTypesWithEmoji = function() {
    let types = this.types;
    const max_name_length = types.reduce(
        (max, type) => (type.name.length > max ? type.name.length : max), 0
    );
    const max_emoji_length = types.reduce(
        (max, type) => (type.emoji.length > max ? type.emoji.length : max), 0
    );

    return types.map(type => ({
        name: `${pad(type.name, max_name_length)}  ${pad(type.emoji, max_emoji_length)}  ${type.description.trim()}`,
        value: type,
        code: type.code
    }));
};

CZRC.prototype.searchAuthor = function(answers, input) {
    input = input || '';
    let authors = this.authors.map(author => author.name);
    return new Promise(function(resolve) {
        setTimeout(function() {
            var fuzzy_result = fuzzy.filter(input, authors);
            resolve(fuzzy_result.map(el => el.original));
        }, Math.random() * (500 - 30) + 30);
    });
};

CZRC.prototype.getAuthorByName = function(name) {
    for(let i=0; i<this.authors.length; i++) {
        if(this.authors[i].name === name) return this.authors[i];
    }
    return null;
};

CZRC.prototype.getTypeByName = function(name) {
    for(let i=0; i<this.types.length; i++) {
        if(this.types[i].name === name) return this.types[i];
    }
    return null;
};

CZRC.prototype.getTypeByEmoji = function(emoji) {
    for(let i=0; i<this.types.length; i++) {
        if(this.types[i].emoji === emoji) return this.types[i];
    }
    return null;
};

CZRC.prototype.isValidTypeName = function(type) {
    return this.getTypeByName(type) !== null;
};

CZRC.prototype.isValidTypeEmoji = function(emoji) {
    return this.getTypeByEmoji(emoji) !== null;
};

CZRC.prototype.isValidType = function(name, emoji) {
    let type = this.getTypeByName(name);
    if(type === null) return false;
    return type.emoji === emoji;
};

CZRC.prototype.isValidAuthor = function(name, email) {
    let author = this.getAuthorByName(name);
    if(author === null) return false;
    return author.email === email;
};

CZRC.prototype.isValidScope = function(scope) {
    return this.scopes.includes(scope);
};

CZRC.prototype.isValidIssueTracker = function(name) {
    return this.issueTrackers.includes(name);
};

module.exports = CZRC;
