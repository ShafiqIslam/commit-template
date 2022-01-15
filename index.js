module.exports = (async function() {
    let CZRC = require('./CZRC.js');
    let czrc = new CZRC();
    await czrc.load();

    let message = require('./dto/message.js');
    let type = require('./dto/type.js');
    let author = require('./dto/author.js');
    let issue = require('./dto/issue.js');

    let format_string = require('./formatter/to_string.js')(czrc);
    let format_object = require('./formatter/to_object.js')(czrc);

    let DecomposingError = require('./formatter/errors/decomposing_error.js');
    let ValidationError = require('./formatter/errors/validation_error.js');

    return {
        czrc: czrc,
        dto: {
            message: message,
            type: type,
            author: author,
            issue: issue
        },
        formatter: {
            toString: format_string,
            toObject: format_object,
        },
        errors: {
            decompose: DecomposingError,
            validation: ValidationError
        }
    };
});
