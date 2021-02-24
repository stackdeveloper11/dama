/*!
 * @name        easyzoom
 * @author       <>
 * @modified    Thursday, November 22nd, 2018
 * @version     2.5.2
 */
!function (t, e) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], function (t) { e(t) }) : "object" == typeof module && module.exports ? module.exports = t.EasyZoom = e(require("jquery")) : t.EasyZoom = e(t.jQuery) }(this, function (i) { "use strict"; var c, d, l, p, u, f, o = { loadingNotice: "Loading image", errorNotice: "The image could not be loaded", errorDuration: 2500, linkAttribute: "href", preventClicks: !0, beforeShow: i.noop, beforeHide: i.noop, onShow: i.noop, onHide: i.noop, onMove: i.noop }; function s(t, e) { this.$target = i(t), this.opts = i.extend({}, o, e, this.$target.data()), void 0 === this.isOpen && this._init() } return s.prototype._init = function () { this.$link = this.$target.find("a"), this.$image = this.$target.find("img"), this.$flyout = i('<div class="easyzoom-flyout" />'), this.$notice = i('<div class="easyzoom-notice" />'), this.$target.on({ "mousemove.easyzoom touchmove.easyzoom": i.proxy(this._onMove, this), "mouseleave.easyzoom touchend.easyzoom": i.proxy(this._onLeave, this), "mouseenter.easyzoom touchstart.easyzoom": i.proxy(this._onEnter, this) }), this.opts.preventClicks && this.$target.on("click.easyzoom", function (t) { t.preventDefault() }) }, s.prototype.show = function (t, e) { var o = this; if (!1 !== this.opts.beforeShow.call(this)) { if (!this.isReady) return this._loadImage(this.$link.attr(this.opts.linkAttribute), function () { !o.isMouseOver && e || o.show(t) }); this.$target.append(this.$flyout); var i = this.$target.outerWidth(), s = this.$target.outerHeight(), h = this.$flyout.width(), n = this.$flyout.height(), a = this.$zoom.width(), r = this.$zoom.height(); (c = a - h) < 0 && (c = 0), (d = r - n) < 0 && (d = 0), l = c / i, p = d / s, this.isOpen = !0, this.opts.onShow.call(this), t && this._move(t) } }, s.prototype._onEnter = function (t) { var e = t.originalEvent.touches; this.isMouseOver = !0, e && 1 != e.length || (t.preventDefault(), this.show(t, !0)) }, s.prototype._onMove = function (t) { this.isOpen && (t.preventDefault(), this._move(t)) }, s.prototype._onLeave = function () { this.isMouseOver = !1, this.isOpen && this.hide() }, s.prototype._onLoad = function (t) { t.currentTarget.width && (this.isReady = !0, this.$notice.detach(), this.$flyout.html(this.$zoom), this.$target.removeClass("is-loading").addClass("is-ready"), t.data.call && t.data()) }, s.prototype._onError = function () { var t = this; this.$notice.text(this.opts.errorNotice), this.$target.removeClass("is-loading").addClass("is-error"), this.detachNotice = setTimeout(function () { t.$notice.detach(), t.detachNotice = null }, this.opts.errorDuration) }, s.prototype._loadImage = function (t, e) { var o = new Image; this.$target.addClass("is-loading").append(this.$notice.text(this.opts.loadingNotice)), this.$zoom = i(o).on("error", i.proxy(this._onError, this)).on("load", e, i.proxy(this._onLoad, this)), o.style.position = "absolute", o.src = t }, s.prototype._move = function (t) { if (0 === t.type.indexOf("touch")) { var e = t.touches || t.originalEvent.touches; u = e[0].pageX, f = e[0].pageY } else u = t.pageX || u, f = t.pageY || f; var o = this.$target.offset(), i = f - o.top, s = u - o.left, h = Math.ceil(i * p), n = Math.ceil(s * l); if (n < 0 || h < 0 || c < n || d < h) this.hide(); else { var a = -1 * h, r = -1 * n; this.$zoom.css({ top: a, left: r }), this.opts.onMove.call(this, a, r) } }, s.prototype.hide = function () { this.isOpen && !1 !== this.opts.beforeHide.call(this) && (this.$flyout.detach(), this.isOpen = !1, this.opts.onHide.call(this)) }, s.prototype.swap = function (t, e, o) { this.hide(), this.isReady = !1, this.detachNotice && clearTimeout(this.detachNotice), this.$notice.parent().length && this.$notice.detach(), this.$target.removeClass("is-loading is-ready is-error"), this.$image.attr({ src: t, srcset: i.isArray(o) ? o.join() : o }), this.$link.attr(this.opts.linkAttribute, e) }, s.prototype.teardown = function () { this.hide(), this.$target.off(".easyzoom").removeClass("is-loading is-ready is-error"), this.detachNotice && clearTimeout(this.detachNotice), delete this.$link, delete this.$zoom, delete this.$image, delete this.$notice, delete this.$flyout, delete this.isOpen, delete this.isReady }, i.fn.easyZoom = function (e) { return this.each(function () { var t = i.data(this, "easyZoom"); t ? void 0 === t.isOpen && t._init() : i.data(this, "easyZoom", new s(this, e)) }) }, s });

