(function ($) {

    /**
	@class $WorkList.
	@constructor
	**/
    $.WorkList= function () {

		var $workTmplList = $('#work-templates .works-list').find('>div'),
			$worklist = $('.page-slider').find('.works-list');

        /** 
		Init function will check for specific body classes and create the necessary page object.
		@function init
		**/
        function init() {

			loadPortfolio();	

		}

		function loadPortfolio(){
			var u = new Date(),
				result  = u.getTime()/1000,
				url = '/home/html/data/works.json?result='+result;

			$.getJSON(url, function(data){
				var buildData;

				console.log(data.works);
				
				$.each(data.works, function(i, data){
					buildData = generateHtml(data);
					buildData.appendTo($worklist);
				});
			})
			.done(function(){
				new $.PageSlider();
				new $.LazyLoadImages().init();
			});
		}

		function generateHtml(jsonData){
            var $template = $workTmplList.clone(true);
			var result;

			if(jsonData){
				$template
				.find('img').attr('src', jsonData.image).end()
				.find('.caption a').attr('data-view', jsonData.view).end()
				.find('.caption h3').text(jsonData.project).end()
				.find('.caption .client').text(jsonData.client).end()
				.find('.caption .date').text(jsonData.date).end()
				.find('.caption .url').text(jsonData.url).end();
			}

			return $template;
		}
		init();
	};

}(jQuery));

$(function () {
	new $.WorkList();
});

(function ($) {

    /**
	@class $.PageSlider
	@constructor
	**/
    $.PageSlider= function () {

		var	$pageContainer = $('.page-crop'), 
			$workEl = $('.works-list').find('>div'),
			$links= $workEl.find('.caption a'),
			$workDesc = $('.work-desc'),
			$back = $workDesc.find('.back'),
			animated = false,
			timer;

		console.log($workEl);

        /** 
		Init function will check for specific body classes and create the necessary page object.
		@function init
		**/
        function init() {
			$.util= new $.Utilities();

			bindEvents();	
		}

		function resizeHeight(element){
			var $self = $(element),
				paddingTop= parseInt($workDesc.css('padding-top')),
				paddingBottom = parseInt($workDesc.css('padding-bottom'));
				thisHeight = $self.outerHeight();

			thisHeight = thisHeight+paddingTop+paddingBottom;
			$pageContainer.css('height', thisHeight);
		}

		function ajaxList(file) {
			$.get('/home/html/work/'+file+'.sec',function(data){
				$('.work-view').empty().append(data).hide();                 
			})
			.done(function() {
				$('.work-view').fadeIn(1000, function(){
					resizeHeight('.work-view');
				});                 
				//ss.ResponsiveImages().init();
				//colPattern();   
			})
			.fail(function() {
				/* error state */
			});

			//$('.filter-'+file).addClass('active');           
			//content.removeClass('active');  

			$.util.goToScroll('.work-desc');
		}

        /**
		@function bindEvents
		Bind events to elements on home page
		**/
        function bindEvents() {
			$links.on('click', function(e){
				e.preventDefault();

				var file = $(this).data('view');
				
				if(file==''){
					alert('상세이미지가 없습니다');
					return false;
				}

				console.log(file);

				$('body').addClass(function(idex){
					$workDesc.css('display', 'block');
					animated = true;

					ajaxList(file);

					return 'easing-page';
				});
			});

			$back.on('click', function(e){
				//e.preventDefault();
				$('body').removeClass(function(index){
					$pageContainer.css('height', 'auto');
					return 'easing-page';
				});

				timer = setTimeout(function(){
					if(animated && !$('body').hasClass('easing-page')){
						$workDesc.css('display', 'none');
						animated = false;
						clearTimeout(timer);
					}
				}, 500);
			});
			
			eventDriven.on(eventDictionary.global.RESIZE, function(e){
				resizeHeight('.work-view');
			});

			$(window).on('resize', function(e){
				if($workDesc.is(':visible')){
					console.log('resize');
					eventDriven.trigger(jQuery.Event(eventDictionary.global.RESIZE));
				}
			});
		}

		init();
	};

}(jQuery));

$(function () {
	//new $.PageSlider();
});
