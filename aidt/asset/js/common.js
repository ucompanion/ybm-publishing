const md_ = ()=> /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
const pageContainer = document.querySelector(".container");
const bWidth = window.innerWidth;

// AOS
AOS.init({
	duration: 800,
	// disable: 'tablet',
})
window.addEventListener('load', function () {
	AOS.refresh();
});

let observer = new IntersectionObserver( (entries, observer) => {
	entries.forEach(entry => {
			if (entry.isIntersecting){
					entry.target.classList.add('aos-animate');
			} else {
					entry.target.classList.remove('aos-animate');
			}
	});
});
document.querySelectorAll('[data-aos]').forEach(aosElem => {
	observer.observe(aosElem)
});


 $(window).resize(function(){
    if(md_()){
        $('.wrap').addClass('mob');
        $('.wrap>div').css('min-height','0');
    }else{
        if(this.window.innerWidth >= 1024){
            $('.wrap').removeClass('mob');
            this.setTimeout(()=>{
                ScrollTrigger.refresh();
            },100);
        }else{
            $('.wrap').addClass('mob');
        }
    }
}).resize();

// header navbox button
function menu_toggle() {
	$("html").toggleClass("hidden");
	$(".header").toggleClass("active");
	$(".menu_icon .menu_linebox").toggleClass("open");
}

$(document).ready(function () {
    /*모바일 높이*/
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + 'px');
    $(window).resize(function () {
        document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + 'px');
    });

    /*header*/
    $('.header nav').mouseenter(function(){
        $('.header').addClass('on');
    }).mouseleave(function(){
        $('.header').removeClass('on');
		//$(".menu_icon .menu_linebox").removeClass("open");
    });
});

// tab function
$(document).ready(function () {
	$(".tab_nav").click(function () {
        if ($(this).hasClass('type_link') === false) {
            let target = $(this);
            let tabNavbox = target.closest('ul')
            let tabNav = tabNavbox.find(".tab_nav");
            let idx = tabNav.index(this);
            let tabWrap = tabNavbox.closest("div");
            let tabContbox = tabWrap.find(".tab_contbox");
            let tabCont = tabContbox.find(".tab_cont");
            tabNav.removeClass("on");
            tabNav.eq(idx).addClass("on");
            tabCont.removeClass("on");
            tabCont.eq(idx).addClass("on");

            const hideId = target.data('hide-id');
            if (hideId) {
                $('#' + hideId).removeClass('on');
            }

            const showId = target.data('show-id');
            if (showId) {
                $('#' + showId).addClass('on');
                console.log(`ID '${showId}'에 'on' 클래스 추가됨.`);
            }

            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }
	})

	let firstTabDimensions = {}; // 첫 번째 탭의 이미지 크기를 저장할 객체
    let firstImage = $(".tab_content.active .zoom_org .original img"); // 첫 번째 탭의 이미지 선택
    if (firstImage.length > 0) {
        firstTabDimensions.width = firstImage.width();
        firstTabDimensions.height = firstImage.height();
    }
   $(".tab_content .zoom_org .original img").not(".tab_content.active .zoom_org .original img").each(function () {
        $(this).css({
            width: firstTabDimensions.width + "px",
            height: firstTabDimensions.height + "px"
        });
    });



//서브페이지 탭
	$(".tab").click(function () {
		let target = $(this);
		let tabNavbox = target.closest('.tabs')
		let tabNav = tabNavbox.find(".tab")
		let idx = tabNav.index(this);
		let tabWrap = tabNavbox.closest(".tab_bx");
		let tabContbox = tabWrap.find(".tab_content_g");
		let tabCont = tabContbox.find(".tab_content");
		tabNav.removeClass("on")
		tabNav.eq(idx).addClass("on")
		tabCont.removeClass("active")
		tabCont.eq(idx).addClass("active")

	})

});


const ms_interview = new Swiper('.interview_g', {
  //effect: 'fade',
  loop: false,
  speed: 500,
  navigation: {
    nextEl: '.interview_g .next_btn',
    prevEl: '.interview_g .prv_btn',
  },
});



