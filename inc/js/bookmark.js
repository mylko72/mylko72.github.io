(function ($) {

    /**
	@class $BookmarkList.
	@constructor
	**/
    $.BookmarkList= function () {

		var $bookTmpl= $('#bookmarkTemplate').find('.contents'),
			$bookTmplList = $bookTmpl.find('.lists').children('li'),
			$bookmarkList= $('#bookmarkList'),
			$bookmarkMenu= $('#bookmarkMenu');

        /** 
		Init function will check for specific body classes and create the necessary page object.
		@function init
		**/
        function init() {
			$.util= new $.Utilities();

			loadBookmarkList();	
			loadBookmarkMenu();	

			bindEvents();

			eventDriven.trigger(jQuery.Event(eventDictionary.global.RESIZE));
		}

		function loadBookmarkList(){
			var u = new Date(),
				result  = u.getTime()/1000,
				cnt = 1,
				buildData,
				url = '/home/html/data/bookmark.json';

			$.getJSON(url, function(data){
				$.each(data, function(i, data){
					var $template= $bookTmpl.clone(true);
					$template.find('h3').attr('id', "bookmark"+cnt);
					$template.find('h3 em').text(i);
					$template.find('.lists').empty();
					$.each(data, function(i, data2){
						buildData = buildTemplate(i, data2);
						buildData.appendTo($template.find('.lists'));
					});
					$template.appendTo($bookmarkList);
					cnt++;
				});
			})
		}

		function loadBookmarkMenu(){
			var	jsonData = '/home/html/data/bookmark.json';
			var fragment = document.createDocumentFragment();
			appendDataToEl(fragment,jsonData);
		}
		
		function appendDataToEl(appendToEl,jsonData){
			var cnt = 1;
			$.getJSON(jsonData, function(data){
				$.each(data, function(i, data){
					a = document.createElement('a');
					a.href= '#bookmark'+cnt;
					a.appendChild(document.createTextNode(i));
					li = document.createElement('li');
					li.appendChild(a);
					appendToEl.appendChild(li);
					cnt++;
				});
				$bookmarkMenu.append(appendToEl);
			});
		}

		function buildTemplate(i, jsonData){
            var $tmplList= $bookTmplList.clone(true),
				$h4 = $tmplList.find('h4 > em'),
				$info = $tmplList.find('.info'),
				$tagClone = $info.find('> p.tags span').clone(),
				result;

			$info.find('> p.tags').empty();

			if(jsonData){
				$h4.text(jsonData.site);
				$info
				.find('> a').attr('href',jsonData.url).text(jsonData.url).end()
				.find('> p.explain').text(jsonData.explain).end();

				$.each(jsonData.tags, function(i, tag){
					//console.log(tag);
					var $tags = $tagClone.clone();
					var $tagEl = $tags.find('a').text(tag);
					$tags.appendTo($info.find('> p.tags'));
				});
			}
			return $tmplList;
		}

		function bindEvents(){
			var headerHeight = $('header').outerHeight(),
				headerTop = $('header').position().top,
				headerBottom = headerHeight + headerTop;
			
			var changedDevice = false,
				real_width = $.util.realWidth();

			$bookmarkMenu.on('click', 'a', function(e){
				e.preventDefault();
				var eTarget = $(this)[0].hash,
					dockedHeight = $('header').outerHeight();

				$bookmarkMenu.find('li').removeClass().addClass('unsel');	
				$(this).parent().removeClass().addClass('sel');
				if(real_width > 992){
					$.util.goToScroll(eTarget,'','','', dockedHeight);
				}else{
					dockedHeight = dockedHeight+$('#bookmarkNav').outerHeight(); 
					$.util.goToScroll(eTarget,'','','', dockedHeight);
				}
			});
			
			eventDriven.on(eventDictionary.global.RESIZE, function(e){
				real_width = $.util.realWidth();

				if(real_width > 992){
					$('#bookmarkNav').addClass('col-md-2 fixed');
					$('.bx-box').addClass('css-shapes-preview');
					changedDevice = false;
				}else{
					if(!changedDevice){
						$('#bookmarkNav').removeClass();
						$('.bx-box').removeClass('css-shapes-preview');
						$('.nav-scroll').hasClass('docked') ? $('#bookmarkNav').addClass('fixed') : $('#bookmarkNav').removeClass('fixed');

						changedDevice = true;
					}
				}
			});

			$(window).on('resize', function(e){
				eventDriven.trigger(jQuery.Event(eventDictionary.global.RESIZE));
			});

			eventDriven.on(eventDictionary.global.SCROLL, function(e){
				var scrollTop = $.util.getScrollTop();	
				if(real_width < 992){
					if($('.nav-scroll').hasClass('docked')){
						$('#bookmarkNav').addClass('fixed');
					}else{
						$('#bookmarkNav').removeClass('fixed');
					}
				}
			});

			/*$(window).on('scroll', function(e){
				if(real_width < 992){
					console.log('called33');
					eventDriven.trigger(jQuery.Event(eventDictionary.global.SCROLL));
				}
			});*/

		}


		init();
	};

}(jQuery));

$(function () {
	new $.BookmarkList();
});
