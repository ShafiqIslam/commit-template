let DecomposingError = require('./decomposing_error.js');
class InvalidType extends DecomposingError {
	constructor(type) {
		super("Given type " + type + " does not exist.");
		this.name = "Invalid Type";
	}
}

module.exports = InvalidType;
