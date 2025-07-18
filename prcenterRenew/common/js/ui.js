//header
var isMobile = window.matchMedia("(max-width: 960px)").matches;

$('header .gnb > li').on('mouseenter',function(){
    if(isMobile){
        $(this).find('.depth').show();
    }else{
        $(this).find('.depth').stop().slideDown();
    }
});
$('header .gnb > li').on('mouseleave',function(){
    if(isMobile){
        $(this).find('.depth').hide();
    }else{
        $(this).find('.depth').stop().slideUp();
    }
});
// 기본 노출로 변경
$(window).on('scroll', function() {
    if ($(this).scrollTop() > 50) {
        $('header').addClass('is-shadow');
        // $('.sitemenu').hide();
    } else {
        $('header').removeClass('is-shadow');
        // $('.sitemenu').show();
    }
});
$(window).on('resize', function() {
    isMobile = window.matchMedia("(max-width: 960px)").matches;
});
$('header .hamburger').on('click',function(){
    $(this).closest('header').find('.gnb-wrap').toggleClass('active');
})



//플로팅배너 bottom버튼 클릭시 scroll
let $w = $(window),
footerHeight = $('footer').outerHeight() +100;
$w.on('scroll', function() {
    var sT = $w.scrollTop();
    var val = $(document).height() - $w.height() - footerHeight;
    if (sT >= val){
        $('.floating-wrap .btn-bottom').addClass('up');
        $('.only-mobile-info').fadeOut();
    } else {
        $('.floating-wrap .btn-bottom').removeClass('up');
        $('.only-mobile-info').fadeIn();
    }
});
$(".floating-wrap .btn-bottom").click(function(){
    if ($(window).scrollTop() > 0 && $(this).hasClass('up') == true) {
        $('html,body').animate({scrollTop:($('html,body').offset().top)},200);
    } else {
        $('html,body').animate({scrollTop:($('footer').offset().top)},200);
    }
});

//url복사
function clip(){

	var url = '';
	var textarea = document.createElement("textarea");
	document.body.appendChild(textarea);
	url = window.document.location.href;
	textarea.value = url;
	textarea.select();
	document.execCommand("copy");
	document.body.removeChild(textarea);
	alert("URL이 복사되었습니다.")
}

//상단 우측 gnb
$(".sitemenu .btn-toggle").click(function(){
    $('.sitemenu').toggleClass('opened');
    $(this).toggleClass('opened');
    $('body').toggleClass('opened');
});

//2022 개정 교육과정 toggle
$('.toggle-target').on('click',function(){
    $(this).closest('.toggle-box ').toggleClass('active');
    $(this).siblings().stop().slideToggle();
});

//iframe  resize
$(window).resize(function(){
    resizeYoutube();
});
$(function(){
    resizeYoutube();
});
function resizeYoutube(){
    $("iframe").each(function(){
        if( /^https?:\/\/www.youtube.com\/embed\//g.test($(this).attr("src")) ){
            $(this).css("width","100%");
            $(this).css("height",Math.ceil( parseInt($(this).css("width")) * 480 / 854 ) + "px");
        }
    });
}



$('.section.youtube .sketch-wrap .thumb-view').on('click',function(){
    $(this).addClass('active');
})

//////////////////////seciton별 scroll효과////////////////////////
AOS.init();

/**
 * video player popup type
 */
const $videoBox =  document.getElementById('video-box');
$(document).on('click','.evShowVideo', function(e){
    e.preventDefault();

    let videoURL = $(this).attr('href');

    $('html').addClass('active-popup');
    $('.videoPopup').show();
    $('.videoPopup video').attr('src',videoURL);
    $videoBox.load();
    $videoBox.play();

    // 팝업 닫기
    $('.videoPopup .overlay').on('click', function () {
        $('.videoPopup').hide();
        $('html').removeClass('active-popup');
        $videoBox.pause();
        return false;
    });

});
