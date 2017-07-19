//@prepros-prepend vendor/jquery.waypoints.js
//@prepros-prepend vendor/sticky.js
//@prepros-prepend vendor/bodymovin_light.js

// on ready
$(function() {

	if( $('.home').length ) {
		// Oil Animation
		var animation = bodymovin.loadAnimation({
		    container: document.getElementById('oil'),
		    renderer: 'svg',
		    loop: true,
		    autoplay: true,
		    path: '/wp-content/themes/halenhardy/assets/js/oil-animation-data.json'
		});
	}
	else {
	    // Sticky header on tablet/desktop
	    if (matchMedia('only screen and (min-width: 797px)').matches) {

	        var sticky = new Waypoint.Sticky({
	            element: $('.site-header-top')[0]
	        });

	    }
	}

});