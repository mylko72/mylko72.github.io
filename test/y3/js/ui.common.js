var SHILLADFS = SHILLADFS || (SHILLADFS = {});      // NAMESPACE 지정
SHILLADFS.MD = SHILLADFS.MD || {};                  // 공통 모듈
SHILLADFS.UI = SHILLADFS.UI || {};                  // UI 기본 설정

// UI 기본 설정
SHILLADFS.UI = {
    Components : function(){},
    LIBS : {},
    keys : {},
    elem : {
        $doc : $(document),
        $win : $(window),
        $html : $('html'),
        $body : $('body'),
        head : document.getElementsByTagName("head")[0]
    },
    events : {
        resize : "resize",
        ready : "ready",
        scroll : "scroll",
        load : "load",
        click : "click",
        mousewheel : "DOMMouseScroll mousewheel wheel",
        mousemove : "mousemove",
        mousedown : "mousedown",
        mouseup : "mouseup",
        touchstart : "touchstart",
        touchmove : "touchmove",
        touchend : "touchend"
    },
    keycode : {
        tab 		: 9,
        enter 		: 13,
        up 			: 38,
        down 		: 40,
        left 		: 37,
        right 		: 39,
        esc 		: 27,
        backspace 	: 8,
        space	 	: 32
    },

    log : function( msg, color ){
        if( msg ){
            color || (color = 'red');
            window.console.log("%c" + msg, "color:"+color+";");
        }
    },

    debug : function( msg ){
        if( msg ){
            var $html = '<div id="debug" style="position:fixed;top:0;right:0;z-index:9999;background-color:#000;color:#fff;font-size:14px;"></div>';
            if( !$('#debug').length ){
                $('body').append( $html );
            }
            $('#debug').text( msg );
        }
    },

    transitionEndName : (function(){
        var keys,
            el = document.createElement('fakeelement'),
            transitions = {
                'transition':'transitionend',
                'OTransition':'oTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            };

        for( keys in transitions ){
            if( el.style[keys] !== undefined ){
                return transitions[keys];
            }
        }
    }()),


    animationEndName : (function(){
        var keys,
            el = document.createElement('fakeelement'),
            animations = {
                'animation':'animationend',
                'OAnimation':'oAnimationEnd',
                'MozAnimation':'animationend',
                'WebkitAnimation':'webkitAnimationEnd'
            };

        for( keys in animations ){
            if( el.style[keys] !== undefined ){
                return animations[keys];
            }
        }
    }()),

};

// 공통 모듈 정의
SHILLADFS.MD = {
    observer : function(){
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function (entry) {
                var currentY = entry.boundingClientRect.top,
                    currentRatio = entry.intersectionRatio,
                    isIntersecting = entry.isIntersecting;
                    entry.target.dataset.observer = entry.isIntersecting;

                if (currentY > previousY && isIntersecting) {
                    ( !obj.currentCheck && obj.toggleCheck && obj.loadCheck ) && obj.button.trigger('click', { 'flag' : false });
                }

            });

        }, {
            root: null,
            threshold: 0
        });

        var boxElList = document.querySelector( obj.wrap.selector );

        io.observe( boxElList );
    },
    popup : function(){
        /* POPUP 
        * 팝업 닫기 클릭 시 열려있는 모든 팝업 같이 닫힘
        * 호출 버튼 : [data-ui=popup] && href="{{ String }}"
        * 호출 팝업 : [data-popup=cont] && id="{{ String }}"  
        * 팝업 닫기 버튼 : [data-popup=close]
        * 팝업 dimmed : [data-popup=dimmed]
        **/
        var module = {
            SELF : $('[data-ui=popup]'),
            NAME : 'UIPopupComponent',
            DATA : {
                ANCHOR : '[data-ui=popup]',
                CLOSE : '[data-popup=close]',
                POPUP : '[data-popup=cont]',
                DIMMED : '[data-popup=dimmed]',
            },
            STORAGE : [],
            STORAGEName : 'UIStorageIndex'
        }

        function init(){
            module.SELF.length && module.SELF.each(function( index ){
                module.STORAGE[index] = new Component( this, index );
                
                for (var key in module.STORAGE[index].elem) {
                    $(module.STORAGE[index].elem[key]).data( module.STORAGEName, index);
                }
            })

            bindEvents();
        }

        function Component( el, index ){
            this.self = $(el);
            this.options = $.extend({
                index : index,
                elem : {
                    root: this.self,
                    anchor : this.self,
                    close : $(this.self.attr('href')).find( module.DATA.CLOSE ),
                    popup : $(this.self.attr('href')),
                    dimmed : $(this.self.attr('href')).find( module.DATA.DIMMED )[0] || true,
                },
                allClose : true,
                popupDimmed : true,
                lockClass : 'lockBody'
            }, this.self.data());

            return this.options;
        }

        function bindEvents(){

            SHILLADFS.UI.elem.$doc.on(SHILLADFS.UI.events.click, module.DATA.ANCHOR, popupToggle( true ));
            SHILLADFS.UI.elem.$doc.on(SHILLADFS.UI.events.click, module.DATA.CLOSE, popupToggle( false ));
            SHILLADFS.UI.elem.$doc.on(SHILLADFS.UI.events.click, module.DATA.DIMMED, popupToggle( false ));
        }

        function popupDimmed( obj ) {

            if (obj.elem.dimmed === true && obj.popupDimmed) {

                var dim = $('<span />').css({
                    'display' : 'block',
                    'position' : 'fixed',
                    'top' : 0,
                    'left' : 0,
                    'width' : '100%',
                    'height' : '100%',
                    'z-index' : 1,
                    'background' : '#000',
                    'opacity' : '.8',
                    'cursor' : 'pointer',
                    })
                    .attr('data-popup', 'dimmed')
                    .data( module.STORAGEName, obj.index );

                    obj.elem.dimmed = dim;

                obj.elem.popup.prepend( dim );
            }

        }

        function popupToggle( flag ) {

            return function( event ){

                var obj = module.STORAGE[$(this).data( module.STORAGEName )];

                obj.allClose && SHILLADFS.UI.elem.$doc.find( module.DATA.POPUP ).hide();
                !obj.allClose && obj.elem.popup.fadeOut('fast');
                flag && (obj.elem.popup.fadeIn('fast'), popupDimmed( obj ), SHILLADFS.UI.elem.$body.addClass( obj.lockClass ));
                !flag && SHILLADFS.UI.elem.$body.removeClass( obj.lockClass );

                event.preventDefault();
            }

        }

        init();

        return {
            init : init
        }
    }
}

// 모듈 실행
;(function (win, $, undefined) {
    "use strict";

    function commonInit(){
        SHILLADFS.MD.popup();
    }

    SHILLADFS.UI.elem.$doc.ready( commonInit );
    
})(this, jQuery);

