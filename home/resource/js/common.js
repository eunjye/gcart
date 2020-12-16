;(function ($, win, doc, undefined) {
	
	var namespace = 'GC';

	win[namespace] = {
		status: {
			scrollY: 0,
			scrollDirection: '',
			scrollIsHome: function(){
				return win[namespace].status.scrollY === 0 ? true : false;
			},
			scrollIsEnd: function(){
				return win[namespace].status.scrollY + $(win).outerHeight() === $(doc).outerHeight() ? true : false;
			},
			scrollCheck: {
				beforeScrollY: 0,
				direction: function(){
					return win[namespace].status.scrollCheck.beforeScrollY < win[namespace].status.scrollY ? 
						'down' : 'up';
				},
				init: function(){
					function bodyAddClass() {
						var $body = $('body');
						if (!!win[namespace].status.scrollIsHome()) {
							$body.addClass('is-home');
						} else if (!!win[namespace].status.scrollIsEnd()) {
							$body.addClass('is-end');
						} else {
							$body.removeClass('is-home is-end');
						}
					}
					win[namespace].status.scrollY = $('html').prop('scrollTop');
					win[namespace].status.scrollIsHome();
					win[namespace].status.scrollIsEnd();
					bodyAddClass();

					$(doc).off('scroll.scrollCheck').on('scroll.scrollCheck', function(){
						win[namespace].status.scrollY = $('html').prop('scrollTop');
						win[namespace].status.scrollDirection = win[namespace].status.scrollCheck.direction();
						win[namespace].status.scrollCheck.beforeScrollY = win[namespace].status.scrollY;
						win[namespace].status.scrollIsHome();
						win[namespace].status.scrollIsEnd();
						bodyAddClass();
					});

				}
			}
		},
		navLoad: function(){
			(function () {
				return new Promise(function(resolve, reject) {
					$.get('/gcart/home/include/header.html', function(response) {
						if (response) {
							resolve(response);
						}
						reject(new Error('Request is failed'));
					});
				});
			})()
			.then(function(data) {
				$('.header-area').html(data);
				win[namespace].nav.hoverMenu(); // hover evt on nav
				win[namespace].nav.slidingMenu(); // show/hide evt on nav
				
			}).catch(function(err) {
				console.error('win.'+namespace+'.navLoad failed!!');
			});
		},
		footerLoad: function(){
			(function () {
				return new Promise(function(resolve, reject) {
					$.get('/gcart/home/include/footer.html', function(response) {
						if (response) {
							resolve(response);
						}
						reject(new Error('Request is failed'));
					});
				});
			})().then(function(data) {
				$('.footer-area').html(data);
			}).catch(function(err) {
				console.error('win.'+namespace+'.footerLoad failed!!');
			});
		},
		nav: {
			hoverMenu: function(){
				var $header = $('.header-area');
				var $links = $header.find('.gnb-area a');
				var flag = {};

				$links
          .off('.openMenuPC')
          .on('mouseenter.openMenuPC focus.openMenuPC', function () {
						$header.addClass('hover');
						clearTimeout(flag);
            $header
              .off('.closeMenuPC')
              .on('mouseleave.closeMenuPC', removeHover);
            $links.off('.closeMenuPC').on('blur.closeMenuPC', removeHover);
          });
					
				function removeHover() {
					flag = setTimeout(function () {
            $header.removeClass('hover');
          }, 1);
        }
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
				win[namespace].mainSlider.slide = $('.slider-visual .slider-inner').slick({
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

			$(win).off('.'+namespace);

			$(doc).on('ready.'+namespace, function(){
				win[namespace].navLoad();
				win[namespace].footerLoad();
				win[namespace].status.scrollCheck.init();

				win[namespace].nav.hoverMenu(); // hover evt on nav
				win[namespace].nav.slidingMenu(); // show/hide evt on nav
			})
			$(doc).on('scroll.'+namespace, function(){

			})
		}
	}
	
	win[namespace].init();
})(jQuery, window, document);