/* jshint devel:true */

(function($) {
	'use strict';

	/*
	var __w = $(window).width();
	var __h = $(window).height();

	function _resize () {
		__w = $(window).width();
		__h = $(window).height();

		$('.grid img').each(function() {
			setDimensionsImage(425, 400, $(this), $(this).parent().parent());
		});
	}
	_resize();

	$(window).on('resize', function() {
		_resize();
		$('.dot').trigger('update');
	});

	// difinição das dimensões de uma imagem para aplicação do lazyload em layout responsivo
	function setDimensionsImage (w, h, $elem, $refDim) {
		var ratio = w / h;
		var newWidth = $refDim.width();
		$elem.width(newWidth);
		$elem.height(newWidth / ratio);
	}
	*/






	// limitação de texto de um bloco
	$('.dot').dotdotdot({
        ellipsis	: '... ',
		callback : function() {
			$('.dot').addClass('vis-visible');
		}
    });






	// âncora com scroll animado
	$('.anchor').anchorAnimate({speed: 800});






	// data:image gerado em http://www.patternify.com/
	var dataImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2N8/fp1PQAIzANCkQYFvgAAAABJRU5ErkJggg==';

	// lazyload em imagens
	$('.lazy').lazyload({
		placeholder: dataImage,
		effect: 'fadeIn',
		load: function() {
			$(this).parent().removeClass('bg-lazy');
		}
	}).parent().addClass('bg-lazy');






	// efeito dos elementos durante o evento scroll (animate.css) - http://daneden.github.io/animate.css/
	var animateElem = $('.animate');
	function _scrollElements($el, ws) {		
		$el.each(function() {
			if ($(this).offset().top <= ws + $(window).height()) {
				$(this).css({visibility: 'visible'}).addClass('animated fadeInUp');
			}
		});
	}
	$(window).on('scroll', function() {
		_scrollElements(animateElem, $(this).scrollTop());
	});
	_scrollElements(animateElem, $(window).scrollTop());





	// botão para scroll caso a tela seja deslizada
	$.scrollUp({
		scrollImg : true,
		scrollDistance : 100
	});





	/*
	// controle de scroll com animação de algum elemento dentro de um container
	function _animAnchorContainer($elem,parent,speed) {
		if (typeof $elem.offset() !== 'undefined') {
			var pos = $elem.offset().top - 10;
			$(parent + ':not(:animated)').animate({scrollTop: pos - $(parent).offset().top}, speed);
		}
	}
	*/

	/*
	// controle de scroll com animação de algum elemento
	function _animAnchor($this,speed) {
		var pos = $this.offset().top - 10;
		$('html:not(:animated),body:not(:animated)').animate({scrollTop: pos}, speed);
	}
	*/





})(jQuery);