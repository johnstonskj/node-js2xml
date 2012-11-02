var Assert = require('assert');
var xml = require('../lib/js2xml');

describe('js2xml', function() {

    describe('#toXml()', function() {

        it('Call with null as root', function(done) {
            var output = xml.toXml(null);
            Assert.strictEqual(
                output,
                '<js:Object xmlns:js="http://www.example.org/js2xml" id="1"></js:Object>',
                'Badly generated XML');
            done();
        });

        it('Call with undefined as root', function(done) {
            var output = xml.toXml(undefined);
            Assert.strictEqual(
                output,
                '<js:Object xmlns:js="http://www.example.org/js2xml" id="1"></js:Object>',
                'Badly generated XML');
            done();
        });

        it('Call with string as root', function(done) {
            var output = xml.toXml('root');
            Assert.strictEqual(
                output,
                '<js:value xmlns:js="http://www.example.org/js2xml">root</js:value>',
                'Badly generated XML');
            done();
        });

        it('Call with number as root', function(done) {
            var output = xml.toXml(42);
            Assert.strictEqual(
                output,
                '<js:value xmlns:js="http://www.example.org/js2xml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">42</js:value>',
                'Badly generated XML');
            done();
        });

        it('Call with date as root (test XSD date formatting)', function(done) {
            var output = xml.toXml(new Date(2012, 10, 01, 08, 54, 49));
            Assert.strictEqual(
                output,
                '<js:value xmlns:js="http://www.example.org/js2xml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:dateTime">2012-11-01T08:54:49-0700</js:value>',
                'Badly generated XML');
            done();
        });

        it('Call with array of values', function(done) {
            var output = xml.toXml([1, 2, 3, 4]);
            Assert.strictEqual(
                output,
                '<js:Array xmlns:js="http://www.example.org/js2xml"><_0 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">1</_0><_1 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">2</_1><_2 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">3</_2><_3 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">4</_3></js:Array>',
                'Badly generated XML');
            done();
        });

        it('Call with object with simple values', function(done) {
            var output = xml.toXml({
                str: 'string',
                num: 42,
                bool: true
            });
            Assert.strictEqual(
                output,
                '<js:Object xmlns:js="http://www.example.org/js2xml" id="1"><str>string</str><num xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">42</num><bool xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:boolean">true</bool></js:Object>',
                'Badly generated XML');
            done();
        });

        it('Call with object with nested values', function(done) {
            var output = xml.toXml({
                object: {
                    str: 'string',
                    num: 42,
                    bool: true
                },
                array: [1, 2, 3, 4]
            });
            Assert.strictEqual(
                output,
                '<js:Object xmlns:js="http://www.example.org/js2xml" id="1"><object idref="1"></object><array><_0 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">1</_0><_1 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">2</_1><_2 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">3</_2><_3 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">4</_3></array></js:Object>',
                'Badly generated XML');
            done();
        });

        it('Call with circular object', function(done) {
            var object = {
                str: 'string',
                num: 42,
                bool: true
            };
            object.self = object;
            var output = xml.toXml(object);
            Assert.strictEqual(
                output,
                '<js:Object xmlns:js="http://www.example.org/js2xml" id="1"><str>string</str><num xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:integer">42</num><bool xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:boolean">true</bool><self idref="1"></self></js:Object>',
                'Badly generated XML');
            done();
        });

        it('Call with options.rootName set', function(done) {
            var output = xml.toXml({name: 'value'}, {rootName: 'root'});
            Assert.strictEqual(
                output,
                '<root id="1"><name>value</name></root>',
                'Badly generated XML');
            done();
        });

        it('Call with options.defaultUrl and defaultPrefix set', function(done) {
            var output = xml.toXml({name: 'value'}, {defaultUrl: 'http://example.com/myNamespace', defaultPrefix: 'mine'});
            Assert.strictEqual(
                output,
                '<mine:Object xmlns:mine="http://example.com/myNamespace" id="1"><name>value</name></mine:Object>',
                'Badly generated XML');
            done();
        });

    });

});
