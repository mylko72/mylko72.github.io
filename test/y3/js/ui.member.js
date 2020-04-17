/* 전역 네임스페이스 */
var SHILLADFS = SHILLADFS || {};
/* Membership 네임스페이스 정의 */
SHILLADFS.Membership = {};

(function(_Membership){

    /* Tab Switch */
    _Membership.TabSwitch = (function(){
        var module = $('[data-js=tabSwitch]');
        var moduleName = 'TabSwitch';

        function init(){
            module.length && module.each(function(){
                $(this).data('component', new initTabArea(this));
                console.log($(this).data());
            })
        }

        function initTabArea(el){
            this._this = $(el);
            this._elements = {
                root: this._this,
                tabmenu : this._this.find('[data-tab-type=tab]'),
                tabcontent : this._this.find('[data-tab-type=tab]')[0].dataset.tabTarget,
            };

            bindEvents(this._elements);
        }

        function bindEvents(el){

            var tabBtn = $('a', el.tabmenu);
            var tabList = $('li', el.tabmenu);
            var tabContents = $(el.tabcontent, el.root);

            tabBtn.on('click' + '.' + moduleName, function(e){
                e.preventDefault();

                var a = $(this);
                var idx = a.parent('li').index();

                tabList.removeClass('on');
                a.closest('li').addClass('on');

                tabContents.removeClass('active');
                tabContents.eq(idx).addClass('active');
            });

        }

        return {
            init: init
        }

    })();

    /* Accordion */
    _Membership.Accordion = (function(){
        var module = $('[data-js=accordion]');
        var moduleName = 'Accordion';

        function init(){
            module.length && module.each(function(){
                $(this).data('component', new initAccordion(this));
                console.log($(this).data());
            })
        }

        function initAccordion(el){
            this._this = $(el);
            this._elements = {
                root : this._this,
                anchor : this._this.find('[data-accordion-type]'),
                chkAnchor : this._this.find('[data-accordion-type=checkbox], [data-accordion-type=radio]'),
                btnAnchor : this._this.find('[data-accordion-type=button]'),
                panel : this._this.find('[data-accordion-target=panel]'),
                accordionList : this._this[0].dataset.accordionList,
                options : {
                    activeClass : 'active',
                    collapsible : this._this.data('accordionCollapsible'),
                    slide : this._this.data('accordionSlide'),
                    toggle : this._this.find('[data-accordion-type]')[0].dataset.accordionType === 'radio' ? false : true,
                    eventType : []
                }
            };

            bindEvents(this._elements);
        }

        function slideUpDown(el, self){
            var anchor = $(self);
            var accordionList = $(el.accordionList);
            var idx = anchor.closest(el.accordionList).index();
            var panels = accordionList.length && el.panel;
            var panel = accordionList.length ? el.panel.eq(idx) : el.panel;

            if(el.chkAnchor.hasClass('open') && anchor.attr('data-checked') == 'false') return false;

            if(el.options.slide){
                if(el.options.toggle){
                    el.chkAnchor.length && el.chkAnchor.toggleClass('open');
                    el.btnAnchor.length && el.btnAnchor.toggleClass('on');

                    panel.toggleClass('open');
                    panel.stop(true).slideToggle();    
                }else{
                    el.options.collapsible && panels.stop(true).slideUp();
                    panel.stop(true).slideDown();
                }
            }else{
                if(el.options.toggle){
                    el.chkAnchor.length && el.chkAnchor.toggleClass('open');
                    el.btnAnchor.length && el.btnAnchor.toggleClass('on');

                    panel.toggleClass('open');
                    panel.toggle();
                }else{
                    el.options.collapsible && panels.css('display','none');
                    panel.css('display','block');
                }
            }
        }

        function bindEvents(el){
            var anchor = el.chkAnchor.find('label');
            var button = el.btnAnchor;

            button.length && button.on('click' + '.' + moduleName, function(e){
                e.preventDefault();
                slideUpDown(el, this);
            });

            anchor.length && anchor.on('change' + '.' + moduleName, function(e){
                e.preventDefault();
                slideUpDown(el, this);
            })    
        }

        return {
            init: init
        }

    })();
    
    /* Checkbox */
    _Membership.Checkbox = (function(){
        var module = $('[data-js=checkbox]');
        var moduleName = 'Checkbox';

        function init(){
            module.length && module.each(function(){
                $(this).data('component', new initCheckbox(this));
                console.log($(this).data());
            })
        } 
        
        function initCheckbox(el){
            this._this = $(el);
            this._elements = {
                root : this._this,
                checkedAll : this._this.find('[data-checkbox-type]'),
                checkedItem : this._this.find('[data-checkbox-target]'),
                options : {
                    total : this._this.find('[data-checkbox-target]').length
                }
            }

            bindEvents(this._elements);
        }

        function bindEvents(el){
            var checkedAll = el.checkedAll;
            var checkedItem = el.checkedItem;
            var total = el.options.total;
            var checkedNum = 0;

            checkedAll.on('change' + '.' + moduleName, function(){
                var $input = $(this);
                var isChecked = $input.is(':checked');

                if(isChecked){
                    checkedItem.prop('checked', true);
                    setTimeout(function(){$input.parent('label').attr('data-checked', true)}, 300);
                }else{
                    checkedItem.prop('checked', false);
                    setTimeout(function(){$input.parent('label').attr('data-checked', false)}, 300);
                }

                checkedNum = getCheckedNum(el);
            });

            checkedItem.on('change' + '.' + moduleName, function(){
                checkedNum = getCheckedNum(el);

                if(checkedNum === total){
                    checkedAll.prop('checked', true);
                    setTimeout(function(){checkedAll.parent('label').attr('data-checked', true)}, 300);
                }else{
                    checkedAll.prop('checked', false);
                    setTimeout(function(){checkedAll.parent('label').attr('data-checked', false)}, 300);
                }
            })
        }

        function getCheckedNum(el){
            return el.root.find('[data-checkbox-target]:checked').length;
        }

        return {
            init: init
        }

    })();

    /* Tooltip */
    _Membership.Tooltip = (function(){
        var module = $('[data-js=tooltip]');
        var moduleName = 'Tooltip';

        function init(){
            module.length && module.each(function(){
                $(this).data('component', new initTooltip(this));
                console.log($(this).data());
            })
        }

        function initTooltip(el){
            this._this = $(el);
            this._elements = {
                root: this._this,
                button : this._this.find('[data-tooltip-type=button]'),
                tooltip : this._this.find('[data-tooltip-type=button]')[0].dataset.tooltipTarget,
                arrow : this._this.find('[data-tooltip-type=button]')[0].dataset.tooltipArrow
            };

            bindEvents(this._elements);
        }

        function computedStyle(el){
            var tooltip_width = el.root.find(el.tooltip).outerWidth();
            var maxWidth = parseInt($(window)[0].innerWidth - 40);
            var offsetX = el.button.offset().left;
            var xpos = 0;

            if(tooltip_width >= maxWidth){
                tooltip_width = maxWidth;
                xpos = -offsetX;
            }else{
                var tempX = (tooltip_width + offsetX) > maxWidth ? maxWidth - (tooltip_width + offsetX): -40;
                xpos = tempX;
            }

            return {
                'width' : tooltip_width + 'px',
                'left' : xpos + 'px',
                'top' : 'initial',
                'bottom' : '25px',
            }
        }

        function bindEvents(el){
            var button = el.button;
            var tooltip = el.root.find(el.tooltip);

            button.on('click' + '.' + moduleName, function(e){
                e.preventDefault();

                var cssStyle = computedStyle(el);

                if($(this).hasClass('active')){
                    e.target == this ? button.toggleClass('closed') : button.removeClass('closed');
                }

                button.addClass('active');
                button.append(tooltip);

                tooltip.css(cssStyle)
            });

            $(document).on('click', '.tip_close', function(e){
                e.preventDefault();
                $(this).closest('[data-tooltip-type=button]').addClass('closed');
            });
        }

        return {
            init: init
        }
    })();

    /* etc */
    _Membership.Util = (function(){
        var selectBox = $('[data-js=selectbox]');
        var checkedButton = $('[data-js=checkedButton]');

        function init(){

            /* Selectbox */
            selectBox.length && selectBox.each(function(){
                $(this).data('component', new initSelectBox(this));
                console.log($(this).data());
            });

            /* 인증버튼 */
            checkedButton.length && checkedButton.each(function(){
                $(this).data('component', new initCheckedButton(this));
                console.log($(this).data());
            });
        }

        /* Selectbox - 값 선택시 스타일 변경 */
        function initSelectBox(el){
            this._this = $(el);
            this._selectbox = this._this.find('.form_sel select');

            this._selectbox.on('change', function(){
                var value = $('option:selected', $(this)).val();
                var index = $('option', $(this)).index($('option:selected', $(this)));

                index === 0 ? $(this).parent('.form_sel').addClass('basic') : $(this).parent('.form_sel').removeClass('basic');
                if(value === 'direct'){
                    var $add_field = $(el).find('.form_inp.add_field').show();
                    $add_field.find('input[type=text]').focus();
                }else{
                    $(el).find('.form_inp.add_field').hide();
                }
            });
        }

        /* 인증버튼 - 선택시 활성 */
        function initCheckedButton(el){
            this._this = $(el);
            this._button = this._this.find('a');

            this._button.on('click', function(e){
                e.preventDefault();

                $(el).find('li').removeClass('on').addClass('off');
                $(el).find('li').attr('data-checked', false);

                $(this).parent('li').removeClass('off').addClass('on');
                $(this).parent('li').attr('data-checked', true);
            });
        }

        return {
            init: init
        }

    })();


})(SHILLADFS.Membership);

$(document).on('ready', function(e){
    SHILLADFS.Membership.TabSwitch.init();
    SHILLADFS.Membership.Accordion.init();
    SHILLADFS.Membership.Checkbox.init();
    SHILLADFS.Membership.Util.init();
    SHILLADFS.Membership.Tooltip.init();

    console.log($(window));
});