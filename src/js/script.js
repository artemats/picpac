const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
const controller = new ScrollMagic.Controller();
const windowWidth = $(window).width();
const nav = $('.header-nav');
const body = $('body');
const burger = $('.burger');
const header = $('.header');
let enableShowTooltip = true;
const folderBook = {
  width: 950,
  height: 472
};
if(windowWidth <= 1300){
    folderBook.width = 880;
    folderBook.height = 402;
}
if(windowWidth <= 991){
    folderBook.width = 730;
    folderBook.height = 350;
}
if(windowWidth <= 767){
    folderBook.width = 530;
    folderBook.height = 220;
}
if(windowWidth <= 575){
    folderBook.width = 470;
    folderBook.height = 200;
}
if(windowWidth <= 480){
    folderBook.width = 300;
    folderBook.height = 150;
}

const initBook = () => {
    $('.flipbook').each(function () {
        const flipbook = $(this);
        let pagesCount = null;
        if (flipbook.width() === 0 || flipbook.height() === 0) {
            setTimeout(initBook, 10);
            return;
        }
        flipbook.find('.double').scissor();
        flipbook.turn({
            width: folderBook.width,
            height: folderBook.height,
            elevation: 50,
            gradients: true,
            autoCenter: false,
            duration: 800,
            when: {
                start: function(event, pageObject, corner) {
                    if (pageObject.next == 1 || pageObject.next == pagesCount) {
                        event.preventDefault();
                    }
                },
                turning: function(event, page, view) {
                    if (page == 1 || page == pagesCount) {
                        event.preventDefault();
                    }
                }
            }
        }).bind("turning", function(event, page, view) {
            $('.book-tooltip').removeClass('is-open-info');
            $('.folder-book').addClass('is-visible-tooltips');
            $('.book-container').removeClass('first last');
        }).bind("last", function() {
            flipbook.closest('.folder-book').removeClass('is-visible-tooltips');
            flipbook.closest('.book-container').addClass('last');
        }).bind("first", function() {
            flipbook.closest('.folder-book').removeClass('is-visible-tooltips');
            flipbook.closest('.book-container').addClass('first');
        }).turn("next");
        pagesCount = flipbook.turn("pages");
    });
};

const nextPage = (book) => {
    book.turn("next");
};

const prevPage = (book) => {
    book.turn("previous");
};

const removeWebp = () => {
    $('picture source').each(function () {
        let source = $(this);
        let set = source.attr('srcset');
        let format = set.split('.').pop();
        if(format == 'webp'){
            source.attr('srcset', '');
        }
    });
};

const folderCarousel = $('.folder-carousel');
const giftsCarousel = $('.gifts-carousel');
const folderCarouselDots = $('.folder-carousel-dots');
folderCarousel.slick({
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    touchMove: false,
    variableWidth: true,
    centerMode: true,
    speed: 800,
    cssEase: 'ease'
}).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    $('.folder-carousel-dots').slick('slickGoTo', nextSlide);
});
let folderSlides = null;
$('.folder-carousel-slide').each(function (i) {
    folderSlides = i;
});

folderCarouselDots.slick({
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    variableWidth: true,
    speed: 800,
    cssEase: 'ease',
    touchMove: false,
    swipe: false,
    draggable: false
});

giftsCarousel.slick({
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    variableWidth: true,
    speed: 800,
    cssEase: 'ease',
    touchMove: false,
    swipe: false,
    draggable: false,
    responsive: [
        {
            breakpoint: 991,
            settings: {
                swipe: true,
                touchMove: true
            }
        }
    ]
});
giftsCarousel.slick('slickNext');
folderCarousel.slick('slickNext');
folderSlides <= 1 ? folderCarouselDots.hide() : null;

$('.gifts-carousel-preview').slick({
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    speed: 800,
    cssEase: 'ease',
    touchMove: false,
    swipe: false,
    draggable: false
});

let time = 3,
    bar,
    isPause,
    tick,
    percentTime;

bar = $('.progress-box');

const startProgressbar = () => {
    resetProgressbar();
    percentTime = 0;
    isPause = false;
    tick = setInterval(interval, 10);
};

const interval = () => {
    if(isPause === false) {
        percentTime += 1 / (time+0.1);
        bar.css('width', percentTime + '%' );
        if(percentTime >= 100) {
            $('.gifts-carousel-nav .carousel-nav-btn.__next').click();
            startProgressbar();
        }
    }
};

const resetProgressbar = () => {
    bar.css('width', 0 + '%');
    clearTimeout(tick);
};

$('.gifts').on('onscreen', function (event, measurement) {
    measurement.onscreen ? isPause = false : isPause = true
});

