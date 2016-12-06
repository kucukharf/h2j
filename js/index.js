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
            item: "htmlInput",
            type: 'change'
        },
        resultBox: {
            item: "resultBox"
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
        return this.b64EncodeUnicode(string)
    },
    decodeOutput: function(string) {
        return this.b64DecodeUnicode(string)
    },
    createModuleJSONPattern: function() {
        return this.statics._OUTPUT = {
            "type": "urn:sony:module:html_template",
            "name": "example",
            "customStaticHtml":this.statics._HTML,
            "template": this.statics._ENCODED,
            "css": "",
            "js": "",
            "fields": this.statics._JSON.fields
        }
    },
    b64DecodeUnicode: function(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    },
    b64EncodeUnicode: function (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
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
