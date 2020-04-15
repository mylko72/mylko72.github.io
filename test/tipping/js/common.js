$(document).on('ready', function() {
//<![CDATA[
	
	// Slick 슬라이드 공통모듈 초기화 2019-05-30
	handleSlickSlides.init();

	// Top 버튼 생성 2019-05-30
	initTopBtn();

	// 편성표 스크롤 액션 2019-06-26
	$('.liveSchedule').length && liveScheduleFn.init();

	/* top 버튼 정의 2018-12-28 */
	function initTopBtn(){
		var topBtn = '<p id="top" class="topIco"><a href="#">TOP</a></p>';
		var scrollTop = $(window).scrollTop();
		var $nav = $('header .gnb');			// 2019-03-07 추가
		var $feedTop = $('.feed_v2_2 .tabList').length ? $('.feed_v2_2 .tabList') : $('.feed_v2_2 .hashTagList');	// 2019-04-15 추가
		var beautyTop = $('[data-js="beautyTop"]'); // K프로젝트 2019-09-17
		var beautyTopMore = beautyTop.find('[data-beauty="more"]'); // K프로젝트 2019-09-17

		$('.wrap').append($(topBtn));

		$(window).on('scroll', function() {
			scrollTop = $(window).scrollTop();

			if (scrollTop == 0) {
				setTimeout(function() {
					$('#top').hide();
					beautyTop.length > 0 &&  beautyTop.removeClass('active'); // K프로젝트 2019-09-17
					$('.searchpArea').length>0 && $('.searchpArea').removeClass("active");		// 2019-03-06 추가
					$nav.length>0 && $nav.closest('nav').removeClass("active");					// 2019-03-07 추가
					$feedTop.length>0 && $feedTop.removeClass("active");						// 2019-04-15 추가
				}, 100);
			} else {
				$('#top').fadeIn();
				beautyTop.length > 0 &&  beautyTop.addClass('active'); // K프로젝트 2019-09-17
				$('.searchpArea').length>0 && $('.searchpArea').addClass("active");				// 2019-03-06 추가
				$nav.length>0 && $nav.closest('nav').addClass("active");						// 2019-03-07 추가
				$feedTop.length>0 && $feedTop.addClass("active");								// 2019-04-15 추가
			}
		}); 		

		/* K프로젝트 2019-09-17 */
		if (beautyTop.length > 0) {

			$(document).on('click', function( event ){

				if ( $(event.target).closest( beautyTop ).length == 0 ) {

					beautyTopMore.hasClass('active') && beautyTopMore.removeClass('active');

				}

			});

			beautyTopMore.on({
				'click' : function( event ){
					event.preventDefault();

					$(this).toggleClass('active').promise().done(function(){

						if ($(this).hasClass('active')) {

							beautyTop.find('li').removeClass('animation');

							beautyTop.find('li').each(function( i ){

								var self = $(this);

								setTimeout(function(){

									self.addClass('animation');

								}, 100 * (i + 1))
								
							})
						}
						
					})

				}
			});

		}
		/* // K프로젝트 2019-09-17 */
	}

	$( '.productSlider' ).each( function() {

		if ( $( '> ul > li', this ).length > 1 ) {		// 2019-07-31 수정
			$(this).touchSlider({
				view : 1,
				initComplete : function (e) {
					var _this = this;
					var $this = $(this);
					var paging = $this.next(".paging");
					var len = Math.ceil(this._len / this._view);

					paging.html("");
					for(var i = 1; i <= len; i++) {
						paging.append('<button type="button" class="btn_page">page' + i + '</button>');
					}

					paging.find(".btn_page").on("click", function (e) {
						_this.go_page($(this).index());
					});
				},
				counter : function (e) {
					$(this).next(".paging").find(".btn_page").removeClass("on").eq(e.current-1).addClass("on");
				}
			});
			// slider 높이 고정
			var articleH = $('li', this).height();
			// $(this).attr('style', 'min-height:' + articleH + 'px !important');

		} else {
			$(this).addClass('single');
		}
	});


	$(".pList").slick({
        dots: true,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3
      });


	/* scroll */
	$('.slider ul').each(function() {
		var t = $(this),
		tW = 0;
		$('li', t).each(function() {
			tW += $(this).outerWidth(true);
		});
		t.css('width', tW);
	});

	$('.slider .list').each(function() {
		var t = $(this),
		tW = 0;
		$('article', t).each(function() {
			tW += $(this).outerWidth(true);
		});
		t.css('width', tW);
	});

	/* loading */
	var loadHeight = $(window).height();
	var loadMargin = $('.loading img').height()/2;
	var headHiehgt = $('header').height()+1;

	$('.loading.search').css('height', loadHeight - headHiehgt +'px');
	$('.loading.search').css('margin-top', headHiehgt +'px');


	/* accordion list */
	var $accordionList =  $('.accordionList dt');

	$accordionList.on('click', function () {
		if($(this).next().is(':hidden')){
			$(this).closest('li').siblings().removeClass('opened');
			$(this).closest('li').siblings().find('dd').hide();
			$(this).next().show();
			$(this).closest('li').addClass('opened');
		} else {
			$(this).next().hide();
			$(this).closest('li').removeClass('opened');
		}
	});

	$( '.vsArea' ).each( function() {
		if ( $( 'article', this ).length < 3 ) {
			$(this).addClass('two');
		}
		else {
			
		}
	} );

	/* Pinch Zoom 끄기 2018-07-10 */
	if ($('#gallerySlider').length) {
		document.documentElement.addEventListener('touchstart', function (event) {
			if (event.touches.length > 1) {
			  event.preventDefault();
			}
		}, false);
	}

	/* 2018.02.08 상품상세 확대 기능 시작 */
	if (zoomCommon.beforeInit() > 0) {
		zoomCommon.addScript();

		document.documentElement.addEventListener('touchstart', function (event) {
			if (event.touches.length > 1) {
			  event.preventDefault();
			}
		}, false);
	};

//]]>
});

