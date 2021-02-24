$().ready(function () {



    function resize(size) {
        if (size >= 1119) {
            $('.resize-menu').removeClass('col-12');
            $('.resize-menu').addClass('col-lg-3');
            $('.desktop-sidebar').removeClass('d-none');
            $('.panel-content').removeClass('col-lg-12');
            $('.panel-content').addClass('col-lg-9');


        } else {
            $('.resize-menu').removeClass('col-lg-3');
            $('.resize-menu').addClass('col-12');
            $('.desktop-sidebar').addClass('d-none');
            $('.panel-content').removeClass('col-lg-9');
            $('.panel-content').addClass('col-lg-12');
        }





        if (size <= 844) {
            $('.footer').addClass('d-none');
        } else {
            $('.footer').removeClass('d-none');
        }
    }



    function headerSize(size) {
        if (size >= 1200) {
            $('.sub-nav-item').removeClass('col-12');
            $('.header-menu').removeClass('mobile');
            $('.header-menu').removeClass('d-none');
            $('.header-menu').css('width', 'auto');
            $('.header-nav').addClass('list-group-horizontal');
            $('.showcase').removeClass('col-lg-12');
            $('.showcase').addClass('col-lg-3');
            $('.showcase-item').removeClass('col-lg-6');
            $('.showcase-item').addClass('col-lg-12');
            $('.banner-area').addClass('col-lg-9');
            $('.banner-area').removeClass('col-lg-12');
            $('.filter-div').addClass('col-lg-3');
            $('.filter-div').removeClass('filters');
            $('.filter-div').css('display','block');
            $('.product-list-area').addClass('col-lg-9');
            $('.product-list-area').removeClass('col-12');
        } else {
            $('.sub-nav-item').addClass('col-12');
            $('.header-menu').addClass('mobile');
            $('.header-menu').addClass('d-none');
            $('.header-nav').removeClass('list-group-horizontal');
            $('.showcase').removeClass('col-lg-3');
            $('.showcase').removeClass('col-lg-12');
            $('.showcase-item').addClass('col-lg-6');
            $('.showcase-item').removeClass('col-lg-12');
            $('.banner-area').removeClass('col-lg-9');
            $('.banner-area').addClass('col-lg-12');
            $('.filter-div').addClass('filters');
            $('.filter-div').removeClass('col-lg-3');
            $('.filter-div').css('display', 'none');
            $('.product-list-area').addClass('col-12');
            $('.product-list-area').removeClass('col-lg-9');
         
        }
    }

    function productArea(size)
    {
        if (size >= 845) {
            $('.thumbnail-area').addClass('col-1');
            $('.thumbnail-area').removeClass('col-12');
            $('.product-scene').addClass('col-11');
            $('.product-scene').removeClass('col-12');
            $('.product-scene').removeClass('order-first');
        } else {
            $('.thumbnail-area').removeClass('col-1');
            $('.thumbnail-area').addClass('col-12');
            $('.product-scene').removeClass('col-11');
            $('.product-scene').addClass('col-12');
            $('.product-scene').addClass('order-first');
        }
    }


    $(window).on('resize', function () {
        resize($(window).width());
        headerSize($(window).width());
        productArea($(window).width());
    })


    $('.sidebar-toggle').click(function () {
        $('.sidebar-wrapper').removeClass('d-none');
        $('.sidebar-wrapper').animate({
            width: "100%"
        });
    })

    $('.sidebar-exit').click(function () {
        $('.sidebar-wrapper').animate({
            width: "0px"
        }, function () {
            $('.sidebar-wrapper').addClass('d-none')
        });
    })

    $('.space').click(function () {
        $('.sidebar-wrapper').animate({
            width: "0px"
        }, function () {
            $('.sidebar-wrapper').addClass('d-none')
        });
    })

    $('.input-group-button').on('click', function () {
        var target = $(this).attr('data-target');
        $("[data='file" + target + "']").click();
    })


    $('.nav-li').click(function () {
        $(this).children('div.absolute').slideToggle('1000', "linear", function () {

        });
    });

    $('.la-bars').click(function () {
        $('.mobile').removeClass('d-none');
        $('.mobile').animate({
            width: "300px"
        });
    })

    $('.mobile-close').click(function () {
        $('.absolute').each(function () {
            $(this).css('display', 'none');
        })
        $('.mobile').animate({
            width: "0px"
        }, function () {
            $('.mobile').addClass('d-none');
        });

    });

    $('.la-list-ul').click(function () {
        $('.mobile').removeClass('d-none');
        $('.mobile').animate({
            width: "300px"
        });
    });


    $.each($('.nav-li'), function () {
        var li = $(this).attr('data');
        $(this).children().children().children().children().children().addClass(li);
        groupLi(li);
    });

    function groupLi(data) {
        for (var i = 0; i < $('.' + data).length; i += 14) {
            $('.' + data).slice(i, i + 14).wrapAll("<div class='sub-nav-item'></div>");
        }
    }

    resize($(window).width());
    headerSize($(window).width());
    productArea($(window).width());

    var swiper = new Swiper('.row-slider', {
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 1,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 1
            },
            450: {
                slidesPerView: 2,
                spaceBetween: 1
            },
            766: {
                slidesPerView: 3,
                spaceBetween: 1
            },
            992: {
                slidesPerView: 4,
                spaceBetween: 1
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 1
            },
            1500: {
                slidesPerView: 6,
                spaceBetween: 1
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    var swipertwo = new Swiper('.column-slider', {
        slidesPerView: 3,
        slidesPerColumn: 2,
        centeredSlides: false,
        spaceBetween: 0,
        breakpoints: {
            320: {
                slidesPerView: 1,
                slidesPerColumn: 2,
                spaceBetween: 1
            },
            450: {
                slidesPerView: 1,
                slidesPerColumn: 2,
                spaceBetween: 1
            },
            766: {
                slidesPerView: 2,
                slidesPerColumn: 2,
                spaceBetween: 1
            },
            992: {
                slidesPerView: 3,
                slidesPerColumn: 2,
                spaceBetween: 1
            }
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });


    var swiperthree = new Swiper('.banner-slider', {
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    var swiperfour = new Swiper('.similar-slider', {
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 1,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 1
            },
            450: {
                slidesPerView: 2,
                spaceBetween: 1
            },
            766: {
                slidesPerView: 3,
                spaceBetween: 1
            },
            992: {
                slidesPerView: 4,
                spaceBetween: 1
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    $('.filter-toggle').click(function () {
        var target = $(this).attr('data-target');
        $('.' + target).toggle(1000);
    }); 


    $('.filter-button').click(function () {
        $('.filters').css('display', 'block');
        $('.filter-close').css('display', 'block');
        $('.filters').animate({
            width: "300px"
        });
    });

    $('.filter-close-btn').click(function () {
        $('.filter-close').css('display', 'none');
        $('.filters').animate({
            width: "0px"
        }, function () {
                $('.filters').css('display','none');
        });
    });



    $('.btn-minus').click(function () {
        if ($('.product-count').val() - 1 > 0) {
            $('.product-count').val($('.product-count').val() - 1);
        }
    });

    $('.btn-plus').click(function () {

        if (parseInt($('.product-count').val()) + 1 <= parseInt($('.product-count').attr('max')) ) {
            $('.product-count').val(parseInt($('.product-count').val()) + 1);
        }
    });

    $('#share').jsSocials({
        showLabel: false,
        showCount: false,
        shares: [
            {
                share: "email",
                logo: "lar la-envelope"
            },
            {
                share: "twitter",
                logo: "lab la-twitter"
            },
            {
                share: "facebook",
                logo: "lab la-facebook-f"
            },
            {
                share: "linkedin",
                logo: "lab la-linkedin-in"
            },
            {
                share: "whatsapp",
                logo: "lab la-whatsapp"
            }
        ]
    });


    $(".cart-icon").click(function () {
        $('.cart-list').toggleClass('d-none');
    })

   
})

$(document).ready(function () {
    $('#summernote').summernote({
        height: 200
    });
})


$(function () {
    var $propertiesForm = $('.mall-category-filter');
    var $body = $('body');

    $body.on('click', '.js-mall-filter', function () {
        var $input = $(this).find('input');
        $(this).toggleClass('mall-filter__option--selected')
        $input.prop('checked', !$input.prop('checked'));
       
    });
    $body.on('click', '.js-mall-clear-filter', function () {
        var $parent = $(this).closest('.mall-property');

        $parent.find(':input:not([type="checkbox"])').val('');
        $parent.find('input[type="checkbox"]').prop('checked', false);
        $parent.find('.mall-filter__option--selected').removeClass('mall-filter__option--selected')

        var slider = $parent.find('.mall-slider-handles')[0]
        if (slider) {
            slider.noUiSlider.updateOptions({
                start: [slider.dataset.min, slider.dataset.max]
            });
        }
      
    });



    $('.mall-slider-handles').each(function () {
        var el = this;
        noUiSlider.create(el, {
            start: [el.dataset.start, el.dataset.end],
            connect: true,
            tooltips: true,
            range: {
                min: [parseFloat(el.dataset.min)],
                max: [parseFloat(el.dataset.max)]
            }
        }).on('change', function (values) {
            $('[data-min="' + el.dataset.target + '"]').val(values[0])
            $('[data-max="' + el.dataset.target + '"]').val(values[1])
            
        });
    })
})