const sb_tab01 = new Swiper('.benefit_g', {
  //effect: 'fade',
  loop: false,
  speed: 500,
  navigation: {
    nextEl: '.benefit_g .next_btn',
    prevEl: '.benefit_g .prv_btn',
  },
});


/*const zoom =$('.sb_sec3 .tab_bx .img').on('mouseenter', function() {
    const rect = this.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    $(this).off('mousemove').on('mousemove', function(e) {
        const xPos = (e.clientX - rect.left) / width * 100;
        const yPos = (e.clientY - rect.top) / height * 100;
        $(this).css('--x', xPos + '%');
        $(this).css('--y', yPos + '%');
		$('.sb_sec3 .zoom').fadeOut();
    });
	 $(this).on('mouseout', function() {
    $('.sb_sec3 .zoom').fadeIn();
	});

});*/



$(document).ready(function () {
	if ($('.faq_g').length < 1) {
        return;
    }
	$(".faq_g").accord({
		independentPanels:!1,
		//independentPanels: true,
		auto: true,
		itemSelector: ".faq",
		headingSelector: ".f",
		panelSelector: ".a"
	});
});

//유튜브
$(window).resize(function(){resizeYoutube();});
$(function(){resizeYoutube();});
function resizeYoutube(){
	$("iframe").each(function(){
		if( /^https?:\/\/www.youtube.com\/embed\//g.test($(this).attr("src")) ){
			$(this).css({"width":"100%", "height":"100%"});
		}
	});
}


    //좌측 플로팅 배너 (섹션네비)
    var $menuItems = $('.float_box1 a');
    $(window).on('scroll', function() {
        var scrollTop = $(window).scrollTop();
        var activeSection = '';

        $('section[class^="sb_"]').each(function() {
            var sectionTop = $(this).offset().top - 80;
            var sectionBottom = sectionTop + $(this).outerHeight();

            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                activeSection = $(this).attr('id');
            }
        });

        $menuItems.each(function() {
            var $this = $(this);
            var targetSection = $this.attr('href').substring(1); // '#section1'에서 'section1' 추출
            if (targetSection === activeSection) {
                $menuItems.closest('li').removeClass('active');
                $this.closest('li').addClass('active');
            }
        });
    });

// Go to top
var $btnTop = $('<div class="topbtn"><button type="button"><span>TOP</span></button></div>').appendTo('.wrap');
$btnTop.find('>button').click(function() {
	$('html').animate({
		scrollTop : '0px'}, 300, 'swing');
		return false;
	});


// animation effect
    function hdScroll() {
        var subScrollTop = $(window).scrollTop();
        var subScrollHeight = $(window).height();
        var subScrollbtm = subScrollTop + subScrollHeight;

         if(subScrollTop >  $(window).innerHeight() + 100){
            $('.topbtn').addClass("fixed").removeAttr('style');

		if(subScrollbtm > ($(document).height() - $("footer").height())){
			$(".topbtn").addClass("noFix").css('bottom',$("footer").height() + 50);
		} else {
			$(".topbtn").removeClass("noFix").removeAttr('style');
		}

        }else{
            $('.topbtn').removeClass("fixed").removeAttr('style');
        }
	}



 $(window).scroll(function(){
        hdScroll()
 });


//토글 레이어

	$('.btn_family').each(function () {
			var ui = $(this).parent();
            var lobt = $(this);
            var toplayer = ui.find(".family_list");
		   //var close = toplayer.find(".bt_close");
            lobt.on("click", function (_e) {
                toplayer.toggle().toggleClass("on");
                _e.stopPropagation();
            });
           toplayer.click(function (_e) {
                _e.stopPropagation();
            });
			/*close.click(function () {
                toplayer.hide().removeClass("on");
			});*/
			$(document).mouseup(function (e){
			  if(toplayer.has(e.target).length === 0){
				toplayer.hide().removeClass("on");
			  }
			});
        });




$(document).ready(function () {
if ($('.sb_sec3 ').length < 1) {
        return;
    }

if (window.innerWidth > 1023){
   $('.zoom_org .original img').zoom(3);
//zoomimg();
}else{
	$('.zoom_org .original img').on('click', function(){
    simpleLightbox($(this).attr('src'));
});

}
});


