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
                $('.writing_staff_all .swiper-wrapper').append("<img src='" + $bookPath + $book + "/writing_staff_all.png' alt='' class='swiper-slide' />");
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
                          //.append("<div class='img-box'><img src='" + $bookPath + $book + "/writing_staff"+number+".png' alt='' /></div>")
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
        // 특정 교과서 전자 저작물 제외
    const arBooksList = new Array('hi15','hi16','hi17','hi19');
    if(arBooksList.indexOf(bookCode) >= 0){
        $('.book-tab-menu .item:last-child').remove();
    }



    // 데이터 정렬 함수
    function sortDataByOrdg(data) {
        return data.sort((a, b) => parseInt(a.mtrlOrdg, 10) - parseInt(b.mtrlOrdg, 10));
    }

// HTML 생성 함수
    function generateHTML(data) {
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
    }


    function getFileIconPath(fileType) {
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
    }





});