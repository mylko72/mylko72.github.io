/**********************************************************************************************
 ** 	변수
 ** onIdx 특정날짜 영역으로 로딩되는 기능추가로 createDate();함수에서 인덱스지정  2016-11-14
 **********************************************************************************************/
var toDayIdx = 10;/* 오늘날짜 contents박스 위치 값 */
var onIdx;/*onIdx  현재 view영역의 인덱스 값 */
var oldIdx = null;
var WDay;
var YList;
var ajaxLoading;
var timeListLibrary;//오른쪽 시간편성표 스크롤 플러그인 객체
var relateSlideLib;//관련상품 슬라이드
var onairEventTimeGap;
var onairViewSize;
var onairImgSize;
/* 변수추가 2017-06-15 */
var insertMode = 'default'; //처음 로딩시 mode는 default
var defaultSlideSize;
var totalSlideSize;
var dragging = false; //2017-07-14 삭제
var dateArr = []; 	//날짜 배열
var dayArr = [];	//요일 배열

/**********************************************************************************************
 ** window - touchstart event
 **********************************************************************************************/
$(window).bind('touchstart', function(e) {
	weekGuideHideFn();//요일 슬라이드 가이드 팝업  숨김
});

/**********************************************************************************************
 ** window - touchmove event :  브라우져 스크롤 고정
 **********************************************************************************************/
$(window).bind('touchmove', function(e) {e.preventDefault();});

 /**********************************************************************************************
  ** onairView 이미지 영역 비율(높이/넓이) 셋팅
  **********************************************************************************************/
 var onairViewSizeFn = function() {
	 var onairWrap = $('.contsL .onairViewWrap');
	 var onairWrapW = onairWrap.outerWidth();
	 var onairWrapH = onairWrap.outerHeight();
	 var onairWrapRate = onairWrapH / onairWrapW;

	 return {
		 width : onairWrapW,
		 height : onairWrapH,
		 rate : onairWrapRate
	 };
 }

 // 2017-08-07 수정
 var onairImgPosSetFn = function(img) {
	 var onairImg = $(img);
	 var onairImgBox = onairImg.closest('.img');
	 var onairImgW = onairImg.outerWidth();
	 var onairImgH = onairImg.outerHeight();
	 console.log('onairImgW', onairImgW);
	 var widthGap = Math.abs(onairViewSize.width - onairImgW);
	 var heightGap = Math.abs(onairViewSize.height - onairImgH);
	 if(onairViewSize.height > onairImgH) {
		 onairImgBox.css({'margin-left' : 0, 'padding-top' : heightGap/2});
	 }else if(onairViewSize.width < onairImgW) {
		 onairImgBox.css({'margin-left' : -widthGap/2, 'padding-top' : 0});
	 }else{
		 onairImgBox.css({'margin-left' : 0, 'padding-top' : 0});
	 }
	 onairImg.css({'visibility' : 'visible'});
 }

 // 2017-08-07 수정
 var onairViewSet = function() {
	 if(!onairViewSize)	 onairViewSize = onairViewSizeFn();
	 var onairImg = $('.contsL .onairViewWrap .img img');
	 onairImg.each(function(i){
		 var $img = $(this),
		 	imgSrc = $img.data('img-src');
		 $img.attr('src', imgSrc);
		 if ($img.length === 1) { //length 프로퍼티는 해당 태그가 존재하면 1, 없으면 0을 리턴한다.
			 if ($img[0].complete === false || $img.attr('src') !== '') {
				 console.log('이미지가 완전히 로딩되지 않음');
				 $img.load(function () {
					 var img = this;
					 console.log('이미지 로딩이 완료됨.');
					 onairImgPosSetFn(img);
				 });
			 }
		 }
	 });
 }

/**********************************************************************************************
 ** 화면상단 요일 리스트
 **********************************************************************************************/
