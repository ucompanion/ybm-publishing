
gsap.registerPlugin(ScrollTrigger, ScrollSmoother,ScrollToPlugin);


setTimeout(function () {
  $(".ms1").addClass("animate");
}, 5000);

// 메인비주얼
const sec01 = () => {
// desktop 애니메이션
    function mainSec01(){
        const mainTl = gsap.timeline({
            /*scrollTrigger : {
                trigger : '.ms1',
                pin : true,
				start: "top+=0 top+=0% ",
                pinSpacing: false,
               // markers : true,
                scrub : 1,
				end: "bottom bottom ",
                invalidateOnRefresh : true,
				toggleClass:"act",
				toggleActions: "play none none reverse",
				id:"1"
            }*/
        })	
		
      	
        .to('.ms1_copywrap',1.5,{
            top:'40px',left:'10rem',fontSize:'1.4rem',opacity :1,delay: 1.2,		
        },0.5)        
         .to('.ms1_copywrap',{  
			 duration: 1,
			 
			onReverseComplete : ()=>{               
				$('.ms1_copywrap').show(); 
            },
			onComplete : ()=>{               
				$('.ms1_copywrap').hide(); 
            }
        })
		.to('.ms1_txtwrap', {
             autoAlpha: 1,		
        },'-=1.9')
		.to('.header',{           
			onReverseComplete : ()=>{
                $('.header').addClass('hide'); 				
            },
			onComplete : ()=>{
                $('.header').removeClass('hide');					
            }
        },'-=0.65')
		
		.to('.ms1_txtwrap',3, {
             autoAlpha: 1,		
        })
		
    }

    //적용
    ScrollTrigger.matchMedia({
       "(min-width:821px)" : ()=>{
           if(!md_()){
                /*const height = 100 * 1;
                gsap.set('.ms1',{
                    height : `${height}vh`
                });*/
                mainSec01();
              
           }else{
                $('.ms1').css('height','auto');
			   mainSec01();
                //mobNomarl();
           }
       },
       "(max-width:820px)" : ()=>{
            $('.ms1').css('height','auto');
		   mainSec01();
            //mobNomarl();
       },
    }); 
}
/**********************/
const sec02 = () => {
    function mainSec02(){
        const mainSec02 = gsap.timeline({
            scrollTrigger : {
                trigger : '.ms2',
                pin : true,
                pinSpacing: false,
				start : "top top",               
				end : "-=250%",
                //markers : true,
                scrub : 1,
                invalidateOnRefresh : true,
				id:"2",
				toggleActions: "play none none reverse",
				toggleClass:"act",
            }
        })
		.to('.header',{           
			onReverseComplete : ()=>{
                $('.header').addClass('white'); 				
            },
			onStart : ()=>{
                $('.header').removeClass('white');					
            }
        })
     
        
        
		 
				
	  }	
     //적용
    ScrollTrigger.matchMedia({
       "(min-width:821px)" : ()=>{
           if(!md_()){
                const height = 100 * 1;
                gsap.set('.ms1',{
                    height : `${height}vh`
                });
                mainSec02();
              
           }else{
                $('.ms2').css('height','auto');
                //mobNomarl();
           }
       },
       "(max-width:820px)" : ()=>{
            $('.ms2').css('height','auto');
            //mobNomarl();
       },
    }); 

}
/**********************/
const sec03 = () => {
    function mainSec03(){
        const mainSec03 = gsap.timeline({
            scrollTrigger : {
                trigger : '.ms3 ',
                pin : true,
                pinSpacing: true,
				start : "top top",
                end : "+=250%",
                //markers : true,
                scrub : true,
                invalidateOnRefresh : true,
				//toggleClass:'open',
				delay:'2', 
				//autoAlpha: 0,
				
            }
        })

         .to('.header',{           
			onReverseComplete : ()=>{
                $('.header').removeClass('white'); 				
            },
			onStart : ()=>{
                $('.header').addClass('white');					
            }
        })        
        
        
		.to('.ms3 .list_item1',2,{ 
			//width:'820',
			onStart : ()=>{
				$('.ms3 .list_item').stop().removeClass('open');	
                $('.ms3 .list_item1').stop().addClass('open');										  
            }
			})
       
		
		.to('.ms3 .list_item2',2,{
			//width:'820',			
			onStart : ()=>{
                $('.ms3 .list_item').stop().removeClass('open');	
				$('.ms3 .list_item2').stop().addClass('open');	
            },
			onReverseComplete : ()=>{
               $('.ms3 .list_item').stop().removeClass('open');	
				$('.ms3 .list_item1').stop().addClass('open');	
            },
		})			
		.to('.ms3 .list_item3',2,{
			//width:'820',
			onStart : ()=>{
                $('.ms3 .list_item').stop().removeClass('open');	
				$('.ms3 .list_item3').stop().addClass('open');	
            },
			onReverseComplete : ()=>{
               $('.ms3 .list_item').stop().removeClass('open');	
				$('.ms3 .list_item2').stop().addClass('open');	
            },
		})	
		
		.to('.ms3 .list_item4',2,{
			//width:'820',
			onStart : ()=>{
                $('.ms3 .list_item').stop().removeClass('open');	
				$('.ms3 .list_item4').stop().addClass('open');	
				
            },
			onReverseComplete : ()=>{
               $('.ms3 .list_item').stop().removeClass('open');	
				$('.ms3 .list_item3').stop().addClass('open');	
            },
			
		})	
		.to('.ms3 .list_item5',2,{
			//width:'820',
			onStart : ()=>{
                $('.ms3 .list_item').stop().removeClass('open');	
				$('.ms3 .list_item5').stop().addClass('open');	
				
				
            },
			onReverseComplete : ()=>{
               $('.ms3 .list_item').stop().removeClass('open');	
				$('.ms3 .list_item4').stop().addClass('open');	
            },
		})	
		.to('.ms3 .pop_wrap',2,{				
            autoAlpha: 1,delay: 0.8 ,	
            y:0
        })	
		
	  }	
     //적용
    ScrollTrigger.matchMedia({
       "(min-width:821px)" : ()=>{
           if(!md_()){
                /*const height = 100 * 1;
                gsap.set('.ms3',{
                    height : `${height}vh`
                });*/
	let isAnimating = false;
   
        $('.ms3 .list_item').on('mouseenter', function () {
            if (isAnimating) return; // 애니메이션이 진행 중일 때는 함수 종료

            isAnimating = true; // 애니메이션이 진행 중임을 표시
            $('.ms3 .list_item').not($(this)).removeClass('open');            
            $(this).addClass('open');

            // 0.3초 후에 애니메이션 플래그를 해제
            setTimeout(function () {
                isAnimating = false;
            }, 150);
        });
   
			   
                mainSec03();
              
           }else{
                $('.ms3').css('height','auto');
                let isAnimating = false;
   
        $('.ms3 .list_item').on('mouseenter', function () {
            if (isAnimating) return; // 애니메이션이 진행 중일 때는 함수 종료

            isAnimating = true; // 애니메이션이 진행 중임을 표시
            $('.ms3 .list_item').not($(this)).removeClass('open');            
            $(this).addClass('open');

            // 0.3초 후에 애니메이션 플래그를 해제
            setTimeout(function () {
                isAnimating = false;
            }, 150);
        });
   
           }
       },
       "(max-width:1023px)" : ()=>{
            $('.ms3').css('height','auto');
           let isAnimating = false;
   
        $('.ms3 .list_item').on('mouseenter', function () {
            if (isAnimating) return; // 애니메이션이 진행 중일 때는 함수 종료

            isAnimating = true; // 애니메이션이 진행 중임을 표시
            $('.ms3 .list_item').not($(this)).removeClass('open');            
            $(this).addClass('open');

            // 0.3초 후에 애니메이션 플래그를 해제
            setTimeout(function () {
                isAnimating = false;
            }, 150);
        });
   
       },
    }); 

}
/**********************/
/**********************/
const sec04 = () => {
    function mainSec04(){
        const mainSec04 = gsap.timeline({
            scrollTrigger : {
                trigger : '.ms4 .list_item',
                //pin : true,
                //pinSpacing: true,
				start : "top top",
                 //end : "+=150%",
                //markers : true,
                scrub : 1,
                invalidateOnRefresh : true,
				//toggleClass:'open',				
            }
        })
    .to('.header',{           
			onReverseComplete : ()=>{
                $('.header').removeClass('white'); 				
            },
			onStart : ()=>{
                $('.header').removeClass('white');					
            }
        })
       
	  }	
     //적용
    ScrollTrigger.matchMedia({
       "(min-width:821px)" : ()=>{
           if(!md_()){
                const height = 100 * 1;
                gsap.set('.ms4',{
                    height : `${height}vh`
                });
                mainSec04();
              
           }else{
                $('.ms4').css('height','auto');
                //mobNomarl();
           }
       },
       "(max-width:820px)" : ()=>{
            $('.ms4').css('height','auto');
            //mobNomarl();
       },
    }); 

}



