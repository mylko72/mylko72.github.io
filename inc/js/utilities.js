(function($){
	
	$.Utilities = function(){

		var $thewindow = $(window);
		var $htmlBody = $('html, body');
		var metrics = {
			init : init,
			getScrollTop : getScrollTop,
			goToScroll : goToScroll,
			calcTop : calcTop,
			device : detectDevice,
			realWidth : checkWidth
		};

		function checkWidth(){
			var real_width;
            if (detectDevice().isMobile() !== null){
                real_width = $(window).width();
            } else {
                real_width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
            }
            return real_width;
        }

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

		function detectDevice(){
			var mobile;
			var device = {
				isIOS : isIOS,
				isIOS7 : isIOS7,
				isIE8Less : isIE8Less,
				isIE8 : isIE8,
				isIE9 : isIE9,
				isIE : isIE,
				isAndroid : isAndroid,
				isBlackBerry : isBlackBerry,
				isiOS : isiOS,
				isOpera : isOpera,
				isWindows : isWindows,
				isMobile : isMobile,
				isSafari : isSafari
			};

		   function isIOS() {
				var iOS=/iPhone|iPod|iPad/.test(window.navigator.userAgent);
				if (iOS) {
					$('body').addClass('ios');
				}
				return (iOS);
			}

			function isIOS7() {
				var iOS7=/(iPad|iPhone);.*CPU.*OS 7_\d/i.test(window.navigator.userAgent);
				return (iOS7);
			}


			function isIE8Less() {
				if(!isIE()){
					return false;
				}

				var IE8 = /MSIE\s([\d.]+)/.test(window.navigator.userAgent),
					version = Number(RegExp.$1);
				if(version < 9) {
					return true;
				}
				return false;
			}

			function isIE8() {
				var IE8 = /MSIE\s([\d.]+)/.test(window.navigator.userAgent),
					version = Number(RegExp.$1);
				if(version === 8) {
					$('body').addClass('ie8');
					return (version);
				}
			}

			function isIE9() {
				var IE9 = /MSIE\s([\d.]+)/.test(window.navigator.userAgent),
					version = Number(RegExp.$1);
				if(version === 9) {
					$('body').addClass('ie9');
					return (version);
				}
				return false;
			}

			function isIE () {

				var app = navigator.appName,
					reg = new RegExp('Trident/.*rv:([0-9]{1,}[\/.0-9]{0,})'),
					result = false;

				if (app === 'Microsoft Internet Explorer' || (app === 'Netscape' && reg.exec(navigator.userAgent) !== null)) {
					result = true;
				}

				return result;
			}

			function isAndroid() {
				return navigator.userAgent.match(/Android/i);
			}
			function isBlackBerry() {
				return navigator.userAgent.match(/BlackBerry/i);
			}
			function isiOS() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			}
			function isOpera() {
				return navigator.userAgent.match(/Opera Mini/i);
			}
			function isWindows() {
				return navigator.userAgent.match(/IEMobile/i);
			}
			function isMobile() {
				if (mobile === undefined){
					mobile = (isAndroid() || isBlackBerry() || isiOS() || isOpera() || isWindows());
				}
				return mobile;
			}

			function isSafari() {
				var safari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
				if (safari) {
					$('body').addClass('safari');
					return (safari);
				}
			}

			return device; 
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
