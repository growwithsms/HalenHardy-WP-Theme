//@prepros-prepend vendor/jquery.waypoints.js
//@prepros-prepend vendor/sticky.js
//@prepros-prepend vendor/inview.js
//@prepros-prepend vendor/bodymovin_light.js
//@prepros-prepend vendor/jquery.fitvids.js

// on ready
jQuery(document).ready(function($) {

    // Animate oil if the oil div exists on page
    if ($('#oil').length) {
        // Oil Animation
        var animation = bodymovin.loadAnimation({
            container: document.getElementById('oil'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/wp-content/themes/halenhardy/assets/js/oil-animation-data.json'
        });
    }

    // Responsive Embeds
    $(".site-main").fitVids({
        customSelector: "iframe[src^='https://www.google.com/maps']"
    });

    // Smooth scroll and focus to footer search
    $('a[href="#search"]').on('click', function(event) {
        
        event.preventDefault();
        
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          var $target = $('#search input');
          $target.focus();
        });
        
    });

    // About Page
    // $(".team-member").on('click', function() {
    //     $(this).toggleClass('active');
    // });

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

    // Spilltration Page
    if($('.page-template-template-spilltration').length) {
        var spilltrationSection = new Waypoint.Inview({
            element: $('#functionality')[0],
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
        var spilltrationSection = new Waypoint.Inview({
            element: $('#space')[0],
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
        var spilltrationSection = new Waypoint.Inview({
            element: $('#speed')[0],
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
        var spilltrationSection = new Waypoint.Inview({
            element: $('#waste')[0],
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
        var spilltrationSection = new Waypoint.Inview({
            element: $('#ultraviolet')[0],
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
        var spilltrationSection = new Waypoint.Inview({
            element: $('#sustainability')[0],
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
        var spilltrationSection = new Waypoint.Inview({
            element: $('#cost')[0],
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
    $('body:not(.woocommerce) a[href*="#"]:not([href="#search"])')
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



        ////////////////////
        // Smart Leadflow
        ////////////////////

        // Cookie functions
        function createCookie(name,value,days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        }
        function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
        function eraseCookie(name) {
            createCookie(name,"",-1);
        }

        // set cookie on cta click
        $(document).on('click', '#smart-leadflow img', function(){
            createCookie('smartleadflowexited','smartleadflowexited',14);
        });

        // When the user clicks on <span> (x), close the modal
        $(document).on('click', '.close', function(){
            $('#smart-leadflow').hide();
            createCookie('smartleadflowexited','smartleadflowexited',14);
        });

        // On Window Load
        $( window ).load(function() {
            // delay popup 10 seconds
            setTimeout(function(){ 
                // If cookie doesn't exist, show popup
                var x = readCookie('smartleadflowexited');
                if (x != "smartleadflowexited") {
                    $('#smart-leadflow').fadeIn();
                }
            }, 10000);
        });

});



