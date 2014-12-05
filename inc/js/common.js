var tram = window.tram;
var eventDriven;
var ticking = false,
	fireScroll = false,
	fireResize = false;

/* Central Location for internal events */
var eventDictionary = {
    global: {
        RESIZE: 'resize',
        ROTATE: 'rotate',
        SCROLL: 'scroll'
    }
};
/**
  Function to throttle speed of events
  @function throttle
 **/
var throttle = (function () {
	return function (fn, delay) {
		delay || (delay = 100);
		var last = (function () {
				return +new Date();
			})(),
		timeoutId = null;

		return function () {
			var args = arguments;
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}

			var now = (function () {
				return +new Date();
			})();
			if (now - last > delay) {
				fn.apply(this, args);
				last = now;
			} else {
				timeoutId = setTimeout(function () {
					fn.apply(this, args);
				}, delay);
			}
		};
	};
})();
function requestTick(ev) {
	if (!ticking) {
		window.webkitRequestAnimationFrame(function () {
			if (fireScroll) {
				eventDriven.trigger(jQuery.Event(eventDictionary.global.SCROLL)/*, ss.metrics*/);
				fireScroll = false;
			}
			if (fireResize) {
				eventDriven.trigger(jQuery.Event(eventDictionary.global.RESIZE)/*, ss.metrics*/);
				fireResize = false;
			}
			ticking = false;
		});
		ticking = true;
	}
}

(function ($) {

    /**
	Global object which lives on every page.  This object will handle the creation of other necessary objects for page functionality. 
	@class $.Global
	@constructor
	**/
    $.Global= function () {

		var gnbName = [],
			cnt = 0;

		var gnbMenu = {
			"Main" : "/home/html/index.html?hn=1",
			"Work" : "/home/html/work.html?hn=2",
			"Profile" : "/home/html/profile.html?hn=3",
			"Vim" : "/home/html/vim.html?hn=4",
			"Bookmark" : "/home/html/bookmark.html?hn=5"
		}

        /** 
		Init function will check for specific body classes and create the necessary page object.
		@function init
		**/
        function init() {
			new $.LazyLoadImages().init();
			new $.Utilities().init();

			$.each(gnbMenu, function(key,value){
				 gnbName[cnt] = new $.Gnb(key, value);
				 cnt++;
			});

			//window.location.search는 URL에 붙은 매개변수 반환
			if(!window.location.search) return false;

			var params = window.location.search.substring( 1 ),
				hn = params.split( '=' ),
				//sn = params[1].split( '=' ),
				hnNum = parseInt( hn[1] ),
				//snNum = parseInt( sn[1] ),
				gnb,
				sub,
				offsetX,
				scrollpos;

			for(var i=0,len=gnbName.length;i<len;i++){
				 if(i==0) gnbName[0].initMenu();
				 gnbName[i].makeMenu();
			}
			gnb = $('#gnb .navbar-collapse').find('.navbar-nav').children('li').eq(hnNum-1).addClass('active');
			new $.NavScroll();
			
			bindEvents();
		}

		function bindEvents(){

		}

		init();
	};

}(jQuery));


$(function () {
    /* Element for firing events through */
    eventDriven= $('<div/>');

    var global = new $.Global();
});

