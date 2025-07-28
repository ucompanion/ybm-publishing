$(function(){

    //채널 dropbox
    let dropTarget = $('.float-contents .drop-box h2');
    let dropBox = $('.float-contents .drop-box ul');
    let dropBoxItem = $('.float-contents .drop-box ul li a');
    $(dropTarget).on('click' , function(){
        $(dropBox).slideToggle();
    });
    $(dropBoxItem).on('click' , function(){
        $(dropBox).slideUp();
    });

    $(window).resize(function(){ 
        if (window.innerWidth < 960) { 
            $('.responsive-layout').addClass('wrapper-m');
            
            } else {
                $('.responsive-layout').removeClass('wrapper-m');   
                $('.only-mobile').hide();
            
            }
        
    }).resize(); 
})