const horizontalA = document.querySelector("#horizontal-a");
const sectionsA = gsap.utils.toArray("#horizontal-a > section");

let scrollTweenA = gsap.to(sectionsA, {
    xPercent: -100 * (sectionsA.length -1),
    ease: "none",
    scrollTrigger: {
        trigger: horizontalA,
        start: "top top",
        end: () => "+=" + (horizontalA.offsetWidth - innerWidth),
        pin: true,
        ainicipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true
    }
});

const horizontalB = document.querySelector("#horizontal-b");
const sectionsB = gsap.utils.toArray("#horizontal-b > section");

let scrollTweenB = gsap.to(sectionsB, {
    xPercent: -100 * (sectionsB.length -1),
    ease: "none",
    scrollTrigger: {
        trigger: horizontalB,
        start: "top top",
        end: () => "+=" + (horizontalB.offsetWidth - innerWidth),
        pin: true,
        ainicipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true
    }
});

//Parallax matchMedia - 추후 적용
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.saveStyles(".ycloud .key-visual");

ScrollTrigger.matchMedia({        
    
    //desktop
    "(min-width: 1280px)": function() {        
        window.onresize = window.onload = function(){ gsap.set('.key-visual', {x:'0', opacity:1}) }
        gsap.timeline({defaults:{duration:45}})
        .add(function(){
            $('.contain').on('mousemove', function(e){
                gsap.to('.m1_cGroup', {duration:1, x:function(i){return (e.clientX/window.innerWidth)/(i+1)*150}, y:function(i){return i*-10*(e.clientY/window.innerHeight)}, rotation:Math.random()*0.1, overwrite:'auto'});
            });            
        }, 'orbs+=0.5')
    }, 

});