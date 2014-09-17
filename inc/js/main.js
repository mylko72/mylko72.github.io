(function ($) {

    /**
	Global object which lives on every page.  This object will handle the creation of other necessary objects for page functionality. 
	@class $.Global
	@constructor
	**/
    $.Main= function () {

        /** 
		Init function will check for specific body classes and create the necessary page object.
		@function init
		**/
        function init() {
			//new $.MotionEffect('.work', {container:'.recent-work', animation:'slide', offsetX:-100, easing:'ease-out-quint', duration:500});
			new $.MotionEffect('.circle', {container:'.my-ability', animation:'scale', easing:'ease', duration:500});
		}
		
		init();

	};

}(jQuery));

$(function (){
	new $.Main();
});
