document.addEventListener("DOMContentLoaded", () => {
    /*
     *  Section2: 미래교육
     */
    function updateNumbering(swiper) {
        const numberingEl = document.querySelector('.main-edu-swiper .swiper-numbering');
        if (!numberingEl) return;
        const current = swiper.realIndex + 1;
        const total = swiper.slides.length - (swiper.loopedSlides * 2);
        numberingEl.innerHTML = `${current} / <span class="total">${total}</span>`;
    }

    var mainEduSwiper = new Swiper(".main-edu-swiper .swiper", {
        threshold: 3,
        slidesPerView: 'auto',
        spaceBetween: 120,
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
                $('.main-edu-swiper .swiper').addClass('is-swiping');
            },
            slideChange: function () {
                updateNumbering(this);
            },
        },
    })

    /*
     *  Section3: Y클라우드
     */
    const mainCloudHorSwiper = new Swiper('.main-cloud-swiper.horizontal', {
        effect: 'cube',
        loop: true,
        cubeEffect: {
            shadow: false,
            shadowOffset: 20,
            shadowScale: 0.8,
            slideShadows: true,
        },
    });

    /*
     *  Section4: 에듀테크
     */
    // Youtube 재생
    document.querySelectorAll('.youtube-link').forEach(box => {
        const thumb = box.querySelector('.youtube-thumb');
        const videoId = box.dataset.youtubeId;
        const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        let timeout = null;
        let loaded = false;

        // 초기 썸네일 DOM 저장
        const thumbHTML = `
            <img src="${thumbUrl}" alt="썸네일" />
        `;

        thumb.innerHTML = thumbHTML;

        // 마우스 진입 시: 일정 시간 후 iframe 삽입
        box.addEventListener('mouseenter', () => {
            if (loaded) return;

            timeout = setTimeout(() => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            iframe.title = "YouTube video";
            iframe.allow = "autoplay; encrypted-media";
            iframe.allowFullscreen = true;
            iframe.frameBorder = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";

            thumb.innerHTML = ''; // 썸네일 제거
            thumb.appendChild(iframe);
            loaded = true;
            }, 500); // 0.5초 후 로드
        });

        // 마우스 나갈 시: 타이머 제거 + 썸네일 복원
        box.addEventListener('mouseleave', () => {
            clearTimeout(timeout);

            if (loaded) {
                thumb.innerHTML = thumbHTML;
                loaded = false;
            }
        });
    });

    // GSAP를 이용한 무한 스크롤 애니메이션을 초기화하는 함수
    function initGsapInfiniteScroll(container) {
        if (!container) {
            console.error(`Error: Invalid container element provided.`);
            return;
        }

        const scrollWrapper = container.querySelector('.main-edutech-wrapper');
        if (!scrollWrapper) {
            console.error(`Error: Scroll wrapper not found inside container.`);
            return;
        }

        const initialItems = Array.from(scrollWrapper.querySelectorAll('.main-edutech-item'));
        if (initialItems.length === 0) {
            console.error(`Error: No initial scroll items found inside wrapper.`);
            return;
        }

        // data-direction 속성 읽기
        const direction = container.dataset.direction;
        // data-speed 속성 읽기, 없으면 기본값 5초 사용
        const speedSeconds = parseFloat(container.dataset.speed) || 5;

        // 초기 아이템들의 총 너비 계산 (한 세트의 너비)
        let singleSetWidth = 0;
        initialItems.forEach(item => {
            const itemStyle = window.getComputedStyle(item);
            const marginRight = parseFloat(itemStyle.marginRight);
            singleSetWidth += item.offsetWidth + marginRight;
        });

        // 화면 너비에 따라 몇 세트의 아이템이 필요한지 계산
        // 컨테이너 너비의 최소 2배 정도는 되어야 부드러운 루프 가능
        const containerWidth = container.offsetWidth;
        // const containerWidth = 1920;
        const numCopies = Math.ceil(containerWidth * 2 / singleSetWidth) + 1; // 최소 2세트 + 여유분 1세트

        // 아이템들을 동적으로 복제하여 wrapper에 추가
        // 초기 아이템들을 포함하여 총 numCopies 세트가 되도록
        for (let i = 0; i < numCopies; i++) {
            initialItems.forEach(item => {
                scrollWrapper.appendChild(item.cloneNode(true)); // 깊은 복사
            });
        }

        // 이제 scrollWrapper 안에 있는 모든 아이템들을 다시 선택
        const allItems = Array.from(scrollWrapper.querySelectorAll('.main-edutech-item'));

        // 모든 아이템을 한 줄에 배치하기 위한 wrapper의 최종 너비 계산
        let totalWrapperWidth = 0;
        allItems.forEach(item => {
            const itemStyle = window.getComputedStyle(item);
            const marginRight = parseFloat(itemStyle.marginRight);
            totalWrapperWidth += item.offsetWidth + marginRight;
        });
        scrollWrapper.style.width = totalWrapperWidth + 'px';


        // GSAP 애니메이션 정의
        let animationTargetX;
        let resetX; // 재배치될 X 값
        if (direction === 'forward') {
            animationTargetX = -singleSetWidth; // 왼쪽으로 한 세트 너비만큼 이동
            resetX = 0; // 초기 위치로 리셋 (실제로는 재배치)
        } else if (direction === 'reverse') {
            // 역방향일 경우 시작 위치를 맨 오른쪽으로 이동시켜야 함
            gsap.set(scrollWrapper, { x: -totalWrapperWidth + containerWidth }); // 시작 위치 조정
            animationTargetX = 0; // 오른쪽으로 이동 (0까지)
            resetX = -singleSetWidth; // 리셋될 X 값
        } else {
            console.error(`Error: Invalid direction '${direction}' for container. Use 'forward' or 'reverse'.`);
            return;
        }

        // 애니메이션 타임라인 생성
        const scrollTimeline = gsap.timeline({
            repeat: -1, // 무한 반복
            ease: "none", // 일정한 속도
            onUpdate: () => {
                // 애니메이션이 진행될 때마다 호출되는 콜백
                const currentX = gsap.getProperty(scrollWrapper, "x");

                if (direction === 'forward') {
                    // 왼쪽으로 스크롤 중, 첫 번째 세트가 화면을 벗어나면 맨 뒤로 재배치
                    if (currentX <= -singleSetWidth) {
                        gsap.set(scrollWrapper, { x: currentX + singleSetWidth }); // X 값을 한 세트 너비만큼 이동
                    }
                } else if (direction === 'reverse') {
                    // 오른쪽으로 스크롤 중, 마지막 세트가 화면을 벗어나면 맨 앞으로 재배치
                    // 이 부분은 좀 더 복잡한 계산이 필요할 수 있음.
                    // 간단하게는 일정 X 값 이상이 되면 다시 뒤로 보내는 방식으로 구현
                    if (currentX >= 0) {
                        gsap.set(scrollWrapper, { x: currentX - singleSetWidth }); // X 값을 한 세트 너비만큼 이동
                    }
                }
            }
        });

        // 애니메이션 추가
        scrollTimeline.to(scrollWrapper, {
            x: (direction === 'forward') ? "-=" + singleSetWidth : "+=" + singleSetWidth, // 상대적인 이동
            duration: speedSeconds,
            ease: "none"
        });

        // 초기 재생
        scrollTimeline.play();

        // 호버 시 멈추고, 호버 해제 시 재생 유지
        container.addEventListener('mouseenter', () => {
            console.log(`마우스 진입 (${direction} 스크롤): 일시 정지`);
            scrollTimeline.pause();
        });

        container.addEventListener('mouseleave', () => {
            console.log(`마우스 이탈 (${direction} 스크롤): 다시 재생`);
            scrollTimeline.play();
        });
    }

    // DOM 콘텐츠가 모두 로드된 후 모든 스크롤 초기화
    const allScrollContainers = document.querySelectorAll('.main-edutech-scroll');
    allScrollContainers.forEach(container => {
        initGsapInfiniteScroll(container); // 함수 호출 시 컨테이너 DOM 요소 직접 전달
    });
})
