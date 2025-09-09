$(function(){

    const $bookPath = '/prcenter/book/';
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
    const textbookIds  = [];
    const SEMESTER = [];
    const textbookIdToSemesterMap = new Map();

    $.ajax({
        url: "/prcenter/book/" + $book + ".json",
        cache: false,
        success: function(res) {
            $('body').addClass(res.subject);
            $('.main-visual .title-box .title').text(res.title);
            $('.main-visual .title-box .desc').html(res.subscript);

            //console.log("Prcenter_TextBook: "+JSON.stringify(res));
            const aiBookLink = document.querySelector(".floating-ai-book a");
            const aiBookDiv = document.querySelector(".floating-ai-book");
            console.log("AIDT_LINK :"+res.AIDT_LINK);

            if (res.AIDT_LINK) {
                aiBookDiv.style.display = "inline-block";
                aiBookLink.href = res.AIDT_LINK;
                aiBookLink.target = "_blank"; // 새 창에서 열기
               // console.log("aiBookLink:    "+aiBookLink.href);
            }else{
                aiBookDiv.style.display = "none";
            }

            if($('.sub-float-right .'+grade+' .'+res.subject).length > 1){
                $('.sub-float-right .'+grade+' .'+res.subject).eq(bnum-1).addClass('active');
            }
            else{
                $('.sub-float-right .'+grade+' .'+res.subject).addClass('active');
            }
            if (res.TEXTBOOK_INFO) {
                const firstId = res.TEXTBOOK_INFO[0].TEXTBOOK_ID;
                const firstSem = res.TEXTBOOK_INFO[0].SEMESTER;

                // 현재 URL에서 grade 파라미터 추출
                const params = new URLSearchParams(window.location.search);
                const grade = (params.get("grade") || "").toLowerCase();

                let siteType = "";
                if (grade.startsWith("ele")) siteType = "E";
                else if (grade.startsWith("mid")) siteType = "M";
                else if (grade.startsWith("hi")) siteType = "H";
                const href = `/textbook/${firstId}.html?siteType=${siteType}`;
                console.log("최종 링크:", href);

                // 버튼 href 속성 변경
                document.querySelector('.btn-edutech-link')
                    .setAttribute('href', href);


                console.log("TEXTBOOK_INFO:", res.TEXTBOOK_INFO);
                // 각 데이터 항목을 개별적으로 처리
                res.TEXTBOOK_INFO.forEach(function(item) {
                    console.log("TEXTBOOK_ID:", item.TEXTBOOK_ID, "SEMESTER:", item.SEMESTER);
                    textbookIds.push(item.TEXTBOOK_ID);
                    textbookIdToSemesterMap.set(item.TEXTBOOK_ID, item.SEMESTER);
                });
                fetchTextbooks(textbookIds); // 서버에 요청하여 교과서 정보 가져오기
            } else {
                console.log("TEXTBOOK_INFO가 JSON 데이터에 포함되어 있지 않습니다.");
            }
            if (Array.isArray(res.TEXTBOOK_HASHTAG_LEFT) && res.TEXTBOOK_HASHTAG_LEFT.length) {
                console.log('TEXTBOOK_HASHTAG_LEFT:', res.TEXTBOOK_HASHTAG_LEFT);
                applyLeftHashtags(res.TEXTBOOK_HASHTAG_LEFT);
            }
            if (Array.isArray(res.TEXTBOOK_HASHTAG_RIGHT) && res.TEXTBOOK_HASHTAG_RIGHT.length) {
                console.log('TEXTBOOK_HASHTAG_RIGHT:', res.TEXTBOOK_HASHTAG_RIGHT);
                applyRightHashtags(res.TEXTBOOK_HASHTAG_RIGHT);
            } else {
                console.log('TEXTBOOK_HASHTAG_RIGHT가 JSON 데이터에 포함되어 있지 않습니다.');
            }

            // 교과서 표지
            let coverImgHtml = '';
            for(let i=0; i<=(res.cover_img_count-1);i++){
                if(i>0 && i%2==0) coverImgHtml += "</div><div class='cover-img-group'>";
                coverImgHtml += "<div class='cover-img'><img src='" + $bookPath + $book + "/cover_image0" + (i+1) + ".png' alt='' class='main-book'/><div class='cover-hover-box'><img src='" + $bookPath + $book + "/cover_image0" + (i+1) + "_main_ov.png' alt='' class='main-ov' /><img src='" + $bookPath + $book + "/cover_image0" + (i+1) + "_ov.png' alt='' class='ov'/></div></div>";
            }
            $('.dataCoverImages').append("<div class='cover-img-group'>" + coverImgHtml + "</div>");

            // 집필진 단체사진
            if(res.writing_staff_all){
                for(let i=1; i<=res.writing_staff_all; i++){
                    $('.writing_staff_all .swiper-wrapper').append("<img src='" + $bookPath + $book + "/writing_staff_all_"+i+".png' alt='' class='swiper-slide' />");
                }
            }
            else{
                $('.writing_staff_all .swiper-wrapper').append("<img src='" + $bookPath + $book + "/writing_staff_all.png' alt='' class='swiper-slide' onerror='this.onerror=null; this.closest(\".evWritingStaffAll\").style.display=\"none\";' />");
            }
            new Swiper('.writing_staff_swiper', {
                pagination: {
                    el: ".writing_staff_pager",
                    clickable: true,
                }
            });

            // 탭전환
            if (res.AIDT_LINK) {
                $('.tab-box .tab-link.type-ai').attr({'href': res.AIDT_LINK});
            } else {
                $('.tab-box').remove();
            }

            // 집필진 매핑
            var $writingStaffBox1 = $('#writingStaffBox1');
            var $leadAuthorBox1 = $writingStaffBox1.find($(".lead-author-box"));
            var $staffList1 = $writingStaffBox1.find($(".staff-list"));
            for(let i=0; i<res.writing_staff.length; i++){
                let number = (i >= 10)? i : '0'+i;
                // 대표저자
                if(i == 0){
                    const $ltBox = $("<div>").prop({className: 'lt-box'});
                    const $imgBox = $("<div>").prop({className: 'img-box'});
                    // 사진 처리
                    $leadAuthorBox1.append(
                        $imgBox.append("<img src='" + $bookPath + $book + "/writing_staff"+number+".png' alt='' />")
                    );
                    // 인터뷰 영상 처리
                    if(res.writing_staff[i].video != null){
                        $leadAuthorBox1.append(
                            $imgBox.append("<a href='"+res.writing_staff[i].video+"' class='evShowVideo'></a>")
                        );
                    }
                    // 이력 처리
                    $leadAuthorBox1.append(
                        $ltBox.append("<div class='tit mg top-20'>대표 저자 " + res.writing_staff[i].name + "</div>")
                            .append("<span>" + res.writing_staff[i].affiliation + "</span>")
                            .append("<div class='tit mg top-12'>주요 이력</div>"),

                        res.writing_staff[i].history.forEach(function(val){
                            $ltBox.append("<li>"+val+"</li>")
                        })
                    );

                    // 대표저자 한마디 소개에 교과목만 추가
                    res.title = (res.title || '').replace(/\(.*?\)/g, '').trim(); // (선생님) 형식의 이름 제거
                    let bookName;
                    const bookNames = {
                        // 초등
                        'ele1': '영어','ele2': '영어','ele3': '수학','ele4': '사회','ele5': '음악','ele6': '체육','ele7': '생활 속의 보건','ele8': '실과','ele9': '생활 속 인공지능',
                        'mid1': '영어','mid2': '영어','mid3': '수학','mid4': '과학','mid5': '기술·가정','mid6': '체육','mid7': '음악','mid8': '정보','mid9': '보건','mid10': '진로와 직업','mid11': '한문','mid12': '개념 기반 탐구','mid13': '인공지능과 문제 해결','mid14': '미디어와 민주시민',
                        'hi1': '공통영어','hi2': '공통영어','hi3': '영어1/2','hi4': '영어 독해와 작문','hi5': '실생활 영어 회화','hi6': '세계 문화와 영어','hi7': '심화영어','hi8': '심화 영어 독해와 작문','hi9': '미디어 영어','hi10': '공통수학','hi11': '대수','hi12': '미적분','hi13': '확률과 통계','hi14': '기하','hi15': '체육','hi16': '운동과 건강','hi17': '스포츠 생활','hi18': '스포츠 과학','hi19': '음악','hi20': '음악 감상과 비평','hi21': '정보','hi22': '인공지능 기초','hi23': '데이터 과학','hi24': '보건','hi25': '한문',
                    };
                    bookName = bookNames[bookCode] || '알 수 없는 책';
                    $leadAuthorBox1.append("<div class='tit mg top-12'>YBM " + bookName + " 교과서는</div><div class='word-contain'><div class='word-box'><div class='inn'>" + res.writing_staff[i].word + "</div></div><span>이다.</span></div>");
                }
                else{
                    let $word = (res.writing_staff[i].type2)? "<div class='inn'>" + res.writing_staff[i].word + "</div>" : "YBM교과서는<div class='inn'>" + res.writing_staff[i].word + "</div>이다.";
                    let $video = (res.writing_staff[i].video != null)? "<a href='"+res.writing_staff[i].video+"' class='evShowVideo'></a>" : '';
                    const $liBox = $("<li>").prop({className: 'lt-box'});
                    $staffList1.append(
                        $liBox.prop({className:'item'})
                          //.append("<div class='img-box'><img src='" + $bookPath + $book + "/writing_staff"+number+".png' alt='' /></div>")
                            .append("<div class='img-box'><img src='" + $bookPath + $book + "/writing_staff"+number+".png' alt='' onerror='this.onerror=null; this.src=\"/prcenter/img/sub/img_staff_default.png\"'/>"+$video+"</div>")
                            .append("<div class='tit'>" + res.writing_staff[i].name + "</div>")
                            .append("<span>" + res.writing_staff[i].affiliation + "</span>")
                            .append("<div class='word-box'>" + $word + "</div>")
                    );
                }
            }

            /*
            // 사회과부도
            if (typeof res.writing_staff_02 != "undefined") {
                var $writingStaffBox2 = $('#writingStaffBox2');
                var $leadAuthorBox2 = $writingStaffBox2.find($(".lead-author-box"));
                var $staffList2 = $writingStaffBox2.find($(".staff-list"));
                for(let i=0; i<res.writing_staff_02.length; i++){
                    let number = (i >= 10)? i : '0'+i;
                    // 대표저자
                    if(i == 0){
                        const $ltBox = $("<div>").prop({className: 'lt-box'});
                        const $imgBox = $("<div>").prop({className: 'img-box'});
                        // 사진 처리
                        $leadAuthorBox2.append(
                            $imgBox.append("<img src='" + $bookPath + $book + "/writing_staff_02_"+number+".png' alt='' />")
                        );
                        // 인터뷰 영상 처리
                        if(res.writing_staff_02[i].video != null){
                            $leadAuthorBox2.append(
                                $imgBox.append("<a href='"+res.writing_staff_02[i].video+"' class='evShowVideo'></a>")
                            );
                        }
                        // 이력 처리
                        $leadAuthorBox2.append(
                            $ltBox.append("<div class='tit mg top-20'>대표 저자 " + res.writing_staff_02[i].name + "</div>")
                                .append("<span>" + res.writing_staff_02[i].affiliation + "</span>")
                                .append("<div class='tit mg top-12'>주요 이력</div>"),

                            res.writing_staff_02[i].history.forEach(function(val){
                                $ltBox.append("<li>"+val+"</li>")
                            })
                        );
                        $leadAuthorBox2.append("<div class='tit mg top-12'>YBM교과서는</div><div class='word-contain'><div class='word-box'><div class='inn'>" + res.writing_staff_02[i].word + "</div></div><span>이다.</span></div>");
                    }
                    else{
                        let $word = (res.writing_staff_02[i].type2)? "<div class='inn'>" + res.writing_staff_02[i].word + "</div>" : "YBM교과서는<div class='inn'>" + res.writing_staff_02[i].word + "</div>이다.";
                        let $video = (res.writing_staff_02[i].video != null)? "<a href='"+res.writing_staff_02[i].video+"' class='evShowVideo'></a>" : '';
                        const $liBox = $("<li>").prop({className: 'lt-box'});
                        $staffList2.append(
                            $liBox.prop({className:'item'})
                                .append("<div class='img-box'><img src='" + $bookPath + $book + "/writing_staff_02_"+number+".png' alt='' />"+$video+"</div>")
                                .append("<div class='tit'>" + res.writing_staff_02[i].name + "</div>")
                                .append("<span>" + res.writing_staff_02[i].affiliation + "</span>")
                                .append("<div class='word-box'>" + $word + "</div>")
                        );
                    }
                }
            }
            */

            // 구성과 특징
            for(let i=0; i<res.character.length; i++){
                let $class = (i == 0)? ' current' : '';
                if(res.character.length > 1){
                    $(".character-tab-menu").append("<li class='item" + $class + "'>" + res.character[i].name + "</li>");
                }
                if(res.character.length > 5){
                    $(".character-tab-menu").addClass('is-small');
                }
                $(".character-tab-contents .swiper-wrapper").append("<li class='swiper-slide'><div class='zoom_minimap'></div><div class='zoom'><div class='original'><img src='" + $bookPath + $book + "/character"+(i+1)+"_1.png' alt='' /></div><div class='viewer'><img src='" + $bookPath + $book + "/character"+(i+1)+"_1.png' alt='' /></div><div class='magnifier'></div></div></li>");
            }

            // swiperjs
            $swiperCharacter = new Swiper('.swiper-character',{
                allowTouchMove: false
            });

            // booktab
            console.log(res.booktab);
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
     * 집필진 탭메뉴
     */
    $(document).on("click", ".writing-staff-tab-menu .item", function(){
        let idx = $('.writing-staff-tab-menu .item').index(this);
        $('.writing-staff-tab-menu .item').removeClass('current');
        $(this).addClass('current');
        $('.writing-staff-box').removeClass('current');
        $('.writing-staff-box').eq(idx).addClass('current');
    });

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
        // window.open($src, 'zoom');
        window.open('/prcenter/zoom.html?f='+$src, 'zoom');

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
    function fetchTextbooks(textbookIds) {
        $.ajax({
            url: '/rest/prcenter/textbooks',
            type: 'GET',
            traditional: true,
            data: { textbookIds: textbookIds },
            success: function(data) {
                // 데이터 처리
                console.log('Textbooks with materials:', data);
                generateHTML(data);


            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX error:', textStatus, errorThrown);
            }
        });
    }

    /**
     * 페이지 예외처리
     */
    // 특정 교과서 지도서 제외
    const arBooksList = new Array('ele5', 'mid8', 'mid14');
    if(arBooksList.indexOf(bookCode) >= 0){
        $('.book-tab-menu .item:nth(2)').remove();
    }
    // 특정 교과서 전자 저작물 제외
    const arBooksList02 = new Array('ele5','ele10','mid8','mid12','mid13','mid14','hi15','hi16','hi17','hi19');
    if(arBooksList02.indexOf(bookCode) >= 0){
        $('.book-tab-menu .item:last-child').remove();
        $('.book-tab h2.title').html("우리 교과서, 지도서는 <br/> 이렇게 구성되어 있어요");
    }
    if(bookCode == 'ele5' || bookCode == 'mid8' || bookCode == 'mid14') {
        $('.book-tab h2.title').html("우리 교과서는 <br/> 이렇게 구성되어 있어요");
    }
    /* 사회과부도 예외처리
    if(bookCode == 'ele4') {
        var writingStaffTabMenu = ''+
            '<div class="writing-staff-tab-menu">'+
            '    <button type="button" class="item current">사회</button>'+
            '    <button type="button" class="item">사회과 부도</button>'+
            '</div>';
        $('.writing-staff-tab-contents').prepend(writingStaffTabMenu);
        $('.book-tab-menu .item:first-child').after('<li class="item">사회과 부도</li>');
    }
    */

    // 데이터 정렬 함수
    function sortDataByOrdg(data) {
        return data.sort((a, b) => parseInt(a.mtrlOrdg, 10) - parseInt(b.mtrlOrdg, 10));
    }

    // HTML 생성 함수 2024.08.21 버전
    /*function generateHTML2(data) {
        const dataWrap = document.querySelector('.data-wrap');
        const learningListBox = document.querySelector('.learning-list-box');
        dataWrap.innerHTML = ''; // 기존 내용 삭제
        const learningItems = learningListBox.querySelectorAll('.learning-item');

        let section1002, section1003;
        console.log(section1002);
        // 섹션을 찾기
        learningItems.forEach(item => {
            const titleElement = item.querySelector('.tit');
            if (titleElement.textContent.includes("수업 진행 자료")) {
                section1002 = item;
            } else if (titleElement.textContent.includes("수업 지원 자료")) {
                section1003 = item;
            }
        });

        // mtrltypeCD별로 데이터를 필터링합니다.
        const filteredData = {
            "1001": data.filter(item => item.mtrltypeCD === '1001'),
            "1002": data.filter(item => item.mtrltypeCD === '1002'),
            "1003": data.filter(item => item.mtrltypeCD === '1003')
        };
        console.log('Filtered data:', filteredData);

        // 1001에 해당하는 데이터 처리
        if (filteredData["1001"].length > 0) {
            // 데이터 그룹화
            const semesterGroups = new Map();
            filteredData["1001"].forEach(item => {
                const semester = textbookIdToSemesterMap.get(item.textbookId);
                if (!semesterGroups.has(semester)) {
                    semesterGroups.set(semester, []);
                }
                semesterGroups.get(semester).push(item);
            });

            // HTML 생성
            semesterGroups.forEach((items, semester) => {
                const divItem = document.createElement('div');
                divItem.className = 'item';

                const dt = document.createElement('dt');
                dt.textContent = semester; // e.g., "3학년 1학기"
                dt.title = semester; // e.g., "3학년 1학기"
                const dd = document.createElement('dd');

                items.sort((a, b) => {
                    const priority = {
                        '교과서': 1,
                        '수학 익힘': 2,
                        '교사용 교과서': 3,
                        '지도서': 4,
                        '전자 저작물': 5
                    };
                    const priorityA = priority[a.mtrlTitle] || 999;
                    const priorityB = priority[b.mtrlTitle] || 999;
                    return priorityA - priorityB;
                });

                items.forEach(item => {
                    if (item.mtrlTitle !== '선정사유서' && item.mtrlTitle !== '진도표' && item.mtrlTitle !== '브로슈어') {
                        const a = document.createElement('a');
                        a.href = '/prcenter_viewer?contentId=' + item.contentid;
                        if (item.mtrlTitle === '전자저작물' || item.mtrlTitle === '전자 저작물') {
                            a.href = '/prviewer/ybm-textbook/pc?contentId=' + item.contentid + "&ybmTextbookId=" + item.textbookId + "&target=_blank";
                            //a.href = '/prcenter_viewer?contentId=' + item.contentid;
                            a.target = '_blank';
                        }

                        // 동적으로 class 설정
                        switch (item.mtrlTitle) {
                            case '교과서':
                                a.className = 'caseA';
                                break;
                            case '수학 익힘':
                                a.className = 'caseB';
                                break;
                            case '교사용 교과서':
                                a.className = 'caseC';
                                break;
                            case '지도서':
                                a.className = 'caseD';
                                break;
                            case '전자 저작물':
                            case '전자저작물':
                                a.className = 'caseE';
                                break;
                            default:
                                a.className = 'defaultCase';
                        }
                        a.target = '_blank';
                        a.textContent = item.mtrlTitle;
                        dd.appendChild(a);
                    }
                });

                divItem.appendChild(dt);
                divItem.appendChild(dd);
                const dl = document.createElement('dl');
                dl.className = 'data-box';
                dl.appendChild(divItem);
                dataWrap.appendChild(dl);
            });

            // 다운로드 박스 추가
            const downloadBox = document.createElement('div');
            downloadBox.className = 'download-box';

            // 추가할 다운로드 항목
            const downloadItems = [
                { title: '선정사유서', displayTitle: '선정 사유서' },
                { title: '진도표', displayTitle: '진도표' },
                { title: '브로슈어', displayTitle: '브로슈어' }
            ];

            const lfBox = document.createElement('div');
            lfBox.className = 'lt-box';

            const rtBox = document.createElement('div');
            rtBox.className = 'rt-box';

            // Iterate over downloadItems and create elements
            downloadItems.forEach(item => {
                let title = item.title;
                let displayTitle = item.displayTitle;
                const dataItem = filteredData["1001"] ? filteredData["1001"].find(d => d.mtrlTitle === title) : null;

                // If there's no data for '브로슈어', skip creating the element
                if (title === '브로슈어' && !dataItem) {
                    return; // Skip 브로슈어 if no data
                }


                const div = document.createElement('div');
                div.className = 'btn download';
                div.textContent = displayTitle + ' ';

                const box = document.createElement('div');
                box.className = 'box';

                if (dataItem) {
                     if(dataItem.mtrlTitle === '브로슈어'){
                         const viewLink = document.createElement('a');
                         viewLink.href = '/prcenter_viewer?contentId=' + dataItem.contentid;
                         viewLink.className = 'btns';
                         viewLink.target = '_blank';
                         viewLink.innerHTML = '<i class="view"></i>';
                         box.appendChild(viewLink);
                     }
                     else{
                         const viewLink = document.createElement('a');
                         viewLink.href = '/prcenter_viewer?contentId=' + dataItem.contentid;
                         viewLink.className = 'btns';
                         viewLink.target = '_blank';
                         viewLink.innerHTML = '<i class="view"></i>';

                         const downloadLink = document.createElement('a');
                         downloadLink.href = "/prcenter_contents/" + dataItem.contentid + "/download";
                         downloadLink.className = 'btns';
                         downloadLink.download = '';
                         downloadLink.innerHTML = '<i class="download"></i>';
                         box.appendChild(viewLink);
                         box.appendChild(downloadLink);
                     }

                }

                div.appendChild(box);

                if (title === '브로슈어') {
                    lfBox.appendChild(div);
                    const contour = document.createElement('div');
                    contour.className = 'contour';
                    lfBox.appendChild(contour);
                } else {
                    rtBox.appendChild(div);
                    const contour = document.createElement('div');
                    contour.className = 'contour';
                    rtBox.appendChild(contour);
                }

            });

            // Append lfBox and rtBox to downloadBox
            downloadBox.appendChild(lfBox);
            downloadBox.appendChild(rtBox);

            // Append downloadBox to dataWrap
            dataWrap.appendChild(downloadBox);

        }


        // 1002에 해당하는 데이터 처리
        if (filteredData["1002"].length > 0 && section1002) {
            console.log("1002: ", filteredData["1002"]);
            const navList = section1002.querySelector('nav.list');
            navList.innerHTML = ''; // 기존 내용 삭제

            // 데이터 정렬
            const sortedData = sortDataByOrdg(filteredData["1002"]);

            sortedData.forEach(item => {
                const fileLink = document.createElement('a');
                fileLink.href = '/prcenter_viewer?contentId=' + item.contentid;
                fileLink.className = 'file';
                if (item.previewFileType === "zip" || item.previewFileType === "numbers") {
                    fileLink.href = "/prcenter_contents/" + item.contentid + "/download";
                }
                fileLink.target = '_blank';

                const img = document.createElement('img');
                img.src = getFileIconPath(item.previewFileType);
                img.alt = '';

                const span = document.createElement('span');
                span.textContent = item.mtrlTitle;

                const searchIcon = document.createElement('i');
                searchIcon.className = 'search';

                fileLink.appendChild(img);
                fileLink.appendChild(span);
                fileLink.appendChild(searchIcon);
                navList.appendChild(fileLink);
            });

            // "+ 자료 더보기" 버튼 추가 (자료가 6개 이상일 경우)
            if (sortedData.length > 6) {
                const moreButton = document.createElement('button');
                moreButton.type = 'button';
                moreButton.className = 'learning-more';
                moreButton.textContent = '+ 자료 더보기';
                section1002.appendChild(moreButton);
            }
        }

        // 1003에 해당하는 데이터 처리
        if (filteredData["1003"].length > 0 && section1003) {
            console.log("1003: ", filteredData["1003"]);
            const navList = section1003.querySelector('nav.list');
            navList.innerHTML = ''; // 기존 내용 삭제

            // 데이터 정렬
            const sortedData = sortDataByOrdg(filteredData["1003"]);

            sortedData.forEach(item => {
                const fileLink = document.createElement('a');
                fileLink.href = '/prcenter_viewer?contentId=' + item.contentid;
                fileLink.className = 'file';

                if (item.previewFileType === "zip") {
                    fileLink.href = "/prcenter_contents/" + item.contentid + "/download";
                }

                fileLink.target = '_blank';

                const img = document.createElement('img');
                img.src = getFileIconPath(item.previewFileType);
                img.alt = '';

                const span = document.createElement('span');
                span.textContent = item.mtrlTitle;

                const searchIcon = document.createElement('i');
                searchIcon.className = 'search';

                fileLink.appendChild(img);
                fileLink.appendChild(span);
                fileLink.appendChild(searchIcon);
                navList.appendChild(fileLink);
            });

            // "+ 자료 더보기" 버튼 추가 (자료가 6개 이상일 경우)
            if (sortedData.length > 6) {
                const moreButton = document.createElement('button');
                moreButton.type = 'button';
                moreButton.className = 'learning-more';
                moreButton.textContent = '+ 자료 더보기';
                section1003.appendChild(moreButton);
            }
        }
    }*/


    // HTML 생성 함수
    function generateHTML(data) {
        const dataWrap = document.querySelector('.data-wrap');
        if (!dataWrap) { console.warn('[generateHTML] .data-wrap 를 찾을 수 없습니다.'); return; }

        // ========== helpers ==========
        const norm   = s => String(s || '').replace(/\s+/g, '').trim();
        const byType = (arr, code) => arr.filter(it => String(it.mtrltypeCD) === String(code));
        const getCID = it => it?.contentid || it?.contentId || it?.id || '';

        // “전자 저작물” / “전자저작물” → 통일 + 공백 제거
        const canonTitle = t => String(t || '')
            .replace(/\s+/g,'')
            .replace(/전자\s*저작물/g, '전자저작물');

        // 본문에서 제외할 다운로드 전용 키워드
        const isDLItem = t => /브로슈어|선정사유서|진도표/.test(norm(t));

        const gradeNum = label => {
            const s = String(label || '');
            let m = s.match(/영어\s*([0-9])/); if (m) return +m[1];
            m = s.match(/([0-9])\s*학년/);     if (m) return +m[1];
            return NaN;
        };

        function orderSemKeys(keys) {
            const hasMid = keys.some(k => /영어\s*[12]/.test(k) || /[12]\s*학년/.test(k));
            if (hasMid) return keys.slice().sort((a,b)=>(gradeNum(b)||0)-(gradeNum(a)||0)); // 영어2 → 영어1
            const pref = ['5학년','6학년','3학년','4학년'];
            return keys.slice().sort((a,b)=>{
                const ia=pref.indexOf(a), ib=pref.indexOf(b);
                if (ia!==-1 || ib!==-1) return (ia!==-1?ia:99)-(ib!==-1?ib:99);
                const na=gradeNum(a), nb=gradeNum(b);
                if (isNaN(na) && isNaN(nb)) return 0;
                if (isNaN(na)) return 1;
                if (isNaN(nb)) return -1;
                return na-nb;
            });
        }

        function semKeyOf(it) {
            let k = it.semester || it.semNm || it.sem || it.gradeNm || '';
            try {
                if (!k && typeof textbookIdToSemesterMap!=='undefined' && textbookIdToSemesterMap.get) {
                    k = textbookIdToSemesterMap.get(it.textbookId) || '';
                }
            } catch(e){}
            if (!k) {
                try {
                    const params = new URLSearchParams(location.search);
                    const g = params.get('grade') || '';
                    if (/^ele([3-6])$/i.test(g)) k = `${RegExp.$1}학년`;
                    else if (/^mid([12])$/i.test(g)) k = `영어 ${RegExp.$1}`;
                } catch(e){}
            }
            return k || '기타';
        }

        const makeA = (href, className, text, targetBlank=true) => {
            const a = document.createElement('a');
            a.href = href || '#!'; a.className = className || ''; a.textContent = text || '';
            if (targetBlank) a.target = '_blank';
            return a;
        };

        // 라벨+문서명으로 (5~6, 3~4 / 2, 1) 자료 찾기
        function findGroupedDoc(type1001, label, docKey) {
            const strip = s => String(s||'').replace(/\s+/g,'');
            const canon = s => strip(s).replace(/[~–—-]/g,'~').replace(/학년/g,'');

            const parseSpan = (s) => {
                const t = strip(s);
                const m2 = t.match(/([0-9])\D*([0-9])/); if (m2) return [m2[1], m2[2]];
                const m1 = t.match(/([0-9])/);           if (m1) return [m1[1], m1[1]];
                return null;
            };

            const wantSpan = parseSpan(label);     // ['5','6'], ['3','4'], ['2','2'] 등
            const wantDoc  = strip(docKey);
            const wantText = canon(label);

            return type1001.find(x => {
                const raw = x.mtrlTitle || '';
                const s   = strip(raw);
                if (!s.includes(wantDoc)) return false;

                if (canon(raw).includes(wantText)) return true; // 문자열 정규화 포함 매칭

                const digits = (s.match(/[0-9]/g) || []);
                if (!wantSpan) return false;

                if (wantSpan[0] === wantSpan[1]) { // 단일 학년(중등)
                    return digits.includes(wantSpan[0]);
                } else { // 범위(초등)
                    return digits.includes(wantSpan[0]) && digits.includes(wantSpan[1]);
                }
            });
        }

        // ★ SEMESTER가 '사회과 부도'인 항목에서 CID 추출 (교과서 우선)
        function getSocialAtlasCID(type1001) {
            const canon = s => String(s||'').replace(/\s+/g,'');
            const isSocialGroup = x => canon(semKeyOf(x)) === '사회과부도';
            // 1) '교과서' 우선
            const prefer = type1001.find(x => isSocialGroup(x) && /교과서/.test(canonTitle(x.mtrlTitle)));
            if (prefer) return getCID(prefer);
            // 2) 없으면 같은 그룹의 첫 항목
            const any = type1001.find(x => isSocialGroup(x));
            return any ? getCID(any) : '';
        }

        // ========== 본문(1001) ==========
        const type1001 = byType(data, '1001');
        dataWrap.innerHTML = '';
        if (type1001.length === 0) return;

        // 학기/학년 그룹
        const groups = new Map();
        type1001.forEach(item => {
            const key = semKeyOf(item);
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(item);
        });

        // data-box
        const dl = document.createElement('dl'); dl.className = 'data-box';
        const SHOW_ORDER = ['교과서','수학익힘','교사용교과서','지도서','전자저작물'].map(canonTitle);
        const CLASS_MAP = {
            [canonTitle('교과서')]      : 'caseA',
            [canonTitle('수학익힘')]    : 'caseB',
            [canonTitle('교사용교과서')]: 'caseC',
            [canonTitle('지도서')]      : 'caseD',
            [canonTitle('전자저작물')]  : 'caseE',
        };

        orderSemKeys(Array.from(groups.keys())).forEach(semKey => {
            // ⛔ 상단 리스트에서는 "사회과 부도" 섹션 제외
            if (norm(semKey) === '사회과부도') return;

            const items = groups.get(semKey) || [];
            const bucket = new Map(); // canonical title -> item[]

            items.forEach(it => {
                if (isDLItem(it.mtrlTitle)) return; // 다운로드 박스 항목은 본문에서 제외
                const key = canonTitle(it.mtrlTitle);
                if (!bucket.has(key)) bucket.set(key, []);
                bucket.get(key).push(it);
            });

            const divItem = document.createElement('div'); divItem.className = 'item';
            const dt = document.createElement('dt'); dt.textContent = semKey; dt.title = semKey;
            const dd = document.createElement('dd');

            // 우선순위 먼저
            SHOW_ORDER.forEach(k => {
                const arr = bucket.get(k); if (!arr || !arr.length) return;
                arr.forEach(item => {
                    const cid = getCID(item); if (!cid) return;
                    const isE = (k === canonTitle('전자저작물'));
                    const href = isE
                        ? `/prviewer/ybm-textbook/pc?contentId=${cid}&ybmTextbookId=${item.textbookId}&target=_blank`
                        : `/prcenter_viewer?contentId=${cid}`;
                    dd.appendChild(makeA(href, CLASS_MAP[k] || 'defaultCase', item.mtrlTitle, true));
                });
                bucket.delete(k);
            });

            // 나머지
            for (const [k, arr] of bucket.entries()) {
                arr.forEach(item => {
                    const cid = getCID(item); if (!cid) return;
                    dd.appendChild(makeA(`/prcenter_viewer?contentId=${cid}`, 'defaultCase', item.mtrlTitle, true));
                });
            }

            divItem.appendChild(dt); divItem.appendChild(dd); dl.appendChild(divItem);
        });

        dataWrap.appendChild(dl);

        // ========== 다운로드 박스 (ele7/8/9 → 5~6만, 3~4 보호, 브로슈어 우선, 잔상/중복 방지) ==========
        var dlBox = document.createElement('div'); dlBox.className = 'download-box';
        var lfBox = document.createElement('div'); lfBox.className = 'lt-box';
        var rtBox = document.createElement('div'); rtBox.className = 'rt-box';

        function appendWithContours(container, nodes) {
            container.innerHTML = '';
            for (var i=0; i<nodes.length; i++) {
                container.appendChild(nodes[i]);
                if (i < nodes.length - 1) {
                    var ct = document.createElement('div');
                    ct.className = 'contour';
                    container.appendChild(ct);
                }
            }
        }

        function _strip(s){ return String(s||'').replace(/\s+/g,''); }
        function _norm(s){ return _strip(s).toLowerCase(); }

// ---- URL 파라미터/학년 그룹
        var groupOrder = [];
        var gradeParam = '';
        try {
            var _params = new URLSearchParams(location.search);
            gradeParam = String(_params.get('grade') || '').trim().toLowerCase();

            if (/^ele/.test(gradeParam)) {
                // ✅ ele7/ele8/ele9는 5~6학년만 표시
                if (/^ele(7|8|9)$/.test(gradeParam)) {
                    groupOrder = ['5~6학년'];
                } else {
                    groupOrder = ['5~6학년','3~4학년'];
                }
            } else if (/^mid/.test(gradeParam)) {
                groupOrder = ['2학년','1학년'];
            } else {
                groupOrder = [];
            }
        } catch(e) {
            groupOrder = [];
        }

// 제목 내 범위를 통일: "5-6학년", "5,6학년", "5·6학년" → "5~6"
        function normalizeRangeText(s) {
            var t = String(s||'');
            t = t.replace(/[·ㆍ‧,，\-–—~]/g, '~');
            t = t.replace(/학년/g, '');
            t = t.replace(/\s+/g, '');
            return t;
        }

// 문서키(선정사유서/진도표/브로슈어)가 제목에 포함?
        function titleContainsKey(title, key) {
            var t = _norm(title), k = _norm(key);
            return t.indexOf(k) !== -1 || t.indexOf(k.replace(/\s+/g,'')) !== -1;
        }

// 기존: 제목 기반 그룹 매칭
        function findGroupedDoc_byTitle(list, label, docKey) {
            var want = normalizeRangeText(label); // "5~6" 또는 "3~4"
            var m = want.match(/^(\d)~?(\d)?$/);
            var a = m ? m[1] : null;
            var b = m && m[2] ? m[2] : m ? m[1] : null;

            for (var i=0; i<list.length; i++) {
                var x = list[i], title = String(x.mtrlTitle||'');
                if (!titleContainsKey(title, docKey)) continue;

                var tt = normalizeRangeText(title);
                if (tt.indexOf(want) !== -1) return x; // 완전 포함

                var digits = (title.match(/\d/g) || []).join('');
                if (a && b) {
                    if (digits.indexOf(String(a)) !== -1 && digits.indexOf(String(b)) !== -1) return x;
                } else if (a) {
                    if (digits.indexOf(String(a)) !== -1) return x;
                }
            }
            return null;
        }

// ★ ele 전용: 5~6 명시 textbookId 집합을 만들고, 동일 문서키 중 그 외 textbookId는 3~4로 간주
        function findGroupedDoc_smartEle(list, label, docKey) {
            if (!/^ele/.test(gradeParam||'')) return null;

            // ✅ ele7/8/9에서는 3~4학년 매칭 자체를 건너뜀(5~6만 존재)
            if (/^ele(7|8|9)$/.test(gradeParam) && /3\s*~?\s*4\s*학년/.test(label)) {
                return null;
            }

            var labelIs34 = /3\s*~?\s*4\s*학년/.test(label);
            var labelIs56 = /5\s*~?\s*6\s*학년/.test(label);

            // 1) 제목 기반 먼저
            var direct = findGroupedDoc_byTitle(list, label, docKey);
            if (direct) return direct;

            // 2) 보조 로직
            var id56 = {};
            for (var i=0;i<list.length;i++) {
                var it = list[i], t = String(it.mtrlTitle||'');
                if (titleContainsKey(t, docKey) && /5\s*~?\s*6\s*학년/i.test(t)) {
                    id56[String(it.textbookId||'')] = 1;
                }
            }
            if (labelIs56) return null;

            if (labelIs34) {
                for (var j=0;j<list.length;j++) {
                    var it2 = list[j];
                    if (!titleContainsKey(it2.mtrlTitle, docKey)) continue;
                    var tid = String(it2.textbookId||'');
                    if (!id56[tid]) return it2; // 5~6이 아닌 쪽을 3~4로 추정
                }
            }
            return null;
        }

// 최종 그룹 매칭
        function findGroupedDoc(list, label, docKey) {
            return findGroupedDoc_byTitle(list, label, docKey) || findGroupedDoc_smartEle(list, label, docKey);
        }

// ★ 초등 브로슈어: "5~6학년 브로슈어" > "브로슈어" > 포함
        function pickBrochureItem(list) {
            var isEle = /^ele/.test(String(gradeParam||''));
            if (isEle) {
                for (var i=0;i<list.length;i++) {
                    var t = String(list[i].mtrlTitle||'');
                    if (/5\s*~?\s*6\s*학년\s*브로슈어/i.test(t) ||
                        /5\s*[\-–—·ㆍ‧,，]\s*6\s*학년\s*브로슈어/i.test(t)) return list[i];
                }
            }
            for (var j=0;j<list.length;j++) {
                if (/^\s*브로슈어\s*$/i.test(String(list[j].mtrlTitle||'').trim())) return list[j];
            }
            for (var k=0;k<list.length;k++) {
                if (/브로슈어/i.test(String(list[k].mtrlTitle||''))) return list[k];
            }
            return null;
        }

// ele4: 사회과부도 CID (기존 헬퍼 사용)
        var socialCid = '';
        try { if (gradeParam === 'ele4') { socialCid = getSocialAtlasCID(type1001) || ''; } } catch(e){}

        function makeCIDSet(){ return { _m:{}, has:function(id){return !!this._m[id];}, add:function(id){this._m[id]=1;} }; }

        var defs = [
            { key:'브로슈어',   display:'브로슈어',   side:'L', onlyPreview:true },
            { key:'선정사유서', display:'선정 사유서', side:'R' },
            { key:'진도표',     display:'진도표',     side:'R' }
        ];

        var leftWraps  = [];
        var rightWraps = [];

// === 각 버튼 생성
        for (var d=0; d<defs.length; d++) {
            var def = defs[d];
            var cidSet = makeCIDSet();
            var hasContent = false;

            var wrap = document.createElement('div');
            wrap.className = 'btn download';
            wrap.appendChild(document.createTextNode(def.display + ' '));

            var box = document.createElement('div');
            box.className = 'box';

            // ① 그룹 라벨/아이콘(브로슈어 제외)
            if (def.key !== '브로슈어' && groupOrder.length) {
                for (var gi=0; gi<groupOrder.length; gi++) {
                    var grpLabel = groupOrder[gi];
                    var gItem = findGroupedDoc(type1001, grpLabel, def.key);
                    if (gItem) {
                        var gcid = (gItem.contentid || gItem.contentId || gItem.id || '');
                        if (gcid && !cidSet.has(gcid)) {
                            var label = document.createElement('b');
                            label.className = 'dl_group_label';
                            label.appendChild(document.createTextNode(grpLabel + ' '));
                            box.appendChild(label);

                            var gv = document.createElement('a');
                            gv.href = '/prcenter_viewer?contentId=' + gcid;
                            gv.target = '_blank';
                            gv.className = 'btns';
                            gv.innerHTML = '<i class="view"></i>';
                            box.appendChild(gv);

                            var gd = document.createElement('a');
                            gd.href = '/prcenter_contents/' + gcid + '/download';
                            gd.setAttribute('download','');
                            gd.className = 'btns';
                            gd.innerHTML = '<i class="download"></i>';
                            box.appendChild(gd);

                            cidSet.add(gcid);
                            hasContent = true;
                        }
                    }
                }
            }

            // ② 공통 아이콘(맨 뒤) — 브로슈어는 초등 우선
            var common = null;
            if (def.key === '브로슈어') {
                common = pickBrochureItem(type1001);
            } else {
                for (var c=0; c<type1001.length; c++) {
                    if (titleContainsKey(type1001[c].mtrlTitle, def.key)) { common = type1001[c]; break; }
                }
            }
            if (common) {
                var cid = (common.contentid || common.contentId || common.id || '');
                if (cid && !cidSet.has(cid)) {
                    var tv = document.createElement('a');
                    tv.href = '/prcenter_viewer?contentId=' + cid;
                    tv.target = '_blank';
                    tv.className = 'btns';
                    tv.innerHTML = '<i class="view"></i>';
                    box.appendChild(tv);

                    if (!def.onlyPreview) {
                        var td = document.createElement('a');
                        td.href = '/prcenter_contents/' + cid + '/download';
                        td.setAttribute('download','');
                        td.className = 'btns';
                        td.innerHTML = '<i class="download"></i>';
                        box.appendChild(td);
                    }
                    cidSet.add(cid);
                    hasContent = true;
                }
            }

            // ele4 + 사회과부도: ‘선정 사유서’가 비어 있어도 컨테이너 생성
            if (def.key === '선정사유서' && !hasContent && gradeParam === 'ele4' && socialCid) {
                hasContent = true;
            }

            if (!hasContent) continue;

            wrap.appendChild(box);
            if (def.side === 'L') leftWraps.push(wrap); else rightWraps.push(wrap);
        }

// 사이에만 contour
        appendWithContours(lfBox, leftWraps);
        appendWithContours(rtBox, rightWraps);

// ---- ele4 전용: 선정 사유서 안에 사회과부도 추가(있을 때만)
        try {
            if (gradeParam === 'ele4' && socialCid) {
                var targetBtn = null;
                var btns = rtBox.querySelectorAll('.btn.download');
                for (var bi=0; bi<btns.length; bi++) {
                    var t = btns[bi].firstChild && btns[bi].firstChild.nodeType === 3 ? btns[bi].firstChild.nodeValue : btns[bi].textContent;
                    if (/선정\s*사유서/.test(String(t||''))) { targetBtn = btns[bi]; break; }
                }
                if (!targetBtn) {
                    targetBtn = document.createElement('div');
                    targetBtn.className = 'btn download';
                    targetBtn.appendChild(document.createTextNode('선정 사유서 '));
                    var nb = document.createElement('div'); nb.className = 'box';
                    targetBtn.appendChild(nb);
                    if (rtBox.children.length) {
                        var ct = document.createElement('div'); ct.className = 'contour';
                        rtBox.appendChild(ct);
                    }
                    rtBox.appendChild(targetBtn);
                }
                var boxNode = targetBtn.querySelector('.box');
                if (!boxNode) { boxNode = document.createElement('div'); boxNode.className='box'; targetBtn.appendChild(boxNode); }

                var lbl = document.createElement('b');
                lbl.className = 'dl_group_label';
                lbl.appendChild(document.createTextNode('사회과부도 '));
                boxNode.appendChild(lbl);

                var v = document.createElement('a');
                v.href = '/prcenter_viewer?contentId=' + socialCid;
                v.target = '_blank';
                v.className = 'btns';
                v.innerHTML = '<i class="view"></i>';
                boxNode.appendChild(v);

                var dld = document.createElement('a');
                dld.href = '/prcenter_contents/' + socialCid + '/download';
                dld.setAttribute('download','');
                dld.className = 'btns';
                dld.innerHTML = '<i class="download"></i>';
                boxNode.appendChild(dld);
            }
        } catch(e) {
            console.warn('[generateHTML] 사회과부도 삽입 중 오류:', e);
        }

        dlBox.appendChild(lfBox);
        dlBox.appendChild(rtBox);
        dataWrap.appendChild(dlBox);


    }




    // 왼쪽/오른쪽 적용 함수
    function applyLeftHashtags(list) {
        const $wrap = $('.suppert-cont.left .suppert-hashtags').first();
        renderHashtags($wrap, list, 8);
    }
    function applyRightHashtags(list) {
        const $wrap = $('.suppert-cont.right .suppert-hashtags').first();
        renderHashtags($wrap, list, 8);
    }




// 공통 렌더러: 컨테이너 안을 통째로 재구성 (최대 8개)
    function renderHashtags($wrap, list, max = 8) {
        if (!$wrap || !$wrap.length || !Array.isArray(list)) return;

        const html = list
            .filter(it => it && typeof it.name === 'string')
            .slice(0, max)
            .map(it => {
                const name = it.name.trim().replace(/^#\s*/, ''); // 기존 # 제거
                return `<div class="hashtag">#${name}</div>`;
            })
            .join('');

        $wrap.html(html); // ← 통째로 갈아끼움 (남는 박스 없음)
    }
    /*function getFileIconPath(fileType) {
        const iconMap = {
            //webapp/prcenter/img/sub/file_ext/ico_file_pdf.png
            'pdf': '/prcenter/img/sub/file_ext/ico_file_pdf.png',
            'hwp': '/prcenter/img/sub/file_ext/ico_file_hwp.png',
            'hwpx': '/prcenter/img/sub/file_ext/ico_file_hwp.png',
            'doc': '/prcenter/img/sub/file_ext/ico_file_doc.png',
            'mp4': '/prcenter/img/sub/file_ext/ico_file_mp4.png',
            'ppt': '/prcenter/img/sub/file_ext/ico_file_pptx.png',
            'pptx': '/prcenter/img/sub/file_ext/ico_file_pptx.png',
            'xlsx': '/prcenter/img/sub/file_ext/ico_file_xlsx.png',
            'xls': '/prcenter/img/sub/file_ext/ico_file_xlsx.png',
            'png': '/prcenter/img/sub/file_ext/ico_file_png.png',
            'zip': '/prcenter/img/sub/file_ext/ico_file_zip.png',
            'mp3': '/prcenter/img/sub/file_ext/ico_file_mp3.png'
        };
        return iconMap[fileType] || '/prcenter/img/sub/file_ext/ico_file_default.png'; // 기본 아이콘 경로
    }*/





});