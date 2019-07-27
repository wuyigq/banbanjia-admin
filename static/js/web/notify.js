define(function (a, b, c) {
    var d = {};
    d.lang = {
        success: "操作成功",
        error: "操作失败",
        exception: "网络异常",
        processing: "处理中...",
        empty: "该项不能为空"
    }, d.confirm = function (a, b, c, d, e) {
        irequire(["jquery.confirm"], function () {
            $.confirm({
                title: "提示",
                content: a,
                confirmButtonClass: "btn-primary",
                cancelButtonClass: "btn-default",
                confirmButton: d || "确 定",
                cancelButton: e || "取 消",
                animation: "top",
                confirm: function () {
                    b && "function" == typeof b && b()
                }, cancel: function () {
                    c && "function" == typeof c && c()
                }
            })
        })
    }, d.alert = function (a, b) {
        irequire(["jquery.confirm"], function () {
            $.alert({
                title: "提示",
                content: a,
                confirmButtonClass: "btn-primary",
                confirmButton: "确 定",
                animation: "top",
                confirm: function () {
                    b && "function" == typeof b && b()
                }
            })
        })
    }, 0 == $("div.message-box", top.window.document).length && $("body", top.window.document).append('<div class="message-box"></div>');
    var e = function (a, b) {
        return this.$element = $(a), this.$note = $('<span class="msg"></span>'), this.options = $.extend({}, {
            type: "success",
            delay: 3e3,
            message: ""
        }, b), this.$note.addClass(this.options.type ? "msg-" + this.options.type : "msg-success"), this.options.message && this.$note.html(this.options.message), this
    };
    e.prototype.show = function () {
        if (this.$element.addClass("in"), this.$element.html(this.$note), this.options.autoClose || !0) {
            var a = this;
            setTimeout(function () {
                a.close()
            }, this.options.delay || 2e3)
        }
    }, e.prototype.close = function () {
        var a = this;
        a.$element.removeClass("in").transitionEnd(function () {
            a.$element.empty(), a.options.onClosed && a.options.onClosed(a)
        }), a.options.onClose && a.options.onClose(a)
    }, $.fn.Tip = function (a) {
        return new e(this, a)
    }, window.msgbox = $("div.message-box", top.window.document), d.success = function (a, b, c, e) {
        d.message.success(a, b, c, e)
    }, d.error = function (a, b, c, e) {
        d.message.error(a, b, c, e)
    }, d.info = function (a, b, c, e) {
        d.message.info(a, b, c, e)
    }, d.message = {
        show: function (a) {
            if (a.url && (a.url = a.url.replace(/&amp;/gi, "&"), a.onClose = function () {
                redirect(a.url)
            }), a.message && a.message.length > 17) return void d.alert(a.message, function () {
                a.url && redirect(a.url)
            });
            notify = window.msgbox.Tip(a), notify.show()
        }, success: function (a, b, c, e) {
            d.message.show({
                delay: 2e3,
                type: "success",
                message: a,
                url: b,
                onClose: c,
                onClosed: e
            })
        }, error: function (a, b, c, e) {
            d.message.show({
                delay: 2e3,
                type: "error",
                message: a,
                url: b,
                onClose: c,
                onClosed: e
            })
        }, info: function (a, b, c, e) {
            d.message.show({
                delay: 2e3,
                type: "info",
                message: a,
                url: b,
                onClose: c,
                onClosed: e
            })
        }
    }, window.Notify = d
});