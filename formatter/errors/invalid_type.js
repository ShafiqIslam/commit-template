let DecomposingError = require('./decomposing_error.js');
class InvalidType extends DecomposingError {
	constructor(type) {
		super("Given type " + type + " does not exist.");
		this.name = "InvalidType";
	}
}

module.exports = InvalidType;
