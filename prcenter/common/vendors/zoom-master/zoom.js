(function () {

	if (typeof $ !== "function")
		throw Error('JQuery is not present.');

	var times = 2, handler;

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
			if(w <= 0) w = $('.book-tab-box').width();
			if(h <= 0) h = p.closest('.book-tab-body').height();
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
			p.closest('.swiper-slide').find('.zoom_minimap .magnifier').css({
				top: p.closest('.zoom').find('.magnifier').css('top'),
				left: p.closest('.zoom').find('.magnifier').css('left')
			});
		}

		handler = function (e) {

			var [w, h] = ['width', 'height'].map(x => $.fn[x].call(t));
			if(w <= 0) w = $('.book-tab-box').width();
			if(h <= 0) h = p.closest('.book-tab-body').height();
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
					p.closest('.swiper-slide').find('.zoom_minimap').html(p.closest('.zoom').html()).fadeIn(500);
					$('.info-zoom-box').stop().fadeOut(800);
				},
				mouseout: function(){
					$('.zoom_minimap').hide();
					$('.info-zoom-box').stop().fadeIn(800);
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
					
					p.closest('.swiper-slide').find('.zoom_minimap').html(p.closest('.zoom').html()).fadeIn(500);					
					
					$('body').addClass('active-modal');
					$('.original:hover~div').show();
					$('.info-zoom-box').stop().fadeOut(800);
				},
				touchend: function(){
					$('body').removeClass('active-modal');
					$('.zoom_minimap').hide();
					$('.original:hover~div').hide();
					$('.info-zoom-box').stop().fadeIn(800);
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