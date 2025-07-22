/***********************************************************
 *  Section1: 최근소식
************************************************************/
let mainNewsSwiper; // Swiper 인스턴스를 저장할 전역 변수
function initializeNewsSwiper(){
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
            clickable: false,
            type: 'bullets',
        },
    };

    const swiperContainerEl = document.querySelector(".news-swiper"); // Swiper HTML 요소 캐싱
    mainNewsSwiper = new Swiper(swiperContainerEl, swiperOptions);
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
function initializeMainEduSwiper(){
    const swiperOptions = {
        threshold: 3,
        slidesPerView: 1.1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: ".main-edu-swiper .swiper-button-prev",
            prevEl: ".main-edu-swiper .swiper-button-next",
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

/***********************************************************
 *  Section3: Y클라우드
************************************************************/
function initializeMainCloud(){
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

        // 호버 이벤트 리스너 추가
        container.addEventListener('mouseenter', () => {
            // console.log('마우스 진입: 다음 슬라이드로 이동 (큐브 효과 유지)');

            // 호버 전의 현재 슬라이드 인덱스 저장 (loop 모드에서는 realIndex 사용)
            originalRealIndexOnHover = mainCloud.realIndex;
            // console.log(`[${container.id || container.className}] 원래 슬라이드 인덱스: ${originalRealIndexOnHover}`);

            // 다음 슬라이드로 이동
            mainCloud.slideNext(500); // 500ms 동안 애니메이션
            // console.log(`[${container.id || container.className}] 이동 후 현재 슬라이드 인덱스: ${mainCloud.realIndex}`);
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
// GSAP를 이용한 무한 스크롤 애니메이션을 초기화하는 함수
function initGsapInfiniteScroll(container) {
    // console.log(`[INIT] initGsapInfiniteScroll 호출:`, container); // 디버깅용 로그

    if (!container) {
        console.error(`Error: Invalid container element provided.`);
        return;
    }

    // 원본 아이템들을 저장해둘 변수 (리사이즈 시 필요)
    // initGsapInfiniteScroll 함수 스코프 내에서 유지되어야 함
    const initialItems = Array.from(container.querySelector('.main-edutech-wrapper').querySelectorAll('.main-edutech-item'));
    if (initialItems.length === 0) {
        console.error(`Error: No initial scroll items found inside wrapper.`);
        return;
    }

    const direction = container.dataset.direction;
    const speedSeconds = parseFloat(container.dataset.speed) || 5;

    let scrollTimeline = null; // 타임라인 인스턴스를 외부에 선언하여 재사용 가능하게 함

    // 애니메이션을 생성하고 시작하는 내부 함수
    // 리사이즈 시 이 함수를 다시 호출하여 애니메이션을 재계산하고 시작
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
    };

    // 초기 애니메이션 시작
    createAndStartAnimation();

    // 호버 시 멈추고, 호버 해제 시 재생 유지
    container.addEventListener('mouseenter', () => {
        // console.log(`마우스 진입 (${direction} 스크롤): 일시 정지`);
        if (scrollTimeline) scrollTimeline.pause();
    });

    container.addEventListener('mouseleave', () => {
        // console.log(`마우스 이탈 (${direction} 스크롤): 다시 재생`);
        if (scrollTimeline) scrollTimeline.play();
    });

    // 리사이즈 이벤트 리스너 추가
    // 성능을 위해 디바운싱 적용
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // console.log(`창 리사이즈 감지 (${direction} 스크롤): 애니메이션 재계산`);
            createAndStartAnimation(); // 애니메이션 재시작
        }, 200); // 200ms 후에 실행
    });
}

