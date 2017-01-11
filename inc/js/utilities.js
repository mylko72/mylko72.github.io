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

		var myevent = {
			 'stop' : function(e){    //퍼사드메서드

				  // 이벤트 객체를 가져온다.
				  e = e || window.event;

				  // IE 이외의 모든 브라우저
				  // 기본동작이 수행되지 않게 한다.
				  if(typeof e.preventDefault === 'function'){
					   e.preventDefault();
				  }
				  // 이벤트가 상위 노드로 전파되지 않게 한다.
				  if(typeof e.stopPropagation === 'function'){
					   e.stopPropagation();
				  }
				 
				  // IE
				  // 기본동작이 수행되지 않게 한다.
				  if(typeof e.returnValue === 'boolean'){
					   e.returnValue = false;
				  }
				  // 이벤트가 상위 노드로 전파되지 않게 한다.
				  if(typeof e.cancelBubble === 'boolean'){
					   e.cancelBubble = true;
				  }
			 }
		}

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

(function ($) {
	$.Form= function () {
		
		function init(){

			bindEvents();

			$(':checked').trigger('click');
		}

		function bindEvents(){
			
			/* checkbox toggle */
			$(':checkbox').click(function(){
				var $label = $(this).next('label');
				$(this).is(':checked') ? $label.addClass('on') : $label.removeClass('on');
				$(this).is(':checked') ? $(this).prop('checked', true) : $(this).prop('checked', false);
			});

			/* radio button toggle */
			$(':radio').click(function(){
				var $label = $(this).next('label');
				console.log($label);
				var val = $(this).attr('name');
				var $labelGroup = $('input[name='+val+']').next();
				$labelGroup.removeClass('on');
				if($(this).is(':checked')){
					$('input[name='+val+']').prop('checked',false);
					$(this).prop('checked',true);
					$label.addClass('on');
				}
			});

		}

		init();

	};

}(jQuery));

$(function () {
	new $.Form();
});