/**********************/
const sec05 = () => {
    function mainSec05(){
        const mainSec05 = gsap.timeline({
            scrollTrigger : {
                trigger : '.ms5',
                pin : true,
                pinSpacing: true,
				start : "top top",
                end : "bottom bottom",
                //markers : true,
                scrub : 1,
                invalidateOnRefresh : true,
				//toggleClass:'open',
				ease : "expo",
            }
        })
         .to('.header',{           
			onReverseComplete : ()=>{
                $('.header').removeClass('white'); 				
            },
			onStart : ()=>{
                $('.header').addClass('white');					
            }
        })
	  }	
     //적용
    ScrollTrigger.matchMedia({
       "(min-width:821px)" : ()=>{
           if(!md_()){
                const height = 100 * 1;
                gsap.set('.ms5',{
                    height : `${height}vh`
                });
                mainSec05();
              
           }else{
                $('.ms5').css('height','auto');
                //mobNomarl();
           }
       },
       "(max-width:820px)" : ()=>{
            $('.ms5').css('height','auto');
            //mobNomarl();
       },
    }); 
}

/**********************/
const sec06 = () => {
    function mainSec06(){
        const mainSec06 = gsap.timeline({
            scrollTrigger : {
                trigger : '.ms6',
                pin : false,
                pinSpacing: true,
				start : "top top",
                end : "bottom bottom",
                //markers : true,
                scrub : 2,
                invalidateOnRefresh : true,
				//toggleClass:'open',
				
                
            }
        })
    
      
        
        .to('.header',{           
			onStart : ()=>{
                $('.header').addClass('white'); 				
            },
			onReverseComplete : ()=>{
                $('.header').addClass('white');					
            }
        })
	
       .to('.ms6 .interview_g',2,{ 
			 autoAlpha: 1,
            
		})
        .to('.ms6 .card_g',1,{ 
			 autoAlpha: 1,
           x:0,
            
			onStart  : ()=>{
                $('.ms6 .gellery_w').addClass('aaa');					
            },
            onReverseComplete : ()=>{
                $('.header').removeClass('aaa'); 				
            },
		})
        
	  }	
     //적용
    ScrollTrigger.matchMedia({
       "(min-width:821px)" : ()=>{
           if(!md_()){
                const height = 100 * 1;
                gsap.set('.ms6',{
                    height : `${height}vh`
                });
                mainSec06();
              
           }else{
                $('.ms6').css('height','auto');
                //mobNomarl();
           }
       },
       "(max-width:820px)" : ()=>{
            $('.ms6').css('height','auto');
            //mobNomarl();
       },
    }); 

}