/* Tab */
function showTab(obj, other){
    var target = $(obj).attr('href');
    $(target).show().siblings('.' + other).hide();
    $(obj).parent().siblings('li').removeClass('active');
	$(obj).parent().addClass('active');

	var $touchSlider = $('.touchSlider', $(target)).filter(':visible');

	if($touchSlider.length){
		$touchSlider.each(function(){
			var $slider = $(this);
			$('.slideItem', $slider).length > 1 && handleSlickSlides.update($slider);
		})
	}
}

/* More */
function load(id, cnt, btn) {
	var girls = id;
    var girls_list = id + ' ul>li:not(.active)';
    var girls_height = $(girls_list).height();
    var girls_non = id + ' ul';
    var girls_length = $(girls_list).length;
    var girls_total_cnt;
	var totals = $('ul>li', $(girls)).length;	// 2018-05-30 추가

	// 2018-05-30 추가
	if(totals <= cnt){
		$(btn).hide();
	};
	
    if (cnt < girls_length) {
        girls_total_cnt = cnt;

		if (girls_length > 2) {
			$(girls_non).css('min-height', (girls_height) + 'px');
		}

	} else {
        girls_total_cnt = girls_length;
        // 2018-05-24 삭제 $(btn).hide();
		$(btn).addClass('close').html('<span>닫기</span>');	// 2018-05-24 추가

		if (girls_length < 3){
			$(girls_non).css('min-height', girls_height + 'px');
		}
    }

	// 2018-05-24 추가
	if (1 > girls_length){
		$(id + ' ul>li:nth-child(n+5)').removeClass('active');
		$(btn).removeClass('close').html('<span>더보기</span>');
		// 2018-05-31 추가
		if($(btn).length>0){
			var ypos = $(btn).offset().top - $(girls_non).outerHeight();
			$(window).scrollTop(ypos);
		}
	}else{
		$(girls_list + ':lt(' + girls_total_cnt + ')').addClass('active');
    }

}

/* Scroll */
function slider(obj){
	var totalWidth = 0;
    var scroll = $(obj).children('.slider');

   scroll.each(function(){
			totalWidth = totalWidth + $(obj).children('li').width();
		});

	scroll.css('width', totalWidth);
}