/* s : 요소 생성 */
var createDate = function(paramDate) {
	Date.prototype.DateAdd=function(tc,et,sd){var obj=((sd==undefined||sd=="")?this:new Date(sd));var z=function(n){return n<10?"0"+n:n;};var tV={y:"FullYear",m:"Month",d:"Date",h:"Hours",mi:"Minutes",s:"Seconds",ms:"Milliseconds"}[tc.toLowerCase()];obj["set"+tV](obj["get"+tV]()+et);with(obj){return getFullYear()+"-"+z(getMonth()+1)+"-"+z(getDate());}obj=null;}
	var YCal=function(a){return Number(a.substring(8,10).replace("-","."));}
	YList=new Array(21);
	var YWeek=new Array("일","월","화","수","목","금","토");
	var Dobj=new Date();
	WDay = '';

	for(var i=0;i<21;i++){
		YList[i]= i > 0 ? Dobj.DateAdd("d",1) : Dobj.DateAdd("d",-10);

		var typeChYList = YList[i].split('-');
		var fullDate = typeChYList[0]+ typeChYList[1] + typeChYList[2];
		// 2017-08-01 수정
		var monthStr = typeChYList[1];
		monthStr = (monthStr[0] === '0') ? monthStr[1] : monthStr;
		dateArr.push(monthStr + '.' + typeChYList[2]);	//dateArr배열에 날짜저장 2017-06-15

		if(paramDate == fullDate || (!paramDate && i == 10)) {
			onIdx = i ;//최초로딩시 선택날짜 인덱스값;
			WDay += "<li class='swiper-slide on'><a href='#' class='today'>";	// today 클래스 2017-07-25
		}else{
			WDay += "<li class='swiper-slide'><a href='#'>";
		}

		WDay += "<span>"+YCal(YList[i])+"</span>";

		if(i==10) {
			WDay += "오늘";
		}else{
			WDay += YWeek[Dobj.getDay()];
			//WDay += YWeek[Dobj.getDay()]+"요일";
		}
		WDay += 	"</a></li>";
		dayArr.push(YWeek[Dobj.getDay()]);	//dayArr배열에 요일저장 2017-06-15
	}
	$('.dateNaviBox .swiper-wrapper').empty().append(WDay);
	weekListSize();
};
/* e : 요소 생성 */

/* s : 요일 요소 영역 넓이 구하기*/
var weekListSize = function() {
	var _wrapper = $('.dateNaviBox .weekSlide .swiper-wrapper');
	var _ele = $('li', _wrapper);
	var _eleW = $('.dateNaviBox .weekSlide').outerWidth()/9;
	var _length = _ele.length;
	var _wrapperW = _eleW * _length;

	_wrapper.css('width', _wrapperW);
	_ele.css('width', _eleW);
}
/* e : 요일 요소 영역 넓이 구하기*/

/* s : 요일 리스트 스와이프 */
var weekListSwipeFn = {
	loadSet : function() {
		this.dateNaviBox = $('.dateNaviBox');
		this.weekSlide = $('.weekSlide', this.dateNaviBox);
		this.eleW = $('ul li', this.weekSlide).outerWidth();
		this.thisSwipeFn(this.weekSlide);
		this.weekSlidePosCh();
	},
	thisSwipeFn : function(wrapper) {
		var wrapper = wrapper;
		this.weekSwipeFn = new Swiper(wrapper, {
			direction: 'horizontal',
			slidesPerView: 'auto',
			scrollbarHide : false,
			freeMode: true,
			onTouchStart : function(swiper, event) {
				weekGuideHideFn();//요일 슬라이드 가이드 팝업  숨김
			},
			onClick : function(swiper, event) {
				oldIdx = onIdx;
				/* s : 클릭 중복 방지 */
				weekListSwipeFn.dupliClick = swiper.clickedIndex != onIdx ? true : false;
				onIdx = swiper.clickedIndex;
				if(!weekListSwipeFn.dupliClick) return;
				/* e : 클릭 중복 방지 */
				$('li', weekListSwipeFn.weekSlide).removeClass('on').eq(onIdx).addClass('on');
				//weekListSwipeFn.weekSlidePosCh();/* swipe 위치 수정 */
				createConts();/* 해당 컨텐츠 생성 */

				/* s : 클릭시 좌우버튼 활성비활성 */
				if(onIdx == 0) {
					$('.dateNaviBox > .btnNext').removeClass('disable');
					$('.dateNaviBox > .btnPrev').addClass('disable');
				}else if(onIdx == ($('li', weekListSwipeFn.weekSlide).length - 1)) {
					$('.dateNaviBox > .btnPrev').removeClass('disable');
					$('.dateNaviBox > .btnNext').addClass('disable');
				}else{
					$('.dateNaviBox > .btnPrev').removeClass('disable');
					$('.dateNaviBox > .btnNext').removeClass('disable');
				}
				/* e : 클릭시 좌우버튼 활성비활성 */
			}
		});
	},
	weekSlidePosCh : function () {//리스트 클릭시 swipe 위치 수정
		$('li', weekListSwipeFn.weekSlide).removeClass('on').eq(onIdx).addClass('on');
		weekListSwipeFn.weekSwipeFn.update();
		weekListSwipeFn.weekSwipeFn.slideTo(onIdx-1);
		return onIdx;
	}
}
/* e : 요일 리스트 스와이프 */