(function () {
	if (typeof $ !== "function")
		throw Error('JQuery is not present.');
	var times = 5, handler;
	var init = function () {
		var t = $(this),
			p = t.parent(),
			v = p.next(),
			cs = v.next(),
			iw = v.children();
		zoommove = function(t,x,y){
			var p = t.parent(),
			v = p.next(),
			cs = v.next(),
			iw = v.children();
			var [w, h] = ['width', 'height'].map(x => $.fn[x].call(t));
			if(w <= 0) w = $('.sb_sec3 .card_content ').width();
			if(h <= 0) h = p.closest('.card_content').height();
			var nw = w * times, nh = h * times, cw = w / times, ch = h / times;
			var rx = cw / 2,
			ry = ch / 2,
			cx = x - rx,
			cy = y - ry,
			canY = cy >= 0 && cy <= h - ch,
			canX = cx >= 0 && cx <= w - cw
			cs.css({
				top: canY ? cy : cy < 0 ? 0 : h - ch,
				left: canX ? cx : cx < 0 ? 0 : w - cw,
			});
			iw.css({
				top: canY ? -cy / (h - ch) * (nh - h) : cy < 0 ? 0 : -(nh - h),
				left: canX ? -cx / (w - cw) * (nw - w) : cx < 0 ? 0 : -(nw - w)
			});
		}
		magnifier = function(p){
			p.closest('.card_content').find('.zoom_minimap .magnifier').css({
				top: p.closest('.zoom_org').find('.magnifier').css('top'),
				left: p.closest('.zoom_org').find('.magnifier').css('left')
			});
		}
		handler = function (e) {
			var [w, h] = ['width', 'height'].map(x => $.fn[x].call(t));
			if(w <= 0) w = $('.sb_sec3 .tab_bx').width();
			if(h <= 0) h = p.closest('.card_content').height();
			var nw = w * times, nh = h * times, cw = w / times, ch = h / times;
			var eventMap = {
				mousemove: function (e) {
					e = e.originalEvent;
					//var x = (e.layerX  > 0)? e.layerX : (e.layerX + w > 0)? e.layerX + w : e.layerX + (w*2);
					var bcr = e.target.getBoundingClientRect();
					var x = e.clientX - bcr.x;
					var y = e.clientY - bcr.y;
					magnifier(p);
					zoommove(t,x,y);
				},
				mouseover: function(){
					p.closest('.card_content').find('.zoom_minimap').html(p.closest('.zoom_org').html()).fadeIn(500);
					$('.sb_sec3 .zoom').stop().fadeOut(800);
				},
				mouseout: function(){
					$('.zoom_minimap').hide();
					$('.sb_sec3 .zoom').stop().fadeIn(800);
				},
				touchmove: function(e){
					e = e.originalEvent;
					$('.original:hover~div').show();
					var bcr = e.target.getBoundingClientRect();
					var x = e.targetTouches[0].clientX - bcr.x;
					var y = e.targetTouches[0].clientY - bcr.y;
					magnifier(p);
					zoommove(t,x,y);
				},
				touchstart: function(e){
					e = e.originalEvent;
					p.closest('.card_content').find('.zoom_minimap').html(p.closest('.zoom_org').html()).fadeIn(500);

					$('.original:hover~div').show();
					$('.sb_sec3 .zoom').stop().fadeOut(800);
				},
				touchend: function(){
					$('.zoom_minimap').hide();
					$('.original:hover~div').hide();
					$('.sb_sec3 .zoom').stop().fadeIn(800);
				}
			};
			p.width(w).height(h);
			cs.width(cw).height(ch);
			iw.width(nw).height(nh);
			for (let k in eventMap)
				p.on(k, eventMap[k]);
		};
		handler();
	};
	$.fn.extend({
		zoom: function (t) {
			times = t || times;
			if(times <= 1) return this;
			for (let x of this)
				init.call(x);
			return this;
		},
		setZoom: function (t) {
			times = t || times;
			if (handler === void 0)
				throw Error('Zoom not initialized.');
			handler();
		}
	});
}());



