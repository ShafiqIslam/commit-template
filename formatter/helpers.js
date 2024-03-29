String.prototype.ucFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.trimAny = function (s) {
    if (s === " ") return this.trim();
    if (s === "]") s = "\\]";
    if (s === "\\") s = "\\\\";
    let regex = new RegExp("^[" + s + "]+|[" + s + "]+$", "g");
    return this.replace(regex, "");
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
