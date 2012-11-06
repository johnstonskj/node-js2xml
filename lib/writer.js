function isEmpty(o) {
    for (var key in o) {
        if (o.hasOwnProperty(key)) 
            return false;
    }
    return true;
}

function XmlText(writer, parent, text) {
    this.writer = writer;
    this.parent = parent;
    this.text = text;
    this.open = false;

    this._write = function() {
        this.writer.buffer += text;
    }
}

function XmlElement(writer, parent, name, ns) {
    this.writer = writer;
    this.parent = parent;
    this.name = name;
    this.ns = ns;
    this.namespaces = {};
    this.attributes = {};
    this.children = [];
    this.open = true;

    this.addNamespace = function(url, prefix) {
        this.namespaces[prefix] = url;
        return this;
    };

    this.addAttribute = function(name, ns, value) {
        this.attributes[name] = value === undefined ? ns : value;
        return this;
    };

    this.addText = function(text) {
        var child = new XmlText(this.writer, this, text);
        this.children.push(child);
        return this;
    };

    this.startElement = function(name, ns) {
        var child = new XmlElement(this.writer, this, name, ns);
        this.children.push(child);
        return child;
    };

    this.endElement = function() {
        for (var idx in this.children) {
            if (this.children[idx].open) {
                throw new Error('Child element not closed');
            }
        }
        this.open = false;
        if (this.parent === undefined || this.parent.open === false) {
            this._write();
        }
    };

    this._write = function() {
        this.writer.buffer += '<' + this.name;
        for (var idx in this.namespaces) {
            if (idx === undefined) {
                this.writer.buffer += ' xmlns="' + this.namespaces[idx] + '"';
            } else {
                this.writer.buffer += ' xmlns:' + idx + '="' + this.namespaces[idx] + '"';
            }
        }
        for (var idx in this.attributes) {
            this.writer.buffer += ' ' + idx + '="' + this.attributes[idx] + '"';
        }
        if (this.children.length === 0) {
            this.writer.buffer += '/>';
        } else {
            this.writer.buffer += '>';
            for (var idx in this.children) {
                this.children[idx]._write();
            }
            this.writer.buffer += '</' + this.name + '>';
        }
    };
}

function XmlWriter(options) {
    var options = options || {};
    this.version = options.version || '1.0';
    this.encoding = options.encoding || 'UTF-8';

    this.root = undefined;
    // the content itself
    this.buffer = '';
    this.namespaces = {};

    this.startDocument = function() { 
        this.buffer += '<?xml version="' + this.version + '" encoding="' + this.encoding + '" ?>';
    };

    this.addNamespace = function(url, prefix) {
        this.namespaces[prefix] = url;
    };

    this.startElement = function(name, ns) {
        this.root = new XmlElement(this, undefined, name, ns);
        this.root.namespaces = this.namespaces;
        return this.root;
    };

    this.endDocument = function() { 
        if (this.root === undefined) 
            throw new Error('No root element in document');
        if (this.root.open) 
            throw new Error('Root element not closed');
    };

    this.toString = function() {
        return this.buffer;
    }
}
exports.XmlWriter = XmlWriter;

