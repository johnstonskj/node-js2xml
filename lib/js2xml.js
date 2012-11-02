var genx = require('genx');
var dateFormat = require('dateformat');
var test = require('validate-type');

function declareElement(w, elements, name) {
    var element = elements[name];
    if (element === undefined) {
        element = w.declareElement(name);
        elements[name] = element;
    } 
    return element;
}
        
function emit(w, elements, counter, circular, o, n) {
    if (test.isString(o)) {
        var elem = n === undefined ? elements['js:value'] : declareElement(w, elements, n);
        w = w.startElement(elem).addText(o).endElement(elem);
    } else if (test.isInteger(o)) {
        var elem = n === undefined ? elements['js:value'] : declareElement(w, elements, n);
        w = w.startElement(elem).addAttribute(elements['xsi:type'], 'xsd:integer').addText(o.toString()).endElement(elem);
    } else if (test.isFloat(o)) {
        var elem = n === undefined ? elements['js:value'] : declareElement(w, elements, n);
        w = w.startElement(elem).addAttribute(elements['xsi:type'], 'xsd:float').addText(o.toString()).endElement(elem);
    } else if (test.isBoolean(o)) {
        var elem = n === undefined ? elements['js:value'] : declareElement(w, elements, n);
        w = w.startElement(elem).addAttribute(elements['xsi:type'], 'xsd:boolean').addText(o.toString()).endElement(elem);
    } else if (test.isDate(o)) {
        var elem = n === undefined ? elements['js:value'] : declareElement(w, elements, n);
        var val = dateFormat(o, "yyyy-mm-dd'T'hh:MM:sso");
        w = w.startElement(elem).addAttribute(elements['xsi:type'], 'xsd:dateTime').addText(val).endElement(elem);
    } else if (test.isArray(o)) {
        var elem = n === undefined ? elements['js:Array'] : declareElement(w, elements, n);
        w = w.startElement(elem);
        for (var idx in o) {
            emit(w, elements, circular, counter, o[idx], '_' + idx);
        }
        w = w.endElement(elem);
    } else {
        var elem = n === undefined ? elements['js:Object'] : declareElement(w, elements, n);
        circular[o] = counter;
        w = w.startElement(elem).addAttribute(elements[':id'], counter.toString());
        counter = counter + 1;
        for (var idx in o) {
            var existing = circular[o[idx]];
            if (existing !== undefined) {
                var child = declareElement(w, elements, idx);
                w = w.startElement(child).addAttribute(elements[':idref'], existing.toString()).endElement(child);
            } else {
                emit(w, elements, counter, circular, o[idx], idx);
            }
        }
        w = w.endElement(elem);
    }
    return w;
}

function toXml(object, options) {

    options = options || {};
    var w = new genx.Writer();

    var buffer = '';
    w.on('data', function(data) {
        buffer += data;
    });

    var xsd = w.declareNamespace('http://www.w3.org/2001/XMLSchema', 'xsd');
    var xsi = w.declareNamespace('http://www.w3.org/2001/XMLSchema-instance', 'xsi');

    var ns  = w.declareNamespace(
        (options.defaultUrl || 'http://www.example.org/js2xml'), 
        (options.defaultPrefix || 'js'));

    var elements = {};
    elements['js:Object'] = w.declareElement(ns, 'Object');
    elements['js:Array'] = w.declareElement(ns, 'Array');
    elements['js:value'] = w.declareElement(ns, 'value');
    elements['xsi:type'] = w.declareAttribute(xsi, 'type');
    elements[':id'] = w.declareAttribute('id');
    elements[':idref'] = w.declareAttribute('idref');

    var circular = {};

    var s = w.startDocument()
    s = emit(s, elements, 1, circular, object, options.rootName);

    s.endDocument();

    return buffer;
}
exports.toXml = toXml;

