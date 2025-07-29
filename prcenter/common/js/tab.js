$('.ui-tab li').click(function(){
    var tab_id = $(this).attr('data-tab');
    if(tab_id == null) return;

    $(this).addClass('current').siblings().removeClass('current');
    $("#"+tab_id).addClass('current').siblings().removeClass('current');
    

    return false;
});


//2022개정 YBM교과서 하단 탭
$('.section.book-tab .ui-tab li').on('click',function(){
    const $box = $('.menu-view-box');
    let index = $(this).data('index');

    $box.removeClass('active1 active2 active3');
    $box.addClass('active' + index);
});