const main = () =>{
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


    // 메인비주얼
    sec01();
    
    // 교과서소개
    sec02();
    
    // 노하우
    sec03();
    
    // 6개짜리
    sec04();
    
    // 10개짜리
    sec05();
    
    // 갤러리
    sec06();

    

}

main();



// typing effect
function typeEffect(element, textArray, speed) {
  let currentTextIndex = 0;
  let currentText = '';
  let isDeleting = false;
  let typingTimeout;

  function type() {
    const text = textArray[currentTextIndex];
    const typingSpeed = isDeleting ? speed / 2 : speed;

    if (!isDeleting && currentText.length === text.length) {
      isDeleting = true;
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(type, 1000);
    } else if (isDeleting && currentText.length === 0) {
      isDeleting = false;
      currentTextIndex = (currentTextIndex + 1) % textArray.length;
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(type, speed);
    } else {
      currentText = isDeleting ? text.substring(0, currentText.length - 1) : text.substring(0, currentText.length + 1);
      element.textContent = currentText;
      typingTimeout = setTimeout(type, typingSpeed);
    }
  }

  type();
}

const typingElements = document.querySelectorAll(".typing");
setTimeout(() => {
  typingElements.forEach(element => {
    const text = element.getAttribute("data-text");
    const textArray = text.split(",");
    typeEffect(element, textArray, 60);
  });
}, 2080);



		
//카드 레이어    
function card01(){	
     $.confirm({
         type: 'card',         
         content:'<h4>상황(자료) 제시 중심 모델</h4><div class="card_box"><ul class="summary"><li>학생들의 학습을 도와줄수 있는 다양한 자료를 AI 디지털교과서로 제시, 학생 스스로 문제 해결을 위한 탐구 활동을 할 수 있도록 도와주는 수업 모델</li><li>특히, AI 디지털교과서를 통해 학습자 개별 맞춤형 자료를 제공, 학습자가 수업 목표에 도달할 수 있도록 도움을 줍니다.</li></ul><div class="chart_g"><img src="/aidt/img/sb/chart_1.png" alt=""></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function card02(){	
     $.confirm({
         type: 'card',         
         content:'<h4>평가 중심 모델</h4><div class="card_box"><ul class="summary"><li>수업의 전 과정 중 학생 개별 탐구는 서책형 교과서를 활용, 진단, 형성, 총괄 평가 장면에서 AI 디지털교과서를 집중적으로 활용하는 수업 모델 </li><li>평가 결과를 토대로 수준별 과제를 제시하고 학생의 성취도를 누가하여 관리하는데 적합</li></ul><div class="chart_g" style="display:block"><img src="/aidt/img/sb/chart_2.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:none"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s3_ryu.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/8.%20%EA%B3%A0%EB%93%B1%20%EA%B3%B5%ED%86%B5%EC%88%98%ED%95%99%20%5B%EC%88%98%EC%A0%95-241210%5D.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();;$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}


function card02_1(){	
     $.confirm({
         type: 'card',         
         content:'<h4>평가 중심 모델</h4><div class="card_box"><ul class="summary"><li>수업의 전 과정 중 학생 개별 탐구는 서책형 교과서를 활용, 진단, 형성, 총괄 평가 장면에서 AI 디지털교과서를 집중적으로 활용하는 수업 모델 </li><li>평가 결과를 토대로 수준별 과제를 제시하고 학생의 성취도를 누가하여 관리하는데 적합</li></ul><div class="chart_g" style="display:none"><img src="/aidt/img/sb/chart_2.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:block"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s3_ryu.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/8.%20%EA%B3%A0%EB%93%B1%20%EA%B3%B5%ED%86%B5%EC%88%98%ED%95%99%20%5B%EC%88%98%EC%A0%95-241210%5D.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function card03(){	
     $.confirm({
         type: 'card',         
         content:'<h4>개별 탐구 중심 모델</h4><div class="card_box"><ul class="summary"><li>AI 디지털교과서를 기본으로 학생들이 개별 및 소집단으로 학습할 수 있는 기본 모델</li><li>사전 진단을 통한 학습자 수준에 따라 개별화된 자료 및 AI 튜터를 활용하여 탐구학습이 이루어지는 모델</li></ul><div class="chart_g"><img src="/aidt/img/sb/chart_3.png" alt=""/></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function card04(){	
     $.confirm({
         type: 'card',         
         content:'<h4>협력 학습 중심 모델</h4><div class="card_box"><ul class="summary"><li>AI 디지털교과서를 활용하여 학생들이 모둠 탐구 학습을 하는 데 적합한 수업 모델</li><li>학생들은 교사가 재구성한 외부 자료나 AI 디지털교과서 내의 다양한 교구를 활용하여 탐구 활동을 실시하고 결과를 공유하며, 다른 학생들의 탐구 활동 결과물을 평가하는 등 다양한 활동에 참여</li></ul><div class="chart_g"><img src="/aidt/img/sb/chart_4.png" alt=""/></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function card05(){	
     $.confirm({
         type: 'card',         
         content:'<h4>느린 학습자 관리 모델</h4><div class="card_box"><ul class="summary"><li>AI 디지털교과서를 활용하여 느린 학습자를 위한 맞춤형 수업을 진행하는 데 적합한 수업 모델</li><li>교사는 AI 디지털교과서를 활용하여 느린 학습자를 위해 개념 이해와 관련된 다양한 콘텐츠를 반복적으로 제공하고, 느린 학습자의 학습 성취도를 진단하여 맞춤형 문제를 제공</li><li>학생의 학습 데이터를 기반으로 교사의 개별 피드백 및 보충 지도 실시 등 느린 학습자를 위한 맞춤형 수업을 지원</li></ul><div class="chart_g" style="display:block"><img src="/aidt/img/sb/chart_5.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:none"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_choi.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/2.%20%EC%B4%88%EB%93%B1%20%EC%98%81%EC%96%B4%28%EC%B5%9C%29%20%5B%EC%88%98%EC%A0%95-241204%5D.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function card05_1(){	
     $.confirm({
         type: 'card',         
         content:'<h4>느린 학습자 관리 모델</h4><div class="card_box"><ul class="summary"><li>AI 디지털교과서를 활용하여 느린 학습자를 위한 맞춤형 수업을 진행하는 데 적합한 수업 모델</li><li>교사는 AI 디지털교과서를 활용하여 느린 학습자를 위해 개념 이해와 관련된 다양한 콘텐츠를 반복적으로 제공하고, 느린 학습자의 학습 성취도를 진단하여 맞춤형 문제를 제공</li><li>학생의 학습 데이터를 기반으로 교사의 개별 피드백 및 보충 지도 실시 등 느린 학습자를 위한 맞춤형 수업을 지원</li></ul><div class="chart_g" style="display:none"><img src="/aidt/img/sb/chart_5.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:block"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_choi.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/2.%20%EC%B4%88%EB%93%B1%20%EC%98%81%EC%96%B4%28%EC%B5%9C%29%20%5B%EC%88%98%EC%A0%95-241204%5D.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}


function card06(){	
     $.confirm({
         type: 'card',         
         content:'<h4>예습 모델</h4><div class="card_box"><ul class="summary"><li>AI 디지털교과서를 활용하여 거꾸로 학습과 같이 사전에 학습할 내용을 학생 스스로 학습하고 학교수업에서는 모둠과 선생님과 함께다양한 탐구 활동을 진행하는 데 적합한 수업 모델</li><li>학생들은AI 디지털교과서를 활용하여 이번 시간에 학습할 개념을 미리 살펴보고, 간단한 활동을 통해 풀이 방법 등을 익힘</li><li>본 수업 시간에는 미리 학습한 개념을 확인하고 단순한 문제 풀이를 넘어 모둠 구성원과 함께 다양한 수학 활동에 참여하며 개념을 다짐</li></ul><div class="chart_g"><img src="/aidt/img/sb/chart_6.png" alt=""/></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function card07(){	
     $.confirm({
         type: 'card',         
         content:' <h4>모니터링 활용 수업 모델</h4><div class="card_box"><ul class="summary"><li>수업 중 학생들의 문제 해결 과정을 AI 보조교사 시스템을 이용한 실시간 활동 결과 모니터링으로 점검하고 교사의 피드백을 통해학생들이 수업 목표에 도달할 수 있도록 구성한 수업 모델</li></ul><div class="chart_g"><img src="/aidt/img/sb/chart_7.png" alt=""/></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}





function card08(){	
     $.confirm({
         type: 'card',         
         content:'<h4>프로젝트형 모델</h4><div class="card_box"><ul class="summary"><li>각 학기 프로젝트 수업(4차시 분량)을 AIDT의 활동 중 &lang;교사 추가 수업&rang;을 이용, 학생들이 협력하여 프로젝트 산출물을 제작하고 결과물을 함께 공유할 수 있도록 구성한 수업 모델</li></ul><div class="chart_g"><img src="/aidt/img/sb/chart_9.png" alt=""/></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

function card09(){	
     $.confirm({
         type: 'card',         
         content:'<h4>놀이 활동 중심 모델</h4><div class="card_box"><ul class="summary"><li>Y클라우드의 디지털 수학 교구나 교사가 온라인으로 직접 제작한 콘텐츠를 가지고 수업 중 교수·학습 활동으로 형성한 수학적 개념이나 원리를 놀이 활동으로 응용·발전시킬 수 있는 수업 모델</li></ul><div class="chart_g" style="display:block"><img src="/aidt/img/sb/chart_10.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:none"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_kim.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/1.%20%EC%B4%88%EB%93%B1%20%EC%98%81%EC%96%B4%28%EA%B9%80%29.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function card09_1(){	
     $.confirm({
         type: 'card',         
         content:'<h4>놀이 활동 중심 모델</h4><div class="card_box"><ul class="summary"><li>Y클라우드의 디지털 수학 교구나 교사가 온라인으로 직접 제작한 콘텐츠를 가지고 수업 중 교수·학습 활동으로 형성한 수학적 개념이나 원리를 놀이 활동으로 응용·발전시킬 수 있는 수업 모델</li></ul><div class="chart_g" style="display:none"><img src="/aidt/img/sb/chart_10.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:block"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_kim.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/1.%20%EC%B4%88%EB%93%B1%20%EC%98%81%EC%96%B4%28%EA%B9%80%29.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function card10(){	
     $.confirm({
         type: 'card',         
         content:'<h4>교구 활용 모델</h4><div class="card_box"><ul class="summary"><li>교수·학습 활동 내 교구가 필요한 활동을 Y클라우드의 디지털 교구 또는 알지오매 스키즈 등 외부 소스)를 디지털 교구를 자료로 등록하여 AIDT 시스템 내에서 구체적 조작활동을할 수 있도록 구성한 수업 모델</li></ul><div class="chart_g" style="display:block"><img src="/aidt/img/sb/chart_8.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:none"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_ryu.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/3.%20%EC%B4%88%EB%93%B1%20%EC%88%98%ED%95%99.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function card10_1(){	
     $.confirm({
         type: 'card',         
         content:'<h4>교구 활용 모델</h4><div class="card_box"><ul class="summary"><li>교수·학습 활동 내 교구가 필요한 활동을 Y클라우드의 디지털 교구 또는 알지오매 스키즈 등 외부 소스)를 디지털 교구를 자료로 등록하여 AIDT 시스템 내에서 구체적 조작활동을할 수 있도록 구성한 수업 모델</li></ul><div class="chart_g" style="display:none"><img src="/aidt/img/sb/chart_8.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:block"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s1_ryu.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/3.%20%EC%B4%88%EB%93%B1%20%EC%88%98%ED%95%99.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function card11(){	
     $.confirm({
         type: 'card',         
         content:'<h4>거꾸로 수업 모델</h4><div class="card_box"><div class="chart_g" style="display:block"><img src="/aidt/img/sb/chart_11.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:none"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s2_park.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/5.%20%EC%A4%91%ED%95%99%20%EC%98%81%EC%96%B4%28%EB%B0%95%29.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}
function card11_1(){	
     $.confirm({
         type: 'card',         
         content:'<h4>거꾸로 수업 모델</h4><div class="card_box"><div class="chart_g" style="display:none"><img src="/aidt/img/sb/chart_11.png" alt=""/><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").hide();$(".vidbox").show();$("video").trigger("pause");>수업 모델 적용 방안 보기</button></div></div><div class="vidbox" style="display:block"><video class="video"  controls="controls" preload="none" poster="/aidt/img/sb/model_s2_park.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/5.%20%EC%A4%91%ED%95%99%20%EC%98%81%EC%96%B4%28%EB%B0%95%29.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button><div class="btn_box"><button type="button" class="btn_tapping" onClick=$(".chart_g").show();$(".vidbox").hide();$("video").trigger("pause");>수업 모델 보기</button></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'bt_close',
         buttons:false
      });
}

//메인팝업
function mv_open(){	
     $.confirm({
         type: 'pop_wrap',        
         content:'<div class="pop_wrap"><div class="pop_inner"><div class="pop_head"><h2>YBM AI 디지털교과서와 함께 학습의 새로운 가능성을 열어보세요!</h2></div><div class="pop_content"><div class="vidbox"><video class="video"  controls="controls" preload="none" width="600" poster="/aidt/img/main/poster_0.jpg" ><source src="https://kr.object.ncloudstorage.com/ybm-prd-std/aidt/241128_YBM_AIDT_v.4.1.mp4" type="video/mp4"></video><button type="button" class="btn_play" onClick="play();"><span class="blind">재생</span></button></div></div></div></div>',
         backgroundDismiss: true, //dimm클릭하면 창 꺼짐
         closeIcon: true,
         closeIconClass: 'btn_close',
         buttons:false
      });
}