// MOVE PAGES ON CLICK //
$(function () {
   $(document).on('click', '.page-arrow.left, .back.page', function () {
        const book = $(this).closest('.flipbook');
        prevPage(book);
   });
    $(document).on('click', '.page-arrow.right, .preview.page', function () {
        const book = $(this).closest('.flipbook');
        nextPage(book);
    });
});

// OPEN BOOK TOOLTIPS ON CLICK //
$(function () {
   $(document).on('click', '.book-tooltip.helper', function () {
     let tooltip = $(this);
     $('.book-tooltip').not(tooltip).removeClass('is-open-info');
     tooltip.toggleClass('is-open-info');
   });
});

// FOLDER DOTS NAV ON CLICK //
$(function () {
    $(document).on('click', '.dot', function(){
       let index = $(this).attr('data-slick-index');
        $('.folder-carousel').slick('slickGoTo', index);
    });
});

// SWITCH TOOLTIPS ON ACTIVE SLIDE //
const switchTooltipsOnActiveSlide = () => {
    const slider = $('.folder-carousel-slide.slick-current');
    slider.on('onscreen', function (event, measurement) {
        if(measurement.onscreen) {

        }
    });
};

// PARALLAX ON SCROLL //
$(function () {
    if(windowWidth >= 992) {
        $('.parallax-on-scroll').each(function () {
            const elem = $(this);
            let speed = elem.attr('data-speed');
            let parallax = TweenMax.from(elem, 1, {
                y: '-' + parseInt(speed ? speed : 30) + '%',
                ease: "Power1.easeInOut"
            });
            new ScrollMagic.Scene({
                triggerElement: this, // <-- Use this to select current element
                triggerHook: 1,
                duration: '200%',
            })
                .setTween(parallax)
                .addTo(controller);
        });
    }
});

// FADE ON SCROLL //
$(function () {
    // const controller = new ScrollMagic.Controller();
    $('.fade-on-scroll').each(function () {
        const elem = $(this);
        const parallax = TweenMax.to(elem, 0.5,
            {
                opacity: 1,
                rotate: 0,
                y: 0,
                ease: "Power1.easeInOut"
            },
        0);
        new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 'onEnter'
        })
            .setTween(parallax)
            .addTo(controller);
    });
});

// SCALE VIDEO ON SCROLL //
$(function () {
    if(windowWidth >= 992) {
        $('.video').each(function () {
            const section = $(this);
            const elem = section.find('.video-box');
            let parallax = TweenMax.to(elem, 1, {
                width: $(window).width(),
                height: '100vh',
                ease: "Power1.easeInOut"
            });
            new ScrollMagic.Scene({
                triggerElement: this,
                triggerHook: 1,
                duration: '100%',
            })
                .setTween(parallax)
                // .addIndicators()
                .addTo(controller);
        });
    }
});

// PARALLAX FOR GIFTS SECTION //
$(function () {
    let giftsTween = TweenMax.fromTo('.gifts', 2,
        {
            y: -50,
            ease: "Power1.easeInOut"
        },
        {
            y: 0,
            ease: "Power1.easeInOut",
        }, 0.15);
    let footerScene = new ScrollMagic.Scene(
        {
            triggerHook: 1,
            triggerElement: '.gifts',
            reverse: true,
            duration: '100%'
        })
        .setTween(giftsTween)
        // .addIndicators({name: "Gifts"})
        .addTo(controller);
});

// SET STOCK PHOTOS ON SCROLL //
let photosScene = null;
const stockPhotosOnScroll = () => {
    const photosSection = $('.photos');
    const tooltip = photosSection.find('.book-tooltip.toggle');
    $('.photos-book-slide:visible .stock-box').each(function () {
        let box = $(this);
        let boxPos = null;
        let duration = '100%';
        let deskPos = {
            x: box.attr('data-x'),
            y: box.attr('data-y'),
            rotate: box.attr('data-rotate')
        };
        let mobilePos = {
          x: `${box.attr('data-mobile-x')}vw`,
          y: `${box.attr('data-mobile-y')}vw`,
          rotate: box.attr('data-mobile-rotate')
        };
        windowWidth >= 992 ? boxPos = deskPos : boxPos = mobilePos;
        windowWidth <= 767 ? duration = '400px' : duration = '100%';
        let stockTween = TweenMax.fromTo(box, 2,
            {
                x: boxPos.x,
                y: boxPos.y,
                rotate: boxPos.rotate,
                ease: "Power1.easeInOut"
            },
            {
                x: 0,
                y: 0,
                rotate: 0,
                ease: "Power1.easeInOut"
            }, 0.15);
        photosScene = new ScrollMagic.Scene(
            {
                offset: '500px',
                triggerElement: '.photos',
                duration: duration
            })
            .setTween(stockTween)
            // .addIndicators({name: "photos"})
            .addTo(controller)
            .on("progress", () => {
                photosSection.removeClass('is-show-book');
            })
            .on("end", () => {
                photosSection.toggleClass('is-show-book');
                enableShowTooltip ? tooltip.addClass('is-open-info') : null;
            });
    });
};