/* s : 요일 리스트 좌우 click 이벤트  */
$(document).on('click', '.dateNaviBox > .btnPrev', function(e) {
	e.preventDefault();
	if($(this).hasClass('disable') || onIdx-1 < 0) return;
	/* dragging이 false일 경우만 실행 2017-06-15 */
	//if(!dragging){ if 삭제 2017-07-14
	oldIdx = onIdx;
	if(!dragging) onIdx = onIdx-1;
	weekListSwipeFn.weekSlidePosCh();/* swipe 위치 수정 */
	if(dragging) onIdx = onIdx-1;
	//}
	createConts();/* 해당 컨텐츠 생성 */
	if(onIdx == 0)  {
		$(this).addClass('disable');
	}else{
		$(this).removeClass('disable');
		$('.dateNaviBox > .btnNext').removeClass('disable');
	}
});
$(document).on('click', '.dateNaviBox > .btnNext', function(e) {
	e.preventDefault();
	if($(this).hasClass('disable') || onIdx+1 > $('.dateNaviBox .weekSlide > ul > li').length - 1) return;
	/* dragging이 false일 경우만 실행 2017-06-15 */
	//if(!dragging){ //if 삭제 2017-07-14
	oldIdx = onIdx;
	if(!dragging) onIdx = onIdx+1;
	weekListSwipeFn.weekSlidePosCh();/* swipe 위치 수정 */
	if(dragging) onIdx = onIdx+1;
	//}
	createConts();/* 해당 컨텐츠 생성 */
	if(onIdx == $('.dateNaviBox .weekSlide > ul > li').length - 1)  {
		$(this).addClass('disable');
	}else{
		$(this).removeClass('disable');
		$('.dateNaviBox > .btnPrev').removeClass('disable');
	}
});
/* e : 요일 리스트 좌우 click 이벤트  */

$(document).on("click", ".playBtn", function(z) {
    var vod = $(this).closest('.onairViewWrap').children("video");
    if (vod.attr("controls") == "controls") {
        //var y = "http://livevod.hnsmall.com:1935" + vod.children("source").attr("srcdata") + B;
        $(this).parent().find("span.flag_tv, span.flag_tv2").css("display", "none");
        //$(this).parent().find("span.img").css("display", "none");
        $(this).find(".videoPlay.bgTvBefore").css("display", "none");
        //$(this).css("display", "none");
        vod.css({
        	'position':'absolute',
        	'display':'block',
        	'top':'0',
        	'left':'0',
        	'z-index':'20',
        	'width':'100%',
        	'height':'100%'
        });
        //vod.children("source").attr("src", y);
        vod.load();
        vod.get(0).play()
    }
});

/* s : 요일 리스트 가이드 레이어 */
var weekGuideHideFn = function() {
	/* 페이드아웃 2017-06-15 */
	if(!$('.weekGuideLayer').is(':hidden')) {
		$('.weekGuideLayer').fadeOut('slow');
	}
}

/* e : 요일 리스트 가이드 레이어 */

/**********************************************************************************************
 **  right - 편성표 시간 스케줄 스크롤
 **********************************************************************************************/
