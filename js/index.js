/**
 * 
 * @author  Burak Arslan
 * @requires he, html2jade, base64
 * @name StaticHtmlParser
 * 
 */

var StaticHtmlParser = StaticHtmlParser || {
    init: function() {
        this.startStaticHtmlParser();
    },
    statics: {
        _HTML: "",
        _JADE: "",
        _ENCODED: "",
        _DECODED: "",
        _JSON: "",
        _OUTPUT: ""
    },
    options: {
        converters: {
            jade: {
                selectById: true,
                bodyless: true,
                wrapper: true,
                wrapLength:1000,
                donotencode: true
            }
        }
    },
    elements: {
        htmlTextBox: {
            item: document.getElementById("htmlInput"),
            type: 'change'
        },
        resultBox: {
            item: document.getElementById("resultBox")
        }
    },
    startStaticHtmlParser: function() {
        this.resetStatics();
        this.checkBeforeStart() && this.addEventListeners();
    },
    syntaxHighlight: function(json) {
    
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });

    },
    checkBeforeStart: function() {
        return this.elements.htmlTextBox === null ? false : true;
    },
    addEventListeners: function() {
        _self = this;
        this.elements.htmlTextBox.item.addEventListener(this.elements.htmlTextBox.type, function() {
            _self.statics._HTML = this.value.trim();
            _self.convert2Jade(_self.statics._HTML, null)
            _self.showResults();
        })
    },
    showResults: function(argument) {

       this.elements.resultBox.item.innerHTML = this.syntaxHighlight(JSON.stringify(this.statics, undefined, 4))
    },
    convert2Jade: function(string, options) {
        var _self = this;
        _self.statics._HTML = string.trim();
        var options = options || _self.options.converters.jade;

        Html2Jade.convertHtml(_self.statics._HTML, options, function(err, output) {
            _self.statics._JADE = output.jade
            _self.statics._JSON = output.json
        });

        _self.statics._HTML.length > 0 ? _self.setStatics() : _self.resetStatics()
    },
    encodeOutput: function(string) {
        return Base64.encode(string)
    },
    decodeOutput: function(string) {
        return Base64.decode(string)
    },
    createModuleJSONPattern: function() {
        return this.statics._OUTPUT = {
            "_id": "urn:sony:module:html_template:1",
            "type": "urn:sony:module:html_template",
            "masterId":"urn:sony:module:html_template",
            "name": "example",
            "locale": "fr_FR",
            "customStaticHtml":this.statics._HTML,
            "template": this.statics._ENCODED,
            "css": "",
            "js": "",
            "fields": this.statics._JSON.fields
        }
    },
    setStatics: function() {
        this.statics._ENCODED = this.encodeOutput(this.statics._JADE)
        this.statics._DECODED = this.decodeOutput(this.statics._ENCODED)
        this.createModuleJSONPattern();
        this.getOutputJsonModel();
    },
    resetStatics: function() {
        this.statics._JADE = "";
        this.statics._ENCODED = "";
        this.statics._DECODED = "";
        this.statics._JSON = "";
        this.statics._OUTPUT = "";
    },
    getStatics: function() {
        return this.statics;
    },
    getOutputJsonModel: function() {
        return this.statics._OUTPUT;
    }
}

StaticHtmlParser.init();