// SWITCH PHOTOS CONTENT ON SCROLL //
$(function () {
    if(windowWidth >= 992) {
        let stockContentTween = TweenMax.fromTo('.photos-content', 2,
            {
                x: 0,
                opacity: 1,
                ease: "Power1.easeInOut"
            },
            {
                x: -500,
                opacity: 0,
                ease: "Power1.easeInOut",
            }, 0.15);
        let scene = new ScrollMagic.Scene(
            {
                offset: '500px',
                triggerElement: '.photos',
                duration: '100%'
            })
            .setTween(stockContentTween)
            // .addIndicators({name: "book"})
            .addTo(controller);
    }
});

// SHOW FOOTER ON SCROLL //
$(function () {
    let footerHeight = $('.footer').outerHeight();
    let footerTween = TweenMax.fromTo('.footer-container', 2,
        {
            y: -100,
            ease: "Power1.easeInOut"
        },
        {
            y: 0,
            ease: "Power1.easeInOut",
        }, 0.15);
    let footerScene = new ScrollMagic.Scene(
        {
            triggerHook: 1,
            triggerElement: '.footer',
            reverse: true,
            duration: footerHeight
        })
        .setTween(footerTween)
        // .addIndicators({name: "Footer"})
        .addTo(controller);
});

// ANCHOR SCROLL ON CLICK //
$(document).on('click', '.scroll-to', function (e) {
    e.preventDefault();
    const id = $(this).attr('href');
    if(id[0] && id === '#reviews' && windowWidth >= 992){
        $('html, body').animate({
            scrollTop: $(id).offset().top + 400
        }, 800);
        closeMenu();
    } else {
        $('html, body').animate({
            scrollTop: $(id).offset().top
        }, 800);
        closeMenu();
    }
});

// GIFTS CAROUSEL NAV ON CLICK //
$(document).on('click', '.gifts-carousel-nav .carousel-nav-btn.__next', function () {
    $('.gifts-carousel, .gifts-carousel-preview').slick('slickNext');
});
$(document).on('click', '.gifts-carousel-nav .carousel-nav-btn.__prev', function () {
    $('.gifts-carousel, .gifts-carousel-preview').slick('slickPrev');
});
$('.gifts-carousel-nav')
    .on({
        mouseenter: function() {
            isPause = true;
        },
        mouseleave: function() {
            isPause = false;
        }
    });

// 3D MOVE BOOK ON MOUSEMOVE //
$('.gift-preview').mousemove(function(event){
    $('.gift-preview-image').each(function(index, element){
        let xPos = (event.clientX/$(window).width())-0.5,
            yPos = (event.clientY/$(window).height())-0.5,
            box = element;

        TweenLite.to(box, 0.6, {
            rotationY: xPos * 30,
            rotationX: -yPos * 30,
            ease: Power4.easeOut,
        });

    })
});

// SWITCH HOVER THEME //
$('.book-tooltip[data-switch-id]')
    .on({
        mouseenter: function() {
            let id = $(this).attr('data-switch-id');
            $('.gift-box').removeClass('is-active');
            $('.gift-box[data-switch-content="'+ id +'"]').addClass('is-active');
        },
        mouseleave: function() {
            $('.gift-box').removeClass('is-active');
        }
    });
$('.gift-box')
    .on({
        mouseenter: function() {
            let id = $(this).attr('data-switch-content');
            $('.book-tooltip').removeClass('is-active');
            $('.book-tooltip[data-switch-id="'+ id +'"]').addClass('is-active');
        },
        mouseleave: function() {
            $('.book-tooltip').removeClass('is-active');
        }
    });

// SWITCH PHOTOS BOOKS //
let bookSlides = null;
let photosBookCount = 0;
$('.photos-book-slide').each(function (i) {
    bookSlides = i;
});
$(document).on('click',  '.book-tooltip.toggle', function () {
    // photosBookCount < bookSlides ? photosBookCount += 1 : photosBookCount = 0;
    // const activeSlide = $('.photos-book-slide').eq(photosBookCount);
    // $('.photos-book-slide').not(activeSlide).hide();
    // activeSlide.fadeIn(800);
    $('.photos-book-carousel').slick('slickNext');
    stockPhotosOnScroll();
});

$('.photos-book-carousel').slick({
    infinite: true,
    dots: false,
    arrows: false,
    fade: true,
    cssEase: 'ease',
    speed: 200
}).on('afterChange', function () {
   $('.photos .book-tooltip.toggle').removeClass('is-open-info');
    enableShowTooltip = false;
});

