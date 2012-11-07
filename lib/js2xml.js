var dateFormat = require('dateformat');
var test = require('validate-type');
var Writer = require('./writer').XmlWriter;

function emit(w, counter, circular, o, n, options) {
    var p = options.defaultPrefix;
    if (test.isString(o)) {
        var elem = n === undefined ? p + ':value' : n;
        var e = w.startElement(elem);
        e.addText(o);
        e.endElement(elem);
    } else if (test.isInteger(o)) {
        var elem = n === undefined ? p + ':value' : n;
        var e = w.startElement(elem);
        e.addAttribute('xsi:type', 'xsd:integer');
        e.addText(o.toString());
        e.endElement(elem);
    } else if (test.isFloat(o)) {
        var elem = n === undefined ? p + ':value' : n;
        var e = w.startElement(elem);
        e.addAttribute('xsi:type', 'xsd:float');
        e.addText(o.toString());
        e.endElement(elem);
    } else if (test.isBoolean(o)) {
        var elem = n === undefined ? p + ':value' : n;
        var e = w.startElement(elem);
        e.addAttribute('xsi:type', 'xsd:boolean');
        e.addText(o.toString());
        e.endElement(elem);
    } else if (test.isDate(o)) {
        var elem = n === undefined ? p + ':value' : n;
        var val = dateFormat(o, "yyyy-mm-dd'T'hh:MM:sso");
        var e = w.startElement(elem);
        e.addAttribute('xsi:type', 'xsd:dateTime');
        e.addText(val);
        e.endElement(elem);
    } else if (test.isArray(o)) {
        var elem = n === undefined ? p + ':Array' : n;
        var child = w.startElement(elem);
        for (var idx in o) {
            emit(child, circular, counter, o[idx], '_' + idx, options);
        }
        child.endElement(elem);
    } else {
        var name = n === undefined ? p + ':Object' : n;
        circular[o] = counter;
        var e = w.startElement(name).addAttribute('id', counter.toString());
        if (options.constructorNames === true && o.constructor.name !== 'Object') {
            e.addAttribute('constructor', o.constructor.name);
        }
        counter = counter + 1;
        for (var idx in o) {
            var existing = circular[o[idx]];
            if (existing !== undefined) {
                var child = idx;
                var e2 = e.startElement(child)
                e2.addAttribute('idref', existing.toString())
                e2.endElement(child);
            } else {
                emit(e, counter, circular, o[idx], idx, options);
            }
        }
        e.endElement(elem);
    }
}

function toXml(object, options) {

    options = options || {};
    var w = new Writer();

    w.addNamespace('http://www.w3.org/2001/XMLSchema', 'xsd');
    w.addNamespace('http://www.w3.org/2001/XMLSchema-instance', 'xsi');

    options.defaultPrefix = options.defaultPrefix || 'js';
    options.defaultUrl = options.defaultUrl || 'http://www.example.org/js2xml';
    w.addNamespace( options.defaultUrl, options.defaultPrefix);

    var circular = {};

    w.startDocument()
    emit(w, 1, circular, object, options.rootName, options);
    w.endDocument();

    return w.toString();
}
exports.toXml = toXml;

