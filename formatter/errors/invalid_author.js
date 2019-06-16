let DecomposingError = require('./decomposing_error.js');
class InvalidAuthor extends DecomposingError {
    constructor(author, message) {
        super("Invalid author: " + author + ". " + (message || ""));
        this.name = "InvalidAuthor";
    }
}

module.exports = InvalidAuthor;
