(function() {
  (function($) {
    var methods;
    methods = {
      init: function(options) {
        var defaults;
        defaults = {
          top: "auto",
          autoOpen: false,
          overlayOpacity: 0.5,
          overlayColor: "#000",
          overlayClose: true,
          closeOnEscape: true,
          closeButtonClass: ".close",
          onOpen: false,
          onClose: false
        };
        options = $.extend(defaults, options);
        return this.each(function() {
          var $modal, $overlay, o;
          o = options;
          $overlay = $("<div class=\"lean-overlay\"></div>");
          $overlay.css({
            display: "none",
            position: "fixed",
            "z-index": 2000,
            top: 0,
            left: 0,
            height: 100 + "%",
            width: 100 + "%",
            background: o.overlayColor,
            opacity: o.overlayOpacity
          }).appendTo("body");
          $modal = $(this);
          $modal.css({
            display: "none",
            position: "fixed",
            "z-index": 2001,
            left: 50 + "%",
            borderRadius: "7px",
            top: (parseInt(o.top) > -1 ? o.top + "px" : 50 + "%"),
            "margin-left": -($modal.outerWidth() / 2) + "px",
            "margin-top": (parseInt(o.top) > -1 ? 0 : -($modal.outerHeight() / 2)) + "px"
          });
          $modal.bind("openModal", function(e) {
            $(this).css("display", "block");
            return $overlay.fadeIn(200, function() {
              if (o.onOpen && typeof o.onOpen === "function") {
                return o.onOpen($modal[0]);
              }
            });
          });
          $modal.bind("closeModal", function(e) {
            $(this).css("display", "none");
            return $overlay.fadeOut(200, function() {
              if (o.onClose && typeof o.onClose === "function") {
                return o.onClose($modal[0]);
              }
            });
          });
          $overlay.click(function() {
            if (o.overlayClose) {
              return $modal.trigger("closeModal");
            }
          });
          $(document).keydown(function(e) {
            if (o.closeOnEscape && e.keyCode === 27) {
              return $modal.trigger("closeModal");
            }
          });
          $modal.find(o.closeButtonClass).click(function(e) {
            $modal.trigger("closeModal");
            return e.preventDefault();
          });
          if (o.autoOpen) {
            return $modal.trigger("openModal");
          }
        });
      }
    };
    return $.fn.easyModal = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.easyModal");
      }
    };
  })(jQuery);

}).call(this);
