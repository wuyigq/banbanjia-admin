define(["jquery", "bootstrap"], function ($, bs) {
    function _bindCssEvent(a, b) {
        function c(e) {
            if (e.target === this) {
                b.call(this, e);
                for (var f = 0; f < a.length; f++) d.off(a[f], c)
            }
        }
        var d = this;
        if (b)
            for (var e = 0; e < a.length; e++) d.on(a[e], c)
    }
    $.fn.animationEnd = function (a) {
        return _bindCssEvent.call(this, ["webkitAnimationEnd", "animationend"], a), this
    }, $.fn.transitionEnd = function (a) {
        return _bindCssEvent.call(this, ["webkitTransitionEnd", "transitionend"], a), this
    }, $.fn.transition = function (a) {
        "string" != typeof a && (a += "ms");
        for (var b = 0; b < this.length; b++) {
            var c = this[b].style;
            c.webkitTransitionDuration = c.MozTransitionDuration = c.transitionDuration = a
        }
        return this
    }, $.fn.transform = function (a) {
        for (var b = 0; b < this.length; b++) {
            var c = this[b].style;
            c.webkitTransform = c.MozTransform = c.transform = a
        }
        return this
    }, $.fn.iappend = function (a, b) {
        var c = $("body").html().length;
        this.append(a);
        var d = 1,
            e = setInterval(function () {
                d++;
                (c != $("body").html().length || d > 1e3) && function () {
                    clearInterval(e), b && b()
                }()
            }, 1)
    }, $(".btn").hover(function () {
        $(this).tooltip("show")
    }, function () {
        $(this).tooltip("hide")
    }), irequire(["jquery.slimscroll"], function () {
        $(".slimscroll").slimScroll({
            height: "auto",
            size: "5px",
            railVisible: !1
        })
    }), $('[data-toggle="popover"]').hover(function () {
        $(this).popover("show")
    }, function () {
        $(this).popover("hide")
    }), window.redirect = function (a) {
        location.href = a
    }, $(".select2").length > 0 && irequire(["select2"], function () {
        $(".select2").each(function () {
            $(this).select2({}), $(this).hasClass("js-select2") && $(this).change(function () {
                $(this).parents("form").submit()
            })
        })
    }), $(".js-clip").length > 0 && irequire(["clipboard"], function (a) {
        new a(".js-clip", {
            text: function (a) {
                return $(a).data("url") || $(a).data("href") || $(a).data("text")
            }
        }).on("success", function (a) {
            Notify.success("复制成功")
        })
    }), $(".js-switch").length > 0 && irequire(["switchery"], function () {
        $(".js-switch").switchery()
    }), $(".toggle-tabs").length > 0 && $(document).on("click", ".toggle-role", function () {
        var a = $(this),
            b = a.parents(".toggle-tabs"),
            c = $(b.data("content"));
        if (!c) return !1;
        var d = a.data("target");
        if (!d) return !1;
        c.find(".toggle-pane").removeClass("active").addClass("hide"), c.find("#" + d).removeClass("hide").addClass("active")
    }), $(".js-qrcode").length > 0 && irequire(["jquery.qrcode"], function () {
        $(".js-qrcode").each(function () {
            var a = ($(this), $(this).data("text") || $(this).data("href") || $(this).data("url")),
                b = $(this).data("width") || 150;
            $(this).show().html("").qrcode({
                render: "canvas",
                width: b,
                height: b,
                text: a
            })
        })
    }), $(".js-checkbox").length > 0 && require(["bootstrap.switch"], function () {
        $(".js-checkbox").bootstrapSwitch(), $(".js-checkbox").on("switchChange.bootstrapSwitch", function (a, b) {
            var c = $(this).data("href");
            if (!c) return !1;
            var d = $(this).data("name") ? $(this).data("name") : "status",
                e = this.checked ? 1 : 0,
                f = {};
            f[d] = e, $.post(c, f, function (a) {
                var b = $.parseJSON(a),
                    c = b.message.errno,
                    d = b.message.message,
                    e = b.message.url;
                if (0 != c) return Notify.error(d), !1;
                e && Notify.success(d, e)
            })
        })
    }), $(".js-colorpicker").length > 0 && ($(".colorpicker").each(function () {
        var a = this;
        util.colorpicker(a, function (b) {
            $(a).parent().prev().prev().val(b.toHexString()), $(a).parent().prev().css("background-color", b.toHexString())
        })
    }), $(".colorclean").click(function () {
        $(this).parent().prev().prev().val(""), $(this).parent().prev().css("background-color", "#FFF")
    })), $(".js-daterange").length > 0 && ($(document).on("click", ".js-daterange .js-btn-custom", function () {
        $(this).siblings().removeClass("btn-primary").addClass("btn-default"), $(this).addClass("btn-primary"), $(this).parent().next(".js-btn-daterange").removeClass("hide"), $(this).parents("form").find(':hidden[name="days"]').val(-1)
    }), require(["daterangepicker"], function () {
        $(".js-daterange").each(function () {
            var a = $(this).data("form");
            $(this).find(".daterange").on("apply.daterangepicker", function (b, c) {
                $(a).submit()
            })
        })
    })), $(document).on("click", ".js-refresh", function (a) {
        a && a.preventDefault();
        var b = $(a.target).data("href");
        b ? window.location = b : window.location.reload()
    }), $(document).on("click", "js-back", function (a) {
        a && a.preventDefault();
        var b = $(a.target).data("href");
        b ? window.location = b : window.history.back()
    }), $(document).on("click", ".js-modal", function (e) {
        e.preventDefault();
        var obj = $(this),
            confirm = obj.data("confirm"),
            handler = function () {
                $("#js-modal").remove(), e.preventDefault();
                var url = obj.data("href") || obj.attr("href"),
                    data = obj.data("set"),
                    modal;
                $.ajax(url, {
                    type: "get",
                    dataType: "html",
                    cache: !1,
                    data: data
                }).done(function (result) {
                    if ('{"message"' == result.substr(0, 10)) {
                        var json = eval("(" + result + ")"),
                            errno = json.message.errno,
                            message = json.message.message;
                        if (errno) return void Notify.error(message || Notify.lang.error)
                    }
                    modal = $('<div class="modal fade" id="js-modal"></div>'), $(document.body).append(modal), modal.modal("show"), modal.iappend(result, function () {
                        $("form.form-validate", modal).length > 0 && ($("button[type='submit']", modal).length && $("button[type='submit']", modal).attr("disabled", !0), irequire(["web/form"], function (a) {
                            $("button[type='submit']", modal).length && $("button[type='submit']", modal).removeAttr("disabled")
                        }))
                    })
                })
            };
        confirm ? Notify.confirm(confirm, handler) : handler()
    }), $(document).on("click", ".js-edit", function (a) {
        var b = $(this),
            c = b.data("href"),
            d = $.trim(b.html()),
            e = b.data("required") || !0,
            f = $.trim($(this).text());
        a.preventDefault(), submit = function () {
            a.preventDefault();
            var g = $.trim(b.val());
            if (e && "" == g) return void Notify.error(Notify.lang.empty);
            if (g == d) return input.remove(), void b.html(g).show();
            if (c) {
                var h = {};
                h[b.data("name")] = g, $.post(c, h, function (a) {
                    var c = $.parseJSON(a),
                        d = c.message.errno,
                        e = c.message.url,
                        f = c.message.message;
                    d ? Notify.error(f, e) : b.html(g).show()
                }).fail(function () {
                    Notify.error(Notify.lang.exception)
                })
            } else b.html(g).show();
            b.trigger("valueChange", [g, f])
        }, b.select().blur(function () {
            submit()
        }).keyup(function (a) {
            if (console.dir(a), 13 == a.keyCode) return void submit()
        })
    }), $(document).on("click", ".js-post", function (a) {
        a.preventDefault();
        var b = $(this),
            c = b.data("confirm"),
            d = b.data("href") || b.attr("href"),
            e = b.data("set") || {},
            f = b.html();
        handler = function () {
            a.preventDefault(), "1" != b.attr("submitting") && (b.html('<i class="fa fa-spinner fa-spin"></i>').attr("submitting", 1), $.post(d, {
                data: e
            }, function (a) {
                var c = $.parseJSON(a),
                    d = c.message.errno,
                    e = c.message.url ? c.message.url : location.href,
                    g = c.message.message;
                d ? (Notify.error(g || Notify.lang.erroror, e), b.removeAttr("submitting").html(f)) : Notify.success(g || Notify.lang.success, e)
            }).fail(function () {
                b.removeAttr("submitting").html(f), Notify.error(Notify.lang.exception)
            }))
        }, c ? Notify.confirm(c, handler) : handler()
    }), $(document).on("click", ".js-selectImg", function () {
        var a = $(this).data("input"),
            b = $(this).data("element"),
            c = $(this).data("full");
        util.image("", function (d) {
            var e = d.attachment;
            c && (e = d.url), a && $(a).val(e).trigger("change"), b && $(b).attr("src", d.url)
        })
    }), $(document).on("click", ".js-selectLink", function () {
        var a = $(this).data("input");
        irequire(["web/hello"], function (b) {
            b.selectLink(function (b) {
                a && $(a).val(b).trigger("change")
            })
        })
    }), $(document).on("click", ".js-selectPlateformLink", function () {
        var a = $(this).data("input"),
            b = $(this).data("type") || "plateform",
            c = {
                type: b
            };
        irequire(["web/hello"], function (b) {
            b.selectPlateformLink(function (b) {
                a && $(a).val(b).trigger("change")
            }, c)
        })
    }), $(document).on("click", ".js-selectManagerLink", function () {
        var a = $(this).data("input"),
            b = $(this).data("type") || "manager",
            c = {
                type: b
            };
        irequire(["web/hello"], function (b) {
            b.selectPlateformLink(function (b) {
                a && $(a).val(b).trigger("change")
            }, c)
        })
    }), $(document).on("click", ".js-selectDeliveryerLink", function () {
        var a = $(this).data("input"),
            b = $(this).data("type") || "deliveryer",
            c = {
                type: b
            };
        irequire(["web/hello"], function (b) {
            b.selectDeliveryerLink(function (b) {
                a && $(a).val(b).trigger("change")
            }, c)
        })
    }), $(document).on("click", ".js-selectData", function () {
        var a = $(this).data("input"),
            b = $(this).data("val");
        return a && $(a).val(b).trigger("change"), !0
    }), $(document).on("click", ".js-selectWxappLink", function () {
        var a = $(this).data("input"),
            b = $(this).data("scene") || "page",
            c = $(this).data("type") || "wmall",
            d = {
                scene: b,
                type: c
            };
        irequire(["web/hello"], function (b) {
            b.selectWxappLink(function (b) {
                a && $(a).val(b).trigger("change")
            }, d)
        })
    }), $(document).on("click", ".js-selectVueLink", function () {
        var a = $(this).data("input"),
            b = $(this).data("scene") || "vuepage",
            c = {
                scene: b
            };
        irequire(["web/hello"], function (b) {
            b.selectWxappLink(function (b) {
                a && $(a).val(b).trigger("change")
            }, c)
        })
    }), $(document).on("click", ".js-selectWxappIcon", function () {
        var a = $(this).data("input"),
            b = $(this).data("element");
        if (a || b) {
            var c = $(this).data("type") || "wmall",
                d = {
                    type: c
                };
            irequire(["web/hello"], function (c) {
                c.selectWxappIcon(function (c) {
                    a && ($(a).children().eq(0).val(c.tabbar.normal).trigger("change"), $(a).children().eq(1).val(c.tabbar.active).trigger("change")), b && ($(b).children().eq(0).attr("src", c.url.normal), $(b).children().eq(1).attr("src", c.url.active))
                }, d)
            })
        }
    }), $(document).on("click", ".js-selectCategory", function () {
        var a = $(this).data("id-input"),
            b = $(this).data("title-input"),
            c = $(this).data("src-input"),
            d = $(this).data("element");
        a && b && irequire(["web/hello"], function (e) {
            e.selectCategory(function (e) {
                a && $(a).val(e.id).trigger("change"), b && $(b).val(e.title).trigger("change"), c && $(c).val(e.thumb_cn).trigger("change"), d && ($(d).find("img").attr("src", e.thumb_cn), $(d).find(".title").html(e.title))
            }, {
                mutil: 0
            })
        })
    }), $(document).on("click", ".js-selectIcon", function () {
        var a = $(this).data("input"),
            b = $(this).data("element");
        (a || b) && irequire(["web/hello"], function (c) {
            c.selectIcon(function (c) {
                a && $(a).val(c).trigger("change"), b && $(b).removeAttr("class").addClass("icon " + c)
            })
        })
    }), $(document).on("click", ".js-selectErranderPage", function () {
        var a = $(this).data("id-input"),
            b = $(this).data("title-input"),
            c = $(this).data("src-input"),
            d = $(this).data("element");
        a && b && irequire(["web/hello"], function (e) {
            e.selectErranderPage(function (e) {
                a && $(a).val(e.id).trigger("change"), b && $(b).val(e.name).trigger("change"), c && $(c).val(e.thumb_cn).trigger("change"), d && ($(d).find("img").attr("src", e.thumb_cn), $(d).find(".title").html(e.name))
            }, {
                mutil: 0
            })
        })
    });
    var form_validate_length = $(".form-validate").length,
        js_table_length = $(".js-table").length;
    form_validate_length || js_table_length ? (form_validate_length > 0 && irequire(["web/form"], function () {}), js_table_length > 0 && irequire(["web/table"], function () {})) : $("#page-loading").remove()
});