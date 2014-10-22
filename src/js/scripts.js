// JQuery start
$(function() {

    //Navigation Script
    var menu = $('nav ul');

    $('#pull').on('click', function(e) {
        e.preventDefault();
        menu.slideToggle();
    });

    var w;
    $(window).resize(function(){
        w = $(window).width();

        if(w > 320 && menu.is(':hidden')) {
            menu.removeAttr('style');
        }
    });

    //Smooth Scroll.
    var $root = $('html, body');

    $('#scroll').on('click', function(e) {
        e.preventDefault();
        var href = $(this).find('a').attr('href');

        $root.animate({
            scrollTop: $(href).offset().top - 50
        }, 800, function () {
            window.location.hash = href;
        });
    });

    $('nav li a').not('#open-cart').on('click', function() {
        var href = $(this).attr('href');

        $root.animate({
            scrollTop: $(href).offset().top - 50
        }, 800, function () {
            window.location.hash = href;
        });
    
        return false;
    });
    

    $('li.shop-two').on('click', function() {
        $('.content ul').removeClass('selecting-quantity-two');
        $(this).parent().addClass('selecting-quantity-two');
    });


    // products pop up on arrow click
    $('.info').on('click', function(e) {
        e.preventDefault();
        $('.product-info').bPopup();
    });


    // set quantity
    var maxValue = 999;
    $('.quantity-container').each(function() {
        var $input = $(this).find('.quantity-input');
        var $minus = $(this).find('.quantity-minus');
        var $plus = $(this).find('.quantity-plus');
        var value = 1;

        // make sure user put in only ints
        $input.on('input', function() {
            var currentValue = parseInt($(this).val());
            if (currentValue >= 1 && currentValue <= maxValue && !isNaN(currentValue)) {
                value = currentValue;
            }
            $(this).val(value);
        });

        $minus.on('click', function() {
            if (value > 1) {
                value -= 1;
                $input.val(value);
            }
        });

        $plus.on('click', function() {
            if (value < maxValue) {
                value += 1;
                $input.val(value);
            }
        });
    });

    /* jshint unused:false */
    /* global Shop:true */
    // init shop
    var shop = new Shop('#products');

    $('#open-cart').on('click', function(e) {
        e.preventDefault();
        $('#shopping-cart').bPopup();
    });

    // navigation color switch on scroll
    var t = $('#home-text').offset().top;
    $(document).scroll(function(){
        if($(this).scrollTop() > t) {
            $('header').css({'background-color': '#075c91'});
        }
        else {
            $('header').removeAttr('style');
        }
    });
});

    
// google maps
var map;

function initialize() {
    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
        center: new google.maps.LatLng(55.3809154, 10.4086351),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true
    };

    // Resize map
    google.maps.event.addDomListener(window, 'resize', function() {
       var center = map.getCenter();
       google.maps.event.trigger(map, 'resize');
       map.setCenter(center); 
    });

    map = new google.maps.Map(mapCanvas, mapOptions);

    // google maps color change
    map.set('styles', [
     {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        { saturation: -100 } // <-- THIS
      ]
    }
    ]);

    /* jshint unused:false */
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(55.3809154, 10.4086351),
      map: map,
      icon: 'img/google-pointer.png',
      size: new google.maps.Size(10, 10)
    });
}

google.maps.event.addDomListener(window, 'load', initialize);


// Parallax on scroll
(function($) {

  $.fn.visible = function(partial) {
    
      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top + 250,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;
    
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  };
    
    })(jQuery);

    var win = $(window);

    var allMods = $('.module');
    /*jshint unused:false */
    var el;
    allMods.each(function(i, el) {
      el = $(el);
      if (el.visible(true)) {
        el.addClass('already-visible');
      }
    });

    win.scroll(function() {
      
      allMods.each(function(i, el) {
        el = $(el);
        if (el.visible(true)) {
          el.addClass('come-in');
        }
      });
      
    });