(function ($) {


    /**
	@class $.Gnb
	@constructor
	**/
	$.Gnb = function(key, value){
		 var $gnb, divEl, $nav, $device = null;

		 this.gnbMenu = key;
		 if(typeof value === "object") this.subMenu = value;
		 if(typeof value === "string") this.url = value;
		 this.getTest = function(){
			  alert(this.subMenu[2].title);
		 };
	};

	$.Gnb.prototype = {
		/**
		@function initMenu
		menu element 태그를 생성한다
		**/
		 initMenu: function(){
			$gnb = $('#gnb');
			divEl = document.createElement('div'); //IE8을 위해 node생성
			divEl.setAttribute('class','collapse navbar-collapse');
			$gnb.append(divEl);
			$nav= $('<ul class="nav nav-pills navbar-nav" />').appendTo($('#gnb .navbar-collapse'));
			$device= $('<ul class="nav navbar-nav navbar-right" />').appendTo($('#gnb .navbar-collapse'));
			this.addStrHtml();
		 },
		/**
		@function makeMenu
		menu를 생성한다.
		**/
		 makeMenu : function(){
			  //var cnt = 0;
			 var tmp="";
			 $nav.append($('<li />'));
			 var $list = $nav.children(':last').append($('<a />'));
			 var $link = $list.find('a').text(this.gnbMenu);
			 if(this.url!=undefined) $link.attr('href', this.url);
				 
			 if(this.subMenu!=undefined){
				 $('<ul class="drop-nav" />').insertAfter($link);
				 $('<ul class="sub-nav">').insertAfter($link);

				 for(var i=0; i<this.subMenu.length; i++){
					  tmp+='<li><a href="'+this.subMenu[i].link+'" target="'+this.subMenu[i].target+'">'+this.subMenu[i].title+'</a></li>';
				 }

				 $list.find('.drop-nav').html(tmp);
				 $list.find('.sub-nav').html(tmp);
			 }

		 },

		 addStrHtml : function(){
			var str = '<li class="dropdown">';
			str += '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Device <b class="caret"></b></a>';
			str += '<ul class="dropdown-menu">';
			str += '<li><a href="#">mobile</a></li>';
			str += '<li><a href="#">tablet</a></li>';
			str += '<li><a href="#">desktop</a></li>';
			str += '</ul>';
			str += '</li>';
			
			$device.append(str);
		 }
	};
}(jQuery));

