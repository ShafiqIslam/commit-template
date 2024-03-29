const pad = require("pad");
const fuzzy = require("fuzzy");

function CZRC() {
  this.types = [];
  this.issueTrackers = [];
  this.defaultIssueTracker = "";
  this.authors = [];
  this.scopes = [];
  this.subjectMaxLength = 72;
  this.bodyMaxLength = 80;
  this.sectionHeaders = {};
  this.bullet = "- ";
  this.inlineSeparator = ", ";
  this.issueTrackerIdSeparator = ": ";
  this.authorEmailTag = { start: " <", end: ">" };
  this.blockNonImperativeSubject = true;
  this.extraImperativeVerbs = [];
}

CZRC.prototype.overwrite = function (overwrite) {
  if (overwrite === null) return;

  this.types = overwrite.types || this.types;
  this.issueTrackers = overwrite.issueTrackers || this.issueTrackers;
  this.defaultIssueTracker = this.hasIssueTracker() ? overwrite.defaultIssueTracker || this.defaultIssueTracker : "";
  this.authors = overwrite.authors || this.authors;
  this.scopes = overwrite.scopes || this.scopes;
  this.subjectMaxLength = overwrite.subjectMaxLength || this.subjectMaxLength;
  this.bodyMaxLength = overwrite.bodyMaxLength || this.bodyMaxLength;
  this.sectionHeaders = overwrite.sectionHeaders || this.sectionHeaders;
  this.bullet = overwrite.bullet || this.bullet;
  this.inlineSeparator = overwrite.inlineSeparator || this.inlineSeparator;
  this.issueTrackerIdSeparator = overwrite.issueTrackerIdSeparator || this.issueTrackerIdSeparator;
  this.authorEmailTag = overwrite.authorEmailTag || this.authorEmailTag;
  this.blockNonImperativeSubject = overwrite.blockNonImperativeSubject === false ? false : true;
};

CZRC.prototype.pushExtraImperativeVerbs = function (extraImperativeVerbs) {
  if (!Array.isArray(extraImperativeVerbs)) return;
  if (extraImperativeVerbs.length == 0) return;
  extraImperativeVerbs = extraImperativeVerbs.map((v) => v.toLowerCase());
  this.extraImperativeVerbs = [...this.extraImperativeVerbs, ...extraImperativeVerbs];
};

CZRC.prototype.getPromise = function () {
  return new Promise((resolve) => resolve(this));
};

CZRC.prototype.formatTypesWithEmoji = function () {
  let types = this.types;
  const max_name_length = types.reduce((max, type) => (type.name.length > max ? type.name.length : max), 0);
  const max_emoji_length = types.reduce((max, type) => (type.emoji.length > max ? type.emoji.length : max), 0);

  return types.map((type) => ({
    name: `${pad(type.name, max_name_length)}  ${pad(type.emoji, max_emoji_length)}  ${type.description.trim()}`,
    value: type,
    code: type.code,
  }));
};

CZRC.prototype.searchAuthor = function (answers, input) {
  input = input || "";
  let authors = this.authors.map((author) => author.name);
  return new Promise(function (resolve) {
    setTimeout(function () {
      var fuzzy_result = fuzzy.filter(input, authors);
      resolve(fuzzy_result.map((el) => el.original));
    }, Math.random() * (500 - 30) + 30);
  });
};

CZRC.prototype.getAuthorByName = function (name) {
  for (let i = 0; i < this.authors.length; i++) {
    if (this.authors[i].name === name) return this.authors[i];
  }
  return null;
};

CZRC.prototype.getTypeByName = function (name) {
  for (let i = 0; i < this.types.length; i++) {
    if (this.types[i].name === name) return this.types[i];
  }
  return null;
};

CZRC.prototype.getTypeByEmoji = function (emoji) {
  for (let i = 0; i < this.types.length; i++) {
    if (this.types[i].emoji === emoji) return this.types[i];
  }
  return null;
};

CZRC.prototype.isValidTypeName = function (type) {
  return this.getTypeByName(type) !== null;
};

CZRC.prototype.isValidTypeEmoji = function (emoji) {
  return this.getTypeByEmoji(emoji) !== null;
};

CZRC.prototype.isValidType = function (name, emoji) {
  let type = this.getTypeByName(name);
  if (type === null) return false;
  return type.emoji === emoji;
};

CZRC.prototype.isValidAuthor = function (name, email) {
  let author = this.getAuthorByName(name);
  if (author === null) return false;
  return author.email === email;
};

CZRC.prototype.isValidScope = function (scope) {
  return this.scopes.includes(scope);
};

CZRC.prototype.doesNotHaveIssueTracker = function () {
  return !this.hasIssueTracker();
};

CZRC.prototype.hasIssueTracker = function () {
  return this.issueTrackers.length > 0;
};

CZRC.prototype.isValidIssueTracker = function (name) {
  if (this.doesNotHaveIssueTracker()) return true;

  return this.issueTrackers.includes(name);
};

module.exports = CZRC;
