/*******

    *** Anchor Slider by Cedric Dugas   ***
    *** Http://www.position-absolute.com ***
    
    Never have an anchor jumping your content, slide it.

    Don't forget to put an id to your anchor !
    You can use and modify this script for any project you want, but please leave this comment as credit.
    
*****/
jQuery.fn.anchorAnimate = function(settings) {
    'use strict';
    settings = jQuery.extend({
        speed : 1100
    }, settings);   
    
    return $(this).each(function(){
        var caller = this;
        $(caller).click(function (event) {  
            event.preventDefault();
            // var locationHref = window.location.href;
            var elementClick = $(caller).attr('href') || $(caller).data('href');

            if ($(elementClick).offset()) {
                var destination = $(elementClick).offset().top;
                $('html:not(:animated),body:not(:animated)').animate({ scrollTop: destination}, settings.speed, function() {
                    // window.location.hash = elementClick;
                });
            }
            return false;
        });
    });
};




/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.5
 *
 */

(function($, window, document, undefined) {
    'use strict';
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failureLimit   : 0,
            event           : 'scroll',
            effect          : 'show',
            container       : window,
            dataAttribute  : 'original',
            skipInvisible  : false,
            appear          : null,
            load            : null,
            placeholder     : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skipInvisible && !$this.is(':visible')) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger('appear');
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failureLimit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failureLimit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effectSpeed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf('scroll')) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr('src') === undefined || $self.attr('src') === false) {
                if ($self.is('img')) {
                    $self.attr('src', settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one('appear', function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elementsLeft = elements.length;
                        settings.appear.call(self, elementsLeft, settings);
                    }
                    $('<img />')
                        .bind('load', function() {

                            var original = $self.attr('data-' + settings.dataAttribute);
                            $self.hide();
                            if ($self.is('img')) {
                                $self.attr('src', original);
                            } else {
                                $self.css('background-image', 'url("' + original + '")');
                            }
                            $self[settings.effect](settings.effectSpeed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elementsLeft = elements.length;
                                settings.load.call(self, elementsLeft, settings);
                            }
                        })
                        .attr('src', $self.attr('data-' + settings.dataAttribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf('scroll')) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger('appear');
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind('resize', function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind('pageshow', function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger('appear');
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[':'], {
        'below-the-fold' : function(a) { return $.belowthefold(a, {threshold : 0}); },
        'above-the-top'  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        'right-of-screen': function(a) { return $.rightoffold(a, {threshold : 0}); },
        'left-of-screen' : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        'in-viewport'    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        'above-the-fold' : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        'right-of-fold'  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        'left-of-fold'   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);









/*

 scrollup v2.1.1
 Author: Mark Goodyear - http://markgoodyear.com
 Git: https://github.com/markgoodyear/scrollup

 Copyright 2013 Mark Goodyear.
 Licensed under the MIT license
 http://www.opensource.org/licenses/mit-license.php

 Twitter: @markgdyr

 */
(function ($, window, document) {
    'use strict';

    // Main function
    $.fn.scrollUp = function (options) {

        // Ensure that only one scrollUp exists
        if (!$.data(document.body, 'scrollUp')) {
            $.data(document.body, 'scrollUp', true);
            $.fn.scrollUp.init(options);
        }
    };

    // Init
    $.fn.scrollUp.init = function (options) {

        // Define vars
        var o = $.fn.scrollUp.settings = $.extend({}, $.fn.scrollUp.defaults, options),
            triggerVisible = false,
            animIn, animOut, animSpeed, scrollDis, scrollEvent, scrollTarget, $self;

        // Create element
        if (o.scrollTrigger) {
            $self = $(o.scrollTrigger);
        } else {
            $self = $('<a/>', {
                id: o.scrollName,
                href: '#top'
            });
        }

        // Set scrollTitle if there is one
        if (o.scrollTitle) {
            $self.attr('title', o.scrollTitle);
        }

        $self.appendTo('body');

        // If not using an image display text
        if (!(o.scrollImg || o.scrollTrigger)) {
            $self.html(o.scrollText);
        }

        // Minimum CSS to make the magic happen
        $self.css({
            display: 'none',
            position: 'fixed',
            zIndex: o.zIndex
        });

        // Active point overlay
        if (o.activeOverlay) {
            $('<div/>', {
                id: o.scrollName + '-active'
            }).css({
                position: 'absolute',
                'top': o.scrollDistance + 'px',
                width: '100%',
                borderTop: '1px dotted' + o.activeOverlay,
                zIndex: o.zIndex
            }).appendTo('body');
        }

        // Switch animation type
        switch (o.animation) {
            case 'fade':
                animIn = 'fadeIn';
                animOut = 'fadeOut';
                animSpeed = o.animationSpeed;
                break;

            case 'slide':
                animIn = 'slideDown';
                animOut = 'slideUp';
                animSpeed = o.animationSpeed;
                break;

            default:
                animIn = 'show';
                animOut = 'hide';
                animSpeed = 0;
        }

        // If from top or bottom
        if (o.scrollFrom === 'top') {
            scrollDis = o.scrollDistance;
        } else {
            scrollDis = $(document).height() - $(window).height() - o.scrollDistance;
        }

        // Scroll function
        scrollEvent = $(window).scroll(function () {
            if ($(window).scrollTop() > scrollDis) {
                if (!triggerVisible) {
                    $self[animIn](animSpeed);
                    triggerVisible = true;
                }
            } else {
                if (triggerVisible) {
                    $self[animOut](animSpeed);
                    triggerVisible = false;
                }
            }
        });

        if (o.scrollTarget) {
            if (typeof o.scrollTarget === 'number') {
                scrollTarget = o.scrollTarget;
            } else if (typeof o.scrollTarget === 'string') {
                scrollTarget = Math.floor($(o.scrollTarget).offset().top);
            }
        } else {
            scrollTarget = 0;
        }

        // To the top
        $self.click(function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: scrollTarget
            }, o.scrollSpeed, o.easingType);
        });
    };

    // Defaults
    $.fn.scrollUp.defaults = {
        scrollName: 'scrollUp',      // Element ID
        scrollDistance: 300,         // Distance from top/bottom before showing element (px)
        scrollFrom: 'top',           // 'top' or 'bottom'
        scrollSpeed: 300,            // Speed back to top (ms)
        easingType: 'linear',        // Scroll to top easing (see http://easings.net/)
        animation: 'fade',           // Fade, slide, none
        animationSpeed: 200,         // Animation in speed (ms)
        scrollTrigger: false,        // Set a custom triggering element. Can be an HTML string or jQuery object
        scrollTarget: false,         // Set a custom target element for scrolling to. Can be element or number
        scrollText: 'Scroll to top', // Text for element, can contain HTML
        scrollTitle: false,          // Set a custom <a> title if required. Defaults to scrollText
        scrollImg: false,            // Set true to use image
        activeOverlay: false,        // Set CSS color to display scrollUp active point, e.g '#00FFFF'
        zIndex: 2147483647           // Z-Index for the overlay
    };

    // Destroy scrollUp plugin and clean all modifications to the DOM
    $.fn.scrollUp.destroy = function (scrollEvent) {
        $.removeData(document.body, 'scrollUp');
        $('#' + $.fn.scrollUp.settings.scrollName).remove();
        $('#' + $.fn.scrollUp.settings.scrollName + '-active').remove();

        // If 1.7 or above use the new .off()
        if ($.fn.jquery.split('.')[1] >= 7) {
            $(window).off('scroll', scrollEvent);

        // Else use the old .unbind()
        } else {
            $(window).unbind('scroll', scrollEvent);
        }
    };

    $.scrollUp = $.fn.scrollUp;

})(jQuery, window, document);










/*
 *  jQuery dotdotdot 1.7.2
 *
 *  Copyright (c) Fred Heusschen
 *  www.frebsite.nl
 *
 *  Plugin website:
 *  dotdotdot.frebsite.nl
 *
 *  Licensed under the MIT license.
 *  http://en.wikipedia.org/wiki/MIT_License
 */

(function( $, undef )
{
    'use strict';
    if ( $.fn.dotdotdot )
    {
        return;
    }

    $.fn.dotdotdot = function( o )
    {
        if ( this.length === 0 )
        {
            $.fn.dotdotdot.debug( 'No element found for "' + this.selector + '".' );
            return this;
        }
        if ( this.length > 1 )
        {
            return this.each(
                function()
                {
                    $(this).dotdotdot( o );
                }
            );
        }


        var $dot = this;

        if ( $dot.data( 'dotdotdot' ) )
        {
            $dot.trigger( 'destroy.dot' );
        }

        $dot.data( 'dotdotdot-style', $dot.attr( 'style' ) || '' );
        $dot.css( 'word-wrap', 'break-word' );
        if ($dot.css( 'white-space' ) === 'nowrap')
        {
            $dot.css( 'white-space', 'normal' );
        }

        $dot.bindEvents = function()
        {
            $dot.bind(
                'update.dot',
                function( e, c )
                {
                    e.preventDefault();
                    e.stopPropagation();

                    opts.maxHeight = ( typeof opts.height === 'number' ) ? opts.height : getTrueInnerHeight( $dot );

                    opts.maxHeight += opts.tolerance;

                    if ( typeof c !== 'undefined' )
                    {
                        if ( typeof c === 'string' || ('nodeType' in c && c.nodeType === 1) )
                        {
                            c = $('<div />').append( c ).contents();
                        }
                        if ( c instanceof $ )
                        {
                            orgContent = c;
                        }
                    }

                    $inr = $dot.wrapInner( '<div class="dotdotdot" />' ).children();
                    $inr.contents()
                        .detach()
                        .end()
                        .append( orgContent.clone( true ) )
                        .find( 'br' )
                        .replaceWith( '  <br />  ' )
                        .end()
                        .css({
                            'height'    : 'auto',
                            'width'     : 'auto',
                            'border'    : 'none',
                            'padding'   : 0,
                            'margin'    : 0
                        });

                    var after = false,
                        trunc = false;

                    if ( conf.afterElement )
                    {
                        after = conf.afterElement.clone( true );
                        after.show();
                        conf.afterElement.detach();
                    }

                    if ( test( $inr, opts ) )
                    {
                        if ( opts.wrap === 'children' )
                        {
                            trunc = children( $inr, opts, after );
                        }
                        else
                        {
                            trunc = ellipsis( $inr, $dot, $inr, opts, after );
                        }
                    }
                    $inr.replaceWith( $inr.contents() );
                    $inr = null;

                    if ( $.isFunction( opts.callback ) )
                    {
                        opts.callback.call( $dot[ 0 ], trunc, orgContent );
                    }

                    conf.isTruncated = trunc;
                    return trunc;
                }

            ).bind(
                'isTruncated.dot',
                function( e, fn )
                {
                    e.preventDefault();
                    e.stopPropagation();

                    if ( typeof fn === 'function' )
                    {
                        fn.call( $dot[ 0 ], conf.isTruncated );
                    }
                    return conf.isTruncated;
                }

            ).bind(
                'originalContent.dot',
                function( e, fn )
                {
                    e.preventDefault();
                    e.stopPropagation();

                    if ( typeof fn === 'function' )
                    {
                        fn.call( $dot[ 0 ], orgContent );
                    }
                    return orgContent;
                }

            ).bind(
                'destroy.dot',
                function( e )
                {
                    e.preventDefault();
                    e.stopPropagation();

                    $dot.unwatch()
                        .unbindEvents()
                        .contents()
                        .detach()
                        .end()
                        .append( orgContent )
                        .attr( 'style', $dot.data( 'dotdotdot-style' ) || '' )
                        .data( 'dotdotdot', false );
                }
            );
            return $dot;
        };  //  /bindEvents

        $dot.unbindEvents = function()
        {
            $dot.unbind('.dot');
            return $dot;
        };  //  /unbindEvents

        $dot.watch = function()
        {
            $dot.unwatch();
            if ( opts.watch === 'window' )
            {
                var $window = $(window),
                    _wWidth = $window.width(),
                    _wHeight = $window.height();

                $window.bind(
                    'resize.dot' + conf.dotId,
                    function()
                    {
                        if ( _wWidth !== $window.width() || _wHeight !== $window.height() || !opts.windowResizeFix )
                        {
                            _wWidth = $window.width();
                            _wHeight = $window.height();

                            if ( watchInt )
                            {
                                clearInterval( watchInt );
                            }
                            watchInt = setTimeout(
                                function()
                                {
                                    $dot.trigger( 'update.dot' );
                                }, 100
                            );
                        }
                    }
                );
            }
            else
            {
                watchOrg = getSizes( $dot );
                watchInt = setInterval(
                    function()
                    {
                        if ( $dot.is( ':visible' ) )
                        {
                            var watchNew = getSizes( $dot );
                            if ( watchOrg.width  !== watchNew.width ||
                                 watchOrg.height !== watchNew.height )
                            {
                                $dot.trigger( 'update.dot' );
                                watchOrg = watchNew;
                            }
                        }
                    }, 500
                );
            }
            return $dot;
        };
        $dot.unwatch = function()
        {
            $(window).unbind( 'resize.dot' + conf.dotId );
            if ( watchInt )
            {
                clearInterval( watchInt );
            }
            return $dot;
        };

        var orgContent  = $dot.contents(),
            opts        = $.extend( true, {}, $.fn.dotdotdot.defaults, o ),
            conf        = {},
            watchOrg    = {},
            watchInt    = null,
            $inr        = null;


        if ( !( opts.lastCharacter.remove instanceof Array ) )
        {
            opts.lastCharacter.remove = $.fn.dotdotdot.defaultArrays.lastCharacter.remove;
        }
        if ( !( opts.lastCharacter.noEllipsis instanceof Array ) )
        {
            opts.lastCharacter.noEllipsis = $.fn.dotdotdot.defaultArrays.lastCharacter.noEllipsis;
        }


        conf.afterElement   = getElement( opts.after, $dot );
        conf.isTruncated    = false;
        conf.dotId          = dotId++;


        $dot.data( 'dotdotdot', true )
            .bindEvents()
            .trigger( 'update.dot' );

        if ( opts.watch )
        {
            $dot.watch();
        }

        return $dot;
    };


    //  public
    $.fn.dotdotdot.defaults = {
        'ellipsis'          : '... ',
        'wrap'              : 'word',
        'fallbackToLetter'  : true,
        'lastCharacter'     : {},
        'tolerance'         : 0,
        'callback'          : null,
        'after'             : null,
        'height'            : null,
        'watch'             : false,
        'windowResizeFix'   : true
    };
    $.fn.dotdotdot.defaultArrays = {
        'lastCharacter'     : {
            'remove'            : [ ' ', '\u3000', ',', ';', '.', '!', '?' ],
            'noEllipsis'        : []
        }
    };
    $.fn.dotdotdot.debug = function( msg ) {return msg;};


    //  private
    var dotId = 1;

    function children( $elem, o, after )
    {
        var $elements   = $elem.children(),
            isTruncated = false;

        $elem.empty();

        for ( var a = 0, l = $elements.length; a < l; a++ )
        {
            var $e = $elements.eq( a );
            $elem.append( $e );
            if ( after )
            {
                $elem.append( after );
            }
            if ( test( $elem, o ) )
            {
                $e.remove();
                isTruncated = true;
                break;
            }
            else
            {
                if ( after )
                {
                    after.detach();
                }
            }
        }
        return isTruncated;
    }
    function ellipsis( $elem, $d, $i, o, after )
    {
        var isTruncated = false;

        //  Don't put the ellipsis directly inside these elements
        var notx = 'a table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, blockquote, select, optgroup, option, textarea, script, style';

        //  Don't remove these elements even if they are after the ellipsis
        var noty = 'script, .dotdotdot-keep';

        $elem
            .contents()
            .detach()
            .each(
                function()
                {

                    var e   = this,
                        $e  = $(e);

                    if ( typeof e === 'undefined' || ( e.nodeType === 3 && $.trim( e.data ).length === 0 ) )
                    {
                        return true;
                    }
                    else if ( $e.is( noty ) )
                    {
                        $elem.append( $e );
                    }
                    else if ( isTruncated )
                    {
                        return true;
                    }
                    else
                    {
                        $elem.append( $e );
                        if ( after && !$e.is( o.after ) && !$e.find( o.after ).length  )
                        {
                            $elem[ $elem.is( notx ) ? 'after' : 'append' ]( after );
                        }
                        if ( test( $i, o ) )
                        {
                            if ( e.nodeType === 3 ) // node is TEXT
                            {
                                isTruncated = ellipsisElement( $e, $d, $i, o, after );
                            }
                            else
                            {
                                isTruncated = ellipsis( $e, $d, $i, o, after );
                            }

                            if ( !isTruncated )
                            {
                                $e.detach();
                                isTruncated = true;
                            }
                        }

                        if ( !isTruncated )
                        {
                            if ( after )
                            {
                                after.detach();
                            }
                        }
                    }
                }
            );

        return isTruncated;
    }
    function ellipsisElement( $e, $d, $i, o, after )
    {
        var e = $e[ 0 ];

        if ( !e )
        {
            return false;
        }

        var txt         = getTextContent( e ),
            space       = ( txt.indexOf(' ') !== -1 ) ? ' ' : '\u3000',
            separator   = ( o.wrap === 'letter' ) ? '' : space,
            textArr     = txt.split( separator ),
            position    = -1,
            midPos      = -1,
            startPos    = 0,
            endPos      = textArr.length - 1;


        //  Only one word
        if ( o.fallbackToLetter && startPos === 0 && endPos === 0 )
        {
            separator   = '';
            textArr     = txt.split( separator );
            endPos      = textArr.length - 1;
        }

        while ( startPos <= endPos && !( startPos === 0 && endPos === 0 ) )
        {
            var m = Math.floor( ( startPos + endPos ) / 2 );
            if ( m === midPos )
            {
                break;
            }
            midPos = m;

            setTextContent( e, textArr.slice( 0, midPos + 1 ).join( separator ) + o.ellipsis );

            if ( !test( $i, o ) )
            {
                position = midPos;
                startPos = midPos;
            }
            else
            {
                endPos = midPos;

                //  Fallback to letter
                if (o.fallbackToLetter && startPos === 0 && endPos === 0 )
                {
                    separator   = '';
                    textArr     = textArr[ 0 ].split( separator );
                    position    = -1;
                    midPos      = -1;
                    startPos    = 0;
                    endPos      = textArr.length - 1;
                }
            }
        }

        if ( position !== -1 && !( textArr.length === 1 && textArr[ 0 ].length === 0 ) )
        {
            txt = addEllipsis( textArr.slice( 0, position + 1 ).join( separator ), o );
            setTextContent( e, txt );
        }
        else
        {
            var $w = $e.parent();
            $e.detach();

            var afterLength = ( after && after.closest($w).length ) ? after.length : 0;

            if ( $w.contents().length > afterLength )
            {
                e = findLastTextNode( $w.contents().eq( -1 - afterLength ), $d );
            }
            else
            {
                e = findLastTextNode( $w, $d, true );
                if ( !afterLength )
                {
                    $w.detach();
                }
            }
            if ( e )
            {
                txt = addEllipsis( getTextContent( e ), o );
                setTextContent( e, txt );
                if ( afterLength && after )
                {
                    $(e).parent().append( after );
                }
            }
        }

        return true;
    }
    function test( $i, o )
    {
        return $i.innerHeight() > o.maxHeight;
    }
    function addEllipsis( txt, o )
    {
        while( $.inArray( txt.slice( -1 ), o.lastCharacter.remove ) > -1 )
        {
            txt = txt.slice( 0, -1 );
        }
        if ( $.inArray( txt.slice( -1 ), o.lastCharacter.noEllipsis ) < 0 )
        {
            txt += o.ellipsis;
        }
        return txt;
    }
    function getSizes( $d )
    {
        return {
            'width' : $d.innerWidth(),
            'height': $d.innerHeight()
        };
    }
    function setTextContent( e, content )
    {
        if ( e.innerText )
        {
            e.innerText = content;
        }
        else if ( e.nodeValue )
        {
            e.nodeValue = content;
        }
        else if (e.textContent)
        {
            e.textContent = content;
        }

    }
    function getTextContent( e )
    {
        if ( e.innerText )
        {
            return e.innerText;
        }
        else if ( e.nodeValue )
        {
            return e.nodeValue;
        }
        else if ( e.textContent )
        {
            return e.textContent;
        }
        else
        {
            return '';
        }
    }
    function getPrevNode( n )
    {
        do
        {
            n = n.previousSibling;
        }
        while ( n && n.nodeType !== 1 && n.nodeType !== 3 );

        return n;
    }
    function findLastTextNode( $el, $top, excludeCurrent )
    {
        var e = $el && $el[ 0 ], p;
        if ( e )
        {
            if ( !excludeCurrent )
            {
                if ( e.nodeType === 3 )
                {
                    return e;
                }
                if ( $.trim( $el.text() ) )
                {
                    return findLastTextNode( $el.contents().last(), $top );
                }
            }
            p = getPrevNode( e );
            while ( !p )
            {
                $el = $el.parent();
                if ( $el.is( $top ) || !$el.length )
                {
                    return false;
                }
                p = getPrevNode( $el[0] );
            }
            if ( p )
            {
                return findLastTextNode( $(p), $top );
            }
        }
        return false;
    }
    function getElement( e, $i )
    {
        if ( !e )
        {
            return false;
        }
        if ( typeof e === 'string' )
        {
            e = $(e, $i);
            return ( e.length ) ? e : false;
        }
        return !e.jquery ? false : e;
    }
    function getTrueInnerHeight( $el )
    {
        var h = $el.innerHeight(),
            a = [ 'paddingTop', 'paddingBottom' ];

        for ( var z = 0, l = a.length; z < l; z++ )
        {
            var m = parseInt( $el.css( a[ z ] ), 10 );
            if ( isNaN( m ) )
            {
                m = 0;
            }
            h -= m;
        }
        return h;
    }


    //  override jQuery.html
    var _orgHtml = $.fn.html;
    $.fn.html = function( str )
    {
        if ( str !== undef && !$.isFunction( str ) && this.data( 'dotdotdot' ) )
        {
            return this.trigger( 'update', [ str ] );
        }
        return _orgHtml.apply( this, arguments );
    };


    //  override jQuery.text
    var _orgText = $.fn.text;
    $.fn.text = function( str )
    {
        if ( str !== undef && !$.isFunction( str ) && this.data( 'dotdotdot' ) )
        {
            str = $( '<div />' ).text( str ).html();
            return this.trigger( 'update', [ str ] );
        }
        return _orgText.apply( this, arguments );
    };


})( jQuery );