var prdTvTimeList = function(startIdx) {
	var timeListWrap = $('.contsR .prdTvTimeList');
	var contentWrap = $('.contsL.scrollView');	 // 2017-08-07 추가
	var wrapH = timeListWrap.outerHeight();
	var startIdx = startIdx ? startIdx : 0;
	var viewNum = Math.floor(wrapH / $('ul li', timeListWrap).outerWidth());
	var diffY;	// 이동거리 2017-06-15

	$('ul li', timeListWrap).css({'height' : $('ul li', timeListWrap).outerWidth()}) - 1;

	/* loading bar 변수정의 2017-06-15 */
	var loadingBar = `
		<li class="swiper-slide loading_wrap">
			<img src="http://image.hnsmall.com/images/mobile2014/common/loading_red.gif" class="loading" alt="">
		</li>
	`;

	// 2017-08-07 추가
	var scrollView = new Swiper(contentWrap, {
	     scrollbar: '.swiper-scrollbar',
	     direction: 'vertical',
	     slidesPerView: 'auto',
	     mousewheelControl: true,
	     freeMode: true
	});

	var scrollFn = new Swiper(timeListWrap, {
		initialSlide : startIdx,
		direction: 'vertical',
		slidesPerView: 'auto',
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		scrollbarHide : false,
		freeMode: true,
		/* 초기화 설정 2017-06-15 */
		onInit: function(swiper){
			var activeIdx;
			//날짜태그 생성
			stickyFn.init();

			// 슬라이드 목록에 index 설정
			if(insertMode == 'default'){
				$('ul', timeListWrap).attr('data-idx', onIdx);
			}

			// 슬라이드에 index 설정
			$('ul li', timeListWrap).each(function(i){
				var index = i+1;
				$(this).attr('slide-idx', index);
			});

			//swiper.activeIndex = swiper.params.initialSlide;

			totalSlideSize = parseInt($('.contsR .prdTvTimeList ul > li').last().attr('slide-idx'));

			setTimeout(weekGuideHideFn, 3000);	//3초후 가이드레이어 숨김
		},
		/* 2017-06-15 삭제
		onTouchStart : function(swiper, event) {
			weekGuideHideFn(); // 요일 슬라이드 가이드 팝업  숨김
		},*/
		/* tap시 날짜태그 숨김 2017-06-15 */
		onTap: function(swiper, event) {
			stickyFn.hide();
		},
		/* slide 이동시 날짜태그 보임 2017-06-15 */
		onSliderMove: function(swiper, event){
			stickyFn.show();
		},
		/* slide가 처음 위치에 도달하면 실행 2017-06-15 */
		// 2017-07-14 수정
		onReachBeginning: function(swiper){
			var mode = 'prepend';
			if(scrollFn === undefined || scrollFn.touches.diff === 0 || onIdx === 0){
				return;
			}
			//console.log(scrollFn.touches.diff);
			//console.log('isBeginning', swiper.isBeginning);
			swiper.params.onHandleSlideList(mode);
			//scrollFn.touches.diff = 0;
		},
		/* slide가 마지막 위치에 도달하면 실행 2017-06-15 */
		// 2017-07-14 수정
		onReachEnd: function(swiper){
			var mode = 'append';
			if(scrollFn === undefined || scrollFn.touches.diff === 0 || onIdx === $('.dateNaviBox .weekSlide > ul > li').length - 1){
				return;
			}
			//console.log(scrollFn.touches.diff);
			//console.log('isEnding', swiper.isEnd);
			swiper.params.onHandleSlideList(mode);
			//scrollFn.touches.diff = 0;
		},
		/* slide 애니메이션마다 실행
		 * slide 위치에 따라 요일 변경 2017-06-15
		 * on 클래스 삭제 2017-07-25
		 * */
		onSlideChangeEnd: function(swiper){
			var activeSlide = $('.swiper-slide-active', timeListWrap);
			var dataIdx = activeSlide.closest('ul').data('idx');

			//console.log('dataIdx :', dataIdx);
			//console.log('insertMode : ', insertMode);

			//$('.dateTag').removeClass('on');
			//activeSlide.closest('ul').find('.dateTag').addClass('on');

			$('li', weekListSwipeFn.weekSlide).removeClass('on').eq(dataIdx).addClass('on');
			weekListSwipeFn.weekSwipeFn.update();
			weekListSwipeFn.weekSwipeFn.slideTo(dataIdx-1);
		},
		/* 2017-06-15 수정 */
		onClick : function(swiper, event) {

			if(timeListLibrary.oldClickIdx ==  swiper.clickedIndex && !$(swiper.clickedSlide).hasClass('ch_2') && !$(swiper.clickedSlide).hasClass('multiItems')) return;	//2017-07-25 수정

			// 클릭한 slide의 목록과 index
			var slideParent = $(swiper.clickedSlide).closest('ul');
			var slideIdx = $(swiper.clickedSlide).attr('slide-idx');

			var getSeqNo = $('li', slideParent).eq(swiper.clickedIndex).attr('seq_frame_no');	//2017-07-25 수정

			// 동시편성상품일 경우 2017-07-25
			if(getSeqNo === undefined){
				var el = (event.target.nodeName !== 'A') ? event.target.parentElement.parentElement : event.target;
				getSeqNo = $('li', slideParent).eq(swiper.clickedIndex).find($(el)).attr('seq_frame_no');
			}
			console.log(getSeqNo);

			//console.log('slideIdx ', slideIdx);
			$('ul li', timeListWrap).removeClass('on');

			// 투채널 class 제거
			if($('ul li', timeListWrap).hasClass('ch_2')){
				$('ul li', timeListWrap).removeClass('ch_2');
			}

			$('li', slideParent).eq(swiper.clickedIndex).addClass('on');

			//클릭한 slide index로 슬라이드 전환
			scrollFn.slideTo(slideIdx-1);
			createLeftConts(getSeqNo);
			timeListLibrary.oldClickIdx =  swiper.clickedIndex;

			var translateY = scrollView.getWrapperTranslate();	// 2017-08-07 추가
			if(translateY<0) scrollView.setWrapperTranslate(0); // 2017-08-07 추가
		},
		/* 이전/다음 목록을 가져오는 custom 함수 2017-07-14 */
		onHandleSlideList: function(mode){

			var nowIdx = (mode === 'prepend') ? $('.contsR').find('.prdTvTimeList ul').first().data('idx') : $('.contsR').find('.prdTvTimeList ul').last().data('idx');
			onIdx = nowIdx;	// nowIdx을 이전,다음 목록을 가져오기 위해 onIdx에 대입 2017-07-14 수정

			dragging = true;

			// loading바 생성
			if(!$('.loading_wrap').length){
				if(mode == 'prepend'){
					$('ul',timeListWrap).eq(0).prepend(loadingBar);
				} else {
					$('ul',timeListWrap).eq(-1).append(loadingBar);
					$('ul',timeListWrap).eq(-1).css('margin-top', '-90px');
				}
			}

	 		setTimeout(function() {
	 			insertMode = mode;
	 			(mode === 'prepend') ? $('.dateNaviBox > .btnPrev').trigger('click') : $('.dateNaviBox > .btnNext').trigger('click');
	 		},500);
		}
	});

	/* Touches information 2017-06-15 */
	scrollFn.touches = {
	    startX: 0,
	    startY: 0,
	    currentX: 0,
	    currentY: 0,
	    diff: 0
	};

	/* TouchMove event binding 2017-06-15 */
	/* 2017-07-14 수정 */
	scrollFn.on('touchMove', function(swiper, e){
		var mode;

		diffY = swiper.touches.diff;

		// 슬라이드의 위치가 top 인경우 이전 날짜 목록 가져옴
		if(swiper.isBeginning && (Math.abs(diffY) > 10) && (onIdx !== 0)){ // 2017-07-25 수정
			mode = 'prepend'
			swiper.params.onHandleSlideList(mode);
	 		// 이벤트가 한번만 실행되도록 touchMove 이벤트 제거
	 		swiper.off('touchMove');
		}

		// 슬라이드의 위치가 end 인경우 다음 날짜 목록 가져옴
		if(swiper.isEnd && (Math.abs(diffY) > 5) && onIdx !== $('.dateNaviBox .weekSlide > ul > li').length - 1){  // 2017-07-25 수정
			mode = 'append'
			swiper.params.onHandleSlideList(mode);
	 		// 이벤트가 한번만 실행되도록 touchMove 이벤트 제거
	 		swiper.off('touchMove');
		}
	});


	/* 최초 로딩시 */
	if(scrollFn.activeIndex > 0 && startIdx < $('ul li', timeListWrap).length - viewNum) {
		scrollFn.slideTo(scrollFn.activeIndex - 1, 0);
		//scrollFn.setWrapperTranslate(scrollFn.translate + 20);
	}

	console.log('defaultSlideSize :'+defaultSlideSize);
	console.log('totalSlideSize :'+totalSlideSize);

	return {
		scrollFn : scrollFn
	};
};

