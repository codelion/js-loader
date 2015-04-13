
/*
Copyright (c) 2012 ElevenBlack
Written by Ciocanel Razvan (chocksy.com)
 */


/*
A self-contained loader library
 */

(function() {
  window.widgetLoader = (function(window, document) {
    "use strict";
    var $s, addSideButton, addWidget, addWidgetListeners, assignModal, cssNumber, defaults, elements, error, isMobile, loadModule, make, openModal, trace;
    defaults = {
      widget_domain: '//location.for.iframe.widget',
      domain: '//domain.for.iframe.widget',
      modal_width: false,
      modal_height: false,
      iframe_widget: false,
      iframe_width: "100%",
      iframe_height: "100%",
      side_btn: true
    };
    cssNumber = {
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    };
    elements = {
      side_btn_content: '<div id="WDG_sideBtn_ctn"><a href="#" id="WDG_sideBtn">Errors Widget</a></div>',
      side_btn: "#WDG_sideBtn"
    };
    assignModal = function() {
      return $s('.el-modal').on('click', (function(_this) {
        return function(e) {
          var element, moduleInfo, widget_token;
          e.preventDefault();
          element = e.currentTarget;
          widget_token = element.getAttribute('data-widget');
          moduleInfo = JSON.stringify({
            url: widget_token
          });
          return loadModule({
            data: moduleInfo
          });
        };
      })(this));
    };
    loadModule = function(e) {
      var info_received;
      info_received = JSON.parse(e.data);
      window.ELopts.widget_url = info_received.url;
      window.ELopts.domain = window.ELopts.widget_domain;
      if (info_received.domain !== void 0) {
        window.ELopts.domain = info_received.domain;
      }
      if (isMobile()) {
        return window.open(window.ELopts.domain + "?id=" + window.ELopts.widget_url, '_blank');
      } else {
        return openModal();
      }
    };
    openModal = function() {
      var current_height, current_width, outerHeight, outerWidth, widget_height, widget_width;
      current_height = make().getWindow('height');
      current_width = make().getWindow('width');
      widget_width = window.ELopts.modal_width ? window.ELopts.modal_width : current_width / 1.2;
      widget_height = window.ELopts.modal_height ? window.ELopts.modal_height : current_height / 1.6;
      outerWidth = typeof widget_width === "number" ? current_width - widget_width : current_width * parseInt(widget_width) / 100;
      outerHeight = typeof widget_height === "number" ? current_height - widget_height : current_height * parseInt(widget_height) / 100;
      return picoModal({
        content: '<iframe id="WDG_widgetIframe" src="' + window.ELopts.domain + "?id=" + window.ELopts.widget_url + '" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>',
        overlayStyles: {
          backgroundColor: "#333",
          opacity: "0.3"
        },
        modalStyles: {
          width: widget_width,
          height: widget_height,
          top: "20%",
          background: "#fff",
          boxShadow: "0px 0px 7px #444",
          border: "1px solid #444",
          borderRadius: "3px",
          marginLeft: -outerWidth / 2 + "px"
        }
      });
    };
    addSideButton = function() {
      var moduleInfo;
      $s('body').append(elements.side_btn_content);
      moduleInfo = JSON.stringify({
        url: window.ELopts.widget_url
      });
      $s(elements.side_btn).stylize({
        position: "fixed",
        top: "20%",
        left: "0",
        width: "90px",
        height: "90px",
        background: "url(//i.imgur.com/jxoB4das.png)",
        textIndent: "-9999px",
        boxShadow: "2px 1px 4px #ccc",
        borderRadius: "5px"
      });
      $s(elements.side_btn).on("click", (function(_this) {
        return function(event) {
          loadModule({
            data: moduleInfo
          });
          return event.preventDefault();
        };
      })(this));
      return false;
    };
    addWidget = function() {
      var $el, url, widget_iframe_html;
      url = window.ELopts.domain + "?id=" + window.ELopts.widget_url + ("?theme=" + window.ELopts.theme);
      widget_iframe_html = '<iframe id="iframe_widget" src="' + url + '" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>';
      $el = $s(window.ELopts.widget_container);
      return $el.html(widget_iframe_html);
    };
    isMobile = function() {
      return /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());
    };
    $s = function(a, b) {
      var elem, fas;
      a = a.match(/^(\W)?(.*)/);
      elem = (b || document)["getElement" + (a[1] ? (a[1] === "#" ? "ById" : "sByClassName") : "sByTagName")](a[2]);
      fas = {
        elem: elem,
        data: function(dataAttr) {
          return elem.getAttribute("data-" + dataAttr);
        },
        html: function(content) {
          elem.innerHTML = content;
          return fas;
        },
        stylize: function(styles) {
          var prop, type;
          styles = styles || {};
          if (typeof styles.opacity !== "undefined") {
            styles.filter = "alpha(opacity=" + (styles.opacity * 100) + ")";
          }
          for (prop in styles) {
            if (styles.hasOwnProperty(prop)) {
              type = typeof styles[prop];
              if (type === "number" && !cssNumber[prop]) {
                styles[prop] += "px";
              }
              elem.style[prop] = styles[prop];
            }
          }
          return fas;
        },
        append: function(html) {
          var c, el;
          c = document.createElement("p");
          c.innerHTML = html;
          el = elem;
          if (elem.length) {
            el = elem[0];
          }
          el.appendChild(c.firstChild);
          return fas;
        },
        destroy: function() {
          if (!!elem) {
            document.body.removeChild(elem);
          }
          return fas;
        },
        on: function(eventName, handler) {
          var el, i;
          if (elem.length) {
            elements = elem;
          } else {
            elements = [elem];
          }
          if (elements.length > 0) {
            i = 0;
            while (i < elements.length) {
              el = elements[i];
              if (el.addEventListener) {
                el.addEventListener(eventName, handler);
              } else if (el.attachEvent) {
                el.attachEvent("on" + eventName, function() {
                  return handler.call(elem);
                });
              }
              i++;
            }
          }
        }
      };
      return fas;
    };
    make = function() {
      var fas;
      fas = {
        extend: function(out) {
          var i, key, obj;
          out = out || {};
          i = 1;
          while (i < arguments.length) {
            obj = arguments[i];
            if (!obj) {
              continue;
            }
            for (key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === "object") {
                  extend(out[key], obj[key]);
                } else {
                  out[key] = obj[key];
                }
              }
            }
            i++;
          }
          return out;
        },
        getWindow: function(type) {
          var d, e, g, w, x, y;
          w = window;
          d = document;
          e = d.documentElement;
          g = d.getElementsByTagName('body')[0];
          x = w.innerWidth || e.clientWidth || g.clientWidth;
          y = w.innerHeight || e.clientHeight || g.clientHeight;
          if (type === 'width') {
            return x;
          }
          if (type === 'height') {
            return y;
          }
        }
      };
      return fas;
    };
    addWidgetListeners = function() {
      var eventMethod, eventer, messageEvent;
      trace("adding listener for selecting the date for showing time");
      eventMethod = (window.addEventListener ? "addEventListener" : "attachEvent");
      eventer = window[eventMethod];
      messageEvent = (eventMethod === "attachEvent" ? "onmessage" : "message");
      return eventer(messageEvent, ((function(_this) {
        return function(e) {
          return loadModule(e);
        };
      })(this)), false);
    };
    trace = function(s) {
      if (window["console"] !== undefined) {
        return window.console.log("widgetLoader: " + s);
      }
    };
    error = function(s) {
      if (window["console"] !== undefined) {
        return window.console.error("widgetLoader: " + s);
      }
    };
    return function(options) {
      window.ELopts = make().extend({}, defaults, options);
      trace("constructor");
      if (window.ELopts.iframe_widget) {
        addWidget();
        addWidgetListeners();
      }
      if (window.ELopts.side_btn) {
        addSideButton();
      }
      assignModal();
      return false;
    };
  })(window, document);

  window.onload = function() {
    if (_lopts.widget_container === void 0) {
      _lopts.widget_container = 'body';
    }
    return widgetLoader(_lopts);
  };

}).call(this);
