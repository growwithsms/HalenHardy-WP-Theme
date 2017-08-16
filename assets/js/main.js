//@prepros-prepend vendor/jquery.waypoints.js
//@prepros-prepend vendor/sticky.js
//@prepros-prepend vendor/inview.js
//@prepros-prepend vendor/bodymovin_light.js
//@prepros-prepend vendor/jquery.fitvids.js

// on ready
$(function() {

    // Home Page...
    if ($('.home').length) {
        // Oil Animation
        var animation = bodymovin.loadAnimation({
            container: document.getElementById('oil'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/wp-content/themes/halenhardy/assets/js/oil-animation-data.json'
        });
    }

    // All Pages Other than the home page...
    else {
        // Sticky header on tablet/desktop
        if (matchMedia('only screen and (min-width: 797px)').matches) {

            var sticky = new Waypoint.Sticky({
                element: $('.site-header-top')[0]
            });

        }
    }

    // Responsive Embeds
    $(".site-main").fitVids({
        customSelector: "iframe[src^='https://www.google.com/maps']"
    });

    // About Page
    $(".team-member").on('click', function() {
        $(this).toggleClass('active');
    });

    
    // Spilltration Page
    if($('.page-template-template-spilltration').length) {
        var spilltrationSection = new Waypoint.Inview({
            element: $('#spilltration')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var spilltrationSection1 = new Waypoint.Inview({
            element: $('#spilltration-1')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var spilltrationSection2 = new Waypoint.Inview({
            element: $('#spilltration-2')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var spilltrationSection3 = new Waypoint.Inview({
            element: $('#spilltration-3')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var spilltrationSection4 = new Waypoint.Inview({
            element: $('#spilltration-4')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var spilltrationSection5 = new Waypoint.Inview({
            element: $('#spilltration-5')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
    }

    if($('.page-template-template-about').length) {
        var historySection = new Waypoint.Inview({
            element: $('#top')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var historySection11 = new Waypoint.Inview({
            element: $('#golden-days')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var historySection1 = new Waypoint.Inview({
            element: $('#early-days')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var historySection2 = new Waypoint.Inview({
            element: $('#middle-days')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var historySection3 = new Waypoint.Inview({
            element: $('#later-days')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
        var historySection4 = new Waypoint.Inview({
            element: $('#future')[0],
            enter: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).addClass('active');
            },
            exited: function(direction) {
                var thisID = this.element.id,
                    anchor = 'a[href="#' + thisID + '"]';
                $(anchor).removeClass('active');
            }
        });
    }

    // Smooth scrolling...
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function(event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function() {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

});