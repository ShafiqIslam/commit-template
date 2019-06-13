function Type(obj) {
    this.name = obj ? obj.name : null;
    this.emoji = obj ? obj.emoji : null;
    this.code = obj ? obj.code : null;
    this.description = obj ? obj.description : null;
}

module.exports = Type;