var getTransform = function(el) {
    var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
    var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

    if(!results) return [0, 0, 0];
    if(results[1] == '3d') return results.slice(2,5);

    results.push(0);
    return results.slice(5, 8); // returns the [X,Y,Z,1] values
}

/**********************************************************************************************
 ** 날짜 태그 추가 및 초기화 2017-06-15
 **********************************************************************************************/
var stickyFn = (function(){
	var sticker;
	var timeListWrap = $('.contsR .prdTvTimeList');
	var timeListWrapList = $('.contsR .prdTvTimeList ul li');

	/* 초기화 */
	var init = function(){
		sticker = '<div class="dateTag">'+ dateArr[onIdx] + ' <span class="day">' + dayArr[onIdx] + '</span>' + '</div>';	// 2017-08-01 수정
		add();
	};

	/* 생성 */
	var add = function(){
		// insertMode에 따라 날짜태그 생성
		var mode = insertMode == 'append' || insertMode == 'default';
		var ulist = mode ? $('.contsR .prdTvTimeList ul').eq(-1) : $('.contsR .prdTvTimeList ul').eq(0);

		//$('.dateTag').removeClass('on'); 2017-07-25 삭제
		mode ? $('li', ulist).first().append(sticker) : $('li', ulist).first().prepend(sticker); // 2017-07-25 수정
	};

	var hide = function(){
		$('.dateTag').fadeOut();
	}

	var show = function(){
		$('.dateTag').fadeIn();
	}

	return {
		init: init,
		hide: hide,
		show: show
	};
}());

