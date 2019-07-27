define(["jquery"], function ($) {
    var $table = $(".js-table"),
        $checkboxs = $('tbody tr td:first-child [type="checkbox"]', $table),
        $form = $table.closest("form"),
        $bottom_bar = $form.find(".js-bar"),
        $batch = $form.find(".js-batch");
    if ($table.length > 0) {
        $(document).on("change", '.js-table thead th:first [type="checkbox"]', function (a) {
            a && a.preventDefault();
            var b = $(this).closest("table"),
                c = $(this).prop("checked");
            $('tbody tr td:first-child [type="checkbox"]', b).prop("checked", c), c ? $bottom_bar.show() : $bottom_bar.hide()
        }), $(document).on("change", '.js-table tbody td:first-child [type="checkbox"]', function (a) {
            a && a.preventDefault();
            var b = $(this).closest("table"),
                c = $(this).prop("checked"),
                d = $('tbody tr td:first-child [type="checkbox"]:checked', b);
            $('thead th:first [type="checkbox"]', b).prop("checked", c && d.length == $checkboxs.length), d.length > 0 ? $bottom_bar.show() : $bottom_bar.hide()
        });
        var get_selecteds = function () {
            var a = $('tbody tr td:first-child [type="checkbox"]:checked', $table);
            return selecteds = a.map(function () {
                return $(this).val()
            }).get(), selecteds
        };
        $batch.on("click", function (e) {
            e.preventDefault();
            var $this = $(this),
                href = $this.attr("href") || $this.data("href") || $this.data("url"),
                html = $this.val() || $this.html(),
                type = $this.data("batch"),
                redirect = $this.data("redirect"),
                data = $this.data("set");
            button_type = $this.val() ? "input" : "button", $this.attr("disabled", "disabled");
            var chks = $('tbody tr td:first-child [type="checkbox"]:checked', $table),
                selecteds = get_selecteds();
            if (selecteds.length <= 0) return Notify.info("请先选择要操作的数据"), $this.removeAttr("disabled", "disabled"), !1;
            var submit = function () {
                "button" == button_type ? $this.html('<i class="fa fa-spinner fa-spin"></i> ' + Notify.lang.processing) : $this.val(Notify.lang.processing), "modal" != type ? $.post(href, {
                    id: selecteds
                }).done(function (a) {
                    var a = $.parseJSON(a),
                        b = a.message.errno,
                        c = a.message.url,
                        d = a.message.message;
                    if (b) "button" == button_type ? $this.html(html) : $this.val(html), Notify.error(d || Notify.lang.error);
                    else {
                        if ("remove" == $this.data("batch")) {
                            var e = $.Deferred();
                            $.when(function (a) {
                                var b = 0;
                                return chks.parents("tr").fadeOut(function () {
                                    $(this).remove(), b++, chks.length == b && a.resolve()
                                }), a
                            }(e)).done(function () {
                                $("table tbody tr", $table).length && "refresh" != redirect || window.location.reload()
                            })
                        } else Notify.success(d || Notify.lang.success, c);
                        "button" == button_type ? $this.html(html) : $this.val(html)
                    }
                }).fail(function () {
                    "button" == button_type ? $this.html(html) : $this.val(html), Notify.error(Notify.lang.exception)
                }) : ($("#js-modal").remove(), $.ajax(href, {
                    type: "get",
                    dataType: "html",
                    cache: !1,
                    data: {
                        id: selecteds
                    }
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
                }))
            };
            $this.data("confirm") ? Notify.confirm($this.data("confirm"), submit, function () {
                $this.removeAttr("disabled", "disabled")
            }) : submit()
        }), $(document).on("click", ".table-responsive .js-remove", function (a) {
            a.preventDefault();
            var b = $(this),
                c = b.attr("href") || b.data("href") || b.data("url"),
                d = b.data("confirm"),
                e = function () {
                    b.html('<i class="fa fa-spinner fa-spin"></i> ' + Notify.lang.processing), $.post(c).done(function (a) {
                        var a = $.parseJSON(a),
                            c = a.message.errno,
                            d = a.message.url,
                            e = a.message.message;
                        if (c) b.button("reset"), Notify.error(e || Notify.lang.error, d);
                        else {
                            var f = b.parents("tr");
                            f.length ? f.fadeOut(function () {
                                f.remove(), 0 == $table.find(".js-remove").length && window.location.reload()
                            }) : Notify.success("操作成功", location.href)
                        }
                    }).fail(function () {
                        b.button("reset"), Notify.error(Notify.lang.exception)
                    })
                };
            d ? Notify.confirm(d, e, function () {
                b.removeAttr("disabled", "disabled")
            }) : e()
        }), $("#page-loading").remove()
    }
});