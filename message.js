function Message() {
    this.subject = null;
    this.types = [];
    this.scopes = [];
    this.what = null;
    this.why = null;
    this.issues = [];
    this.coAuthors = [];
    this.references = [];
}

/**
 * @param string
 */ 
Message.prototype.setSubject = function (subject) {
    this.subject = subject;
    return this;
};

/**
 * @param array<Type>
 */
Message.prototype.setTypes = function (types) {
    this.types = types;
    return this;
};

/**
 * @param array<string>
 */
Message.prototype.setScopes = function (scopes) {
    this.scopes = scopes;
    return this;
};

/**
 * @param string
 */
Message.prototype.setWhat = function (what) {
    this.what = what;
    return this;
};

/**
 * @param string
 */
Message.prototype.setWhy = function (why) {
    this.why = why;
    return this;
};

/**
 * @param array<Issue>
 */
Message.prototype.setIssues = function (issues) {
    this.issues = issues;
    return this;
};

/**
 * @param array<string>
 */
Message.prototype.setReferences = function (references) {
    this.references = references;
    return this;
};

/**
 * @param array<Author>
 */
Message.prototype.setCoAuthors = function (co_authors) {
    this.coAuthors = co_authors;
    return this;
};

module.exports = Message;
