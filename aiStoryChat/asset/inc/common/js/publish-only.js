/*-------------------------------------------------------------------
	분류순서
	- @ Publish	    : 레이아웃
	- @ Init	    : 초기실행
-------------------------------------------------------------------*/
$(function () {
	$("[data-include]").each(function () {
		$(this).load($(this).data("include"), function () {
			console.log(`[INFO] 퍼블리싱 ${$(this).data("include")} 인클루드 완료`);
			$(this).contents().unwrap(); // 제대로 동작함
			// if (window.initUI) initUI();
		});
	});
});