/*function zoomimg(){
	if ($('.sb_sec3 ').length < 1) {
        return;
    }
	$(".sb_sec3 .card_content").each(function() {
		var $ui = $(this);
		var $img = $ui.find('.img>img');
		//$img.hide();
		 //$ui.append('');
		 $ui.prepend('<div class="zoom_minimap"></div><div class="zoom_org"><div class="original"><img src="' + $img.attr("src") + '"  alt=""></div><div class="viewer"><img src="' + $img.attr("src") + '"  alt=""></div><div class=magnifier></div></div>')
	});
}
*/


function play(element){
	$(".vidbox").each(function() {
		var $ui = $(this);
		 $ui.find('video').trigger('play');
		 $ui.find('.btn_play').fadeOut();

	});
}

/*function mvplay(){
	var target = $(this);
	if(target.hasClass(".btn_p")==false){
		$('.jconfirm-type-card .vidbox').hide();
		$('.jconfirm-type-card .chart_g').show();
		$('.jconfirm').addClass('aaa');
	}else {
		$('.jconfirm-type-card .vidbox').show();
		$('.jconfirm-type-card .chart_g').hide();
		$('.jconfirm').addClass('bbb');
}*/









jconfirm.defaults = {
    onOpenBefore: function () {
		$('html').addClass('hidden');

	},
	onClose: function () {$('html').removeClass('hidden');},
	 onOpen: function () {

    },
	onDestroy: function () {$('html').removeClass('hidden');},
    title: false,

}