/**********************************************************************************************
 ** 관련상품 갤러리 슬라이드
 **********************************************************************************************/
var relatePrdSlide = function() {
	var slideWrap = $('.contsL .relatPrdListWrap');
	var moveElem = $('.swiper-slide', slideWrap);
	var elemTotal = moveElem.length;
	var loop = true;
	var followFinger = true;
	var stopPropagation = true;
	var swipeFn;

	if(elemTotal < 2) {loop = false; followFinger = false; stopPropagation = false;}
	swipeFn = new Swiper(slideWrap, {
		preloadImages : false,
		lazyLoading : true,
		loop : loop,
		followFinger : followFinger,
		touchMoveStopPropagation : stopPropagation,
		speed:300,
		onSlideChangeStart : function(swiper) {
			var index = parseInt($('.swiper-slide-active', slideWrap).attr('data-swiper-slide-index'));
 			$('.indicateWrap button', slideWrap).removeClass('on').eq(index).addClass('on');
		}/*,
		onLazyImageLoad : function(swiper, slide, image) {
			$(image).load(function() {
				var _this = $(this);
				var _thisH = _this.outerHeight();
				var _padT = (73 - _thisH) / 2;

				_this.parent('.img').css({'padding-top' : _padT});
			});
		}*/
	});

	return {
		swipeFn : swipeFn
	}
}

/**********************************************************************************************
 **  편성표 메인 컨텐츠
 **********************************************************************************************/
/* 메인 컨텐츠 전체 구성 */
//var fileNum = -1;/* 퍼블작업시 사용 */
var fileNum = 0;

var createConts = function() {
	var _insertBox = $('.onAirCont');

	//_insertBox.empty();
	/* s : 퍼블 화면용 */
	fileNum += 1;
	//if(fileNum > 4) fileNum = 0;
	if(fileNum > 4) fileNum = 1;
	fileName = 'schedule0'+fileNum+'_0'+fileNum;
	ajaxLoad(YList[onIdx].replace(/-/g,""), _insertBox, "http://devimage.hnsmall.com/genhtml/tvtableAjax/"+ fileName +".html", false);
	/* e : 퍼블 화면용 */
}

/* 메인 컨텐츠 왼쪽 구성 */
var createLeftConts = function(getSeqNo) {
	var _insertBox = $('.onAirCont .contsL .swiper-slide');	 // 2017-08-07 수정
	//_insertBox.empty();
	/* s : 퍼블 화면용 */
	fileName = 'seq_schedule'+getSeqNo+'_'+getSeqNo;
	ajaxLoad(YList[onIdx].replace(/-/g,""), _insertBox, "http://devimage.hnsmall.com/genhtml/tvtableAjax/"+ fileName +".html", true);
	/* e : 퍼블 화면용 */
}

/**********************************************************************************************
 **  AJAX
 ** 이전 함수 :ajaxLoad($date, $path, $url)
 **********************************************************************************************/
