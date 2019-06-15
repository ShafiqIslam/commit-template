class DecomposingError extends Error {
	constructor(message) {
		super(message);
		this.name = "DecomposingError";
	}
}

module.exports = DecomposingError;
