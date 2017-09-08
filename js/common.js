/*
**************************************************************************
*	tag-tokyu 2018 common.js
**************************************************************************/

var UaInfo = (function(){
	var that = {
		os: '',
		interface: 'mouse'
	};
	var userAgent = window.navigator.userAgent.toLowerCase();

	if (userAgent.indexOf('iphone') >= 0 || userAgent.indexOf('ipod') >= 0) {
		that.os = 'iPhone';
		that.interface = 'touch';
	} else if(userAgent.indexOf('ipad') >= 0) {
		that.os = 'iPad';
		that.interface = 'touch';
	} else if (userAgent.indexOf('android') >= 0) {
		if(userAgent.indexOf('mobile') >= 0) {
			that.os = 'Android';
		} else {
			that.os = 'AndroidTab';
		};
		that.interface = 'touch';
	} else  if (navigator.userAgent.indexOf('Win')!=-1){
		that.os = 'win';
	} else {
		that.os = 'mac';
	};
	return that;
})();

TAG = {
	minWidth: 1080,
	breakPoint: 768,
	scrollBarWidth: 17,
	touch: false,
	rspEvent: null,
	visEvent: null,
	preload: null,
	nowPage: null,
	ancherNav: null
}

$(function(){
	TAG.scrollBarWidth = window.innerWidth - $(window).outerWidth(true);
	TAG.touch = UaInfo.interface == 'touch';
	if (TAG.touch) {
		$('html').addClass('is-touch');
	};
	// var ida = $('body').attr('class').split(' '),
		idb = [];
	// $.each(ida, function(i, item){
	// 	if (item.substr(0,3) == 'id-') {
	// 		idb.push(item.substr(3));
	// 	};
	// });
	TAG.nowPage = idb;

	TAG.rspEvent = new (function(){
		var that = {},
			task = [],
			id = 'pc';
		that._init = function(){
			$(window).on('resize.rsp', function(e){
				that._resize();
			});
			that._resize();
			return that;
		};
		that._resize = function(){
			var _id = '';
			if (window.matchMedia('(max-width:767px)').matches) _id = 'sp';
			else _id = 'pc';
			if (id != _id) {
				id = _id;
				that._dispatch();
			};
		};
		that._dispatch = function(){
			$.each(task, function(i, f){
				f(id);
			});
		};
		that.add = function(f){
			task.push(f);
			f(id);
		};
		that.get = function(){
			return id;
		};
		return that._init();
	});

	TAG.visEvent = new (function(){
		var that = {},
			task = [];
		that._init = function(){
			$(window).on('resize.vis scroll.vis', function(e){
				that._check();
			});
			return that;
		};
		that._check = function(){
			var _t = $(window).scrollTop(),
				_h = $(window).height(),
				_l = task.length;
			for (var i = _l - 1; i >= 0; i--) {
				var _pt = task[i].$t.offset().top,
					_ph = task[i].$t.outerHeight();
				if (_t <= _pt + _ph && _pt <= _t + _h) {
					if (!task[i].s && (_pt <= _t + _h * task[i].p)) {
						task[i].s = true;
						task[i].func(true, task[i].$t);
						if (task[i].one == 1) {
							that.remove(task[i].$t);
						};
					};
				} else {
					if (task[i].s) {
						task[i].s = false;
						task[i].func(false, task[i].$t);
					};
				};
			};
		};
		that.add = function(t, f, p, b){
			task.push({ $t: t, func: f, s: false, p: (p ? p : 1), one: (b ? b : 0) });
			that._check();
		};
		that.remove = function(t){
			for (var i = 0; i < task.length; i++) {
				if (task[i].$t == t) {
					task.splice(i, 1);
					return;
				};
			};
		};
		return that._init();
	});

	TAG.loadEvent = new (function(){
		var that = {},
			task = [];
		that._init = function(){
			return that;
		};
		that.dispatch = function(type){
			$.each(task, function(i, f){
				f(type);
			});
		};
		that.add = function(f){
			task.push(f);
		};
		return that._init();
	});

	TAG.preload = new (function(){
		var that = {},
			task = [],
			callBack = null,
			num = 0,
			total = 0,
			img = null;
		that._start = function(){
			img = new Image();
			$(img).on('load', function(e){
				$(img).off('load');
				$(img).off('error');
				$(img).remove();
				img = null;
				num ++;
				if (task.length > 1) {
					task.shift();
					that._start();
					that._progress();
				} else {
					that._complete();
				};
			});
			img.src = task[0];
		};
		that._progress = function(){
			callBack({ type: 'progress', now: num, total: total });
		};
		that._complete = function(){
			callBack({ type: 'complete', now: num, total: total });
		};
		that.add = function(a){
			task = task.concat(a);
			total = task.length;
		};
		that.load = function(c){
			callBack = c;
			if (total == 0) {
				that._complete();
			} else {
				that._start();
			};
		};
		that.reset = function(){
			task = [];
			total = 0;
			callBack = null;
			if (img){
				$(img).off('load');
				img = null;
			};
		};
		return that;
	});

	function setImageRollover(){
		$('a.img-on').each(function(i){
			var $self = $(this),
				srcs = [];
			$self.find('img').not('.off').each(function(j){
				var _src = $(this).data('img') ? $(this).data('img') : $(this).attr('src');
				srcs[j] = {
					off: _src,
					on : _src.replace(/\.\w+$/, '_o'+'$&')
				};
			});
			$self.hover(function(e){
				if (TAG.rspEvent.get() == 'sp' || TAG.touch) return;
				if (srcs.length > 0) {
					$self.find('img').not('.off').each(function(j){
						$(this).attr('src', srcs[j].on);
					});
				};
			}, function(e){
				if (TAG.rspEvent.get() == 'sp' || TAG.touch) return;
				if (srcs.length > 0) {
					$self.find('img').not('.off').each(function(j){
						$(this).attr('src', srcs[j].off);
					});
				};
			});
		});
	};

	function setImageSwitch(){
		var task = [];
		$('img.switch').each(function(i){
			var _src = $(this).data('img');
			if (!_src) _src= $(this).attr('src');
			task.push({
				target: $(this),
				pc: _src,
				sp: _src.replace(/\.\w+$/, '_sp'+'$&')
			});
		});
		TAG.rspEvent.add(function(_id){
			$.each(task, function(i){
				this.target.attr('src', this[_id]);
			});
		});
	};

	function setInnerScroll(){
		$('a.scroll').on('click', function(e){
			e.preventDefault();
			var ta = $(this).attr('href');
			if (ta == '#') ta = 'body';
			var pt = $(ta).offset().top;
			var wh = $(window).height();
			var ch = $('body').height();
			if (pt + wh > ch) {
				pt = ch - wh;
			};
			TweenMax.to($('html,body'), 0.8, { scrollTop: pt, ease: Expo.easeInOut });
		});
	};

	function setLineHight(){
		var isPc = '',
			winW = 0;
		function change(){
			$('.js-h').each(function(){
				var _d = parseInt($(this).data(isPc)),
					$t = $(this);
				if (_d == 0) {
					$t.find('.modH').css({ height: '' });
				} else {
					var _n = 0,
						_m = 0,
						_o = 0,
						_l = $t.find('.modH').length - 1;
					$t.find('.modH').each(function(j){
						$(this).css({ height: '' });
						_o = Math.max(_o, $(this).outerHeight());
						if (_m % _d == _d - 1 || _l == j) {
							for (var k = _n * _d; k < _m + 1; k ++) {
								$t.find('.modH').eq(k).css({ height: _o });
							};
							_o = 0;
							_n ++;
						};
						_m ++;
					});
				};
			});
		};
		function init(){
			$(window).on('resize.lineH', function(e){
				var _winW = $(window).width();
				if (_winW != winW) {
					winW = _winW;
					change();
				};
			});
			TAG.rspEvent.add(function(_id){
				isPc = _id;
				change();
			});
		};
		$(window).on('load.lineH', function(e){
			init();
		});
	};

	function setTelLink(){
		function setTel(){
			$('span[data-action=call]').each(function(i){
				var _t = $(this).text();
				$(this).html('<a href="tel:'+_t.replace(/-/g, '')+'">'+_t+'</a>');
			});
		};
		function resetTel(){
			$('span[data-action=call]').each(function(i){
				var _t = $(this).text();
				$(this).html(_t);
			});
		};
		TAG.rspEvent.add(function(_id){
			if (_id == 'pc') {
				resetTel();
			} else {
				setTel();
			};
		});
	};

	function setPagetop(){
		var $btn = $('#pagetop'),
			isShow = false;

		function scroll(){
			var st = $(window).scrollTop(),
				wh = $(window).height();
			if (st > wh * 0.5) {
				if (!isShow) {
					isShow = true;
					$btn.stop().fadeIn(400);
				};
			} else {
				if (isShow) {
					isShow = false;
					$btn.stop().fadeOut(400);
				};
			};
		};
		scroll();

		$(window).on('scroll.pagetop', function(e){
			scroll();
		});
	};

	function setSns(){
	};

	function setHeader(){
		var $parsonBtn = $('.header-nav .contentNav-toggle.contentNav-parsons'),
			$parsonTag = $('.header-parsons'),
			isParson = false,
			parsonTime = false;
		$('.header-nav .contentNav-list > li > a').each(function(i){
			var _a = $(this).attr('href').split('/');
			if (_a[2] == TAG.nowPage[0]) {
				$(this).addClass('on');
				return;
			};
		});
		TAG.nowPage[0]
		$parsonBtn.hover(function(e){
			if (TAG.rspEvent.get() == 'pc') {
				parsonClear();
				parsonOpen();
			};
		}, function(e){
			if (TAG.rspEvent.get() == 'pc') {
				parsonStart();
			};
		});
		$parsonTag.hover(function(e){
			parsonClear();
		}, function(e){
			parsonStart();
		});
		$parsonTag.find('.parsonsNav-list li').each(function(i){
			$(this).append('<span class="cover '+$(this).find('a').attr('class')+'"></span>');
		});
		function parsonOpen(){
			if (isParson) return;
			isParson = true;
			$parsonTag.show();
			$parsonTag.find('.parsonsNav-list li').each(function(i){
				var $that = $(this);
				TweenMax.to($that.find('.cover'), 0.6, { width: '100%', delay: i*0.05, ease: Quart.easeOut, onComplete: function(e){
					$that.find('a').css({ opacity: 1 });
					TweenMax.fromTo($that.find('.parsonsNavList-box'), 0.6, { left: -50 }, { left: 0, ease: Quart.easeOut });
					TweenMax.to($that.find('.cover'), 0.6, { left: '100%', ease: Quart.easeOut });
				} });
			});
		};
		function parsonClose(){
			if (!isParson) return;
			isParson = false;
			TweenMax.killTweensOf($parsonTag.find('.cover'));
			TweenMax.killTweensOf($parsonTag.find('.parsonsNavList-box'));
			$parsonTag.find('.cover').css({ left: '', width: '' });
			$parsonTag.find('.parsonsNavList-box').css({ left: '' });
			$parsonTag.find('a').css({ opacity: '' });
			$parsonTag.hide();
		};
		function parsonStart(){
			parsonClear();
			parsonTime = setTimeout(function(e){
				parsonClose();
			}, 150);
		};
		function parsonClear(){
			clearTimeout(parsonTime);
		};

		var $menuOpen = $('.headerMenu-open'),
			$menuClose = $('.headerMenu-close'),
			$menuTag = $('.header-menu'),
			isMenu = false;
		$menuOpen.on('click', function(e){
			e.preventDefault();
			menuOpen();
		});
		$menuClose.on('click', function(e){
			e.preventDefault();
			menuClose();
			$menuTag.find('.contentNavSub-list').css({ display: '' });
			$menuTag.find('.contentNav-toggle').removeClass('active');
		});
		$menuTag.find('.header-nav').on('click', function(e){
			if (e.target == this) {
				menuClose();
			};
		});
		$menuTag.on('messageClick', function(e){
			menuClose();
		});
		function menuOpen(){
			if (isMenu) return;
			isMenu = true;
			$menuTag.show();
			TweenMax.fromTo($menuTag, 0.6, { left: '100%' }, { left: 0, ease: Quart.easeOut });
			$('html').addClass('is-modal');
		};
		function menuClose(){
			if (!isMenu) return;
			isMenu = false;
			TweenMax.to($menuTag, 0.6, { left: '100%', ease: Quart.easeOut, onComplete: function(){
				$menuTag.hide();
			} });
			$('html').removeClass('is-modal');
		};

		TAG.rspEvent.add(function(id){
			if (id == 'pc') {
				isMenu = false;
				TweenMax.killTweensOf($menuTag);
				$menuTag.css({ display: '', left: '' });
				$('html').removeClass('is-modal');
			};
		});
	};

	function setFooter(){
	};

	function setContentNav(){
		$('.content-nav .contentNav-list > li').each(function(i){
			var $that = $(this),
				$btn = $that.find('.contentNav-toggle'),
				$tag = $that.find('.contentNavSub-list');

			$btn.on('click', function(e){
				if (TAG.rspEvent.get() == 'sp') {
					e.preventDefault();
					$tag.slideToggle(400, 'easeOutQuart');
					$btn.toggleClass('active');
				};
			});
		});
		TAG.rspEvent.add(function(id){
			$('.contentNavSub-list').css({ display: '' });
			$('.contentNav-toggle').removeClass('active');
		});

		if (TAG.nowPage[0] == 'top') {
			$('.contentNav-message').addClass('scroll').attr('href', '#message').on('click', function(e){
				$('.header-menu').trigger('messageClick');
			});
		};
	};

	// function setLoading(){
	// 	var $loader = $('#loader'),
	// 		isTop = TAG.nowPage[0] == 'top',
	// 		isAncher = $(window).scrollTop() > 50;
	// 	function loadStart(){
	// 		var imgs = [
	// 			'/2018/img/icon_arrow01.png',
	// 			'/2018/img/icon_arrow02.png',
	// 			'/2018/img/icon_arrow08.png',
	// 			'/2018/img/icon_plus01.png',
	// 			'/2018/img/icon_minus01.png',
	// 			'/2018/img/icon_menu_close.png',
	// 			'/2018/img/icon_menu_open.png',
	// 			'/2018/img/icon_entry.png',
	// 		];
	// 		$('img').each(function(i){
	// 			imgs.push($(this).attr('src'));
	// 		});
	// 		TAG.preload.add(imgs);
	// 		TAG.preload.load(function(e){
	// 			e.ancher = isAncher;
	// 			TAG.loadEvent.dispatch(e);
	// 			if ((!isTop || isAncher) && e.type == 'complete') {
	// 				loadEnd();
	// 			};
	// 		});
	// 	};
	// 	function anime($that){
	// 		TweenMax.to($that, 0.6, { top: (Math.random(0, 1) * 50), ease: Sine.easeOut, onComplete: function(e){
	// 			anime($that);
	// 		} });
	// 	};
	// 	function loadEnd(){
	// 		$loader.find('.loader-box').fadeOut(200, function(e){
	// 			TweenMax.killTweensOf($loader.find('li'));
	// 			$loader.fadeOut(800, function(e){
	// 				$loader.remove();
	// 				obj = { type: 'end', ancher: isAncher };
	// 				TAG.loadEvent.dispatch(obj);
	// 			});
	// 		});
	// 	};
	// 	setTimeout(function(e){
	// 		isAncher = $(window).scrollTop() > 50;
	// 		if (isTop && !isAncher) {
	// 			$loader.addClass('top');
	// 		} else {
	// 			$loader.find('li').each(function(i){
	// 				anime($(this));
	// 			});
	// 			$loader.find('.loader-box').fadeIn(200);
	// 		};
	// 		obj = { type: 'start', ancher: isAncher };
	// 		TAG.loadEvent.dispatch(obj);
	// 		loadStart();
	// 	}, 50);
	// };

	TAG.ancherNav = (function(){
		var that = function(){
			this.$box = $('#ancher-nav');
			this.$btn = this.$box.find('.ancherNav-button a');
			this.$list = this.$box.find('.ancherNav-list');
			this.isOpen = false;
			this.timer = null;
			this._init();
		};
		that.prototype = {
			_init: function(){
				var scope = this;
				this.$btn.on('click', function(e){
					e.preventDefault();
					scope._toggle();
				});
				this.$box.hover(function(e){
					scope._stop();
				}, function(e){
					scope._start();
				});
				TAG.rspEvent.add(function(b){
					if (!b) {
						scope.close();
					};
				});
			},
			_toggle: function(){
				var scope = this;
				this.$box.toggleClass('active');
				this.isOpen = this.$box.hasClass('active');
			},
			_start: function(){
				var scope = this;
				this._stop();
				this.timer = setTimeout(function(e){
					scope.close();
				}, 600);
			},
			_stop: function(){
				clearTimeout(this.timer);
			},
			open: function(){
				if (this.isOpen) return;
				this._toggle();
			},
			close: function(){
				if (!this.isOpen) return;
				this._toggle();
			}
		};
		return that;
	})();

	TAG.lineBg = (function(){
		var that = function(){
			this.$box = null;
			this.winW = 0;
			this.span = [];
			this._init();
		};
		that.prototype = {
			_init: function(){
				var scope = this;
				$('#warpAll').prepend('<div id="bg-line"></div>');
				this.$box = $('#bg-line');
				$(window).on('resize.line', function(e){
					scope._resize();
				});
				$(window).on('scroll.line', function(e){
					scope._scroll();
				});
				TAG.loadEvent.add(function(e){
					if (e.type == 'end') {
						scope._resize();
						scope._scroll();
					};
				})
			},
			_resize: function(){
				var _w = $(window).width();
				if (this.winW == _w) return;
				var scope = this,
					_h = $('#warpAll').height(),
					_t = TAG.rspEvent.get() == 'pc' ? 100 : 50;
				this.winW = _w;
				var _n = 0,
					_l = this.span.length;
				while (_n * (_w - _t) < _h) {
					_n ++;
				};
				if (_l < _n) {
					for (var i = _l; i < _n; i++) {
						this.$box.append('<span></span>');
						this.span.push(false);
					};
				};
				this.$box.find('span').each(function(i){
					$(this).css({ top: (_w - _t) * i });
				});
			},
			_scroll: function(){
				var _t = $(window).scrollTop(),
					_w = $(window).width(),
					_h = $(window).height(),
					_m = TAG.rspEvent.get() == 'pc' ? 100 : 50;
					_l = this.span.length;
				for (var i = _l - 1; i >= 0; i--) {
					var _pt = i * (_w - _m),
						_ph = (i + 1) * (_w - _m);
					if (_t <= _pt + _ph && _pt <= _t + _h) {
						if (!this.span[i] && (_pt <= _t + _h)) {
							this.span[i] = true;
							this._show(i);
						};
					};
				};
			},
			_show: function(n){
				var s = TAG.rspEvent.get() == 'pc' ? 5 : 3;
				TweenMax.to(this.$box.find('span').eq(n), s, { width: '141.42136%', delay: 0.5, ease: Sine.easeInOut });
			}
		};
		return that;
	})();


	// init
	setImageRollover();
	setImageSwitch();
	setHeader();
	setFooter();
	setContentNav();
	setInnerScroll();
	setLineHight();
	setTelLink();
	setPagetop();
	setSns();
	// setLoading();

	// easing
	$.extend($.easing,
	{
		easeOutQuart: function (x, t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		}
	});
});
// This looks like a JavaScript file. Click this bar to format it.No 1