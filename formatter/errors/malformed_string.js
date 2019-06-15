let DecomposingError = require('./decomposing_error.js');
class MalformedString extends DecomposingError {
	constructor(message) {
        message = message || "The given message string is malformed";
		super(message);
		this.name = "MalformedString";
	}
}

module.exports = MalformedString;
