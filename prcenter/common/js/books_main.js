/***********************************************************
 *  스케치
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
    const initialItems = Array.from(container.querySelector('.sketch-wrapper').querySelectorAll('.sketch-item'));
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
        const scrollWrapper = container.querySelector('.sketch-wrapper');
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
        const firstSetOfClonedItems = Array.from(scrollWrapper.querySelectorAll('.sketch-item')).slice(0, initialItems.length);

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
        const allCurrentItems = Array.from(scrollWrapper.querySelectorAll('.sketch-item'));
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
        const currentX = gsap.getProperty(scrollWrapper, "x");
        const speedPxPerSecond = 60; // 1초에 200px 움직이는 속도 (조정 가능)
        const distance = Math.abs(endX - currentX);
        const calculatedDuration = distance / speedPxPerSecond;
        scrollTimeline.to(scrollWrapper, {
            x: endX,
            duration: calculatedDuration,
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

function initSketchPC(){
    // DOM 콘텐츠가 모두 로드된 후 모든 스크롤 초기화
    const allScrollContainers = document.querySelectorAll('.sketch-scroll');
    allScrollContainers.forEach(container => {
        initGsapInfiniteScroll(container);
    });
}

let sketchSwiper; // Swiper 인스턴스를 저장할 전역 변수
function initSketchMobile() {
    const swiperOptions = {
        threshold: 3,
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        pagination: {
            el: ".sketch-swiper .swiper-pagination",
            clickable: false,
            type: 'bullets',
        },
    };

    const swiperContainerEl = document.querySelector(".sketch-swiper"); // Swiper HTML 요소 캐싱
    sketchSwiper = new Swiper(swiperContainerEl, swiperOptions);
}

function initSketch(){
    initSketchPC();
    initSketchMobile();
}

document.addEventListener('DOMContentLoaded', () => {
    initSketch();
});