function ajaxLoad($date, $path, $url, $areaLeft) {
	$.ajax({
		type : "GET",
		url : $url,
		//data : {date:$date},
		path : $path,
		beforeSend :function() {
			// 로딩중
			ajaxLoading=true;
			if(!$areaLeft){
				$path.show();
				$('.onAirWrap .noConts').hide();
			}
		},
		success:function(html){
			/* 퍼블리싱 화면 소스 */
			if(!html) {
				ajaxError();
				return;
			}
			/* 퍼블리싱 화면 소스 */

			var _html = $.parseHTML(html);

			/* insertMode에 의존하여 슬라이드 목록 추가 2017-06-15 */
			var lists = $(_html).find('.prdTvTimeList ul');
			var insertPos;

 			$('.loading_wrap').remove(); // loading bar 제거

			if(insertMode == 'append'){
				//var lists = $(_html).find('.prdTvTimeList ul');
				insertPos = totalSlideSize-3;

				$path.find('.prdTvTimeList').append(lists);
				$path.find('.prdTvTimeList ul').last().attr('data-idx', onIdx);
			}else if(insertMode == 'prepend'){
				//var lists = $(_html).find('.prdTvTimeList ul');
				defaultSlideSize = lists.children('li').size();
				insertPos = defaultSlideSize;

				$path.find('.prdTvTimeList').prepend(lists);
				$path.find('.prdTvTimeList ul').first().attr('data-idx', onIdx);
			}else{
				insertPos = 0;

				$path.empty().append(_html);
				$path.find('.prdTvTimeList ul li').first().addClass('on');
				$path.find('.prdTvTimeList ul').attr('data-idx', onIdx);
			}


			//console.log('insertPos ' , insertPos);
			timeListLibrary.scrollFn.activeIndex = insertPos;

			/* onAirTimer */
			/*clearInterval(timer);
			if($('.onairViewWrap .videoPlay .live').length > 0) {
				onAirTime($('.onairViewWrap .videoPlay .live').attr('remaintime'));
			}*/

			/* s : 오른쪽 시간표 스크롤 영역 */
			if(!$areaLeft){
				console.log('call here2');
				timeListLibrary.scrollFn.destroy(true, true);
				timeListLibrary = new prdTvTimeList(timeListLibrary.scrollFn.activeIndex);
				//console.log('timeListLibrary.scrollFn.activeIndex ', timeListLibrary.scrollFn.activeIndex);
				//timeListLibrary.scrollFn.params.slidesOffsetAfter = 20;
				//timeListLibrary.scrollFn.update();// 로드완료 화면 오른쪽 스크롤 Lib 리사이즈

				timeListLibrary.oldClickIdx =  $('.contsR .prdTvTimeList ul > li.on').index();/* 오른쪽 시간표 스크롤 영역 시작 인덱스 값 저장 */
			}
			/* e : 오른쪽 시간표 스크롤 영역 */

			/* s : 관련상품 슬라이드 */
			//relateSlideLib = new relatePrdSlide();
			if($('.relatPrdListWrap').length > 0) {
				relateSlideLib = new relatePrdSlide();
			}
			/* e : 관련상품 슬라이드 */

			/* onair view image position setting */
			onairViewSet();
		},
		complete: function() {
			// 로딩완료 2017-06-15
			ajaxLoading=false;
 			dragging = false;
			insertMode = 'default';
		},
		error: function() {
			$path.hide();
			$('.onAirWrap .noConts').show();
			//재설정 2017-06-15
			insertMode = 'default';
 			dragging = false;
		}
	});
}
/* 퍼블리싱 화면 소스 */
var ajaxError = function() {
	$('.onAirWrap .onAirCont').hide();
	$('.onAirWrap .noConts').show();
}
/* 퍼블리싱 화면 소스 */

/**********************************************************************************************
 **	생방송 타이머
 **********************************************************************************************/
function onAirCounter(startTime) {
	this.options = {
		digitHeight: 50,
		digitSlideTime : 0,
		digitImageHeight : 550
	};

	options.timeStr = "00"+startTime;
	this.animateDigits = function() {
		for (var i=0; i<8; i++) {
			digits[i].digitNext = Number(this.options.timeStr.charAt(i));
			digits[i].digitNext = (digits[i].digitNext + 10)%10;
			if (digits[i].digit == 0) $(".onAirWrap .onairViewWrap .imgFrame .digitWrap .digit.num"+i).css("background-position-y", -this.options.digitImageHeight+this.options.digitHeight + "px");
			if (digits[i].digit != digits[i].digitNext) {
				$(".onAirWrap .onairViewWrap .imgFrame .digitWrap .digit.num"+i).animate( { "background-position-y" : -digits[i].digitNext*options.digitHeight+"px"}, options.digitSlideTime, function(){
				});
				digits[i].digit = digits[i].digitNext;
			}
		}
	};
	this.animateDigits();
}
var digits = new Array();
var oldTime;
function onAirTime(startTime) {
	oldTime = startTime;
	//console.log("oldTime : "+oldTime);

	for (var i=0; i<8; i++) {
		 digits[i] = { digit: Number(oldTime.charAt(i))};
	}

	onAirCounter(oldTime);
	setIntervalFx(); // 타임카운터 인터벌 설정
}

var timer;
function setIntervalFx(){

	timer = setInterval( "this.updateCounter()", 1000);
	var n = oldTime;
	//console.log("newTime : "+n);
	/*n is a string (typeof chk)*/

	this.updateCounter = function() {
		n = n-1;

		//console.log("TimeCountn : "+typeof n+n);

		var val = String(n);

		/*HHmmss 문자열 생성*/
		if(val.length==1){
			val = "00000"+val;
		}else if(val.length==2){
			val = "0000"+val;
		}else if(val.length==3){
			val = "000"+val;
		}else if(val.length==4){
			val = "00"+val;
		}else if(val.length==5){
			val = "0"+val;
		}

		/*HHmmss 시분초 단위 생성*/
		if(val.substring(4, 6)==99) val=val.substring(0, 4)+"59";
		if(val.substring(2, 4)==99) val=val.substring(0, 2)+"59"+val.substring(4, 6);
		if(val.substring(0, 2)==99) val="00"+val.substring(2, 6);

		n = Number(val);
		//console.log("TimeCountval : "+typeof val + val);
		/*제로 카운트 다음 방송 호출*/
		if(isNaN(n)){
			onAirCounter("000000");
			clearInterval(timer);
		}else{
			onAirCounter(val);
		}
	};
}

