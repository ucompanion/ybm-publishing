$(function(){

    const $bookPath = '/prcenterRenew/book/';
    const urlParams = new URLSearchParams(window.location.search);
    const bookCode = urlParams.get('grade')||'ele1';

    const grade = bookCode.replace(new RegExp("[(0-9)]", "gi"), "");
    const bnum = bookCode.replace(/[^0-9]/g,'');

    $('body').addClass(grade);
    $('#bgTopObj').attr('src', $bookPath + grade + "/bg_top_obj.png");
    $('.sub-float-right ul.'+grade).addClass('on');

    /**
     * 교과서 데이터 매핑
     */
    let $swiperCharacter = null;
    let $swiperBooktabHeader = [];
    let $swiperBooktabBody = [];
    let $book = grade + '/book' + ((bnum < 10)? '0'+bnum : bnum);
    $.ajax({
        url: "/prcenterRenew/book/" + $book + ".json",
        cache: false,
        success: function(res) {
            $('body').addClass(res.subject);
            $('.main-visual .title-box .title').text(res.title);
            $('.main-visual .title-box .desc').text(res.subscript);

            if($('.sub-float-right .'+grade+' .'+res.subject).length > 1){
                $('.sub-float-right .'+grade+' .'+res.subject).eq(bnum-1).addClass('active');
            }
            else{
                $('.sub-float-right .'+grade+' .'+res.subject).addClass('active');
            }

            // 교과서 표지
            let coverImgHtml = '';
            for(let i=1; i<=res.cover_img_count;i++){
                if(i>1 && i%3==0) coverImgHtml += "</div><div class='cover-img-group'>";
                coverImgHtml += "<div class='cover-img'><img src='" + $bookPath + $book + "/cover_image0" + i + ".png' alt='' class='main-book'/><div class='cover-hover-box'><img src='" + $bookPath + $book + "/cover_image0" + i + "_main_ov.png' alt='' class='main-ov' /><img src='" + $bookPath + $book + "/cover_image0" + i + "_ov.png' alt='' class='ov'/></div></div>";
            }
            $('.dataCoverImages').append("<div class='cover-img-group'>" + coverImgHtml + "</div>");

            // 집필진 단체사진
            if(res.writing_staff_all){
                for(let i=1; i<=res.writing_staff_all; i++){
                    $('.writing_staff_all .swiper-wrapper').append("<img src='" + $bookPath + $book + "/writing_staff_all_"+i+".png' alt='' class='swiper-slide' />");
                }
            }
            else{
                $('.writing_staff_all .swiper-wrapper').append("<img src='" + $bookPath + $book + "/writing_staff_all.png' alt='' class='swiper-slide' />");
            }
            new Swiper('.writing_staff_swiper', {
                pagination: {
                    el: ".writing_staff_pager",
                    clickable: true,
                }
            });

            // 집필진 매핑
            for(let i=0; i<res.writing_staff.length; i++){
                let number = (i >= 10)? i : '0'+i;
                // 대표저자
                if(i == 0){
                    const $ltBox = $("<div>").prop({className: 'lt-box'});
                    const $imgBox = $("<div>").prop({className: 'img-box'});
                    // 사진 처리
                    $(".lead-author-box").append(
                        $imgBox.append("<img src='" + $bookPath + $book + "/writing_staff"+number+".png' alt='' />")
                    );
                    // 인터뷰 영상 처리
                    if(res.writing_staff[i].video != null){
                        $(".lead-author-box").append(
                            $imgBox.append("<a href='"+res.writing_staff[i].video+"' class='evShowVideo'></a>")
                        );
                    }
                    // 이력 처리
                    $(".lead-author-box").append(
                        $ltBox.append("<div class='tit mg top-20'>대표 저자 " + res.writing_staff[i].name + "</div>")
                            .append("<span>" + res.writing_staff[i].affiliation + "</span>")
                            .append("<div class='tit mg top-12'>주요 이력</div>"),

                        res.writing_staff[i].history.forEach(function(val){
                            $ltBox.append("<li>"+val+"</li>")
                        })
                    );
                    $(".lead-author-box").append("<div class='tit mg top-12'>YBM교과서는</div><div class='word-contain'><div class='word-box'><div class='inn'>" + res.writing_staff[i].word + "</div></div><span>이다.</span></div>");
                }
                else{
                    let $word = (res.writing_staff[i].type2)? "<div class='inn'>" + res.writing_staff[i].word + "</div>" : "YBM교과서는<div class='inn'>" + res.writing_staff[i].word + "</div>이다.";
                    let $video = (res.writing_staff[i].video != null)? "<a href='"+res.writing_staff[i].video+"' class='evShowVideo'></a>" : '';
                    const $liBox = $("<li>").prop({className: 'lt-box'});
                    $(".staff-list").append(
                        $liBox.prop({className:'item'})
                            .append("<div class='img-box'><img src='" + $bookPath + $book + "/writing_staff"+number+".png' alt='' />"+$video+"</div>")
                            .append("<div class='tit'>" + res.writing_staff[i].name + "</div>")
                            .append("<span>" + res.writing_staff[i].affiliation + "</span>")
                            .append("<div class='word-box'>" + $word + "</div>")
                    );
                }
            }

            // 구성과 특징
            for(let i=0; i<res.character.length; i++){
                let $class = (i == 0)? ' current' : '';
                if(res.character.length > 1){
                    $(".character-tab-menu").append("<li class='item" + $class + "'>" + res.character[i].name + "</li>");
                }
                $(".character-tab-contents .swiper-wrapper").append("<li class='swiper-slide'><div class='zoom_minimap'></div><div class='zoom'><div class='original'><img src='" + $bookPath + $book + "/character"+(i+1)+"_1.png' alt='' /></div><div class='viewer'><img src='" + $bookPath + $book + "/character"+(i+1)+"_1.png' alt='' /></div><div class='magnifier'></div></div></li>");
            }

            // swiperjs
            $swiperCharacter = new Swiper('.swiper-character',{
                allowTouchMove: false
            });

            // booktab
            for(let i=0; i<res.booktab.length; i++){
                let $class = (i == 0)? ' current' : '';

                let $divHeader = $("<div>").prop({className: 'booktab-swiper-header swiper'+ i + $class});
                let $divBody = $("<div>").prop({className: 'booktab-swiper-body swiper'+ i + $class});
                let $headerHtml = $bodyHtml = '';
                let booktabCnt = 1;
                res.booktab[i].forEach(function(booktab){
                    $headerHtml += "<li class='swiper-slide'>" + booktab + "</li>";
                    $bodyHtml += "<li class='swiper-slide'><div class='zoom_minimap'></div><div class='zoom'><div class='original'><img src='" + $bookPath + $book + "/booktab"+(i+1)+"_"+(booktabCnt)+".png' alt='' /></div><div class='viewer'><img src='" + $bookPath + $book + "/booktab"+(i+1)+"_"+(booktabCnt)+".png' alt='' /></div><div class='magnifier'></div></div></li>";
                    booktabCnt++;
                });
                $(".book-tab-header").append(
                    $divHeader.append(
                        $("<ul>").prop({className:'swiper-wrapper'}).append($headerHtml)
                    )
                );
                $(".book-tab-body").append(
                    $divBody.append(
                        $("<ul>").prop({className:'swiper-wrapper'}).append($bodyHtml)
                    ).append("<div class='swiper-pagination pager"+i+"'></div>")
                    .append("<div class='swiper-button swiper-button-prev prev"+i+"'></div>")
                    .append("<div class='swiper-button swiper-button-next next"+i+"'></div>")

                );
                // swiperjs
                $swiperBooktabHeader[i] = new Swiper('.booktab-swiper-header.swiper'+ i, {
                    on: { slideChange: function(){ $swiperBooktabBody[i].slideTo(this.realIndex); } }
                });
                $swiperBooktabBody[i] = new Swiper('.booktab-swiper-body.swiper'+ i, {
                    allowTouchMove: false,
                    navigation: {
                        nextEl: ".swiper-button-next.next"+ i,
                        prevEl: ".swiper-button-prev.prev"+ i,
                    },
                    pagination: {
                        el: ".pager"+ i,
                        clickable: true,
                    },
                    on: { slideChange: function(){ $swiperBooktabHeader[i].slideTo(this.realIndex); } }
                });
            }

            // zoom
            if (window.innerWidth > 680){
                $('.zoom .original img').zoom(3);
            }
            else{
                $('.info-zoom-box .inn').text("이미지를 터치해보세요.");
            }

            // 대표 저자 한마디 예외처리 - 일부 교과서 "이다." 제거
            const arWritingList = new Array('mid6');
            if(arWritingList.indexOf(bookCode) >= 0){
                $('.lead-author-box .word-contain span').remove();
            }

        },
        error: function(){
            history.back();
        }
    });

    /**
     * 집필진 단체사진 show hide
     */
    $(document).on({
        mouseenter: function(){
            $('.writing_staff_all').stop().fadeIn();
        },
        mouseleave: function(){
            $('.writing_staff_all').stop().fadeOut();
        }
    },'.evWritingStaffAll');

    /**
     * 집필진 popup
     */
    $(document).on({
        mouseenter: function(){
            $(this).stop().addClass('on');
        },
        mouseleave: function(){
            $(this).stop().removeClass('on');
        }
    },'.staff-list .item');

    /**
     * 구성과 특징
     */
    $(document).on("click", ".character-tab-menu .item", function(){
        let idx = $('.character-tab-menu .item').index(this);
        $('.character-tab-menu .item').removeClass('current');
        $(this).addClass('current');
        $swiperCharacter.slideTo(idx);
    });

    /**
     * book-tab
     */
    $(document).on("click", ".book-tab-menu .item", function(){
        let idx = $('.book-tab-menu .item').index(this);
        $('.book-tab-menu .item').removeClass('current');
        $(this).addClass('current');
        $('.booktab-swiper-header').removeClass('current');
        $('.booktab-swiper-header').eq(idx).addClass('current');
        $('.booktab-swiper-body').removeClass('current');
        $('.booktab-swiper-body').eq(idx).addClass('current');
    });

    /**
     * 모바일 일때 zoom 이미지 팝업 형태로 출력
     */
    $(document).on('click', '.zoom .original', function(){

        if (window.innerWidth > 680) return;

        let $src = $(this).children('img').attr('src');
        window.open('/prcenterRenew/html/sub/zoom.html?f='+$src, 'zoom');

    });

    /**
     * 교수 학습 자료 더보기 버튼 출력
     */
    $('.learning-item .list').each(function(){
        const more = $(this).parent().find('.learning-more');
        if($(this).prop('scrollHeight') > $(this).height()){
            more.show();
        }
        else{
            more.hide();
        }
    });

    /**
     * 교수 학습 자료 더보기 버튼 작동
     */
    $(document).on('click', '.learning-item .learning-more', function(){
        $(this).prev('.list').animate({"height":$(this).prev('.list').prop('scrollHeight')});
        $(this).fadeOut();
    });

    /**
     * Y클라우드 유튜브 영상 사이즈 처리
     */
    $(window).resize(function(){resizeYoutube();});
    $(function(){resizeYoutube();});
    function resizeYoutube(){ $(".ycloud-tab-contents iframe").each(function(){ if( /^https?:\/\/www.youtube.com\/embed\//g.test($(this).attr("src")) ){ $(this).css({"width":"100%", "height":"100%"});} }); }

    /**
     * Y클라우드 탭메뉴
    */
    $(document).on("click", ".ycloud-tab-menu li", function(){
        let idx = $('.ycloud-tab-menu li').index(this);
        $('.ycloud-tab-menu li').removeClass('current');
        $(this).addClass('current');
        $('.ycloud-tab-contents').removeClass('current');
        $('.ycloud-tab-contents').eq(idx).addClass('current');
        $('.ycloud-tab-contents').eq(idx).find('iframe').each(function(){
            $(this).attr('src',$(this).attr('src'));
        });
        $('.ycloud-tab-contents').eq(idx).find('.video-box img').each(function(){
            let $src = $(this).attr('src').split('?')[0];
            $(this).attr('src',$src+"?"+new Date().getTime());
        });
    });

    /**
     * Y클라우드 change youtube
     */
    $(document).on('click', '.ycloud-tab-contents .text-box a[data-youtube]', function(e){
        let youtube = $(this).data('youtube');
        $(this).closest('.ycloud-tab-contents').find('iframe').attr('src',youtube);
    });

    new Swiper('.video-box-swiper', {
        pagination: {
            el: ".video_box_pager",
            clickable: true,
        }
    });

    new Swiper('.elworks-box-swiper', {
        spaceBetween: 40,
        loop:true,
        on: {
            slideChange: function(){
                const imgObj = $('.elworks-box-swiper .swiper-slide').eq(this.realIndex).find('img');
                imgObj.attr('src',imgObj.attr('src'));
            }
        },
        navigation: {
            nextEl: ".elworks-next",
            prevEl: ".elworks-prev",
        },
    });



    //좌측 플로팅 배너 (섹션네비)
    var $menuItems = $('.sub-float-left a');

    $(window).on('scroll', function() {
        var scrollTop = $(window).scrollTop();
        var activeSection = '';

        $('.scroll-section').each(function() {
            var sectionTop = $(this).offset().top - 60;
            var sectionBottom = sectionTop + $(this).outerHeight();

            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                activeSection = $(this).attr('id');
            }
        });

        $menuItems.each(function() {
            var $this = $(this);
            var targetSection = $this.attr('href').substring(1); // '#section1'에서 'section1' 추출

            if (targetSection === activeSection) {
                $menuItems.removeClass('active');
                $this.addClass('active');
            }
        });
    });

    // 초기 로드시에도 활성화 상태를 반영
    $(window).trigger('scroll');


    /**
     * 페이지 예외처리
     */
    // 특정 교과서 전자 저작물 제외
    const arBooksList = new Array('hi14','hi15','hi16','hi18');
    if(arBooksList.indexOf(bookCode) >= 0){
        $('.book-tab-menu .item:last-child').remove();
    }
});