//Navigation Script
$(function() {
    var pull = $('#pull');
    var menu = $('nav ul');

    $(pull).on('click', function(e) {
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

    $('a').click(function() {
        var href = $.attr(this, 'href');

        $root.animate({
            scrollTop: $(href).offset().top - 50
        }, 800, function () {
            window.location.hash = href;
        });
    
        return false;
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
          icon: '../img/googlepointer.png',
          size: new google.maps.Size(10, 10)
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
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
