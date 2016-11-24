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
                donotencode: true
            }
        }
    },
    elements: {
        htmlTextBox: {
            item: document.getElementById("htmlInput"),
            type: 'change'
        }
    },
    startStaticHtmlParser: function() {
        this.addEventListeners();
    },
    addEventListeners: function() {
        _self = this;
        this.elements.htmlTextBox.item.addEventListener(this.elements.htmlTextBox.type, function() {
            _self.statics._HTML = this.value.trim();
            _self.convert2Jade(_self.statics._HTML, null)
        })
    },
    convert2Jade: function(string, options) {
        var _self = this;
        var options = options || _self.options.converters.jade;

        Html2Jade.convertHtml(string, options, function(err, output) {
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
            "_id": "urn:sony:module:html_template:123456",
            "type": "urn:sony:module:html_template",
            "name": "example",
            "locale": "fr_FR",
            "template": "wtbW9kdWxlIHtmb250LWZhbWlseTogJ1JhbGV3YXknLCBz",
            "css": "",
            "js": "",
            "fields":this.statics._JSON.fields,
            "template": this.statics._ENCODED 
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
    },
    getStatics: function() {
        return this.statics;
    },
    getOutputJsonModel:function(){
        console.log(JSON.stringify());
        return this.statics._OUTPUT;
    }
}

StaticHtmlParser.init();