const nlp = require("compromise");
const util = require("node:util");

const ValidationError = require("../formatter/errors/validation_error");

let _czrc = null;
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

Message.prototype.validate = function () {
  validateSubject(this.subject);
  validateIssues(this.issues);
};

function validateSubject(subject) {
  if (!subject) throw new ValidationError("Subject can't be empty");

  if (isImperative(subject)) return;

  let message =
    'Subject %s be in imperative mood, and should complete "This commit will ... ", e.g. "... Do something".';

  if (_czrc.blockNonImperativeSubject) {
    throw new ValidationError(util.format(message, "must"));
  } else {
    console.log(`\n\x1b[33m${util.format(message, "should")}`);
    console.log("However, this is allowed for the time being, please be aware next time. \x1b[0m\n");
  }
}

function isImperative(sentence) {
  let first_word = sentence.split(" ")[0];
  let imperative = nlp(first_word).verbs().isImperative().text();
  if (first_word == imperative) return true;

  if (_czrc.extraImperativeVerbs.includes(first_word)) return true;

  return false;
}

function validateIssues(issues) {
  if (_czrc.doesNotHaveIssueTracker()) return;
  if (!issues || issues.length == 0) throw new ValidationError("Issues can't be empty");
}

module.exports = function (czrc) {
  _czrc = czrc;
  return Message;
};