/**********************************************************************************************
 **	가이드 팝업
 **********************************************************************************************/
var guideShow = function() {
	$('.slide_guideWrap').show();
}

$(document).on('click', '.slide_guideWrap', function() {
	$('.slide_guideWrap').fadeOut('slow');
});

/**********************************************************************************************
 **	가로모드 체크
 **********************************************************************************************/
function landScapeCheck(){
	if ($(window).height() > $(window).width()) {
		$('.landscape').hide();
	} else {
		$('.landscape').show();
		$('.slide_guideWrap').hide();
	}
}

/**********************************************************************************************
 **	window resize
 **********************************************************************************************/
 $(window).resize(function() {
	 landScapeCheck();//가로모드 체크
	 weekListSize();//요일 리스트 요소 리사이즈
	 weekListSwipeFn.weekSlidePosCh();//요일 리스트 위치 리사이즈
	if(timeListLibrary) {
		$('.contsR .prdTvTimeList ul li').css({'height' : $('.contsR .prdTvTimeList ul li').outerWidth()});
		timeListLibrary.scrollFn.update();// 로드완료 화면 오른쪽 스크롤 Lib 리사이즈
	}
	if(relateSlideLib) {
		relateSlideLib.swipeFn.update();//	로드완료 화면 관련 상품 스와이프 Lib 리사이즈
	}
	/* s : 이미지 영역 비율 */
	onairViewSize = onairViewSizeFn();
	onairImgPosSetFn();
	/* e : 이미지 영역 비율 */
 });

 /**********************************************************************************************
  ** 레이어 팝업 및 토스트 팝업
  **********************************************************************************************/
 function openLayerPop(id) {
 	var _thisPopup = $(id),
 		_popH = _thisPopup.outerHeight(),
 		_winH = $(window).height() - 110,
 		_wrapH = $('.wrap').outerHeight(),
 		_winST = $(window).scrollTop() + 55;

 	_thisPopup.before('<div class=\"layerDim\" style=\"position:fixed; top:0; left:0; right:0; bottom:0; height:' + _wrapH +'px; background:url(//image.hnsmall.com/images/mobile2014/common/bg_dim.png) repeat left top; z-index:9999;\"></div>');

 	if($('.scrollY', _thisPopup).length > 0) {
 		var _popH = _thisPopup.outerHeight();
 		_thisPopup.show().css({'top' : (_winH - _popH)/2 + 55});
 	}else{
 		_thisPopup.show().css({'top' : (_winH - _popH)/2 + _winST});
 	}


 	$('.layerDim').bind('touchmove', function(e) {e.preventDefault();});
 	_thisPopup.bind('touchmove', function(e) {e.preventDefault();});
 	if($('.scrollY', _thisPopup).length > 0) {$('.scrollY', _thisPopup).bind('touchmove', function(e) {e.stopPropagation();});}

 }

 function closeLayerPop(id) {
 	var _thisPopup = $(id);
 	_thisPopup.hide();
 	$('.layerDim').unbind('touchmove').remove();
 	$(_thisPopup).unbind('touchmove');
 	if($('.scrollY', _thisPopup).length > 0) {$('.scrollY', _thisPopup).unbind('touchmove');}
 }

 /* s : 토스트 팝업 2016-04-08 */
 function toastAlert(_this, popEle) {
 	var _animated = null;
 	var optionAlarm = $(popEle);

 	if(_animated == null) {
 		_aminated = true;
 		optionAlarm.addClass("view");

 		setTimeout(function() {
 			optionAlarm.removeClass('view');
 			if(!$(this).hasClass('view')) {_aminated = null;}
 		},1000);

 		/*
 		optionAlarm.bind('transitionend webkitTransitionend', function() {
 			setTimeout(function() {
 				optionAlarm.removeClass('view');
 				if(!$(this).hasClass('view')) {_aminated = null;}
 			},1000);
 		});
 		*/
 	}
 }
 /* e : 토스트 팝업 2016-04-08 */