//영상 레이어
function interview_mv1(){
     $.confirm({
         type: 'interview_mv',
         content:'<h4><span>YBM AI 디지털교과서 미리보기!</span><strong>초등학교 영어 3~4학년군</strong></h4><div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/main/thum_interview01.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/%EC%98%81%EC%96%B43%2C4_%EC%B4%88%EB%93%B1_YBM.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}





function interview_mv2(){
     $.confirm({
         type: 'interview_mv',
         content:'<h4><span>YBM AI 디지털교과서 미리보기!</span><strong>초등학교 수학 3~4학년군</strong></h4><div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/main/thum_interview02.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/%EC%88%98%ED%95%993%2C4_%EC%B4%88%EB%93%B1_YBM.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function interview_mv3(){
     $.confirm({
         type: 'interview_mv',
         content:'<h4><span>YBM AI 디지털교과서 미리보기!</span><strong>고등학교 공통수학1/2</strong></h4><div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/main/thum_interview03.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/%EA%B3%B5%ED%86%B5%EC%88%98%ED%95%991%2C2_%EA%B3%A0%EB%93%B1_YBM.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function interview_mv4(){
     $.confirm({
         type: 'interview_mv',
         content:'<h4><span>YBM AI 디지털교과서 미리보기!</span><strong>중학교 영어1</strong></h4><div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/main/thum_interview04.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/%EC%98%81%EC%96%B41_%EC%A4%91%ED%95%99_YBM.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function interview_mv5(){
     $.confirm({
         type: 'interview_mv',
         content:'<h4><span>YBM AI 디지털교과서 미리보기!</span><strong>고등학교 공통영어1/2</strong></h4><div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/main/thum_interview05.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/%EA%B3%B5%ED%86%B5%EC%98%81%EC%96%B41%2C2_%EA%B3%A0%EB%93%B1_YBM.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function swiper_start(){
    var swiper = new Swiper(".gallery_thum", {
          spaceBetween: 11,
          slidesPerView: 'auto',
          freeMode: true,
          watchSlidesProgress: true,
          direction: "vertical",
        watchSlidesVisibility: true,
        watchOverflow: true,
        breakpoints: {
          480: {
            direction: "vertical",
            slidesPerView: 4
          }
        }
    });
    var swiper2 = new Swiper(".gallery", {
          spaceBetween: 0,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          thumbs: {
            swiper: swiper,
          },
    });
}


	//사진 레이어
function gallery01(){
     $.confirm({
         onOpenBefore: function(){swiper_start();$('html').addClass('hidden');},
         type: 'gallery',
         content:'<h4><span>YBM과 함께하는 미래교실 미리보기!</span><strong>AI 미래교실 세미나</strong></h4><p class="summary">YBM이 전국에 계신 선생님들을 찾아갑니다! 선생님들의 열정에 YBM의 AI 코스웨어를 더해, 미래 교실의 문을 활짝 열었습니다. AI 미래교실 세미나 현장을 함께 만나볼까요?</p><div class="gallery_box"><div class="swiper gallery"><div class="swiper-wrapper"><div class="swiper-slide"><img src="/aidt/img/main/news01_img_00.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news01_img_01.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news01_img_02.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news01_img_03.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news01_img_04.jpg" alt="" /></div></div></div><div thumbsSlider="" class="swiper gallery_thum"><div class="swiper-wrapper"><div class="swiper-slide"><img src="/aidt/img/main/news01_img_00_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news01_img_01_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news01_img_02_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news01_img_03_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news01_img_04_sum.jpg" alt="" /></div></div></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function gallery02(){
     $.confirm({
         onOpenBefore: function(){swiper_start();$('html').addClass('hidden');},
         type: 'gallery',
         content:'<h4><span>충남교육청 영어교육 나눔 한마당!</span><strong>&lang;영어로 미래로&rang; 에서 만난 YBM</strong></h4><p class="summary">AI 코스웨어를 활용한 미래 교실은 어떤 모습일까요? AI가 선생님의 수업에 어떤 도움을 줄 수 있을지 의견을 나누었던 뜻깊은 시간, 지금 만나보세요!</p><div class="gallery_box"><div class="swiper gallery"><div class="swiper-wrapper"><div class="swiper-slide"><img src="/aidt/img/main/news02_img_00.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news02_img_01.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news02_img_02.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news02_img_03.jpg" alt="" /></div></div></div><div thumbsSlider="" class="swiper gallery_thum"><div class="swiper-wrapper"><div class="swiper-slide"><img src="/aidt/img/main/news02_img_00_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news02_img_01_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news02_img_02_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news02_img_03_sum.jpg" alt="" /></div></div></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function gallery03(){
     $.confirm({
         onOpenBefore: function(){swiper_start();$('html').addClass('hidden');},
         type: 'gallery',
         content:'<h4><span>샛별 에듀테크 페어에 찾아온 YBM</span><strong>AI 코스웨어를 활용한 미래교실은?</strong></h4><p class="summary">Y클라우드의 에듀테크 콘텐츠와 YBM의 AI 코스웨어를 활용한 효과적인 수업 방법, 그리고 숨겨진 활용 노하우까지! 샛별 에듀테크 페어 현장을 확인해보세요.</p><div class="gallery_box"><div class="swiper gallery"><div class="swiper-wrapper"><div class="swiper-slide"><img src="/aidt/img/main/news03_img_00.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news03_img_01.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news03_img_02.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news03_img_03.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news03_img_04.jpg" alt="" /></div></div></div><div thumbsSlider="" class="swiper gallery_thum"><div class="swiper-wrapper"><div class="swiper-slide"><img src="/aidt/img/main/news03_img_00_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news03_img_01_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news03_img_02_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news03_img_03_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news03_img_04_sum.jpg" alt="" /></div></div></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div> </div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function gallery04(){
     $.confirm({
         onOpenBefore: function(){swiper_start();$('html').addClass('hidden');},
         type: 'gallery',
         content:'<h4><span>미래교육을 선도하는 YBM</span><strong>2024 에듀테크 코리아 페어</strong></h4><p class="summary">에듀테크 코리아 페어 현장에서 선보인 YBM의 교육 혁신! 새로운 교과서와 최신 에듀테크 트렌드를 담은 강연, 선생님과 학생의 상호작용을 돕는 AI 코스웨어까지!<br>미래 교육을 이끌어가는 YBM 부스를 사진으로 함께 살펴볼까요?</p><div class="gallery_box"><div class="swiper gallery"><div class="swiper-wrapper"><div class="swiper-slide"><img src="/aidt/img/main/news04_img_00.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_01.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_02.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_03.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_04.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_05.jpg" alt="" /></div></div></div><div thumbsSlider="" class="swiper gallery_thum"><div class="swiper-wrapper"><div class="swiper-slide"><img src="/aidt/img/main/news04_img_00_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_01_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_02_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_03_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_04_sum.jpg" alt="" /></div><div class="swiper-slide"><img src="/aidt/img/main/news04_img_05_sum.jpg" alt="" /></div></div></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}



//선생님 동영상

function ex_s1_kim(){
     $.confirm({
         type: 'teach_mv',
         content:'<div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_kim.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/1.%20%EC%B4%88%EB%93%B1%20%EC%98%81%EC%96%B4%28%EA%B9%80%29.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}

function ex_s1_choi(){
     $.confirm({
         type: 'teach_mv',
         content:'<div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_choi.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/2.%20%EC%B4%88%EB%93%B1%20%EC%98%81%EC%96%B4%28%EC%B5%9C%29%20%5B%EC%88%98%EC%A0%95-241204%5D.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}

function ex_s1_ryu(){
     $.confirm({
         type: 'teach_mv',
         content:'<div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_ryu.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/3.%20%EC%B4%88%EB%93%B1%20%EC%88%98%ED%95%99.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}

function ex_s2_kim(){
     $.confirm({
         type: 'teach_mv',
         content:'<div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s2_kim.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/4.%20%EC%A4%91%ED%95%99%20%EC%98%81%EC%96%B4%28%EA%B9%80%29.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}

function ex_s2_park(){
     $.confirm({
         type: 'teach_mv',
         content:'<div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s2_park.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/5.%20%EC%A4%91%ED%95%99%20%EC%98%81%EC%96%B4%28%EB%B0%95%29.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}

function ex_s3_kim(){
     $.confirm({
         type: 'teach_mv',
         content:'<div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s3_kim.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/6.%20%EA%B3%A0%EB%93%B1%20%EA%B3%B5%ED%86%B5%EC%98%81%EC%96%B4%28%EA%B9%80%29.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}

function ex_s3_park(){
     $.confirm({
         type: 'teach_mv',
         content:'<div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s3_park.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/7.%20%EA%B3%A0%EB%93%B1%20%EA%B3%B5%ED%86%B5%EC%98%81%EC%96%B4%28%EB%B0%95%29%20%5B%EC%88%98%EC%A0%95%5D.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}

function ex_s3_ryu(){
     $.confirm({
         type: 'teach_mv',
         content:'<div class="vidbox"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s3_ryu.jpg" controlslist="nodownload" oncontextmenu="return false;"><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/8.%20%EA%B3%A0%EB%93%B1%20%EA%B3%B5%ED%86%B5%EC%88%98%ED%95%99%20%5B%EC%88%98%EC%A0%95-241210%5D.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false,
      });
}


//이미지 크게보기

/*function imgbig(){
var $imgbig = $('.zoom_org .original');
$imgbig.click(function() {
	var target = $(this);
     var $img = target.find('img');
     $.confirm({
         type: 'imgbig',
         content:'',
         onContentReady:function(){
             var self = this;
             self.setContent('<img src="' + $img.attr("src") + '"  alt="' + $img.attr("alt") + '">');
            },
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons: false
      });
});
}*/

function simpleLightbox(imageUrl, bgColor, maxWidth){
    if(typeof bgColor === 'undefined'){
        bgColor = '#000';
    }
    if(typeof maxWidth === 'undefined'){
        maxWidth = '1100px';
    }
    window.open('', 'simpleLightbox').document.write('<html><head><meta name="viewport" content="user-scalable=yes, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, width=device-width" /></head><body style="margin:0;'+bgColor+';height:100%;" onclick="javascript:window.close(\'simpleLightbox\');"><div style="text-align:center"><img style="position:relative;z-index:2;width:100%;max-width:'+maxWidth+';" src="'+imageUrl+'"/></div></body></html>');
}

function scrollToTarget(event) {
    // 특정 위치로 스르륵 이동
    const target = document.querySelector('.sb_sec5');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}


