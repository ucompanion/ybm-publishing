/***********************************************************
 *  공통: Youtube
************************************************************/
let isClickDelegationInitialized = false;
const youtubeBoxStates = new Map();
let players = {};
function initYoutubeThumbnails() {
    console.log("YouTube 썸네일 초기화 함수 실행됨!");

    // ✅ 클릭 이벤트는 document 전체에 단 한 번만 등록되도록 합니다.
    if (!isClickDelegationInitialized) {
        document.addEventListener('click', (event) => {
            const box = event.target.closest('.youtube-link');
            if (!box) return;

            const currentState = youtubeBoxStates.get(box) || {
                timeoutId: null,
                isLoaded: false,
                originalThumbHTML: box.querySelector('.youtube-thumb').innerHTML,
                currentIframe: null,
                thumbElement: box.querySelector('.youtube-thumb')
            };
            youtubeBoxStates.set(box, currentState);

            event.preventDefault(); // 기본 링크 이동 방지 (box가 <a> 태그일 경우)

            // 이미 로드된 상태에서 클릭 시, iframe이 숨겨져 있다면 보이게 하고 재생 시도
            if (currentState.isLoaded || currentState.timeoutId) {
                if (currentState.isLoaded && currentState.currentIframe && currentState.currentIframe.classList.contains('hide-youtube')) {
                    currentState.currentIframe.classList.remove('hide-youtube');
                    currentState.thumbElement.innerHTML = '';
                    currentState.thumbElement.appendChild(currentState.currentIframe);
                    if (players[box.id] && typeof players[box.id].playVideo === 'function') {
                        players[box.id].playVideo();
                    }
                }
                return;
            }

            currentState.timeoutId = setTimeout(() => {
                const thumbContainer = box.querySelector('.youtube-thumb');
                const videoId = box.dataset.youtubeId;

                const iframeId = `ytplayer-${Date.now()}`;
                const iframe = document.createElement('iframe');
                iframe.id = iframeId;
                iframe.width = "100%";
                iframe.height = "100%";
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&enablejsapi=1`;
                iframe.title = "YouTube video player";
                iframe.frameBorder = "0";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                iframe.setAttribute('loading', 'lazy');

                thumbContainer.innerHTML = '';
                thumbContainer.appendChild(iframe);

                currentState.isLoaded = true;
                currentState.currentIframe = iframe;
                currentState.timeoutId = null;

                if (typeof YT !== 'undefined' && YT.Player) {
                    players[box.id || iframeId] = new YT.Player(iframe.id, {
                        events: {
                            'onStateChange': function(event) {
                                const currentBox = Array.from(youtubeBoxStates.keys()).find(key => players[key.id || key.dataset.youtubeId] === event.target);
                                if (event.data === YT.PlayerState.ENDED && currentBox) {
                                    const state = youtubeBoxStates.get(currentBox);
                                    if (state) {
                                        state.currentIframe.classList.add('hide-youtube');
                                        state.thumbElement.innerHTML = state.originalThumbHTML;
                                        event.target.stopVideo();
                                        event.target.seekTo(0);
                                    }
                                }
                            }
                        }
                    });
                } else {
                    console.warn("YT.Player is not defined. YouTube API may not be loaded, or initYoutubeThumbnails should be called inside onYouTubeIframeAPIReady.");
                }
            }, 500); // 0.5초 딜레이
        });
        isClickDelegationInitialized = true; // 클릭 위임 리스너가 등록되었음을 표시
    }

    document.querySelectorAll('.youtube-link').forEach(box => {
        if (box.dataset.youtubeListenersInitialized === 'true') {
            return; // 이미 초기화된 요소라면 건너뜀
        }

        const thumbContainer = box.querySelector('.youtube-thumb');
        const state = youtubeBoxStates.get(box) || {
            timeoutId: null, isLoaded: false, originalThumbHTML: thumbContainer.innerHTML, currentIframe: null, thumbElement: thumbContainer
        };
        youtubeBoxStates.set(box, state);

        box.addEventListener('mouseleave', () => {
            const currentState = youtubeBoxStates.get(box);
            if (currentState.timeoutId) {
                clearTimeout(currentState.timeoutId);
                currentState.timeoutId = null;
            }
            if (currentState.isLoaded) {
                if (currentState.currentIframe && currentState.thumbElement.contains(currentState.currentIframe)) {
                    currentState.thumbElement.removeChild(currentState.currentIframe);
                }
                currentState.thumbElement.innerHTML = currentState.originalThumbHTML;
                currentState.isLoaded = false;
                currentState.currentIframe = null;
            }
        });

        box.dataset.youtubeListenersInitialized = 'true';
    });
}

/***********************************************************
 *  Section1: 최근소식
************************************************************/
let mainNewsSwiper; // Swiper 인스턴스를 저장할 전역 변수
function initNewsSwiper(){
    const swiperOptions = {
        threshold: 3,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        slidesPerView: 1,
        spaceBetween: 100,
        centeredSlides: true,
        loop: true,
        pagination: {
            el: ".news-swiper .swiper-pagination",
            clickable: true,
            type: 'bullets',
        },
    };

    const swiperContainerEl = document.querySelector(".news-swiper"); // Swiper HTML 요소 캐싱
    mainNewsSwiper = new Swiper(swiperContainerEl, swiperOptions);
}

const newsData = [
    // {
    //     idx: 1,
    //     id: 'news-item-01',
    //     title: '“감사합니다. 선생님!” <br/> 축 합격! 2022 개정 YBM교과서 홍보관 오픈',
    //     date: '2025.08.29',
    //     content: ''+
    //         '<p><img src="/prcenter/img/main/img_sec1_data01.png" alt="" loading="lazy" /></p>'+
    //         '<p>'+
    //             '<br>항상 YBM교과서를 사랑해 주시고, 학교 현장에서 함께해 주시는 선생님들께 진심으로 감사드립니다.'+
    //             '<br>올해도 기쁜 소식을 전해드립니다!'+
    //             '<br>2022 개정 교육과정에 따라 2026학년도부터 새롭게 도입되는 초·중·고 교과서가 선생님들을 찾아갑니다.'+
    //             '<br>'+
    //             '<br>YBM교과서는 각 학교급과 과목의 특성을 살린 참신한 교육 콘텐츠와,'+
    //             '<br>수업에 바로 활용할 수 있는 다양한 자료를 꾸준히 개발하고 있습니다.'+
    //             '<br>'+
    //             '<br>새로운 학기, 새로운 YBM교과서와 함께 학생들과의 배움이 더욱 생생해지고, 선생님의 수업이 한층 더 빛나기를 기대합니다.'+
    //         '</p>'
    // },
    {
        idx: 1,
        id: 'news-item-01',
        title: 'YBM교과서 홍보관 리뉴얼 기념 릴레이 이벤트 (3차)',
        date: '2025.08.29',
        content: ''+
            '<p><img src="/prcenter/img/main/img_sec1_bak_250908.png" alt="" loading="lazy" /></p>'+
            '<p>'+
                '<br>YBM교과서 홍보관, 새롭게 단장했습니다!'+
                '<br>새로운 YBM교과서가 최종 합격하면서, 교과서 홍보관도 새로운 모습으로 선생님들을 찾아갑니다.'+
                '<br>새롭게 만나는 교과서를 한자리에서 확인하시고, 더 편리해진 구성과 풍성한 수업 지원 자료를 만나 보세요.'+
                '<br>'+
                '<br>교과서 합격 축하를 기념해 준비한 릴레이 이벤트에서 새로운 교과서를 직접 체험하고, 특별한 혜택도 받아 가세요!'+
                '<br>교과서 표지를 선택하고, 소개 페이지를 둘러본 뒤 간단한 퀴즈에 참여하시면, YBM교과서의 특징을 쉽게 확인할 수 있어요.'+
                '<br>YBM이 준비한 풍성한 선물을 지금 바로 만나 보세요!'+
            '</p>',
    },
    {
        idx: 2,
        id: 'news-item-02',
        title: '발행사 공동<br>AIDT 웹전시관 오픈',
        date: '2025.08.29',
        content: ''+
            '<p><img src="/prcenter/img/main/img_sec1_data02.png" alt="" loading="lazy" /></p>'+
            '<p>'+
                '발행사 공동 AIDT 웹전시관이 새롭게 문을 열었습니다.'+
                '<br>이번 전시관에서는 2학기부터 활용할 수 있는 수학·영어·정보 서책 교과서와 연계된 모든 AIDT를 직접 체험해 보실 수 있습니다.'+
                '<br>AIDT는 단순한 보조 자료가 아니라, 교과서와 긴밀히 연결된 교육의 든든한 동반자입니다. 앞으로는 더 포용적이고, 더 창의적이며, 더 연결된 학습 경험을 제공하는 새로운 모습으로 선생님들을 찾아갈 예정입니다. 교육 현장의 변화에 발맞추어, AIDT는 교실 속 배움의 과정을 더욱 생생하게 만들고, 학생들에게 희망을 이어주는 도구가 될 것입니다.'+
                '<br>선생님과 함께 내일의 교실을 만들어가며, 배움의 희망을 끝까지 이어가겠습니다.'+
            '</p>'
    },
    {
        idx: 3,
        id: 'news-item-03',
        title: 'Y클라우드의 에듀테크 서비스를 소개합니다!',
        date: '2025.08.29',
        content: ''+
            '<p><img src="/prcenter/img/main/img_sec1_data03.png" alt="" loading="lazy" /></p>'+
            '<p>'+
                '<br>Y클라우드에서는 학생들의 창의적인 사고력 확장, 교실 속 실시간 상호작용, 생성형 AI 기반 학습 등 수업의 질을 높이고 배움의 즐거움을 더해주는 다양한 에듀테크 서비스를 제공하고 있습니다.'+
                '<br>각 서비스들은 수업 활동 전반에 바로 활용할 수 있어, 선생님의 수업을 더욱 생생하고 효과적으로 이끌어 드립니다.'+
                '<br>또한 다양한 수업 방식과 교과 특성에 맞춰 적용할 수 있어 교실 속 학습 경험을 한 단계 업그레이드 할 수 있습니다.'+
                '<br>앞으로도 Y클라우드는 선생님과 학생 모두에게 더 나은 학습 환경을 제공하기 위해 꾸준히 노력하겠습니다.'+
            '</p>'
    },
    {
        idx: 4,
        id: 'news-item-04',
        title: '디지털 교육의 현장 속으로! 2025 에듀플러스위크 미래교육박람회',
        date: '2025.08.16',
        content: ''+
            '<p><img src="/prcenter/img/main/img_sec1_data04.png" alt="" loading="lazy" /></p>'+
            '<p>'+
                '<br>YBM은 지난 8월 13일부터 15일까지 코엑스에서 열린 2025 에듀플러스위크 미래교육박람회에 참여했습니다. 이번 박람회에서는 AIDT 공동 전시관을 운영하며 AI·디지털 교육 자료를 시연했습니다.'+
                '<br>부스에서는 맞춤형 학습 지원, 학생 화면 제어, 실시간 상호작용, 활동 중심 학습 등 AI·디지털 교육 자료의 핵심 기능을 선보였습니다.'+
                '<br>특히 실제 교실에서 활용 가능한 수업 모델을 중심으로 소개해 많은 교육 관계자들의 주목을 받았습니다.'+
                '<br>뜨거웠던 현장의 열기를 사진으로 만나 보세요.'+
            '</p>'
    },
    {
        idx: 5,
        id: 'news-item-05',
        title: '2026년, 한층 더 발전한 AI·디지털 교육 자료, 2025 세종 디지털 교육 박람회',
        date: '2025.07.22',
        content: ''+
            '<p><img src="/prcenter/img/main/img_sec1_data05.png" alt="" loading="lazy" /></p>'+
            '<p>'+
                '<br>지난 7월 22일, 세종 정부컨벤션센터에서 ‘2025 세종 디지털 교육 박람회‘ 가 개최되었습니다.'+
                '<br>YBM에서는 AI·디지털 교육 자료와 Y클라우드의 에듀테크 서비스를 선보여 많은 선생님과 학생들의 뜨거운 관심을 받았습니다. '+
                '<br>부스에서는 직접 서비스를 체험할 수 있는 시연과 서비스 소개를 진행했고, 방문객들은 새로운 학습 환경에 큰 호응을 보냈습니다. 성공적으로 마무리된 세종 디지털 교육 박람회 현장을 만나 보세요.'+
            '</p>'
    },
    {
        idx: 6,
        id: 'news-item-06',
        title: '2025 울산 미래교육박람회, 미래 교육을 위한 YBM의 노력!',
        date: '2025.07.20',
        content: ''+
            '<p><img src="/prcenter/img/main/img_sec1_data06.png" alt="" loading="lazy" /></p>'+
            '<p>'+
                '<br>지난 7월 18일부터 20일까지, 울산전시컨벤션센터(UECO)에서 열린 2025 울산 미래교육박람회에 YBM이 참여했습니다!'+
                '<br>YBM은 이번 박람회에서 AI·디지털 교육 자료와 Y클라우드의 에듀테크 서비스를 선보였습니다.'+
                '<br>부스에서는 맞춤형 학습 지원, 쌍방향 수업 도구, 활동 중심 학습 서비스 등을 소개하며 다양한 참관객들에게 새로운 수업 환경을 직접 경험할 수 있는 기회를 제공했습니다.'+
                '<br>현장을 찾아주신 많은 교육 관계자들은 YBM이 제시하는 새로운 학습 방식에 공감을 표했습니다.'+
                '<br>성공적으로 마무리된 울산 미래교육박람회 현장을 만나 보세요.'+
            '</p>'
    },
];

// 2. 모달 내용을 업데이트하는 함수
function updateModalContent(newsId) {
    const currentIndex = newsData.findIndex(news => news.id === newsId);

    if (currentIndex !== -1) { // 해당 뉴스를 찾았을 경우
        const selectedNews = newsData[currentIndex];

        // 모달 본문 내용 채우기
        document.getElementById('detail-news-title').innerHTML = selectedNews.title;
        document.getElementById('detail-news-date').textContent = selectedNews.date;
        document.getElementById('detail-news-content').innerHTML = selectedNews.content;

        // 이전/다음 뉴스 정보 가져오기 및 업데이트
        const prevIndex = currentIndex - 1;
        const nextIndex = currentIndex + 1;

        const prevNews = (prevIndex >= 0) ? newsData[prevIndex] : null;
        const nextNews = (nextIndex < newsData.length) ? newsData[nextIndex] : null;

        const prevLinkElement = document.getElementById('detail-prev-news');
        const nextLinkElement = document.getElementById('detail-next-news');

        // 이전 뉴스 링크/텍스트 업데이트
        if (prevNews) {
            prevLinkElement.innerHTML = prevNews.title;
            prevLinkElement.closest('.board-pager-nav').setAttribute('data-news-id', prevNews.id);
            prevLinkElement.closest('.board-pager-nav').style.pointerEvents = 'auto'; // 링크 활성화
        } else {
            prevLinkElement.innerHTML = '이전 뉴스가 없습니다.';
            prevLinkElement.closest('.board-pager-nav').removeAttribute('data-news-id');
            prevLinkElement.closest('.board-pager-nav').style.pointerEvents = 'none'; // 링크 비활성화
        }

        // 다음 뉴스 링크/텍스트 업데이트
        if (nextNews) {
            nextLinkElement.innerHTML = nextNews.title;
            nextLinkElement.closest('.board-pager-nav').setAttribute('data-news-id', nextNews.id);
            nextLinkElement.closest('.board-pager-nav').style.pointerEvents = 'auto';
        } else {
            nextLinkElement.innerHTML = '다음 뉴스가 없습니다.';
            nextLinkElement.closest('.board-pager-nav').removeAttribute('data-news-id');
            nextLinkElement.closest('.board-pager-nav').style.pointerEvents = 'none';
        }
    }
}

function initNewsBoard(){
    // 3. 초기 목록에서 뉴스 아이템 클릭 시
    document.querySelectorAll('.post-link').forEach(link => {
        link.addEventListener('click', function() {
            const newsId = this.dataset.newsId;
            updateModalContent(newsId); // 모달 내용만 업데이트
            // Bootstrap의 data-bs-toggle="modal"이 모달을 여는 것을 처리함.
            // 여기에 `new bootstrap.Modal(...).show()`를 추가할 필요 없음.
        });
    });

    // 추가: 이전/다음 링크 클릭 시 모달 내용 변경 (optional, for full navigation)
    document.getElementById('newsDetailModal').addEventListener('click', function(event) {
        const target = event.target;
        // 클릭된 요소의 가장 가까운 <a class="board-pager-nav"> 부모를 찾음
        const clickedNavLink = target.closest('a.board-pager-nav');

        if (clickedNavLink && clickedNavLink.hasAttribute('data-news-id')) {
            event.preventDefault(); // 중요: <a> 태그의 기본 동작 (페이지 이동)을 막음

            const newsId = clickedNavLink.dataset.newsId; // 부모 <a>에서 newsId 가져옴
            updateModalContent(newsId); // 모달 내용만 업데이트 (모달은 이미 열려있으므로 닫히지 않음)
        }
    });
}

/***********************************************************
 *  Section2: 미래교육
************************************************************/
function updateNumbering(swiper) {
    const numberingEl = document.querySelector('.main-edu-swiper .swiper-numbering');
    if (!numberingEl) return;

    const current = swiper.realIndex + 1;
    const total = swiper.slides.length - (swiper.loopedSlides * 2);

    while (numberingEl.firstChild) {
        numberingEl.removeChild(numberingEl.firstChild);
    }

    const currentTextNode = document.createTextNode(`${current} / `);
    const totalSpan = document.createElement('span');
    totalSpan.classList.add('total');
    totalSpan.textContent = total;

    numberingEl.appendChild(currentTextNode);
    numberingEl.appendChild(totalSpan);
}

let mainEduSwiper; // Swiper 인스턴스를 저장할 전역 변수
function initMainEduSwiper(){
    const swiperOptions = {
        threshold: 3,
        slidesPerView: 1.1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: ".main-edu-swiper .swiper-button-next",
            prevEl: ".main-edu-swiper .swiper-button-prev",
        },
        pagination: {
            el: ".main-edu-swiper .swiper-pagination",
            clickable: false,
            type: 'bullets',
        },
        on: {
            init: function () {
                updateNumbering(this);
            },
            slideChange: function () {
                updateNumbering(this);
            },
        },
        breakpoints: {
            // 720 ~
            720: {
                slidesPerView: 'auto',
                spaceBetween: 0,
            },
            // 1024 ~ (pc 최적화)
            1024: {
                slidesPerView: 'auto',
                spaceBetween: 100,
            },
        }

    };

    const swiperContainerEl = document.querySelector(".main-edu-swiper"); // Swiper HTML 요소 캐싱
    mainEduSwiper = new Swiper(swiperContainerEl, swiperOptions);
}

function initYoutubePopupFeature() {
    const youtubeLinks = document.querySelectorAll('.youtube-link');
    const youtubePopup = document.querySelector('.youtubePopup');
    const iframe = youtubePopup.querySelector('iframe');
    const youtubeCloseBtn = youtubePopup.querySelector('.youtube-close');
    const dimmer = youtubePopup.querySelector('.dimmer');

    // getYouTubeVideoId 함수는 더 이상 필요 없으므로 제거됨

    function showYoutubePopup(videoId) { // videoId를 직접 인자로 받음
        $(youtubePopup).fadeIn("fast");
        if (videoId) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            youtubePopup.classList.add('is-active');
        } else {
            console.warn('유효한 YouTube 비디오 ID가 아닙니다:', videoId);
        }
    }

    function hideYoutubePopup() {
        youtubePopup.classList.remove('is-active');
        iframe.src = '';
        $(youtubePopup).fadeOut("fast");
    }

    youtubeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // data-youtube-id 속성에서 비디오 ID를 직접 가져옴
            const videoId = e.currentTarget.dataset.youtubeId;
            showYoutubePopup(videoId); // ID를 직접 전달
        });
    });

    youtubeCloseBtn.addEventListener('click', hideYoutubePopup);
    dimmer.addEventListener('click', hideYoutubePopup);
}


/***********************************************************
 *  Section3: Y클라우드
************************************************************/
function initMainCloud(){
    const mainCloudContainers = document.querySelectorAll('.main-cloud-swiper');
    mainCloudContainers.forEach(container => {
        let originalRealIndexOnHover = -1; // 호버 시점의 실제 슬라이드 인덱스를 저장할 변수

        const mainCloud = new Swiper(container, {
            effect: 'flip',
            loop: true,
            flipEffect: {
                shadow: false,
                shadowOffset: 20,
                shadowScale: 0.8,
                slideShadows: true,
            },
            allowTouchMove: false,
        });
        container.addEventListener('mouseenter', () => {
            originalRealIndexOnHover = mainCloud.realIndex;
            mainCloud.slideNext(500);
        });

        container.addEventListener('mouseleave', () => {
            // console.log('마우스 이탈: 원래 슬라이드로 복귀 (큐브 효과 유지)');

            // 호버 이탈 시 이전에 저장된 originalRealIndexOnHover로 복귀
            // slideToLoop(index, speed)
            if (originalRealIndexOnHover !== -1) { // 저장된 인덱스가 있을 경우에만
                 mainCloud.slideToLoop(originalRealIndexOnHover, 500); // 500ms 동안 애니메이션
                 originalRealIndexOnHover = -1; // 인덱스 초기화 (다음 호버를 위해)
            }
            // console.log(`[${container.id || container.className}] 복귀 후 현재 슬라이드 인덱스: ${mainCloud.realIndex}`);
        });
    });
}

/***********************************************************
 *  Section4: 에듀테크
************************************************************/
function initGsapInfiniteScroll(container) {
    if (!container) {
        console.error(`Error: Invalid container element provided.`);
        return;
    }

    const initialItems = Array.from(container.querySelector('.main-edutech-wrapper').querySelectorAll('.main-edutech-item'));
    if (initialItems.length === 0) {
        console.error(`Error: No initial scroll items found inside wrapper.`);
        return;
    }

    const direction = container.dataset.direction;
    const speedSeconds = parseFloat(container.dataset.speed) || 5;

    let scrollTimeline = null;
    const createAndStartAnimation = () => {
        const scrollWrapper = container.querySelector('.main-edutech-wrapper');
        if (!scrollWrapper) {
            console.error(`Error: Scroll wrapper not found inside container.`);
            return;
        }

        // 기존 타임라인이 있다면 kill하여 리소스 해제
        if (scrollTimeline) {
            scrollTimeline.kill();
            scrollTimeline = null;
        }

        // 1. 아이템 동적 복제 및 래퍼 너비 계산
        // 기존에 복제된 아이템들을 제거하고 원본 아이템들만 남김
        while (scrollWrapper.firstChild) { // 래퍼 내부의 모든 자식 요소를 안전하게 제거
            scrollWrapper.removeChild(scrollWrapper.firstChild);
        }
        // 첫 번째 세트의 아이템 클론들을 먼저 추가합니다.
        initialItems.forEach(item => scrollWrapper.appendChild(item.cloneNode(true)));

        // 이제 scrollWrapper에 추가된 클론들을 기반으로 singleSetWidth를 계산합니다.
        const firstSetOfClonedItems = Array.from(scrollWrapper.querySelectorAll('.main-edutech-item')).slice(0, initialItems.length);

        let singleSetWidth = 0;
        firstSetOfClonedItems.forEach((item, idx) => {
            const itemStyle = window.getComputedStyle(item);
            const marginRight = parseFloat(itemStyle.marginRight);
            singleSetWidth += item.offsetWidth + marginRight;
        });
        // console.log(`[CREATE] singleSetWidth: ${singleSetWidth}`);

        const containerWidth = container.offsetWidth;
        // console.log(`[CREATE] containerWidth: ${containerWidth}`);

        // numCopies 계산은 singleSetWidth가 정상화되면 자동으로 해결됩니다.
        const numCopies = Math.ceil(containerWidth * 2 / singleSetWidth) + 1;
        // console.log(`[CREATE] numCopies: ${numCopies}`);

        // 나머지 필요한 수량의 아이템들을 추가합니다.
        for (let i = 0; i < numCopies; i++) {
            initialItems.forEach(item => {
                scrollWrapper.appendChild(item.cloneNode(true));
            });
        }

        // 모든 아이템을 한 줄에 배치하기 위한 wrapper의 최종 너비 계산
        const allCurrentItems = Array.from(scrollWrapper.querySelectorAll('.main-edutech-item'));
        let totalWrapperWidth = 0;
        allCurrentItems.forEach(item => {
            const itemStyle = window.getComputedStyle(item);
            const marginRight = parseFloat(itemStyle.marginRight);
            totalWrapperWidth += item.offsetWidth + marginRight;
        });
        scrollWrapper.style.width = totalWrapperWidth + 'px';
        // console.log(`[CREATE] Final Wrapper Width: ${scrollWrapper.style.width}`);

        // 2. 애니메이션 정의 및 타임라인 생성
        let startX, endX; // 애니메이션의 시작과 끝 지점

        if (direction === 'forward') {
            startX = 0;
            endX = -singleSetWidth; // 왼쪽으로 한 세트 너비만큼 이동
            gsap.set(scrollWrapper, { x: startX }); // 시작 위치 설정
        } else if (direction === 'reverse') {
            // 역방향일 경우 시작 위치를 맨 오른쪽으로 이동시켜야 함
            startX = -singleSetWidth; // 역방향 시작점 (음수)
            endX = 0; // 0까지 이동
            gsap.set(scrollWrapper, { x: startX }); // 시작 위치 설정
        } else {
            // console.error(`Error: Invalid direction '${direction}' for container. Use 'forward' or 'reverse'.`);
            return;
        }

        // GSAP 타임라인 생성
        scrollTimeline = gsap.timeline({
            repeat: -1, // 무한 반복
            ease: "none", // 일정한 속도
            onRepeat: () => {
                // 애니메이션이 한 바퀴 돌고 반복될 때마다 실행됩니다.
                // 이 시점에 x 값을 시작점으로 '점프'시킵니다.
                gsap.set(scrollWrapper, { x: startX });
            }
        });

        // 애니메이션 추가
        scrollTimeline.to(scrollWrapper, {
            x: endX, // 목표 지점
            duration: speedSeconds,
            ease: "none"
        });

        // 초기 재생
        scrollTimeline.play();

        // initYoutubeThumbnails();
    };

    createAndStartAnimation();
    container.addEventListener('mouseenter', () => {
        if (scrollTimeline) scrollTimeline.pause();
    });

    container.addEventListener('mouseleave', () => {
        if (scrollTimeline) scrollTimeline.play();
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createAndStartAnimation();
        }, 200);
    });
}

function initMainEduTechPC(){
    // DOM 콘텐츠가 모두 로드된 후 모든 스크롤 초기화
    const allScrollContainers = document.querySelectorAll('.main-edutech-scroll');
    allScrollContainers.forEach(container => {
        initGsapInfiniteScroll(container);
    });

    // Object 이미지
    gsap.to(".object-group.only-pc .object-01", {
        yPercent: -40, // 오브젝트 높이의 50%만큼 위로 이동
        duration: 2.5,   // 2초 동안 애니메이션
        ease: "sine.inOut", // 부드러운 시작과 끝
        yoyo: true,    // 애니메이션이 끝나면 역방향으로 재생 (다시 제자리로)
        repeat: -1,    // 무한 반복 (-1은 무한대)
    });
    gsap.fromTo(".object-group.only-pc .object-02",
    { yPercent: -30 }, // 시작 위치: 현재보다 30% 위 (이동할 범위의 가장 위)
    {
        yPercent: 30,    // 끝 위치: 현재보다 30% 아래 (이동할 범위의 가장 아래)
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,      // 애니메이션이 끝나면 역방향으로 재생 (-30% <-> +30%)
        repeat: -1,
    }
    );
    gsap.fromTo(".object-group.only-pc .object-03",
    { yPercent: 40 }, // 시작 위치: 현재보다 40% 아래 (이동할 범위의 가장 아래)
    {
        yPercent: -40,   // 끝 위치: 현재보다 40% 위 (이동할 범위의 가장 위)
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
    }
    );
    gsap.to(".object-group.only-pc .object-04", {
        yPercent: 25,  // 오브젝트 높이의 50%만큼 아래로 이동
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
    });
}

let mainEduTechSwiper;
function initMainEduTechMobile() {
    const swiperOptions = {
        threshold: 3,
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        pagination: {
            el: ".main-edutech-swiper .swiper-pagination",
            clickable: false,
            type: 'bullets',
        },
    };

    const swiperContainerEl = document.querySelector(".main-edutech-swiper"); // Swiper HTML 요소 캐싱
    mainEduTechSwiper = new Swiper(swiperContainerEl, swiperOptions);

    // Object 이미지
    gsap.to(".object-group.only-mobile .object-01", {
        yPercent: -40, // 오브젝트 높이의 50%만큼 위로 이동
        duration: 2.5,   // 2초 동안 애니메이션
        ease: "sine.inOut", // 부드러운 시작과 끝
        yoyo: true,    // 애니메이션이 끝나면 역방향으로 재생 (다시 제자리로)
        repeat: -1,    // 무한 반복 (-1은 무한대)
    });
    gsap.to(".object-group.only-mobile .object-02", {
        yPercent: 25,  // 오브젝트 높이의 50%만큼 아래로 이동
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
    });
}

function initMainEduTech(){
    initMainEduTechPC();
    initMainEduTechMobile();
}

/***********************************************************
 *  Section5: 2022개정 교육과정 모바일
************************************************************/
function initEduBooks() {
    const classBookModalElement = document.getElementById('classBookModal');
    let classBookModal;

    if (classBookModalElement) {
        classBookModal = new bootstrap.Modal(classBookModalElement);
    }

    window.addEventListener('resize', function() {
        if (classBookModal && classBookModalElement.classList.contains('show') && window.innerWidth <= 1024) {
            classBookModal.hide();
            setTimeout(function(){
                const section5 = document.getElementById('section5');
                if (section5) {
                    const offset = 50;
                    const elementRect = section5.getBoundingClientRect();
                    const scrollPosition = window.pageYOffset + elementRect.top - offset;
                    window.scrollTo({top: scrollPosition, behavior: 'smooth'});
                }
            }, 500)
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Section1 Init
    initNewsSwiper();
    initNewsBoard();

    // Section2 Init
    initMainEduSwiper();
    initYoutubePopupFeature();
    // initMainEdu();

    // Section3 Init
    initMainCloud();

    // Section4 Init
    initMainEduTech();

    // Section5 Init
    initEduBooks();

    // 곻통 Init
    // initYoutubeThumbnails();

});
