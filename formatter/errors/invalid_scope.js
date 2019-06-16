let DecomposingError = require('./decomposing_error.js');
class InvalidScope extends DecomposingError {
    constructor(scope) {
        super("Given scope " + scope + " does not exist.");
        this.name = "InvalidScope";
    }
}

module.exports = InvalidScope;
