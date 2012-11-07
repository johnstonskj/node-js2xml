var should = require('should');
var XmlWriter = require('../lib/writer').XmlWriter;

describe('XmlWriter', function() {

    describe('#()', function() {

        it('No options', function(done) {
            var writer = new XmlWriter();
            writer.startDocument();
            var element = writer.startElement('Test');
            element.endElement();
            writer.endDocument();
            writer.toString().should.equal(
                '<?xml version="1.0" encoding="UTF-8" ?><Test/>',
                'Badly generated XML');
            done();
        });

        it('Set XML pi version', function(done) {
            var writer = new XmlWriter({version: '2.0'});
            writer.startDocument();
            var element = writer.startElement('Test');
            element.endElement();
            writer.endDocument();
            writer.toString().should.equal(
                '<?xml version="2.0" encoding="UTF-8" ?><Test/>',
                'Badly generated XML');
            done();
        });

        it('Set XML pi encoding', function(done) {
            var writer = new XmlWriter({encoding: 'UTF-16'});
            writer.startDocument();
            var element = writer.startElement('Test');
            element.endElement();
            writer.endDocument();
            writer.toString().should.equal(
                '<?xml version="1.0" encoding="UTF-16" ?><Test/>',
                'Badly generated XML');
            done();
        });

    });

    describe('#endDocument()', function() {

        it('No root element, or startDocument', function(done) {
            var writer = new XmlWriter();
            (function() {
                writer.endDocument();
            }).should.throw();
            done();
        });

        it('No root element', function(done) {
            var writer = new XmlWriter();
            writer.startDocument();
            (function() {
                writer.endDocument();
            }).should.throw();
            done();
        });

        it('Root element still open', function(done) {
            var writer = new XmlWriter();
            writer.startDocument();
            var element = writer.startElement('Test');
            (function() {
                writer.endDocument();
            }).should.throw();
            done();
        });

    });

    describe('#addNamespace()', function() {

        it('adding root namespaces, before', function(done) {
            var writer = new XmlWriter({encoding: 'UTF-16'});
            writer.startDocument();
            writer.addNamespace('http://example.org/people', 'people');
            writer.addNamespace('http://example.org/places', 'places');
            var element = writer.startElement('Test');
            element.endElement();
            writer.endDocument();
            writer.toString().should.equal(
                '<?xml version="1.0" encoding="UTF-16" ?><Test xmlns:people="http://example.org/people" xmlns:places="http://example.org/places"/>',
                'Badly generated XML');
            done();
        });

        it('adding root namespaces, after', function(done) {
            var writer = new XmlWriter({encoding: 'UTF-16'});
            writer.startDocument();
            var element = writer.startElement('Test');
            writer.addNamespace('http://example.org/people', 'people');
            writer.addNamespace('http://example.org/places', 'places');
            element.endElement();
            writer.endDocument();
            writer.toString().should.equal(
                '<?xml version="1.0" encoding="UTF-16" ?><Test xmlns:people="http://example.org/people" xmlns:places="http://example.org/places"/>',
                'Badly generated XML');
            done();
        });

        it('adding root, and element, namespaces', function(done) {
            var writer = new XmlWriter({encoding: 'UTF-16'});
            writer.startDocument();
            writer.addNamespace('http://example.org/people', 'people');
            writer.addNamespace('http://example.org/places', 'places');
            var element = writer.startElement('Test');
            element.addNamespace('http://example.org/things', 'things');
            element.endElement();
            writer.endDocument();
            writer.toString().should.equal(
                '<?xml version="1.0" encoding="UTF-16" ?><Test xmlns:people="http://example.org/people" xmlns:places="http://example.org/places" xmlns:things="http://example.org/things"/>',
                'Badly generated XML');
            done();
        });

    });

    describe('#addAttribute()', function() {

        it('Add simple attribute', function(done) {
            var writer = new XmlWriter({encoding: 'UTF-16'});
            writer.startDocument();
            var element = writer.startElement('Test');
            element.addAttribute('id', '987245');
            element.endElement();
            writer.endDocument();
            writer.toString().should.equal(
                '<?xml version="1.0" encoding="UTF-16" ?><Test id="987245"/>',
                'Badly generated XML');
            done();
        });

    });

    describe('#startElement()', function() {

        it('Add nested elements', function(done) {
            var writer = new XmlWriter({encoding: 'UTF-16'});
            writer.startDocument();
            for (var i = 0; i < 5; i++) {
                var element = writer.startElement('Test');
                element.addAttribute('id', i.toString());
                for (var x = 0; x < 2; x++) {
                    var child = element.startElement('child');
                    child.addAttribute('id', i.toString() + '-' + x.toString());
                    child.endElement();
                }
                element.endElement();
            }
            writer.endDocument();
            writer.toString().should.equal(
                '<?xml version="1.0" encoding="UTF-16" ?><Test id="0"><child id="0-0"/><child id="0-1"/></Test><Test id="1"><child id="1-0"/><child id="1-1"/></Test><Test id="2"><child id="2-0"/><child id="2-1"/></Test><Test id="3"><child id="3-0"/><child id="3-1"/></Test><Test id="4"><child id="4-0"/><child id="4-1"/></Test>',
                'Badly generated XML');
            done();
        });

    });

});
