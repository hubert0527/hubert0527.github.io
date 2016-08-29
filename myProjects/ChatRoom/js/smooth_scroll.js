
	$(function() {
	  $('a[href*=#]:not([href=#])').click(function() {
		var i, len = this.classList.length;
		for(i=0;i<len;i++){
			if(this.classList[i]=="non_smooth_scroll") return;
		}
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	  });
	});
	