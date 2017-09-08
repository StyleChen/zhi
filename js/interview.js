/*
**************************************************************************
*	tag-tokyu 2018 interview.js
**************************************************************************/

$(function(){

	function setMotion(){
		$('.modPanel-box').append('<span class="cover"></span>');
		$('.modPanel-image').append('<span class="cover"></span>');

		function init(){
			$('.modPanel-box').each(function(i){
				var $that = $(this);
				TAG.visEvent.add($that, function(e){
					TweenMax.to($that.find('> .cover'), 1, { left: '100%', ease: Quart.easeOut, onComplete: function(){
						$(this.target).remove();
					} });
					if (TAG.rspEvent.get() == 'pc') {
						TweenMax.to($that.find('.modPanel-image .cover'), 1, { left: '100%', delay: 1, ease: Quart.easeOut, onComplete: function(){
							$(this.target).remove();
						} });
					} else {
						$that.find('.modPanel-image .cover').remove();
					};
					TweenMax.fromTo($that.find('.modPanel-inner'), 1, { left: -100 }, { left: 0, ease: Quart.easeOut });
				}, 0.8, 1);
			});
		};

		TAG.loadEvent.add(function(e){
			if (e.type == 'end') {
				init();
			};
		});
	};

	// init
	new TAG.ancherNav();
	new TAG.lineBg();
	setMotion();
});