(function ($) {

    /**
	@class $.NavScroll
	@constructor
	**/
	$.NavScroll = function(){

		var $header = $('header'),
			$headerClone = $header.contents().clone(true),
			$navScroll,
			docked = false;

        /** 
		Init function will check for specific body classes and create the necessary page object.
		@function init
		**/
        function init() {
			$navScroll = $("<div class='nav-scroll'></div>").append($headerClone).insertAfter($header);
			$navScroll.find('.device').remove();

			$.util= new $.Utilities();
			
			console.log($.util.device().isIE());
			bindEvents();
		}

		function undock(){
			if(!docked) return;

			console.log('undocked');
			$navScroll.removeClass('docked');
			docked = false;
		}

		function dock(){
			if(docked) return;

			console.log('docked');
			$navScroll.addClass('docked');
			docked = true;
		}

        /**
		@function bindEvents
		Bind events to elements on home page
		**/
        function bindEvents() {
			var headerHeight = $header.outerHeight(),
				headerTop = $header.position().top,
				headerBottom = headerHeight + headerTop;

			var $myForm = $('.my-form'),
				$label = $myForm.find('label'); 

			$label.on('click', function(){
				var $input = $(this).prev('input');
				if($input.is(':checked')){
					$(this).find('.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
				}else{
					$(this).find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
				}
			});

			eventDriven.on(eventDictionary.global.SCROLL, function(e){
				var scrollTop = $.util.getScrollTop();	
				if(scrollTop >= headerBottom){
					dock();
				}else{
					undock();
				}
			});

			$(window).on('scroll', function(e){
				eventDriven.trigger(jQuery.Event(eventDictionary.global.SCROLL));
			});
		}

		init();
	};

}(jQuery));

(function ($) {

    /**
	@class $.MotionEffect
	@constructor
	**/
	$.MotionEffect = function(element, options){

		var	$container = $(options.container),
			$el= $container.find($(element)),
			animated = false;

	 	// Transition slides
		var offsetX = options.offsetX;
		var offsetXEnd = 0;
		var animation = options.animation;
		var easing = options.easing;
		var duration = Math.round(options.duration);
		var fadeRule = 'opacity ' + duration + 'ms ' + easing;
		var slideRule = 'transform ' + duration + 'ms ' + easing;
	
        /** 
		Init function will check for specific body classes and create the necessary page object.
		@function init
		**/
        function init() {
			if (animation == 'slide') {
				tram($el)
					.set({ visibility: '' })
					.add(slideRule)
					.start({ x: offsetX, opacity:0 });
			}
				
			if (animation == 'scale') {
				tram($el)
					.set({ visibility: '' })
					.add(fadeRule)
					.start({ scale: 0, opacity:0 });
			}
			/* define transitions
			tram($element)
			  	.set({ x:-90, opacity:0 })
			  	.add('transform 500ms ease-out-quint')*/

			$.util= new $.Utilities();
			bindEvents();
		}

		function addMotion(){
			if(animated) return;

			console.log('called');
			if (animation == 'slide') {
				tram($el)
					.set({ x: offsetX, opacity:0 })
					.add(slideRule)
					.start({ x: offsetX, opacity:0 })
					.then({ x: offsetXEnd, opacity:1 });
			}
			if (animation == 'scale') {
				tram($el)
					.set({ scale: 0.5, opacity:0 })
					.add(fadeRule)
					.start({ scale: 0.5, opacity:0 })
					.then({ scale: 1, opacity:1 })
			}
			/*tram($element)
				.start({ x: -90, opacity: 0 })
				.then({ x: 0, opacity: 1 })*/
			//$element.addClass(x);
			animated = true;
		}

        /**
		@function bindEvents
		Bind events to elements on home page
		**/
        function bindEvents() {
			var containerHeight = $container.outerHeight()+($(window).height()/2),
				containerTop = $container.position().top,
				containerBottom = containerTop - containerHeight;
			
			console.log('containerTop '+ containerTop);
			console.log('containerBottom '+ containerBottom);

			eventDriven.on(eventDictionary.global.SCROLL, function(e){
				var scrollTop = $.util.getScrollTop();	
				// Disable in old browsers
				if (!tram.support.transform) {
					return;
				}
				if(scrollTop >= containerBottom){
					addMotion();
				}
			});

			$(window).on('scroll', function(e){
				eventDriven.trigger(jQuery.Event(eventDictionary.global.SCROLL));
			});
		}

		init();
	};

}(jQuery));

(function($){

    /**
	@class $.LazyLoadImages
	@constructor
	**/
	$.LazyLoadImages = function(){
		return {
			lazy : [],
			init : function(){
				var self = this;
				$.util= new $.Utilities();

				//Lazy loaded images
				self.lazy = $('.lazy');
				self.lazy.attr('data-lazy-loaded', 'false');
				self.scan();
				self.bindEvents();
			},
			scan : function(){
				var len = this.lazy.length;
				console.log('length :'+len);
				for(var i=0;i<len;i++){
					console.log('call2');
					var $elem = $(this.lazy[i]);
					if($elem.attr('data-lazy-loaded') !== 'true' && this.isInView($elem)){
						console.log('call');
						$elem.attr('data-lazy-loaded', 'true');
						$elem.animate({'opacity':1});
						$elem.removeClass('lazy');
					}
				}
			},
			isInView : function(elem){
				if(!elem.is(':visible')){
					return false;	
				}
				var elemTop = $.util.calcTop(elem),
					scrollBottom = $(window).height()+$.util.getScrollTop(),
					threshold = 0;
				if(elemTop < scrollBottom+threshold){
					return true;
				}
				return false;
		   	},
			bindEvents : function(){
				var self = this;
				eventDriven.on(eventDictionary.global.SCROLL, function(e){
					self.scan();
				});
				$(window).on('scroll', throttle(function (e) {
					fireScroll = true;
					if (typeof window.webkitRequestAnimationFrame !== 'undefined') {
						requestTick();
					} else {
						eventDriven.trigger(jQuery.Event(eventDictionary.global.SCROLL)/*, metrics*/);
					}
				}, 250));
			}
		};
	};
}(jQuery));