//$(document).ready(function () {
//    $("#content").ajaxify({
//        forms: "form:not(.no-ajaxy)",
//        selector: "a:not(.wscolorcode)",
//        refresh: true,
//        style: true,
//        prefetch: false,
//        deltas: true,
//        previewoff: true,
//        verbosity: 100,
//        inline: true
//    });

//});
; (function ($) {
    $.fn.zoom = function (options) {
        // 默认配置
        var _option = {
            align: "left",				// 当前展示图片的位置，则放大的图片在其相对的位置
            thumb_image_width: 300,		// 当前展示图片的宽
            thumb_image_height: 400,	// 当前展示图片的高
            source_image_width: 900,  	// 放大图片的宽
            source_image_height: 1200,	// 放大图片的高
            zoom_area_width: 600, 		// 放大图片的展示区域的宽
            zoom_area_height: "justify",// 放大图片的展示区域的高
            zoom_area_distance: 10,     // 
            zoom_easing: true,          // 是否淡入淡出
            click_to_zoom: false,
            zoom_element: "auto",
            show_descriptions: true,
            description_location: "bottom",
            description_opacity: 0.7,
            small_thumbs: 3,			// 小图片展示的数量
            smallthumb_inactive_opacity: 0.4, 	// 小图片处于非激活状态时的遮罩透明度
            smallthumb_hide_single: true,    	// 
            smallthumb_select_on_hover: false,
            smallthumbs_position: "bottom",		// 小图片的位置
            show_icon: true,
            hide_cursor: false,			// � � �放到图片时，是否隐藏指针
            speed: 600,     			// 
            autoplay: true,				// 是否自动播放
            autoplay_interval: 6000, 	// 自动播放时每� 图片的停留时间
            keyboard: true,
            right_to_left: false,
        }

        if (options) {
            $.extend(_option, options);
        }

        var $ul = $(this);
        if ($ul.is("ul") && $ul.children("li").length && $ul.find(".bzoom_big_image").length) {

            $ul.addClass('bzoom clearfix').show();
            var $li = $ul.children("li").addClass("bzoom_thumb"),
				li_len = $li.length,
				autoplay = _option.autoplay;
            $li.first().addClass("bzoom_thumb_active").show();
            if (li_len < 2) {
                autoplay = false;
            }

            $ul.find(".bzoom_thumb_image").css({ width: _option.thumb_image_width, height: _option.thumb_image_height }).show();

            var scalex = _option.thumb_image_width / _option.source_image_width,
				scaley = _option.thumb_image_height / _option.source_image_height,
				scxy = _option.thumb_image_width / _option.thumb_image_height;

            var $bzoom_magnifier, $bzoom_magnifier_img, $bzoom_zoom_area, $bzoom_zoom_img;

            // 遮罩显示的区域
            if (!$(".bzoom_magnifier").length) {
                $bzoom_magnifier = $('<li class="bzoom_magnifier"><div class=""><img src="" /></div></li>');
                $bzoom_magnifier_img = $bzoom_magnifier.find('img');

                $ul.append($bzoom_magnifier);

                $bzoom_magnifier.css({ top: top, left: left });
                $bzoom_magnifier_img.attr('src', $ul.find('.bzoom_thumb_active .bzoom_thumb_image').attr('src')).css({ width: _option.thumb_image_width, height: _option.thumb_image_height });
                $bzoom_magnifier.find('div').css({ width: _option.thumb_image_width * scalex, height: _option.thumb_image_height * scaley });
            }

            // 大图
            if (!$('.bzoom_zoom_area').length) {
                $bzoom_zoom_area = $('<li class="bzoom_zoom_area"><div><img class="bzoom_zoom_img" /></div></li>');
                $bzoom_zoom_img = $bzoom_zoom_area.find('.bzoom_zoom_img');
                var top = 0,
                    left = 0;

                $ul.append($bzoom_zoom_area);

                if (_option.align == "left") {
                    top = 0;
                    left = 0 + _option.thumb_image_width + _option.zoom_area_distance;
                }

                $bzoom_zoom_area.css({ top: top, left: left });
                $bzoom_zoom_img.css({ width: _option.source_image_width, height: _option.source_image_height });
            }

            var autoPlay = {
                autotime: null,
                isplay: autoplay,

                start: function () {
                    if (this.isplay && !this.autotime) {
                        this.autotime = setInterval(function () {
                            var index = $ul.find('.bzoom_thumb_active').index();
                            changeLi((index + 1) % _option.small_thumbs);
                        }, _option.autoplay_interval);
                    }
                },

                stop: function () {
                    clearInterval(this.autotime);
                    this.autotime = null;
                },

                restart: function () {
                    this.stop();
                    this.start();
                }
            }

            // 循环小图
            var $small = '';
            if (!$(".bzoom_small_thumbs").length) {
                var top = _option.thumb_image_height + 10,
					width = _option.thumb_image_width,
					smwidth = (_option.thumb_image_width / _option.small_thumbs) - 10,
					smheight = smwidth / scxy,
					ulwidth =
					smurl = '',
					html = '';

                for (var i = 0; i < _option.small_thumbs; i++) {
                    smurl = $li.eq(i).find('.bzoom_thumb_image').attr("src");

                    if (i == 0) {
                        html += '<li class="bzoom_smallthumb_active"><img src="' + smurl + '" alt="small" style="width:' + smwidth + 'px; height:' + smheight + 'px;" /></li>';
                    } else {
                        html += '<li style="opacity:0.4;"><img src="' + smurl + '" alt="small" style="width:' + smwidth + 'px; height:' + smheight + 'px;" /></li>';
                    }
                }

                $small = $('<li class="bzoom_small_thumbs" style="top:' + top + 'px; width:' + width + 'px;"><ul class="clearfix" style="width: 485px;">' + html + '</ul></li>');
                $ul.append($small);

                $small.delegate("li", "click", function (event) {
                    changeLi($(this).index());
                    autoPlay.restart();
                });

                autoPlay.start();
            }

            function changeLi(index) {
                $ul.find('.bzoom_thumb_active').removeClass('bzoom_thumb_active').stop().animate({ opacity: 0 }, _option.speed, function () {
                    $(this).hide();
                });
                $small.find('.bzoom_smallthumb_active').removeClass('bzoom_smallthumb_active').stop().animate({ opacity: _option.smallthumb_inactive_opacity }, _option.speed);

                $li.eq(index).addClass('bzoom_thumb_active').show().stop().css({ opacity: 0 }).animate({ opacity: 1 }, _option.speed);
                $small.find('li:eq(' + index + ')').addClass('bzoom_smallthumb_active').show().stop().css({ opacity: _option.smallthumb_inactive_opacity }).animate({ opacity: 1 }, _option.speed);

                $bzoom_magnifier_img.attr("src", $li.eq(index).find('.bzoom_thumb_image').attr("src"));
            }




            _option.zoom_area_height = _option.zoom_area_width / scxy;
            $bzoom_zoom_area.find('div').css({ width: _option.zoom_area_width, height: _option.zoom_area_height });

            $li.add($bzoom_magnifier).mousemove(function (event) {
                var xpos = event.pageX - $ul.offset().left,
					ypos = event.pageY - $ul.offset().top,
					magwidth = _option.thumb_image_width * scalex,
					magheight = _option.thumb_image_height * scalex,
					magx = 0,
					magy = 0,
					bigposx = 0,
					bigposy = 0;

                if (xpos < _option.thumb_image_width / 2) {
                    magx = xpos > magwidth / 2 ? xpos - magwidth / 2 : 0;
                } else {
                    magx = xpos + magwidth / 2 > _option.thumb_image_width ? _option.thumb_image_width - magwidth : xpos - magwidth / 2;
                }
                if (ypos < _option.thumb_image_height / 2) {
                    magy = ypos > magheight / 2 ? ypos - magheight / 2 : 0;
                } else {
                    magy = ypos + magheight / 2 > _option.thumb_image_height ? _option.thumb_image_height - magheight : ypos - magheight / 2;
                }

                bigposx = magx / scalex;
                bigposy = magy / scaley;

                $bzoom_magnifier.css({ 'left': magx, 'top': magy });
                $bzoom_magnifier_img.css({ 'left': -magx, 'top': -magy });

                $bzoom_zoom_img.css({ 'left': -bigposx, 'top': -bigposy });
            }).mouseenter(function (event) {
                autoPlay.stop();

                $bzoom_zoom_img.attr("src", $(this).find('.bzoom_big_image').attr('src'));
                $bzoom_zoom_area.css({ "background-image": "none" }).stop().fadeIn(400);

                $ul.find('.bzoom_thumb_active').stop().animate({ 'opacity': 0.5 }, _option.speed * 0.7);
                $bzoom_magnifier.stop().animate({ 'opacity': 1 }, _option.speed * 0.7).show();
            }).mouseleave(function (event) {
                $bzoom_zoom_area.stop().fadeOut(400);
                $ul.find('.bzoom_thumb_active').stop().animate({ 'opacity': 1 }, _option.speed * 0.7);
                $bzoom_magnifier.stop().animate({ 'opacity': 0 }, _option.speed * 0.7, function () {
                    $(this).hide();
                });

                autoPlay.start();
            })
        }
    }
})(jQuery);
//var _0x8964 = ["\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74", "\x74\x6F\x75\x63\x68\x73\x74\x61\x72\x74", "\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x77\x73\x6D\x65\x6E\x75\x63\x6F\x6E\x74\x61\x69\x6E\x65\x72\x22\x20\x2F\x3E", "\x77\x72\x61\x70\x49\x6E\x6E\x65\x72", "\x62\x6F\x64\x79", "\x2E\x77\x73\x6D\x65\x6E\x75", "\x70\x72\x65\x70\x65\x6E\x64\x54\x6F", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x6F\x76\x65\x72\x6C\x61\x70\x62\x6C\x61\x63\x6B\x62\x67\x22\x3E\x3C\x2F\x64\x69\x76\x3E", "\x77\x73\x61\x63\x74\x69\x76\x65", "\x74\x6F\x67\x67\x6C\x65\x43\x6C\x61\x73\x73", "\x63\x6C\x69\x63\x6B", "\x23\x77\x73\x6E\x61\x76\x74\x6F\x67\x67\x6C\x65", "\x72\x65\x6D\x6F\x76\x65\x43\x6C\x61\x73\x73", "\x2E\x6F\x76\x65\x72\x6C\x61\x70\x62\x6C\x61\x63\x6B\x62\x67", "\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x77\x73\x6D\x65\x6E\x75\x2D\x63\x6C\x69\x63\x6B\x22\x3E\x3C\x69\x20\x63\x6C\x61\x73\x73\x3D\x22\x77\x73\x6D\x65\x6E\x75\x2D\x61\x72\x72\x6F\x77\x20\x66\x61\x20\x66\x61\x2D\x61\x6E\x67\x6C\x65\x2D\x64\x6F\x77\x6E\x22\x3E\x3C\x2F\x69\x3E\x3C\x2F\x73\x70\x61\x6E\x3E", "\x70\x72\x65\x70\x65\x6E\x64", "\x2E\x73\x75\x62\x2D\x6D\x65\x6E\x75", "\x68\x61\x73", "\x2E\x77\x73\x6D\x65\x6E\x75\x2D\x6C\x69\x73\x74\x3E\x20\x6C\x69", "\x2E\x77\x73\x73\x68\x6F\x70\x74\x61\x62\x69\x6E\x67", "\x2E\x77\x73\x6D\x65\x6E\x75\x2D\x6C\x69\x73\x74\x20\x3E\x20\x6C\x69", "\x2E\x77\x73\x6D\x65\x67\x61\x6D\x65\x6E\x75", "\x77\x73\x2D\x61\x63\x74\x69\x76\x65\x61\x72\x72\x6F\x77", "\x63\x68\x69\x6C\x64\x72\x65\x6E", "\x73\x69\x62\x6C\x69\x6E\x67\x73", "\x70\x61\x72\x65\x6E\x74", "\x73\x6C\x6F\x77", "\x73\x6C\x69\x64\x65\x55\x70", "\x2E\x73\x75\x62\x2D\x6D\x65\x6E\x75\x2C\x20\x2E\x77\x73\x73\x68\x6F\x70\x74\x61\x62\x69\x6E\x67\x2C\x20\x2E\x77\x73\x6D\x65\x67\x61\x6D\x65\x6E\x75", "\x6E\x6F\x74", "\x73\x6C\x69\x64\x65\x54\x6F\x67\x67\x6C\x65", "\x6F\x6E", "\x2E\x77\x73\x6D\x65\x6E\x75\x2D\x63\x6C\x69\x63\x6B", "\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x77\x73\x6D\x65\x6E\x75\x2D\x63\x6C\x69\x63\x6B\x30\x32\x22\x3E\x3C\x69\x20\x63\x6C\x61\x73\x73\x3D\x22\x77\x73\x6D\x65\x6E\x75\x2D\x61\x72\x72\x6F\x77\x20\x66\x61\x20\x66\x61\x2D\x61\x6E\x67\x6C\x65\x2D\x64\x6F\x77\x6E\x22\x3E\x3C\x2F\x69\x3E\x3C\x2F\x73\x70\x61\x6E\x3E", "\x2E\x77\x73\x74\x69\x74\x65\x6D\x72\x69\x67\x68\x74", "\x2E\x77\x73\x74\x61\x62\x69\x74\x65\x6D\x20\x3E\x20\x6C\x69", "\x77\x73\x2D\x61\x63\x74\x69\x76\x65\x61\x72\x72\x6F\x77\x30\x32", "\x2E\x77\x73\x6D\x65\x6E\x75\x2D\x63\x6C\x69\x63\x6B\x30\x32", "\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x77\x73\x6D\x65\x6E\x75\x2D\x63\x6C\x69\x63\x6B\x30\x33\x22\x3E\x3C\x69\x20\x63\x6C\x61\x73\x73\x3D\x22\x77\x73\x6D\x65\x6E\x75\x2D\x61\x72\x72\x6F\x77\x20\x66\x61\x20\x66\x61\x2D\x61\x6E\x67\x6C\x65\x2D\x64\x6F\x77\x6E\x22\x3E\x3C\x2F\x69\x3E\x3C\x2F\x73\x70\x61\x6E\x3E", "\x2E\x77\x73\x74\x62\x72\x61\x6E\x64\x62\x6F\x74\x74\x6F\x6D", "\x2E\x77\x73\x74\x61\x62\x69\x74\x65\x6D\x30\x32\x20\x3E\x20\x6C\x69", "\x77\x73\x2D\x61\x63\x74\x69\x76\x65\x61\x72\x72\x6F\x77\x30\x33", "\x2E\x77\x73\x6D\x65\x6E\x75\x2D\x63\x6C\x69\x63\x6B\x30\x33", "\x6D\x6F\x75\x73\x65\x65\x6E\x74\x65\x72", "\x77\x73\x73\x68\x6F\x70\x6C\x69\x6E\x6B\x2D\x61\x63\x74\x69\x76\x65", "\x61\x64\x64\x43\x6C\x61\x73\x73", "\x2E\x77\x73\x73\x68\x6F\x70\x74\x61\x62\x69\x6E\x67\x2E\x77\x74\x73\x64\x65\x70\x61\x72\x74\x6D\x65\x6E\x74\x6D\x65\x6E\x75\x20\x3E\x20\x2E\x77\x73\x73\x68\x6F\x70\x77\x70\x20\x3E\x20\x2E\x77\x73\x74\x61\x62\x69\x74\x65\x6D\x20\x3E\x20\x6C\x69", "\x2E\x77\x73\x73\x68\x6F\x70\x74\x61\x62\x69\x6E\x67\x2E\x77\x74\x73\x62\x72\x61\x6E\x64\x6D\x65\x6E\x75\x20\x3E\x20\x2E\x77\x73\x73\x68\x6F\x70\x74\x61\x62\x69\x6E\x67\x77\x70\x20\x3E\x20\x2E\x77\x73\x74\x61\x62\x69\x74\x65\x6D\x30\x32\x20\x3E\x20\x6C\x69", "\x72\x65\x61\x64\x79", "\x6C\x6F\x61\x64\x20\x72\x65\x73\x69\x7A\x65", "\x6F\x75\x74\x65\x72\x57\x69\x64\x74\x68", "\x68\x65\x69\x67\x68\x74", "\x31\x30\x30\x25", "\x63\x73\x73", "\x2E\x77\x73\x73\x68\x6F\x70\x77\x70", "\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74", "\x66\x69\x6E\x64", "\x61\x75\x74\x6F", "\x65\x61\x63\x68", "", "\x2E\x77\x73\x73\x68\x6F\x70\x74\x61\x62\x69\x6E\x67\x2C\x20\x2E\x77\x73\x74\x69\x74\x65\x6D\x72\x69\x67\x68\x74\x2C\x20\x2E\x77\x73\x74\x62\x72\x61\x6E\x64\x62\x6F\x74\x74\x6F\x6D\x2C\x20\x2E\x77\x73\x6D\x65\x67\x61\x6D\x65\x6E\x75\x2C\x20\x75\x6C\x2E\x73\x75\x62\x2D\x6D\x65\x6E\x75", "\x72\x65\x73\x69\x7A\x65", "\x70\x78", "\x6D\x69\x6E\x2D\x77\x69\x64\x74\x68", "\x77\x69\x64\x74\x68", "\x2E\x77\x73\x6D\x65\x6E\x75\x63\x6F\x6E\x74\x61\x69\x6E\x65\x72", "\x73\x74\x79\x6C\x65", "\x72\x65\x6D\x6F\x76\x65\x41\x74\x74\x72", "\x74\x72\x69\x67\x67\x65\x72", "\x6C\x6F\x61\x64", "\x77\x73\x6F\x70\x65\x6E\x73\x65\x61\x72\x63\x68", "\x2E\x77\x73\x6D\x6F\x62\x69\x6C\x65\x68\x65\x61\x64\x65\x72\x20\x2E\x77\x73\x73\x65\x61\x72\x63\x68", "\x2E\x77\x73\x73\x65\x61\x72\x63\x68", "\x62\x6F\x64\x79\x2C\x20\x2E\x77\x73\x6F\x70\x65\x6E\x73\x65\x61\x72\x63\x68\x20\x2E\x66\x61\x2E\x66\x61\x2D\x74\x69\x6D\x65\x73", "\x73\x74\x6F\x70\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E", "\x2E\x77\x73\x73\x65\x61\x72\x63\x68\x2C\x20\x2E\x77\x73\x73\x65\x61\x72\x63\x68\x66\x6F\x72\x6D\x20\x66\x6F\x72\x6D"]; jQuery(function () { _0x8964[0]; document[_0x8964[2]](_0x8964[1], function () { }, false); jQuery(function () { jQuery("body")[_0x8964[4]](_0x8964[3]); jQuery(_0x8964[8])[_0x8964[7]](".wsmenu"); jQuery(_0x8964[12])["click"](function () { jQuery("body")["toggleClass"]("wsactive") }); jQuery(_0x8964[14])["click"](function () { jQuery("body")["removeClass"]("wsactive") }); jQuery(_0x8964[19])["has"](".sub-menu")["prepend"](_0x8964[15]); jQuery(_0x8964[21])["has"](".wsshoptabing")["prepend"](_0x8964[15]); jQuery(_0x8964[21])["has"](".wsmegamenu")["prepend"](_0x8964[15]); jQuery(".wsmenu-click")["on"]("click", function () { jQuery(this)["toggleClass"]("ws-activearrow")["parent"]()["siblings"]()["children"]()["removeClass"]("ws-activearrow"); jQuery(".sub-menu, .wsshoptabing, .wsmegamenu")["not"](jQuery(this)["siblings"](".sub-menu, .wsshoptabing, .wsmegamenu"))["slideUp"]("slow"); jQuery(this)["siblings"](".sub-menu")["slideToggle"]("slow"); jQuery(this)["siblings"](".wsshoptabing")["slideToggle"]("slow"); jQuery(this)["siblings"](".wsmegamenu")["slideToggle"]("slow"); return false }); jQuery(".wstabitem > li")["has"]("wstitemright")["prepend"]('<span class="wsmenu-click02"><i class="wsmenu-arrow fa fa-angle-down"></i></span>'); jQuery(".wsmenu-click02")["on"]("click", function () { jQuery(this)["siblings"]("wstitemright")["slideToggle"]("slow"); jQuery(this)["toggleClass"]("ws-activearrow02")["parent"]()["siblings"]()["children"]()["removeClass"]("ws-activearrow02"); jQuery("wstitemright")["not"](jQuery(this)["siblings"]("wstitemright"))["slideUp"]("slow"); return false }); jQuery(".wstabitem02 > li")["has"](".wstbrandbottom")["prepend"]('<span class="wsmenu-click03"><i class="wsmenu-arrow fa fa-angle-down"></i></span>'); jQuery(".wsmenu-click03")["on"]("click", function () { jQuery(this)["siblings"](".wstbrandbottom")["slideToggle"]("slow"); jQuery(this)["toggleClass"]("ws-activearrow03")["parent"]()["siblings"]()["children"]()["removeClass"]("ws-activearrow03"); jQuery(".wstbrandbottom")["not"](jQuery(this)["siblings"](".wstbrandbottom"))["slideUp"]("slow"); return false }); jQuery(window)["ready"](function () { jQuery(".wsshoptabing.wtsdepartmentmenu > .wsshopwp > .wstabitem > li")["on"]("mouseenter", function () { jQuery(this)["addClass"]("wsshoplink-active")["siblings"](this)["removeClass"]("wsshoplink-active"); return false }); jQuery(".wsshoptabing.wtsbrandmenu > .wsshoptabingwp > .wstabitem02 > li")["on"]("mouseenter", function () { jQuery(this)["addClass"]("wsshoplink-active")["siblings"](this)["removeClass"]("wsshoplink-active"); return false }) }); _0x1dfex2(); jQuery(window)["on"]("load resize", function () { var _0x1dfex1 = jQuery(window)["outerWidth"](); if (_0x1dfex1 <= 991) { jQuery(".wsshopwp")["css"]("height", "100%"); jQuery("wstitemright")["css"]("height", "100%") } else { _0x1dfex2() } }); function _0x1dfex2() { var _0x1dfex3 = 1; jQuery(".wstabitem > li")[_0x8964[59]](function () { var _0x1dfex4 = jQuery(this)[_0x8964[57]]("wstitemright")[_0x8964[56]](); _0x1dfex3 = _0x1dfex4 > _0x1dfex3 ? _0x1dfex4 : _0x1dfex3; jQuery(this)[_0x8964[57]]("wstitemright")["css"]("height", _0x8964[58]) }); jQuery(".wsshopwp")["css"]("height", _0x1dfex3 + 0) } jQuery(document)["ready"](function (_0x1dfex5) { function _0x1dfex6() { if (_0x1dfex5(window)["outerWidth"]() >= 991) { _0x1dfex5(".wsshoptabing, .wstitemright, .wstbrandbottom, .wsmegamenu, ul.sub-menu")["css"]({ "\x64\x69\x73\x70\x6C\x61\x79": _0x8964[60] }) } } _0x1dfex6(); _0x1dfex5(window)["resize"](_0x1dfex6) }); jQuery(window)["on"]("resize", function () { if (jQuery(window)["outerWidth"]() <= 991) { jQuery(".wsmenu")["css"]("height", jQuery(this)["height"]() + "px"); jQuery(".wsmenucontainer")["css"]("min-width", jQuery(this)["width"]() + "px") } else { jQuery(".wsmenu")["removeAttr"]("style"); jQuery(".wsmenucontainer")["removeAttr"]("style"); jQuery("body")["removeClass"]("wsactive"); jQuery(".wsmenu-click")["removeClass"]("ws-activearrow"); jQuery(".wsmenu-click02")["removeClass"]("ws-activearrow02"); jQuery(".wsmenu-click03")["removeClass"]("ws-activearrow03") } }); jQuery(window)["trigger"]("resize") }); jQuery(window)["on"]("load", function () { jQuery(".wsmobileheader .wssearch")["on"]("click", function () { jQuery(this)["toggleClass"]("wsopensearchi") }); jQuery("body, .wsopensearchi .fa.fa-times")["on"]("click", function () { jQuery(".wssearch")["removeClass"]("wsopensearchi") }); jQuery(".wssearch, .wssearchform form")["on"]("click", function (_0x1dfex7) { _0x1dfex7["stopPropagation"]() }) }) }())
'use strict';
var _0x8964 = ["use strict", "touchstart", "addEventListener", '<div class="wsmenucontainer" />', "wrapInner", "body", ".wsmenu", "prependTo", '<div class="overlapblackbg"></div>', "wsactive", "toggleClass", "click", "#wsnavtoggle", "removeClass", ".overlapblackbg", '<span class="wsmenu-click"><i class="wsmenu-arrow fa fa-angle-down"></i></span>', "prepend", ".sub-menu", "has", ".wsmenu-list> li", ".wsshoptabing", ".wsmenu-list > li", ".wsmegamenu", "ws-activearrow", "children", "siblings", "parent",
"slow", "slideUp", ".sub-menu, .wsshoptabing, .wsmegamenu", "not", "slideToggle", "on", ".wsmenu-click", '<span class="wsmenu-click02"><i class="wsmenu-arrow fa fa-angle-down"></i></span>', ".wstitemright", ".wstabitem > li", "ws-activearrow02", ".wsmenu-click02", '<span class="wsmenu-click03"><i class="wsmenu-arrow fa fa-angle-down"></i></span>', ".wstbrandbottom", ".wstabitem02 > li", "ws-activearrow03", ".wsmenu-click03", "mouseenter", "wsshoplink-active", "addClass", ".wsshoptabing.wtsdepartmentmenu > .wsshopwp > .wstabitem > li",
".wsshoptabing.wtsbrandmenu > .wsshoptabingwp > .wstabitem02 > li", "ready", "load resize", "outerWidth", "height", "100%", "css", ".wsshopwp", "innerHeight", "find", "auto", "each", "", ".wsshoptabing, .wstitemright, .wstbrandbottom, .wsmegamenu, ul.sub-menu", "resize", "px", "min-width", "width", ".wsmenucontainer", "style", "removeAttr", "trigger", "load", "wsopensearchi", ".wsmobileheader .wssearch", ".wssearch", "body, .wsopensearchi .fa.fa-times", "stopPropagation", ".wssearch, .wssearchform form"];
jQuery(function () {
    "use strict";
    document["addEventListener"]("touchstart", function () {
    }, false);
    jQuery(function () {
        function _0x1dfex2$jscomp$0() {
            var _0x1dfex3$jscomp$0 = 1;
            jQuery(".wstabitem > li")["each"](function () {
                var _0x1dfex4$jscomp$0 = jQuery(this)["find"](".wstitemright")["innerHeight"]();
                _0x1dfex3$jscomp$0 = _0x1dfex4$jscomp$0 > _0x1dfex3$jscomp$0 ? _0x1dfex4$jscomp$0 : _0x1dfex3$jscomp$0;
                jQuery(this)["find"](".wstitemright")["css"]("height", "auto");
            });
            jQuery(".wsshopwp")["css"]("height", _0x1dfex3$jscomp$0 + 0);
        }
        jQuery("body")["wrapInner"]('<div class="wsmenucontainer" />');
        jQuery('<div class="overlapblackbg"></div>')["prependTo"](".wsmenu");
        jQuery("#wsnavtoggle")["click"](function () {
            jQuery("body")["toggleClass"]("wsactive");
        });
        jQuery(".overlapblackbg")["click"](function () {
            jQuery("body")["removeClass"]("wsactive");
        });
        jQuery(".wsmenu-list> li")["has"](".sub-menu")["prepend"]('<span class="wsmenu-click"><i class="wsmenu-arrow fa fa-angle-down"></i></span>');
        jQuery(".wsmenu-list > li")["has"](".wsshoptabing")["prepend"]('<span class="wsmenu-click"><i class="wsmenu-arrow fa fa-angle-down"></i></span>');
        jQuery(".wsmenu-list > li")["has"](".wsmegamenu")["prepend"]('<span class="wsmenu-click"><i class="wsmenu-arrow fa fa-angle-down"></i></span>');
        jQuery(".wsmenu-click")["on"]("click", function () {

            jQuery(this)["toggleClass"]("ws-activearrow")["parent"]()["siblings"]()["children"]()["removeClass"]("ws-activearrow");
            jQuery(".sub-menu, .wsshoptabing, .wsmegamenu")["not"](jQuery(this)["siblings"](".sub-menu, .wsshoptabing, .wsmegamenu"))["slideUp"]("slow");
            jQuery(this)["siblings"](".sub-menu")["slideToggle"]("slow");
            jQuery(this)["siblings"](".wsshoptabing")["slideToggle"]("slow");
            jQuery(this)["siblings"](".wsmegamenu")["slideToggle"]("slow");
            return false;
        });
        jQuery(".wstabitem > li")["has"]("wstitemright")["prepend"]('<span class="wsmenu-click02"><i class="wsmenu-arrow fa fa-angle-down"></i></span>');
        jQuery(".wsmenu-click02")["on"]("click", function () {
            jQuery(this)["siblings"]("wstitemright")["slideToggle"]("slow");
            jQuery(this)["toggleClass"]("ws-activearrow02")["parent"]()["siblings"]()["children"]()["removeClass"]("ws-activearrow02");
            jQuery("wstitemright")["not"](jQuery(this)["siblings"]("wstitemright"))["slideUp"]("slow");
            return false;
        });
        jQuery(".wstabitem02 > li")["has"](".wstbrandbottom")["prepend"]('<span class="wsmenu-click03"><i class="wsmenu-arrow fa fa-angle-down"></i></span>');
        jQuery(".wsmenu-click03")["on"]("click", function () {
            jQuery(this)["siblings"](".wstbrandbottom")["slideToggle"]("slow");
            jQuery(this)["toggleClass"]("ws-activearrow03")["parent"]()["siblings"]()["children"]()["removeClass"]("ws-activearrow03");
            jQuery(".wstbrandbottom")["not"](jQuery(this)["siblings"](".wstbrandbottom"))["slideUp"]("slow");
            return false;
        });
        jQuery(window)["ready"](function () {
            jQuery(".wsshoptabing.wtsdepartmentmenu > .wsshopwp > .wstabitem > li")["on"]("mouseenter", function () {
                jQuery(this)["addClass"]("wsshoplink-active")["siblings"](this)["removeClass"]("wsshoplink-active");
                return false;
            });
            jQuery(".wsshoptabing.wtsbrandmenu > .wsshoptabingwp > .wstabitem02 > li")["on"]("mouseenter", function () {
                jQuery(this)["addClass"]("wsshoplink-active")["siblings"](this)["removeClass"]("wsshoplink-active");
                return false;
            });
        });
        _0x1dfex2$jscomp$0();
        jQuery(window)["on"]("load resize", function () {
            var _0x1dfex1$jscomp$0 = jQuery(window)["outerWidth"]();
            if (_0x1dfex1$jscomp$0 <= 991) {
                jQuery(".wsshopwp")["css"]("height", "100%");
                jQuery("wstitemright")["css"]("height", "100%");
            } else {
                _0x1dfex2$jscomp$0();
            }
        });
        jQuery(document)["ready"](function (_0x1dfex5$jscomp$0) {
            function _0x1dfex6$jscomp$0() {
                if (_0x1dfex5$jscomp$0(window)["outerWidth"]() >= 991) {
                    _0x1dfex5$jscomp$0(".wsshoptabing, .wstitemright, .wstbrandbottom, .wsmegamenu, ul.sub-menu")["css"]({
                        "display": ""
                    });
                }
            }
            _0x1dfex6$jscomp$0();
            _0x1dfex5$jscomp$0(window)["resize"](_0x1dfex6$jscomp$0);
        });
        jQuery(window)["on"]("resize", function () {
            if (jQuery(window)["outerWidth"]() <= 991) {
                jQuery(".wsmenu")["css"]("height", jQuery(this)["height"]() + "px");
                jQuery(".wsmenucontainer")["css"]("min-width", jQuery(this)["width"]() + "px");
            } else {
                jQuery(".wsmenu")["removeAttr"]("style");
                jQuery(".wsmenucontainer")["removeAttr"]("style");
                jQuery("body")["removeClass"]("wsactive");
                jQuery(".wsmenu-click")["removeClass"]("ws-activearrow");
                jQuery(".wsmenu-click02")["removeClass"]("ws-activearrow02");
                jQuery(".wsmenu-click03")["removeClass"]("ws-activearrow03");
            }
        });
        jQuery(window)["trigger"]("resize");
    });
    jQuery(window)["on"]("load", function () {
        jQuery(".wsmobileheader .wssearch")["on"]("click", function () {
            jQuery(this)["toggleClass"]("wsopensearchi");
        });
        jQuery("body, .wsopensearchi .fa.fa-times")["on"]("click", function () {
            jQuery(".wssearch")["removeClass"]("wsopensearchi");
        });
        jQuery(".wssearch, .wssearchform form")["on"]("click", function (_0x1dfex7$jscomp$0) {
            _0x1dfex7$jscomp$0["stopPropagation"]();
        });
    });
}());

$(document).ready(function () {
    $(".wsmenu>.wsmenu-list>li").hover(function () {
        $("#container-background").addClass("container-background");
    }, function () {
        $("#container-background").removeClass("container-background");
    });
    jQuery.event.special.touchstart =
    {
          setup: function (_, ns, handle) {
              if (ns.includes("noPreventDefault")) {
                  this.addEventListener("touchstart", handle, { passive: false });
              }
              else {
                  this.addEventListener("touchstart", handle, { passive: true });
              }
          }
    };
});