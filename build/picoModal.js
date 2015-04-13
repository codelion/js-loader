
/*
Copyright (c) 2012 James Frasca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */


/*
A self-contained modal library
 */

(function() {
  window.picoModal = (function(window, document) {
    "use strict";
    var cssNumber, make, observable, overlay;
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
    observable = function() {
      var callbacks;
      callbacks = [];
      return {
        watch: function(callback) {
          callbacks.push(callback);
        },
        trigger: function() {
          var i;
          i = 0;
          while (i < callbacks.length) {
            window.setTimeout(callbacks[i], 1);
            i++;
          }
        }
      };
    };
    make = function(parent) {
      var elem, iface;
      elem = document.createElement("div");
      (parent || document.body).appendChild(elem);
      iface = {
        elem: elem,
        child: function() {
          return make(elem);
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
          return iface;
        },
        clazz: function(clazz) {
          elem.className += clazz;
          return iface;
        },
        html: function(content) {
          elem.innerHTML = content;
          return iface;
        },
        getWidth: function() {
          return elem.clientWidth;
        },
        onClick: function(callback) {
          if (elem.attachEvent) {
            elem.attachEvent("onclick", callback);
          } else {
            elem.addEventListener("click", callback);
          }
          return iface;
        },
        destroy: function() {
          document.body.removeChild(elem);
          return iface;
        }
      };
      return iface;
    };
    overlay = function(getOption) {
      var clickCallbacks, elem;
      clickCallbacks = observable();
      elem = make().clazz("pico-overlay").stylize({
        display: "block",
        position: "fixed",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        zIndex: 10000
      }).stylize(getOption("overlayStyles", {
        opacity: 0.5,
        background: "#000"
      })).onClick(clickCallbacks.trigger);
      return {
        elem: elem.elem,
        destroy: elem.destroy,
        onClick: clickCallbacks.watch
      };
    };
    return function(options) {
      var close, closeButton, closeCallbacks, elem, getOption, shadow, width;
      getOption = function(opt, defaultValue) {
        if (options[opt] === void 0) {
          return defaultValue;
        } else {
          return options[opt];
        }
      };
      if (typeof options === "string") {
        options = {
          content: options
        };
      }
      shadow = overlay(getOption);
      closeCallbacks = observable();
      elem = make().clazz("pico-content").stylize({
        display: "block",
        position: "fixed",
        zIndex: 10001,
        left: "50%",
        top: "50px"
      }).html(options.content);
      width = getOption("width", elem.getWidth());
      elem.stylize({
        width: width + "px",
        margin: "0 0 0 " + (-(width / 2) + "px")
      }).stylize(getOption("modalStyles", {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "5px"
      }));
      close = function() {
        closeCallbacks.trigger();
        shadow.destroy();
        elem.destroy();
      };
      if (getOption("overlayClose", true)) {
        shadow.onClick(close);
      }
      closeButton = void 0;
      if (getOption("closeButton", true)) {
        closeButton = elem.child().html(getOption("closeHtml", "&#xD7;")).clazz("pico-close").stylize(getOption("closeStyles", {
          borderRadius: "2px",
          cursor: "pointer",
          height: "15px",
          width: "15px",
          position: "absolute",
          top: "5px",
          right: "5px",
          fontSize: "16px",
          textAlign: "center",
          lineHeight: "15px",
          background: "#CCC"
        })).onClick(close);
      }
      return {
        modalElem: elem.elem,
        closeElem: (closeButton ? closeButton.elem : null),
        overlayElem: shadow.elem,
        close: close,
        onClose: closeCallbacks.watch
      };
    };
  })(window, document);

}).call(this);
