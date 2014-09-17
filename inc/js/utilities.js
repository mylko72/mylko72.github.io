(function($){
	
	$.Utilities = function(){

		var $thewindow = $(window);
		var $htmlBody = $('html, body');
		var metrics = {
			init : init,
			getScrollTop : getScrollTop,
			goToScroll : goToScroll,
			calcTop : calcTop
		};

		function getScrollTop() {
			return $thewindow.scrollTop();
		}
		
		/**
		 Scrolls to an element.
		 @class $.scrollTo
		 @constructor

		 @param {HTMLElement} element - the element you want the body to scroll to.
		 @param {Number} position (optional) - the top coordinate where to scroll to.
		 @param {Number} speed (optional) - speed of scroll.
		 @param {Function} func (optional) - callback function to be called after scroll
		 **/
		function goToScroll(element, position, speed, func, area){
			var pos = position || $(element).offset().top,
				_speed = speed || 800,
				callback = (func) ? func() : null,
				_area = area || 0;
			$htmlBody.animate({scrollTop : pos - _area}, _speed, function(){callback;});
		}	

		function calcTop(elem){
			var offset = elem.offset();
			return offset.top
		}

		function init(){

			$('<div id="toTop">Back to Top</div>').appendTo($('body'));

			bindEvents();
		}

		/**
		@function bindEvents
		**/
		function bindEvents(){
			$(window).scroll(function() {
				if($(this).scrollTop() > $thewindow.height()) {
					$('#toTop').fadeIn();	
				} else {
					$('#toTop').fadeOut();
				}
			});

			$('#toTop').click(function() {
				$htmlBody.animate({scrollTop:0},800);
			});	
			
		}

		return metrics;
	};

}(jQuery));