/* layerPopup */
function showlayer(self, obj, cb){
    var $self = $(self);
    var $target = $(obj);
    var $layerWrap = $target.find('.inner');
    var windowHeight = $(window).height();

    if($self.parents("div[class^='layerPopup']").length > 0){
        $self.parents("div[class^='layerPopup']").hide();
    }

   // $target.attr('tabindex', '0').show().focus();
    $target.attr('tabindex', '0').show();
    $(".dimLayer").show();

	var layerSize = $layerWrap.height();
	var lHeight = $(window).height();
	var header = $layerWrap.find('.header').height();
	var bottom = $layerWrap.find('.bottom').height();
	var hSize = header + bottom + 102; //header 사이즈 + layer_pop 패딩 + layer_container 패딩 합한 값
	var cHeight = layerSize - header - bottom;

	//$(window.event.target).hasClass('shareBtn') ? $(".wrap").css("height","auto") : $(".wrap").css("height",lHeight);
	$(".dimLayer").css("height",lHeight);

	if(cHeight > lHeight ){
		$target.css('top' , hSize - 25 + 'px'); // 25px 상단 패딩값
		$layerWrap.find('.container').css('height' , lHeight - hSize + 'px');
	}else{
		$target.css('margin-top' , -(layerSize/2) - 12 + 'px');  //12 상단패딩 % 2 값
	}

	if(typeof cb === 'function'){
		cb();
	}

    $target.find(".layerClose").click(function(){
            $target.hide();
            $(".dimLayer").hide();
            $(".wrap").css("height","auto");
            $(".wrap").css("position","relative");
            $target.css("top","50%");
            //$self.focus();
            $(this).off('click');
            $(window).off('resize orientationchange');
    });

}

function showtool(self, obj){
    var $self = $(self);
    var $target = $(obj);
	var $layerWrap = $target.find('.inner');
	var windowHeight = $(window).height();

    if($self.parents("div[class^='toolPopup']").length > 0){
        $self.parents("div[class^='toolPopup']").hide();
    }

	$target.attr('tabindex', '0').show();
    $(".toolDim").show();
    $(".toolDim").on('click', function () {
            $target.hide();
            $(".toolDim").hide();
    });
}

/*
 * 이미지갤러리 확대 기능
 * 작성일: 2018.06.20
 */
var zoomCommon = (function(){
	var ua = window.navigator.userAgent.toLowerCase(),
		ios = /iphone|ipod|ipad/.test(ua),
		safari = /safari/.test(ua),
		samsung = /samsungbrowser/.test(ua),
		//script_url = 'iscroll.shilladfs.zoom.js';
		script_url = 'https://m-tipping.shilladfs.com/resources/publisher/js/iscroll.shilladfs.zoom.js';

	return {
		beforeInit: function() {
			return $('.pinchZoomInOutArea img').length;
		},
		addScript: function() {
			$.getScript(script_url)
			.done(function(e){
				if (ios && ua.search('crios') < 0) {
					zoomInOutDetail.init();
				} else {
					if (!samsung) {
						zoomInOutDetail.init();
					};
				};
			})
			.fail(function(e){
				//console.log('리소스 로드 실패');
			});
		}
	}
})();

var zoomInOutDetail = (function(){
	var detailZoom = [],
		root = '.pinchZoomInOutArea',
		tgt = '.detail_info_img',
		tgtH,
		tgtText,
		setting = {
			tap : true,
			tabZoomFactor : true,
			zoom: true,
			scrollX: true,
			scrollY: true,
			eventPassthrough: false,
			preventDefault: false,
			lockDirection: true,
			bounce: false,
			momentum: false,
			zoomMax: 4
		}

	function addEvent() {
		$.each($(root), function(i, el) {
			if ($(el).find('img').length > 0) {
				$(el).attr('id', 'zoomable'+i);	
				detailZoom[i] = 'zoomable'+i;	
				detailZoom[i] = new SDFS_iscroll('#zoomable'+i, setting);
			};
		});
	};

	function setHeight(){
		var thisImg, maxImg;
		$(root).find('img').each(function(i){
			thisImg = $(this).height()
			//console.log('thisImg', thisImg);
			if(maxImg == undefined){
				maxImg = thisImg;
			}else{
				if(!comparison(maxImg, thisImg)){
					maxImg = thisImg;
				}
			}
		});
		//console.log('maxImg',maxImg);
		$(tgt).height(maxImg);
		return maxImg;
	}

	function comparison(a, b){
		return a > b;
	}
	
	function setUI() {
		tgtText = $(tgt).find('p.text');
		if (tgtText.length > 0) {
			tgtText.remove();
		}; 
		$(root).find('a').css({'word-wrap':'break-word'});
		$(root).find('img').css("cssText", "width:100% !important; height:auto;");
		console.log('call 2');

		addEvent();
		//setTimeout(setHeight, 500);
	}; 
	
	return {
		init: function() {
			setUI();	
		}
	}
})();