function initializeMainEduTechPC(){
    // DOM 콘텐츠가 모두 로드된 후 모든 스크롤 초기화
    const allScrollContainers = document.querySelectorAll('.main-edutech-scroll');
    allScrollContainers.forEach(container => {
        initGsapInfiniteScroll(container);
    });

    // Youtube
    // 페이지의 모든 .main-edutech-link 요소를 선택한다.
    const edutechLinks = document.querySelectorAll('.main-edutech-link');

    // 각 링크 요소에 대해 반복하며 기능을 추가한다.
    edutechLinks.forEach(link => {
        // 현재 링크 요소 내부에서 재생 버튼, iframe 컨테이너, 초기 썸네일 요소를 찾는다.
        const btnPlay = link.querySelector('.btn-play'); // 실제 재생 버튼
        const youtubeThumbContainer = link.querySelector('.youtube-thumb'); // iframe을 감싸는 div
        const initialThumb = link.querySelector('.main-edutech-thumb'); // 유튜브 영상 재생 전 보이는 썸네일 이미지 영역
        const iframeElement = youtubeThumbContainer ? youtubeThumbContainer.querySelector('iframe') : null; // 미리 HTML에 있는 iframe 요소

        // 만약 재생 버튼이나 iframe 요소를 찾지 못했다면, 이 링크는 스킵한다.
        if (!btnPlay || !iframeElement) {
            console.warn('경고: 재생 버튼 또는 iframe 요소를 찾을 수 없습니다. (데이터 ID: ' + link.dataset.youtubeId + ')');
            return;
        }

        link.addEventListener('mouseleave', () => {
            // 마우스가 링크 영역 밖으로 나가면 'is-hovered' 클래스를 제거한다.
            // 이 클래스 제거로 CSS에서 오버레이를 다시 숨길 수 있다.
            youtubeThumbContainer.classList.remove('is-playing');
            // ⭐ 중요: 여기서 is-playing 클래스는 제거하지 않는다. ⭐
            // (사용자가 직접 닫지 않는 한 영상은 계속 재생되거나 표시 상태 유지)
        });

        // 2. 재생 버튼 클릭 이벤트: 유튜브 영상 재생 시작
        btnPlay.addEventListener('click', (event) => {
            // a 태그의 기본 동작(링크 이동)을 막는다.
            event.preventDefault();
            // 이벤트 버블링(부모 요소로 이벤트 전파)을 막아 불필요한 동작을 방지한다.
            event.stopPropagation();

            const youtubeId = link.dataset.youtubeId; // 'data-youtube-id' 속성에서 유튜브 영상 ID를 가져온다.

            // 유튜브 ID가 없으면 재생하지 않고 종료한다.
            if (!youtubeId) {
                console.error('오류: 유튜브 영상 ID가 설정되지 않았습니다.');
                return;
            }

            youtubeThumbContainer.classList.add('is-playing');
            // iframe의 src 속성을 동적으로 변경하여 유튜브 영상을 로드하고 자동 재생 설정
            // - controls=0: 플레이어 컨트롤러를 숨김
            // - autoplay=1: 자동 재생
            // - mute=1: 크롬 등 브라우저 정책상 자동 재생은 음소거 상태에서만 허용될 수 있다.
            // - loop=1&playlist=${youtubeId}: 영상을 반복 재생하려면 'loop=1'과 함께 'playlist' 파라미터에 현재 영상 ID를 넣어줘야 한다.
            iframeElement.src = `https://www.youtube.com/embed/${youtubeId}?controls=0&autoplay=1&mute=1&loop=1&playlist=${youtubeId}`;

            // 최상위 main-edutech-link 요소에 'is-playing' 클래스를 추가한다.
            // 이 클래스로 CSS에서 초기 썸네일 숨기고 유튜브 영상(iframe)을 표시한다.
            console.log(`유튜브 영상 재생 시작: ${youtubeId}`);
        });
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

let mainEduTechSwiper; // Swiper 인스턴스를 저장할 전역 변수
function initializeMainEduTechMobile() {
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

function initializeMainEduTech(){
    initializeMainEduTechPC();
    initializeMainEduTechMobile();
}

document.addEventListener('DOMContentLoaded', () => {
    // Section1 Init
    initializeNewsSwiper();

    // Section2 Init
    initializeMainEduSwiper();
    // initializeMainEdu();

    // Section3 Init
    initializeMainCloud();

    // Section4 Init
    initializeMainEduTech();
});
