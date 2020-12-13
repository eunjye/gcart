;(function ($, win, doc, undefined) {
	
	var GC = {};

	win.GC = GC = {
		status: {
			scrollY: 0,
			scrollDirection: '',
			scrollIsHome: function(){
				return GC.status.scrollY === 0 ? true : false;
			},
			scrollIsEnd: function(){
				return GC.status.scrollY + $(win).outerHeight() === $(doc).outerHeight() ? true : false;
			},
			scrollCheck: {
				beforeScrollY: 0,
				direction: function(){
					return GC.status.scrollCheck.beforeScrollY < GC.status.scrollY ? 
						'down' : 'up';
				},
				init: function(){
					function bodyAddClass() {
						var $body = $('body');
						if (!!GC.status.scrollIsHome()) {
							$body.addClass('is-home');
						} else if (!!GC.status.scrollIsEnd()) {
							$body.addClass('is-end');
						} else {
							$body.removeClass('is-home is-end');
						}
					}
					GC.status.scrollY = $('html').prop('scrollTop');
					GC.status.scrollIsHome();
					GC.status.scrollIsEnd();
					bodyAddClass();

					$(doc).off('scroll.scrollCheck').on('scroll.scrollCheck', function(){
						GC.status.scrollY = $('html').prop('scrollTop');
						GC.status.scrollDirection = GC.status.scrollCheck.direction();
						GC.status.scrollCheck.beforeScrollY = GC.status.scrollY;
						GC.status.scrollIsHome();
						GC.status.scrollIsEnd();
						bodyAddClass();
					});

				}
			}
		},
		navLoad: function(){
			(function () {
				return new Promise(function(resolve, reject) {
					$.get('/home/include/header.html', function(response) {
						if (response) {
							resolve(response);
						}
						reject(new Error("Request is failed"));
					});
				});
			})()
			.then(function(data) {
				$('.header-area').html(data);
				GC.nav.hoverMenu(); // hover evt on nav
				GC.nav.slidingMenu(); // show/hide evt on nav
				
			}).catch(function(err) {
				console.error('win.GC.navLoad failed!!');
			});
		},
		footerLoad: function(){
			(function () {
				return new Promise(function(resolve, reject) {
					$.get('/home/include/footer.html', function(response) {
						if (response) {
							resolve(response);
						}
						reject(new Error("Request is failed"));
					});
				});
			})().then(function(data) {
				$('.footer-area').html(data);
			}).catch(function(err) {
				console.error('win.GC.footerLoad failed!!');
			});
		},
		nav: {
			hoverMenu: function(){
				var $header = $('.header-area');
				var $link = $header.find('.nav-d1 > li > a')

				$link
					.off('.hoverOnLink')
					.on('mouseenter.hoverOnLink', function(){
						$header.addClass('hover');
						$header.on('mouseleave.hoverOnLink', function(){
							$header.removeClass('hover');
						})
					})
			},
			slidingMenu: function(){
				var $header = $('.header-area');
				var $btnMenu = $header.find('.btn-menu');
				
				$btnMenu
					.off('.openMenu')
					.on('click.openMenu', function(){
						$header.toggleClass('open');
					});
			}
		},
		mainSlider: {
			slide: {},
			init: function(){
				GC.mainSlider.slide = $('.slider-visual .slider-inner').slick({
					infinite: true,
					speed: 400,
					autoplay: true,
					autoplaySpeed: 5000,
					arrows: false,
					pauseOnHover: false,
					dots: true,
					appendDots: '.slider-pagination',
					customPaging : function(slider, idx) {
							return '<a href="#">'+ ((idx < 9)?'0'+ ++idx : ++idx) +'</a>';
					},
				})
			}
		},
		init: function(){

			$(win).off('.GC');

			$(doc).on('ready.GC', function(){
				GC.navLoad();
				GC.footerLoad();
				GC.status.scrollCheck.init();

				GC.nav.hoverMenu(); // hover evt on nav
				GC.nav.slidingMenu(); // show/hide evt on nav
			})
			$(doc).on('scroll.GC', function(){

			})
		}
	}
	
	GC.init();
})(jQuery, window, document);