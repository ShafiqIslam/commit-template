let DecomposingError = require('./decomposing_error.js');
class MaxLengthExceeded extends DecomposingError {
    constructor(line, expected_length) {
        super("Max length exceeded in \"" + line + "\". Expected " + expected_length + " found " + line.length);
        this.name = "MaxLengthExceeded";
    }
}

module.exports = MaxLengthExceeded;