// PLAY REVIEW VIDEOS ON HOVER //
$('.reviews-list-item')
    .on({
        mouseenter: function () {
            $('.reviews-list-item').removeClass('is-active');
            $(this).addClass('is-active');
            let video = $(this).find('video');
            video[0] ? video[0].play() : null;
        },
        mouseleave: function () {
            let video = $(this).find('video');
            video[0] ? video[0].pause() : null;
        }
    })
    .on('click', function () {
        $('.reviews-list-item').removeClass('is-active').find('video')[0].pause();
        $(this).addClass('is-active');
        let video = $(this).find('video');
        video[0] ? video[0].play() : null;
    });

// TOGGLE ACCORDION THEME //
$(document).on('click', '.accordion-box-header', function () {
    const box = $(this).closest('.accordion-box');
    const boxContent = box.find('.accordion-box-content');
    $('.accordion-box').not(box).removeClass('is-active');
    box.addClass('is-active');
    $('.accordion-box-content').not(boxContent).slideUp(300);
    boxContent.slideDown(300);
});
$('.accordion-box').eq(0).find('.accordion-box-header').click();

const openMenu = () => {
    body.addClass('is-open-menu');
    burger.addClass('is-active');
    nav.slideDown(300);
    setTimeout(function () {
        nav.addClass('is-open');
    }, 200);
};

const closeMenu = () => {
    body.removeClass('is-open-menu');
    burger.removeClass('is-active');
    nav.removeClass('is-open').slideUp(300);
};

// FIXED HEADER ON SCROLL //
const fixedHeader = (scrollPos) => {
    scrollPos <= 0 ? header.removeClass('is-fixed') : header.addClass('is-fixed');
};

// TOGGLE MAIN MENU //
$(document).on('click', '.burger', function () {
    $(this).hasClass('is-active') ? closeMenu() : openMenu();
});

// ENABLE CSS ANIMATION FOR PHOTOS TOOLTIP //
$(function () {
    $('.animation-section').each(function () {
        const section = $(this);
        section.on('onscreen', function (event, measurement) {
            measurement.onscreen ? section.addClass('enable-animation') : section.removeClass('enable-animation');
        });
    });
});

// PLAY VIDEO ON SCROLL //
$(function () {
    $('.video').on('onscreen', function (event, measurement) {
        const section = $(this);
        let video = section.find('video');
        if(measurement.onscreen && measurement.percentFromTop <= 50) {
            section.addClass('is-active');
            video[0].play();
        } else {
            section.removeClass('is-active');
            video[0].pause();
        }
    });
});

// FADE BOOK TOOLTIPS ON FOLDER //
let toolPause,
    toolTick,
    toolCount;

const startFadeTooltips = () => {
    resetFadeTooltips();
    toolCount = 0;
    toolPause = false;
    toolTick = setInterval(tooltipInterval, 1500);
};

const tooltipInterval = () => {
    if(toolPause === false) {
        toolCount += 1;
        $('.book-tooltip.helper').removeClass('is-active');
        $('.folder-carousel-slide.slick-current .book-tooltip.helper.__' + toolCount).addClass('is-active');
        if(toolCount >= 3) {
            startFadeTooltips();
        }
    }
};

const resetFadeTooltips = () => {
    clearTimeout(toolTick);
};
startFadeTooltips();

$('.folder').on('onscreen', function (event, measurement) {
    measurement.onscreen ? toolPause = false : toolPause = true
});

$(document).on('click', '.open-modal', function () {
    $(this).modal({
        fadeDuration: 500,
        fadeDelay: 0.5
    });
});

// CLEAR PHONE FORMAT //
$('a[href^="tel:"]').each(function () {
    let href = $(this).attr('href');
    let newHref = href.replace(/[^+\d]+/g, '');
    $(this).attr('href', 'tel:' + newHref);
});

// $('form').on('submit', function (e) {
//     e.preventDefault();
//     const form = $(this);
//     form.addClass('is-success');
//     setTimeout(function () {
//         form.removeClass('is-success');
//     }, 3000);
// });


isSafari ? removeWebp() : null;

$(window).on('scroll', function () {

    let scrollPos = $(document).scrollTop();
    $('.nav .scroll-to').each(function () {
        const currLink = $(this);
        const refElement = $(currLink.attr('href'));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('.nav .scroll-to').removeClass('active');
            currLink.addClass('active');
        }
        else{
            currLink.removeClass('active');
        }
    });

    fixedHeader(scrollPos);
});

$(document).ready(function () {
    initBook();

    stockPhotosOnScroll();
    switchTooltipsOnActiveSlide();
    startProgressbar();
    fixedHeader($(window).scrollTop());

    setTimeout(function () {
        $('#wrapper').removeClass('loading');
    }, 400);

});