/*
 * slick 슬라이드 공통모듈
 * 작성일: 2019.05.30
 */
var handleSlickSlides = (function(){

	var slickSlide = '.touchSlider';

	var config = {
		centerMode: true,
		centerPadding: '12.5px',
		slidesToShow: 1,
		lazyLoad: 'ondemand',
		adaptiveHeight: true,
		arrow: false,
		useTransform: false,
		infinite: true,
		autoplay: false,
	};

	function updateCount(event, slick, currentSlide, nextSlide){
		var i = (slick.currentSlide ? slick.currentSlide : 0) + 1;

		$('.bar', $(slick.$slider)).length < 1 && $(slick.$slider).prepend('<span class="bar" />');
		$('.desc', $(slick.$slider)).length > 0 && $('.desc', $(slick.$slider)).css('width', '100%');
	
		if (slick.currentSlide != 0) {
			$('.bar', $(slick.$slider)).hide();
		}

		$(this).find('.slideCount').html('<span class="current">' + i + '</span> <span>/</span> <span class="total">' + slick.slideCount + '</span>');
		$(this).find('.totalCount').length && $(this).find('.totalCount').html('<span class="total">' + (slick.slideCount-1) + '</span>개');
	}
	
	return {
		init: function(){

			$(slickSlide).on('init', updateCount);	// 2019-07-01 추가

			var $selector = $('[id*=Slider], [class*=Slider]', $(slickSlide));
			
			if($selector.length < 1) return false;

			$selector.each( function() {
				var selector = this;
				var option = selector.dataset.option && JSON.parse(selector.dataset.option);
				var settings = option ? $.extend({}, config, option) : config;
				var $items = $( '.slideItem', this );

				console.log(settings);
				if ( $items.length > 1 ) {
					$(selector).slick(settings).on("lazyLoadError", function (e, slider, $img){
						$img.length && $img[0].onerror && $img[0].onerror(e);
					});
				} 
				else {
					$items.closest('.touchSlider').addClass('single');
					var src = $('.img', $items).data('lazy');
					$('.img', $items).attr('src', src);
				}
			});

			$(slickSlide).on('setPosition', updateCount);
		},
		update: function($slickSlide){
			$('[id*=Slider], [class*=Slider]', $slickSlide).slick('setPosition');
		}
	}
})();

/*
 * 편성표 스크롤 액션
 * 작성일: 2019.06.26
 */
var liveScheduleFn = (function(){

	var scheduleLists = '.scheduleLists';
	var scrollTop = null;

	function addEvent(){

		$('.alarm', $(scheduleLists)).on('click', function(){
			$(this).toggleClass('active');
		})

		$(window).on('scroll', function(){
			var num = 0;
			scrollTop = $(window).scrollTop();

			$(scheduleLists).each(function(){
				var $scheduleList = $(scheduleLists).eq(num);
				var ypos = $scheduleList.hasClass('today') ? $scheduleList.offset().top - 20 : $scheduleList.offset().top - 45;

				if(scrollTop > ypos){
					$scheduleList.addClass('fixed');
					$scheduleList.addClass('pt30');
					num++
				}else{
					$scheduleList.removeClass('pt30');
					$scheduleList.removeClass('fixed');
					num--
				}
			});
		})

	}

	return {
		init: function(){
			$(scheduleLists).each(function(i){
				$(scheduleLists).eq(i).css('z-index', i);
			});
		
			addEvent();
		}
	}
})();



/* K프로젝트 2019-09-17 */
$(function(){

	var beautyMain = (function( target ){

		if (target.length == 0) return false;
		
		var total = 0;

		$('[data-beauty=main]').each(function(){
			total += $(this).outerHeight(true);
		});

		target.find('[data-beauty=bubble]').height( $(window).height() - total );

	})( $('.beautyWrap') );

})