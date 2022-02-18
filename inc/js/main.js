var myhome = myhome || {};
myhome.ui = {};

(function (_ui) {

	_ui.Main = (function(){

		const myAbility = document.querySelector('.my-ability');
		const abilityRect = myAbility.getBoundingClientRect();

		function init(){
			let pageYOffset = window.pageYOffset + window.innerHeight;
			if(pageYOffset > abilityRect.top){
				myAbility.classList.add('active');
			}

			bindEvents();
		}

		function bindEvents(){
			document.addEventListener('scroll', function(){
				let pageYOffset = window.pageYOffset + window.innerHeight - abilityRect.height;
				if(pageYOffset > abilityRect.top){
					myAbility.classList.add('active');
				}
			});
		}

		return {
			init: init
		}

	})();

}(myhome.ui ));

$(function (){
	myhome.ui.Main.init();
});
