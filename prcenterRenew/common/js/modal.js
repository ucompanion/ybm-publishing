//main modal 오늘 하루 보지 않기
// 쿠키 설정 함수
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// 쿠키 가져오기 함수
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 자정 기준으로 쿠키 초기화
const now = new Date();
const midnight = new Date();
midnight.setHours(24, 0, 0, 0);
const expiresIn = midnight.getTime() - now.getTime();
setTimeout(() => {
    setCookie('hidePopup', '', -1); // 쿠키 삭제
    location.reload(); // 페이지 새로고침
}, expiresIn);

// 팝업 표시 제어
if (getCookie('hidePopup') !== 'true') {
    $('#modalPopup').show();
}

// 닫기 버튼 클릭 이벤트
$('#closePopup').click(function() {
    $('#modalPopup').hide();
});

// 닫기 버튼 클릭 이벤트
$('#closePopup2').click(function() {
    $('#modalPopup2').hide();
});

// 오늘 하루 보지 않기 버튼 클릭 이벤트
$('#hideForToday').click(function() {
    setCookie('hidePopup', 'true', 1); // 쿠키를 1일 동안 설정
    $('#modalPopup').hide();
});


//layer popup
$('[data-popup]').on('click', function () {
    var popupName = $(this).data('popup');
  
    $.ajax({
        type: "GET", //추후 POST로 변경
        url: "../html/modal.html",
        dataType: "html",
        error: function () {
            alert("통신실패!!!!");
        },
        success: function (res) {
            //console.log('성공');
            $(".popup-wrap").html(res);
            $('html').addClass('active-popup');
            $('#' + popupName + 'Popup').addClass('show');
    
            // 팝업 닫기
            $('.dimd, .close-btn').on('click', function () {
                $('html').removeClass('active-popup');
                $('.layerpop').removeClass('show');
                $('[data-popup]').removeClass('active');
                return false;
            });

            
    
            // 팝업 스크립트
            $('[data-popup]').on('click', function () {
                var popupName = $(this).data('popup');
                $('html').addClass('active-popup');
                $('#' + popupName + 'Popup').addClass('show');
                return false;
            });

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

            
            //현장스케치(이미지) 팝업 swipe
            var imageSwiper = new Swiper(".imageSwiper-wrap .imageSwiperRail", {
                spaceBetween: 10,
                slidesPerView: 5,
                freeMode: true,
                watchSlidesProgress: true,
                observer: true,
                observeParents: true,
            });
            var imageSwiper2 = new Swiper(".imageSwiper-wrap .imageSwiperThumb", {
                // autoplay: {
                //     delay: 000,
                // },
                navigation: {
                    nextEl: ".imageSwiper-wrap .swiper-button-next",
                    prevEl: ".imageSwiper-wrap .swiper-button-prev",
                },
                thumbs: {
                    swiper: imageSwiper,
                },
                observer: true,
                observeParents: true,
            });
        }
    });
});
