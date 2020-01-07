define(["jquery.ui"], function (a) {
    var b = {
        sysinfo: null,
        id: 0,
        store_id: 0,
        type: 0,
        navs: {},
        initPart: [],
        data: {},
        selected: "page",
        childid: null,
        keyworderr: !1
    };
    return jQuery.base64 = function (a) {
        function b(a, b) {
            var c = h.indexOf(a.charAt(b));
            if (-1 === c) throw "Cannot decode base64";
            return c
        }
        function c(a, b) {
            for (; a.length > 0;) {
                var c = a[0];
                if (c < 128) a.shift(),
                    b.push(String.fromCharCode(c));
                else if (192 == (128 & c)) {
                    if (a.length < 2) break;
                    c = a.shift();
                    var d = a.shift();
                    b.push(String.fromCharCode(((31 & c) << 6) + (63 & d)))
                } else {
                    if (a.length < 3) break;
                    c = a.shift();
                    var d = a.shift(),
                        e = a.shift();
                    b.push(String.fromCharCode(((15 & c) << 12) + ((63 & d) << 6) + (63 & e)))
                }
            }
        }
        function d(a) {
            var d, e, f = 0,
                h = a.length,
                i = [],
                j = [];
            if (a = String(a), 0 === h) return a;
            if (h % 4 != 0) throw "Cannot decode base64";
            for (a.charAt(h - 1) === g && (f = 1, a.charAt(h - 2) === g && (f = 2), h -= 4), d = 0; d < h; d += 4) {
                b(a, d),
                    b(a, d + 1),
                    b(a, d + 2),
                    b(a, d + 3);
                e = b(a, d) << 18 | b(a, d + 1) << 12 | b(a, d + 2) << 6 | b(a, d + 3),
                    j.push(e >> 16),
                    j.push(e >> 8 & 255),
                    j.push(255 & e),
                    c(j, i)
            }
            switch (f) {
                case 1:
                    e = b(a, d) << 18 | b(a, d + 1) << 12 | b(a, d + 2) << 6,
                        j.push(e >> 16),
                        j.push(e >> 8 & 255);
                    break;
                case 2:
                    e = b(a, d) << 18 | b(a, d + 1) << 12,
                        j.push(e >> 16)
            }
            if (c(j, i), j.length > 0) throw "Cannot decode base64";
            return i.join("")
        }
        function e(a, b) {
            a < 128 ? b.push(a) : a < 2048 ? (b.push(192 + (a >> 6 & 31)), b.push(128 + (63 & a))) : (b.push(224 + (a >> 12 & 15)), b.push(128 + (a >> 6 & 63)), b.push(128 + (63 & a)))
        }
        function f(a) {
            if (1 !== arguments.length) throw "SyntaxError: exactly one argument required";
            if (a = String(a), 0 === a.length) return a;
            var b, c, d = [],
                f = [],
                i = a.length;
            for (b = 0; b < i;) {
                for (e(a.charCodeAt(b), d); d.length >= 3;) {
                    var j = d.shift(),
                        k = d.shift();
                    c = j << 16 | k << 8 | d.shift(),
                        f.push(h.charAt(c >> 18)),
                        f.push(h.charAt(c >> 12 & 63)),
                        f.push(h.charAt(c >> 6 & 63)),
                        f.push(h.charAt(63 & c))
                }
                b++
            }
            switch (d.length) {
                case 1:
                    c = d.shift() << 16,
                        f.push(h.charAt(c >> 18) + h.charAt(c >> 12 & 63) + g + g);
                    break;
                case 2:
                    var j = d.shift(),
                        k = d.shift();
                    c = j << 16 | k << 8,
                        f.push(h.charAt(c >> 18) + h.charAt(c >> 12 & 63) + h.charAt(c >> 6 & 63) + g)
            }
            return f.join("")
        }
        var g = "=",
            h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        return {
            decode: d,
            encode: f,
            VERSION: "1.1"
        }
    }(jQuery),
        b.init = function (a) {
            window.tmodtpl = a.tmodtpl,
                b.attachurl = a.attachurl,
                b.type = a.type,
                b.data = a.data,
                b.id = a.id,
                b.store_id = a.store_id,
                b.mallset = a.mallset,
                b.diymenu = a.diymenu,
                b.storeactivity = a.storeactivity,
                b.plugins = a.plugins,
                b.has_gohome = b.checkPluginExist("gohome"),
                b.data && (b.page = b.data.page, b.page.thumb || (b.page.thumb = ""), b.page.diymenu || (b.page.diymenu = -1), b.items = b.data.items),
                b.initTpl(),
                b.initPage(),
                b.initItems(),
                b.initParts(),
                b.initSortable(),
                b.initGotop(),
                b.initSave(),
                $("#page").unbind("click").click(function () {
                    "page" != b.selected && (b.selected = "page", b.initPage())
                })
        },
        b.initItems = function (a) {
            var c = $("#app-preview");
            if (!b.items) return void (b.items = {});
            c.empty(),
                console.log('items: ', b.items)
            $.each(b.items, function (a, b) {
                if (void 0 !== b.id) {
                    var d = $.extend(!0, {}, b);
                    d.itemid = a;
                    var e = tmodtpl("tpl-show-" + b.id, d);
                    c.append(e)
                }
            });
            var d = $("#tpl-editor-del").html();
            $("#app-preview .drag").append(d),
                $("#app-preview .drag .btn-edit-del .btn-del").unbind("click").click(function (a) {
                    a.stopPropagation();
                    var c = $(this).closest(".drag"),
                        d = c.data("itemid");
                    if ($(this).closest(".drag").hasClass("nodelete")) return void Notify.error("此组建禁止删除");
                    Notify.confirm("确定删除吗", function () {
                        var a = b.getNear(d);
                        delete b.items[d],
                            b.initItems(),
                            a ? $(document).find(".drag[data-itemid='" + a + "']").trigger("mousedown") : $("#page").trigger("click")
                    })
                }),
                a && b.selectedItem(a)
        },
        b.selectedItem = function (a) {
            a && (b.selected = a, "page" == a ? $("#page").trigger("click") : $(".drag[data-itemid='" + a + "']").addClass("selected"))
        },
        b.initPage = function (a) {
            void 0 === a && (a = !0),
                b.page || (b.page = {
                    type: 3 == b.type ? "home" : b.type,
                    title: "请输入页面标题",
                    name: "未命名页面",
                    thumb: "",
                    desc: "",
                    keyword: "",
                    background: "#F3F3F3",
                    diygotop: "0",
                    navigationbackground: "#000000",
                    navigationtextcolor: "#ffffff",
                    diymenu: "-1",
                    followbar: 0
                }),
                b.page.type = b.type,
                $("#page").text(b.page.title),
                $("#page").css({
                    "background-color": b.page.navigationbackground,
                    color: b.page.navigationtextcolor
                }),
                $("#app-preview").css({
                    "background-color": b.page.background
                }),
                $("#app-preview").find(".drag").removeClass("selected"),
                a && b.initEditor()
        },
        b.initParts = function () {
            b.getParts();
            var a = {
                0: ["picture", "title", "img_card", "banner", "picturew", "listmenu", "buttons", "richtext", "line", "blank", "copyright"],
                1: ["fixedsearch", "searchbar", "navs", "notice", "activity", "danmu", "selective", "bargain", "waimai_goods", "goodsTab", "waimai_stores", "storesTab", "waimai_allstores", "selftake_stores", "brand_stores", "graphic", "listmenu", "cart", "redpacket", "guide", "service", "urltags"],
                2: ["memberHeader", "memberBindMobile", "blockNav"],
                3: ["operation", "info", "tags", "coupon", "onsale", "evaluate"],
                4: ["fixedsearch", "searchbar", "navs", "notice", "activity", "danmu", "graphic", "listmenu", "guide", "service"],
                5: ["fixedsearch", "searchbar", "navs", "notice", "activity", "danmu", "selective", "bargain", "waimai_goods", "waimai_stores", "graphic", "listmenu", "cart", "guide", "service"]
            };
            if (b.checkPluginExist("svip") && (a[1].push("svipGuide"), a[2].push("svipGuide")),
            // b.has_gohome && 2 != b.type && a[0].push("gohomeActivity"), 
            // !b.has_gohome || 1 != b.type && 4 != b.type && 5 != b.type || a[0].push("haodianGroup"),
            b.has_gohome && 4 == b.type && ( a[0].push("article"), a[0].push("articleStatistics")),
            b.has_gohome && 5 == b.type && (a[0].push("haodianList"), a[0].push("haodianSettle")), b.type > 0 && a[b.type]) var c = b.iconcat(a[b.type], a[0]);
            else var c = a[0];
            $.each(c, function (a, c) {
                var d = b.parts[c];
                d && (d.id = c, b.initPart.push(d))
            });
            var d = tmodtpl("tpl-parts", b);
            $("#parts").html(d).show(),
                $("#parts nav").unbind("click").click(function () {
                    var a = $(this).data("id");
                    if ("page" === a) return void $("#page").trigger("click");
                    if ($.inArray(a, c) < 0) return void Notify.error("此页面组建不存在！");
                    var d = $.extend(!0, {}, b.parts[a]);
                    if (delete d.name, !d) return void Notify.error("未找到此元素！");
                    var e = $("#tpl-show-" + a).length,
                        f = $("#tpl-editor-" + a).length;
                    if (0 == e || 0 == f) return void Notify.error("添加失败！模板错误，请刷新页面重试");
                    var g = b.getId("M", 0);
                    if (d.data) {
                        var h = $.extend(!0, {}, d.data),
                            i = {},
                            j = 0;
                        $.each(h, function (a, c) {
                            var d = b.getId("C", j);
                            i[d] = c,
                                delete d,
                                j++
                        }),
                            d.data = i
                    }
                    if (d.max && d.max > 0) {
                        var k = b.getItemNum(a);
                        if (k > 0 && k >= d.max) return void Notify.error("此元素最多允许添加 " + d.max + " 个")
                    }
                    var l = !0;
                    if (b.selected && "page" != b.selected) {
                        var m = b.items[b.selected],
                            n = [];
                        n.length > 0 && -1 != $.inArray(m.id, n) && (l = !1)
                    }
                    if (d.istop) {
                        var o = {};
                        o[g] = d,
                            $.each(b.items, function (a, b) {
                                o[a] = b
                            }),
                            b.items = o
                    } else if (b.selected && "page" != b.selected && l) {
                        var o = {};
                        $.each(b.items, function (a, c) {
                            o[a] = c,
                                a == b.selected && (o[g] = d)
                        }),
                            b.items = o
                    } else b.items[g] = d;
                    var p = {},
                        q = [],
                        r = {};
                    if ($.each(b.items, function (a, b) {
                        b.isbottom ? (b.key = a, q.push(b)) : p[a] = b
                    }), q.length > 0) {
                        q.sort(function (a) {
                            return function (b, c) {
                                return b[a] - c[a]
                            }
                        }("priority"));
                        for (var s = 0; s < q.length; s++) {
                            var d = q[s],
                                t = d.key;
                            delete d.key,
                                r[t] = d
                        }
                    }
                    b.items = $.extend({}, p, r),
                        b.initItems(),
                        $(".drag[data-itemid='" + g + "']").trigger("mousedown").trigger("click"),
                        b.selected = g
                })
        },
        b.getId = function (a, b) {
            return a + (+new Date + b)
        },
        b.getParts = function () {
            b.parts = {
                img_card: {
                    name: "图片标题",
                    params: {
                        imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/img-card-1.jpg"
                    },
                    style: {
                        paddingtop: "0",
                        paddingleft: "0"
                    }
                },
                banner: {
                    name: "单图组",
                    params: {},
                    style: {
                        paddingtop: "0",
                        paddingleft: "0",
                        background: "#fafafa"
                    },
                    data: {
                        C0123456789101: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/banner-1.jpg?t=1",
                            linkurl: ""
                        },
                        C0123456789102: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/banner-2.jpg",
                            linkurl: ""
                        }
                    }
                },
                picture: {
                    name: "图片轮播",
                    params: {
                        picturedata: 0,
                        has_gohome: b.has_gohome
                    },
                    style: {
                        paddingtop: "0",
                        paddingleft: "0",
                        dotbackground: "#ff2d4b",
                        background: "#fafafa"
                    },
                    data: {
                        C0123456789101: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/picture-1.jpg",
                            linkurl: ""
                        },
                        C0123456789102: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/picture-2.jpg",
                            linkurl: ""
                        }
                    }
                },
                searchbar: {
                    name: "搜索框",
                    params: {
                        placeholder: "请输入关键字进行搜索"
                    },
                    style: {
                        background: "#f1f1f2",
                        inputbackground: "#ffffff",
                        color: "#999999",
                        iconcolor: "#b4b4b4",
                        paddingtop: 10,
                        paddingleft: 10,
                        searchstyle: "",
                        textalign: "left"
                    }
                },
                richtext: {
                    name: "富文本",
                    params: {
                        content: ""
                    },
                    style: {
                        background: "#ffffff",
                        paddingleft: "0",
                        paddingtop: "0"
                    }
                },
                title: {
                    name: "标题栏",
                    params: {
                        title: "请输入标题",
                        icon: "",
                        linkurl: ""
                    },
                    style: {
                        style: 1,
                        background: "#ffffff",
                        color: "#666666",
                        textalign: "left",
                        fontsize: "12",
                        paddingtop: "5",
                        paddingleft: "5"
                    }
                },
                line: {
                    name: "辅助线",
                    params: {},
                    style: {
                        height: "2",
                        background: "#ffffff",
                        border: "#000000",
                        padding: "10",
                        linestyle: "solid"
                    }
                },
                blank: {
                    name: "辅助空白",
                    params: {},
                    style: {
                        height: "15",
                        background: "#f5f5f5"
                    }
                },
                picturew: {
                    name: "图片橱窗",
                    params: {
                        row: "1",
                        showtype: 0,
                        pagenum: "2"
                    },
                    style: {
                        paddingtop: "0",
                        paddingleft: "0",
                        showdot: 0,
                        dotbackground: "#ff2d4b",
                        background: "#fafafa"
                    },
                    data: {
                        C0123456789101: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/cube-1.jpg",
                            linkurl: ""
                        },
                        C0123456789102: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/cube-2.jpg",
                            linkurl: ""
                        },
                        C0123456789103: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/cube-1.jpg",
                            linkurl: ""
                        },
                        C0123456789104: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/cube-2.jpg",
                            linkurl: ""
                        },
                        C0123456789105: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/cube-1.jpg",
                            linkurl: ""
                        },
                        C0123456789106: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/cube-2.jpg",
                            linkurl: ""
                        }
                    }
                },
                navs: {
                    name: "导航栏",
                    params: {
                        showtype: 0,
                        showdot: 0,
                        rownum: "4",
                        pagenum: "8",
                        navsdata: 0,
                        navsnum: "4",
                        has_gohome: b.has_gohome
                    },
                    style: {
                        margintop: "0",
                        navstyle: "",
                        dotbackground: "#ff2d4b"
                    },
                    data: {
                        C0123456789101: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-1.png",
                            linkurl: "",
                            text: "导航文字1",
                            color: "#666666"
                        },
                        C0123456789102: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-2.png",
                            linkurl: "",
                            text: "导航文字2",
                            color: "#666666"
                        },
                        C0123456789103: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-3.png",
                            linkurl: "",
                            text: "导航文字3",
                            color: "#666666"
                        },
                        C0123456789104: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-4.png",
                            linkurl: "",
                            text: "导航文字4",
                            color: "#666666"
                        }
                    }
                },
                activity: {
                    name: "活动组",
                    style: {
                        background: "#ffffff",
                        marginTop: 10,
                        marginBottom: 10
                    },
                    params: {
                        activitydata: 0
                    },
                    data: {
                        C0123456789101: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-1.png",
                            linkurl: "",
                            text: "活动一",
                            color: "#ff2d4b",
                            placeholder: "活动提示",
                            placeholderColor: "#7b7b7b"
                        },
                        C0123456789102: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-2.png",
                            linkurl: "",
                            text: "活动二",
                            color: "#ff2d4b",
                            placeholder: "活动提示",
                            placeholderColor: "#7b7b7b"
                        }
                    }
                },
                buttons: {
                    name: "按钮组",
                    params: {
                        rownum: "4",
                        buttonsnum: "4"
                    },
                    style: {
                        margintop: "0",
                        backgroundcolor: "#EAEEF1"
                    },
                    data: {
                        C0123456789101: {
                            linkurl: "",
                            text: "按钮1",
                            color: "#666666",
                            backgroundcolor: "#F5F5F5"
                        },
                        C0123456789102: {
                            linkurl: "",
                            text: "按钮2",
                            color: "#666666",
                            backgroundcolor: "#F5F5F5"
                        },
                        C0123456789103: {
                            linkurl: "",
                            text: "按钮3",
                            color: "#666666",
                            backgroundcolor: "#F5F5F5"
                        },
                        C0123456789104: {
                            linkurl: "",
                            text: "按钮4",
                            color: "#666666",
                            backgroundcolor: "#F5F5F5"
                        }
                    }
                },
                graphic: {
                    name: "导航栏1",
                    params: {},
                    style: {
                        paddingtop: "5",
                        paddingleft: "5",
                        cardbackground: "#efeff4",
                        titlecolor: "#333333",
                        subheadcolor: "#606060",
                        background: "#fafafa"
                    },
                    data: {
                        C0123456789101: {
                            title: "来包香烟",
                            subhead: "25分钟送达",
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-5.png",
                            linkurl: ""
                        },
                        C0123456789102: {
                            title: "生活用品",
                            subhead: "25分钟送达",
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-6.png",
                            linkurl: ""
                        },
                        C0123456789103: {
                            title: "常用药品",
                            subhead: "30分钟送达",
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-7.png",
                            linkurl: ""
                        },
                        C0123456789104: {
                            title: "咖啡奶茶",
                            subhead: "25分钟送达",
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-8.png",
                            linkurl: ""
                        }
                    }
                },
                notice: {
                    name: "公告",
                    params: {
                        noticedata: 0,
                        noticenum: 5,
                        speed: 2,
                        imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/hotdot.png",
                        has_gohome: b.has_gohome
                    },
                    style: {
                        paddingtop: "0",
                        paddingleft: "0",
                        textcolor: "#666666",
                        iconcolor: "#fd5454",
                        background: "#ffffff"
                    },
                    data: {
                        C0123456789101: {
                            linkurl: "",
                            title: "这里是第一条自定义公告的标题"
                        },
                        C0123456789102: {
                            linkurl: "",
                            title: "这里是第二条自定义公告的标题"
                        },
                        C0123456789103: {
                            linkurl: "",
                            title: "这里是第三条自定义公告的标题"
                        }
                    }
                },
                danmu: {
                    name: "订单弹幕",
                    params: {
                        status: 1,
                        styleType: 1,
                        dataType: 1,
                        starttime: 5,
                        endtime: 60
                    },
                    style: {
                        background: "#ff2d4b",
                        color: "#ffffff",
                        opacity: "0.7",
                        top: 60,
                        left: 10
                    },
                    data: {},
                    max: 1
                },
                waimai_goods: {
                    name: "商品组",
                    params: {
                        goodstype: "0",
                        showtitle: "1",
                        showprice: "1",
                        showoldprice: "1",
                        showtag: "0",
                        goodsdata: "0",
                        goodssort: "0",
                        goodsnum: "6",
                        showicon: "1",
                        iconposition: "left top",
                        buybtntext: "立即抢购",
                        goodsiconsrc: "",
                        storeshow: "1"
                    },
                    style: {
                        background: "#fafafa",
                        paddingtop: "10",
                        paddingleft: "0",
                        marginbottom: "0",
                        liststyle: "1",
                        goodsicon: "recommand",
                        titlecolor: "#333",
                        pricecolor: "#fb4e44",
                        oldpricecolor: "#999",
                        buybtncolor: "#fb4e44",
                        iconpaddingtop: "0",
                        iconpaddingleft: "0",
                        iconzoom: "100",
                        tagbackground: "#fe5455",
                        salescolor: "#777777"
                    },
                    data: {
                        C0123456789101: {
                            sid: "0",
                            goods_id: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                            price: "20.00",
                            old_price: "10.00",
                            title: "这里是商品标题",
                            store_title: "这里是门店名称",
                            discount: "5",
                            sailed: "20",
                            comment_good_percent: "88%",
                            store: {
                                id: "1",
                                title: "这里是门店名称",
                                logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                                send_price: "15",
                                delivery_price: "5",
                                delivery_time: "30"
                            }
                        },
                        C0123456789102: {
                            sid: "0",
                            goods_id: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                            price: "20.00",
                            old_price: "10.00",
                            title: "这里是商品标题",
                            store_title: "这里是门店名称",
                            discount: "5",
                            sailed: "20",
                            comment_good_percent: "88%",
                            store: {
                                id: "1",
                                title: "这里是门店名称",
                                logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                                send_price: "15",
                                delivery_price: "5",
                                delivery_time: "30"
                            }
                        },
                        C0123456789103: {
                            sid: "0",
                            goods_id: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-3.jpg",
                            price: "20.00",
                            old_price: "10.00",
                            title: "这里是商品标题",
                            store_title: "这里是门店名称",
                            discount: "5",
                            sailed: "20",
                            comment_good_percent: "88%",
                            store: {
                                id: "1",
                                title: "这里是门店名称",
                                logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                                send_price: "15",
                                delivery_price: "5",
                                delivery_time: "30"
                            }
                        },
                        C0123456789104: {
                            sid: "0",
                            goods_id: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-4.jpg",
                            price: "20.00",
                            old_price: "10.00",
                            title: "这里是商品标题",
                            store_title: "这里是门店名称",
                            discount: "5",
                            sailed: "20",
                            comment_good_percent: "88%",
                            store: {
                                id: "1",
                                title: "这里是门店名称",
                                logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-4.jpg",
                                send_price: "15",
                                delivery_price: "5",
                                delivery_time: "30"
                            }
                        }
                    }
                },
                waimai_stores: {
                    name: "商户组",
                    params: {
                        showdiscount: "1",
                        discountstyle: "1",
                        showhotgoods: "1",
                        storedata: "0",
                        storenum: "6",
                        categoryid: "0",
                        categoryname: "请选择分类",
                        activitytype: "discount",
                        storeactivity: b.storeactivity
                    },
                    style: {
                        background: "#fafafa",
                        paddingtop: "10",
                        paddingleft: "0",
                        titlecolor: "#333",
                        scorecolor: "#ff2d4b",
                        deliverytitlebgcolor: "#ff2d4b",
                        deliverytitlecolor: "#fff"
                    },
                    data: {
                        C0123456789101: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            title: "这里是门店名称",
                            score: "5",
                            sailed: "888",
                            send_price: "15",
                            delivery_price: "5",
                            delivery_title: "平台专送",
                            delivery_time: 30,
                            activity: {
                                items: {
                                    C0123456789101: {
                                        type: "discount",
                                        title: "满35减12;满60减20"
                                    },
                                    C0123456789102: {
                                        type: "couponCollect",
                                        title: "可领2元代金券"
                                    }
                                },
                                num: 2
                            },
                            hot_goods: {
                                C0123456789101: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                },
                                C0123456789102: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                },
                                C0123456789103: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-3.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                }
                            }
                        },
                        C0123456789102: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                            title: "这里是门店名称",
                            score: "5",
                            sailed: "888",
                            send_price: "15",
                            delivery_price: "5",
                            delivery_title: "平台专送",
                            delivery_time: 45
                        },
                        C0123456789103: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                            title: "这里是门店名称",
                            score: "5",
                            sailed: "888",
                            send_price: "15",
                            delivery_price: "5",
                            delivery_title: "平台专送",
                            delivery_time: 55,
                            hot_goods: {
                                C0123456789101: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-4.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                },
                                C0123456789102: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-5.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                }
                            }
                        }
                    }
                },
                copyright: {
                    name: "版权",
                    params: {
                        datafrom: 0,
                        content: "请填写版权说明",
                        imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/copyright.png",
                        config: ""
                    },
                    style: {
                        showimg: 1,
                        style: 1,
                        color: "#CECECE",
                        background: "#ffffff"
                    },
                    max: 1,
                    isbottom: 1,
                    priority: 2
                },
                listmenu: {
                    name: "列表导航",
                    params: {},
                    style: {
                        paddingtop: 10,
                        background: "#ffffff",
                        iconcolor: "#999999",
                        color: "#000000",
                        remarkcolor: "#888888"
                    },
                    data: {
                        C0123456789101: {
                            icon: "icon-shop",
                            text: "文字1",
                            remark: "查看",
                            link: ""
                        },
                        C0123456789102: {
                            icon: "icon-shop",
                            text: "文字2",
                            remark: "查看",
                            line: ""
                        },
                        C0123456789103: {
                            icon: "icon-shop",
                            text: "文字3",
                            remark: "查看",
                            line: ""
                        }
                    }
                },
                fixedsearch: {
                    name: "定位搜索框",
                    params: {
                        location: "定位",
                        text: "请输入商户或商品名称",
                        linkto: 0,
                        has_gohome: b.has_gohome
                    },
                    style: {
                        locstyle: "round",
                        searchstyle: "round",
                        fixedbackground: "#ffffff",
                        locbackground: "#999999",
                        searchbackground: "#f4f4f4",
                        loccolor: "#ffffff",
                        searchcolor: "#656565"
                    },
                    max: 1,
                    istop: 1
                },
                selective: {
                    name: "为您优选",
                    params: {
                        showtype: 0,
                        pagenum: 6,
                        storedata: 0,
                        storenum: 6,
                        title: "为您优选"
                    },
                    style: {
                        margintop: 0,
                        titlecolor: "#333333",
                        storecolor: "#333333",
                        dotbackground: "#ff2d4b",
                        showdot: 0
                    },
                    data: {
                        C0123456789101: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            title: "这里是门店名称",
                            score: "5"
                        },
                        C0123456789102: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                            title: "这里是门店名称",
                            score: "5"
                        },
                        C0123456789103: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                            title: "这里是门店名称",
                            score: "5"
                        }
                    }
                },
                waimai_allstores: {
                    name: "商户列表",
                    params: {
                        showdiscount: 1,
                        discountstyle: 1,
                        showhotgoods: 1,
                        hotgoodsnum: 3,
                        datafrom: 0,
                        categoryid: 0,
                        categorytitle: "商户分类",
                        showchildcategory: 0,
                        store_categorys: []
                    },
                    style: {
                        margintop: "0",
                        titlecolor: "#333",
                        scorecolor: "#ff2d4b",
                        deliverytitlebgcolor: "#ff2d4b",
                        deliverytitlecolor: "#fff",
                        childcategorycolor: "#333333",
                        childcategoryactivecolor: "#ff2d4b"
                    },
                    data: {
                        C0123456789101: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            title: "这里是门店名称",
                            score: "5",
                            sailed: "888",
                            send_price: "15",
                            delivery_price: "5",
                            delivery_title: "平台专送",
                            delivery_time: 30,
                            activity: {
                                items: {
                                    C0123456789101: {
                                        type: "discount",
                                        title: "满35减12;满60减20"
                                    },
                                    C0123456789102: {
                                        type: "couponCollect",
                                        title: "可领2元代金券"
                                    }
                                },
                                num: 2
                            },
                            hot_goods: {
                                C0123456789101: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                },
                                C0123456789102: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                },
                                C0123456789103: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-3.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                }
                            }
                        },
                        C0123456789102: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                            title: "这里是门店名称",
                            score: "5",
                            sailed: "888",
                            send_price: "15",
                            delivery_price: "5",
                            delivery_title: "平台专送",
                            delivery_time: 45,
                            hot_goods: {
                                C0123456789101: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                },
                                C0123456789102: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                },
                                C0123456789103: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-3.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                }
                            }
                        },
                        C0123456789103: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                            title: "这里是门店名称",
                            score: "5",
                            sailed: "888",
                            send_price: "15",
                            delivery_price: "5",
                            delivery_title: "平台专送",
                            delivery_time: 55,
                            hot_goods: {
                                C0123456789101: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-4.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                },
                                C0123456789102: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-5.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%"
                                }
                            }
                        }
                    },
                    max: 1,
                    isbottom: 1,
                    priority: 1
                },
                bargain: {
                    name: "天天特价",
                    params: {
                        showtype: 0,
                        pagenum: 4,
                        title: "天天特价",
                        bargainnum: 4
                    },
                    style: {
                        margintop: 0,
                        dotbackground: "#ff2d4b",
                        titlecolor: "#333333",
                        goodsnamecolor: "#333333"
                    },
                    data: {
                        C0123456789101: {
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            title: "水煮肉片",
                            score: "5",
                            discount_price: "10",
                            price: "20",
                            discount: "5.0",
                            store_title: "这里是门店名称"
                        },
                        C0123456789102: {
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                            title: "青椒肉丝",
                            score: "5",
                            discount_price: "10",
                            price: "20",
                            discount: "5.0",
                            store_title: "这里是门店名称"
                        },
                        C0123456789103: {
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                            title: "青笋肉片",
                            score: "5",
                            discount_price: "10",
                            price: "20",
                            discount: "5.0",
                            store_title: "这里是门店名称"
                        },
                        C0123456789104: {
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-4.jpg",
                            title: "青笋肉片",
                            score: "5",
                            discount_price: "10",
                            price: "20",
                            discount: "5.0",
                            store_title: "这里是门店名称"
                        }
                    }
                },
                selftake_stores: {
                    name: "到店自取",
                    params: {
                        title: "到店自取",
                        storedata: 1,
                        storenum: 4
                    },
                    style: {
                        margintop: 0,
                        background: "#fff",
                        titlecolor: "#333333",
                        storetitlecolor: "#333333",
                        distancecolor: "#ffffff",
                        distancebackgroundcolor: "#ff2d4b",
                        feecolor: "#ff2d4b",
                        feebackgroundcolor: "#ffdbd5"
                    },
                    data: {
                        C0123456789101: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            title: "这里是门店名称",
                            distance: "1.5",
                            delivery_price: "5.5",
                            activity: {
                                items: {
                                    C0123456789101: {
                                        type: "discount"
                                    },
                                    C0123456789102: {
                                        type: "couponCollect"
                                    },
                                    C0123456789103: {
                                        type: "grant"
                                    },
                                    C0123456789104: {
                                        type: "couponGrant"
                                    }
                                },
                                num: 4
                            }
                        },
                        C0123456789102: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                            title: "这里是门店名称",
                            distance: "0.3",
                            delivery_price: "3.0",
                            activity: {
                                items: {
                                    C0123456789101: {
                                        type: "discount"
                                    },
                                    C0123456789102: {
                                        type: "couponCollect"
                                    },
                                    C0123456789103: {
                                        type: "grant"
                                    },
                                    C0123456789104: {
                                        type: "couponGrant"
                                    }
                                },
                                num: 4
                            }
                        }
                    }
                },
                cart: {
                    name: "购物车",
                    params: {
                        showcart: "1"
                    },
                    max: 1
                },
                redpacket: {
                    name: "超级红包",
                    params: {
                        showredpacket: "1"
                    },
                    max: 1
                },
                guide: {
                    name: "启动图",
                    params: {
                        status: 1,
                        show_setting: "everytime",
                        interval_time: 60,
                        guidedata: 0
                    },
                    style: {
                        backgroundcolor: "#000000"
                    },
                    data: {
                        C0123456789101: {
                            pagePath: "pages/home/index",
                            imgUrl: "https://1.xinzuowl.com/attachment/images/1/2017/03/qra8AS8rF5m8MUom19Bo521maA8oF8.jpg"
                        },
                        C0123456789102: {
                            pagePath: "pages/home/index",
                            imgUrl: "https://1.xinzuowl.com/attachment/images/1/2016/11/yammcm8C22RvxXR2E2RrRX262rHkZP.jpg"
                        },
                        C0123456789103: {
                            pagePath: "pages/home/index",
                            imgUrl: "https://1.xinzuowl.com/attachment/images/1/2016/11/z6KuY8xzb8NnKb0B1cW6wK46W9Dlnu.jpg"
                        }
                    },
                    max: 1
                },
                memberHeader: {
                    name: "会员中心头部",
                    params: {
                        headerstyle: "color",
                        backgroundimgurl: "",
                        leftbtn: {
                            text: "我的订单",
                            linkurl: ""
                        },
                        rightbtn: {
                            text: "我的钱包",
                            linkurl: ""
                        }
                    },
                    style: {
                        background: "rgba(236, 65, 73, 0.7428571428571428)",
                    }
                },
                memberBindMobile: {
                    name: "绑定手机",
                    params: {
                        placeholdertext: "如果您用手机号注册过会员或您想通过微信外购物请绑定您的手机号码"
                    },
                    style: {
                        margintop: 0,
                        background: "#ffffff",
                        titlecolor: "#ff0011",
                        placeholdercolor: "#999999"
                    }
                },
                blockNav: {
                    name: "导航块",
                    params: {
                        navstyle: "icon",
                        has_placeholder: 1,
                        has_title: 0,
                        title: "我的资产"
                    },
                    style: {
                        margintop: 0,
                        background: "#ffffff",
                        titlecolor: "#000000"
                    },
                    data: {
                        C0123456789101: {
                            icon: "icon-money",
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-1.png",
                            linkurl: "",
                            text: "我的红包",
                            textcolor: "#000000",
                            placeholder: "4个未使用",
                            placeholdercolor: "#cccccc",
                            iconcolor: "#676A6B",
                            marktext: "hot",
                            markcolor: "#ffffff",
                            markbackground: "#FE4C44"
                        },
                        C0123456789102: {
                            icon: "icon-iconpiaoquan01",
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-2.png",
                            linkurl: "",
                            text: "我的代金券",
                            textcolor: "#000000",
                            placeholder: "9个未使用",
                            placeholdercolor: "#cccccc",
                            iconcolor: "#676A6B",
                            marktext: "hot",
                            markcolor: "#ffffff",
                            markbackground: "#FE4C44"
                        },
                        C0123456789103: {
                            icon: "icon-vipcard",
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-3.png",
                            linkurl: "",
                            text: "配送会员卡",
                            textcolor: "#000000",
                            placeholder: "暂未购买",
                            placeholdercolor: "#cccccc",
                            iconcolor: "#676A6B",
                            marktext: "hot",
                            markcolor: "#ffffff",
                            markbackground: "#FE4C44"
                        }
                    }
                },
                operation: {
                    name: "操作导航",
                    params: {},
                    style: {
                        margintop: "0",
                        style: 2,
                        navstyle: "radius"
                    },
                    data: {
                        C0123456789101: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-1.png",
                            linkurl: "pages/store/goods?sid=" + b.store_id,
                            text: "点外卖",
                            color: "#333333",
                            decoration: "优质美食，急速配送",
                            dec_color: "#a0a0a0"
                        },
                        C0123456789102: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-2.png",
                            linkurl: "wx:scanCode",
                            text: "扫码点餐",
                            color: "#333333",
                            decoration: "扫一扫轻松下单",
                            dec_color: "#a0a0a0"
                        },
                        C0123456789103: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-3.png",
                            linkurl: "pages/store/paybill?sid=" + b.store_id,
                            text: "当面付",
                            color: "#333333",
                            decoration: "当面收钱",
                            dec_color: "#a0a0a0"
                        },
                        C0123456789104: {
                            imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/default/navs-4.png",
                            linkurl: "tangshi/pages/reserve/index?sid=" + b.store_id,
                            text: "预定",
                            color: "#333333",
                            decoration: "点餐预定",
                            dec_color: "#a0a0a0"
                        }
                    },
                    max: 1
                },
                info: {
                    name: "商户信息",
                    params: {
                        titletext: "商家详情",
                        icon: "icon-shop"
                    },
                    style: {
                        margintop: "0",
                        titlecolor: "#333333",
                        iconcolor: "#FFD161",
                        statuscolor: "#ffffff",
                        statusbackground: "#FC6167",
                        namecolor: "#333333"
                    },
                    max: 1
                },
                tags: {
                    name: "标签",
                    params: {},
                    style: {
                        margintop: "10",
                        background: "#ffffff",
                        activecolor: "#FFD161"
                    },
                    data: {
                        C0123456789101: {
                            text: "代金券",
                            color: "#333333",
                            binddata: "coupon",
                            selected: 0
                        },
                        C0123456789102: {
                            text: "本店在售",
                            color: "#333333",
                            binddata: "onsale",
                            selected: 1
                        },
                        C0123456789103: {
                            text: "评价",
                            color: "#333333",
                            binddata: "evaluate",
                            selected: 0
                        }
                    },
                    max: 1
                },
                coupon: {
                    name: "代金券",
                    params: {
                        getbtntext: "立即领取",
                        usebtntext: "去使用"
                    },
                    style: {
                        pricecolor: "#F9001A",
                        conditioncolor: "#AEAEAE",
                        scenecolor: "#DAA8A3",
                        limitcolor: "#AEAEAE",
                        rightbackground: "#FFD300",
                        leftbackground: "#ffffff",
                        circlecolor: "#E3BC03",
                        circletextcolor: "#ffffff",
                        btnbordercolor: "#E3BC03",
                        getbtncolor: "#FFD300",
                        getbtnbackground: "#ffffff",
                        usebtncolor: "#232326",
                        usebtnbackground: "#ffec00"
                    },
                    max: 1
                },
                onsale: {
                    name: "本店在售",
                    params: {
                        titletext: "本店在售",
                        icon: "icon-goods_light",
                        goodsdata: "0",
                        goodsnum: "4",
                        buybtntext: "购买"
                    },
                    style: {
                        margintop: "10",
                        background: "#ffffff",
                        titlecolor: "#333333",
                        iconcolor: "#FFD161",
                        goodstitlecolor: "#333333",
                        pricecolor: "#EB3C1E",
                        oldpricecolor: "#8E8E8E",
                        discountcolor: "#EB3C1E",
                        buybtncolor: "#ffffff",
                        buybtnbackground: "#fb4e44",
                        sailedcolor: "#8E8E8E",
                        lookallcolor: "#999999"
                    },
                    data: {
                        C0123456789101: {
                            sid: "0",
                            goods_id: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                            price: "20.00",
                            old_price: "10.00",
                            title: "这里是商品标题",
                            discount: "5"
                        },
                        C0123456789102: {
                            sid: "0",
                            goods_id: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                            price: "20.00",
                            old_price: "10.00",
                            title: "这里是商品标题",
                            discount: "5"
                        },
                        C0123456789103: {
                            sid: "0",
                            goods_id: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-3.jpg",
                            price: "20.00",
                            old_price: "10.00",
                            title: "这里是商品标题",
                            discount: "5"
                        },
                        C0123456789104: {
                            sid: "0",
                            goods_id: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-4.jpg",
                            price: "20.00",
                            old_price: "10.00",
                            title: "这里是商品标题",
                            discount: "5"
                        }
                    },
                    max: 1
                },
                evaluate: {
                    name: "评论",
                    params: {
                        titletext: "评论",
                        icon: "icon-comment"
                    },
                    style: {
                        margintop: "10",
                        background: "#fff",
                        titlecolor: "#333333",
                        iconcolor: "#FFD161",
                        telcolor: "#2f2f2f",
                        timecolor: "#898989",
                        contentcolor: "#333",
                        goodstitlecolor: "#576B95",
                        replaycolor: "#898989",
                        replaybackground: "#F4F4F4",
                        lookallcolor: "#999"
                    },
                    max: 1
                },
                service: {
                    name: "客服",
                    params: {
                        showservice: "1",
                        servicefrom: "meiqia",
                        iconImg: "",
                        qq: "",
                        wxqrcode: ""
                    },
                    max: 1
                },
                gohomeActivity: {
                    name: "生活圈",
                    params: {
                        type: "seckill",
                        headline: "生活圈",
                        headline_show: 1,
                        more: "更多",
                        more_link: "",
                        showoldprice: "0",
                        buybtntext: "去拼团",
                        buybtntext_kanjia: "去砍价",
                        buybtntext_pintuan: "去拼团",
                        buybtntext_seckill: "立即抢",
                        goodsdata: "0",
                        goodsnum: "4",
                        sid: b.store_id
                    },
                    style: {
                        margintop: "10",
                        background: "#f5f5f5",
                        marginbottom: "0",
                        liststyle: "1",
                        titlecolor: "#333",
                        pricecolor: "#ff2d4b",
                        oldpricecolor: "#999",
                        buybtncolor: "#fff",
                        buybtnbackground: "",
                        barbackground: "#FED4D5",
                        barinnerbackground: "",
                        bartextcolor: "#fff",
                        headlinecolor: "#333333",
                        morecolor: "#999999"
                    },
                    data: {
                        C0123456789101: {
                            id: 0,
                            sid: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                            price: "10.00",
                            old_price: "20.00",
                            title: "这里是商品标题",
                            discount: "5",
                            falesailed_total: "10",
                            sailed_percent: "80",
                            peoplenum: "10",
                            peopleimg: {
                                C0123456789101: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                                C0123456789102: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                C0123456789103: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg"
                            }
                        },
                        C0123456789102: {
                            id: 0,
                            sid: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                            price: "10.00",
                            old_price: "20.00",
                            title: "这里是商品标题",
                            discount: "5",
                            falesailed_total: "10",
                            sailed_percent: "80",
                            peoplenum: "10",
                            peopleimg: {
                                C0123456789101: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                                C0123456789102: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                C0123456789103: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg"
                            }
                        },
                        C0123456789103: {
                            id: 0,
                            sid: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-3.jpg",
                            price: "10.00",
                            old_price: "20.00",
                            title: "这里是商品标题",
                            discount: "5",
                            falesailed_total: "10",
                            sailed_percent: "80",
                            peoplenum: "10",
                            peopleimg: {
                                C0123456789101: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                                C0123456789102: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                C0123456789103: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg"
                            }
                        },
                        C0123456789104: {
                            sid: "0",
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-4.jpg",
                            price: "10.00",
                            old_price: "20.00",
                            title: "这里是商品标题",
                            discount: "5",
                            falesailed_total: "10",
                            sailed_percent: "80",
                            peoplenum: "10",
                            peopleimg: {
                                C0123456789101: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                                C0123456789102: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                C0123456789103: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg"
                            }
                        }
                    }
                },
                article: {
                    name: "文章",
                    params: {
                        headline_show: "1",
                        headline: "文章",
                        more: "更多",
                        more_link: "",
                        informationdata: 0,
                        informationnum: 10
                    },
                    style: {
                        margintop: "10",
                        headlinecolor: "#333333",
                        morecolor: "#999999"
                    },
                    data: {
                        C0123456789101: {
                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/member.jpg",
                            wenzhangimg: {
                                C0123456789101: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                C0123456789102: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                                C0123456789103: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                                C0123456789104: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-4.jpg"
                            }
                        }
                    },
                    max: 1,
                    isbottom: 1
                },
                articleStatistics: {
                    name: "文章统计",
                    params: {
                        imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/statistics.gif"
                    },
                    style: {
                        margintop: "0",
                        backgroundcolor: "#ffffff",
                        textcolor: "#666666"
                    },
                    data: {}
                },
                haodianSettle: {
                    name: "好店入驻",
                    params: {
                        btntext: "我要入驻",
                        imgurl: "../addons/hello_banbanjia/plugin/diypage/static/img/new_settle.png"
                    },
                    style: {
                        margintop: "0",
                        backgroundcolor: "#ffffff",
                        newscolor: "#333333",
                        titlecolor: "#ff2d4b",
                        btncolor: "#ffffff",
                        btnbackground: "#ff2d4b"
                    },
                    data: {}
                },
                haodianGroup: {
                    name: "好店组",
                    params: {
                        title: "好店推荐",
                        showtype: 0,
                        pagenum: 4,
                        storenum: 4
                    },
                    style: {
                        margintop: 10,
                        dotbackground: "#ff2d4b",
                        titlecolor: "#333333",
                        storetitlecolor: "#333333"
                    },
                    data: {
                        C0123456789101: {
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            title: "门店名称"
                        },
                        C0123456789102: {
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                            title: "门店名称"
                        },
                        C0123456789103: {
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                            title: "门店名称"
                        },
                        C0123456789104: {
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-4.jpg",
                            title: "门店名称"
                        }
                    }
                },
                haodianList: {
                    name: "好店列表",
                    params: {
                        showdiscount: "1"
                    },
                    style: {
                        margintop: "0",
                        backgroundcolor: "#ffffff",
                        storetitlecolor: "#333333",
                        starscolor: "#ff2d4b",
                        startextcolor: "#999999",
                        storedistancecolor: "#ff2d4b",
                        storetagstextcolor: "#ff2d4b",
                        tagsbackgroundcolor: "#FFE3E7"
                    },
                    data: {
                        C0123456789101: {
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            title: "门店名称",
                            activity: {
                                items: {
                                    C0123456789101: {
                                        type: "discount",
                                        title: "满35减12;满60减20"
                                    },
                                    C0123456789102: {
                                        type: "couponCollect",
                                        title: "可领2元代金券"
                                    }
                                },
                                num: 2
                            }
                        },
                        C0123456789102: {
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                            title: "门店名称",
                            activity: {
                                items: {
                                    C0123456789101: {
                                        type: "discount",
                                        title: "满35减12;满60减20"
                                    },
                                    C0123456789102: {
                                        type: "couponCollect",
                                        title: "可领2元代金券"
                                    }
                                },
                                num: 2
                            }
                        },
                        C0123456789103: {
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                            title: "门店名称",
                            activity: {
                                items: {
                                    C0123456789101: {
                                        type: "discount",
                                        title: "满35减12;满60减20"
                                    },
                                    C0123456789102: {
                                        type: "couponCollect",
                                        title: "可领2元代金券"
                                    }
                                },
                                num: 2
                            }
                        }
                    },
                    max: 1,
                    isbottom: 1
                },
                svipGuide: {
                    name: "超级会员",
                    params: {},
                    style: {
                        margintop: 0,
                        paddingtop: 10,
                        paddingleft: 10,
                        outerbackgroundcolor: "#ffffff",
                        innerbackgrountcolor: "#f3dda0",
                        textcolor: "#644f1b"
                    },
                    data: {}
                },
                brand_stores: {
                    name: "品牌商户",
                    params: {
                        storedata: 0,
                        storenum: 1
                    },
                    style: {
                        margintop: "10",
                        background: "#ffffff",
                        storetitlecolor: "#ffffff",
                        activitycolor: "#ffffff",
                        activitybackgroundcolor: "#ff2d4b",
                        descriptioncolor: "#333333",
                        goodstitlecolor: "#333333",
                        pricecolor: "#ff2d4b",
                        oldpricecolor: "#999999"
                    },
                    data: {
                        C0123456789101: {
                            store_id: 0,
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            title: "这里是门店名称",
                            content: "麻辣、鲜香、挑战你的味蕾",
                            shopSign: "",
                            activity: {
                                items: {
                                    C0123456789101: {
                                        type: "discount",
                                        title: "满35减12;满60减20"
                                    },
                                    C0123456789102: {
                                        type: "couponCollect",
                                        title: "可领2元代金券"
                                    }
                                },
                                num: 2
                            },
                            hot_goods: {
                                C0123456789101: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20"
                                },
                                C0123456789102: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20"
                                },
                                C0123456789103: {
                                    sid: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-3.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20"
                                }
                            }
                        }
                    }
                },
                goodsTab: {
                    name: "商品选项卡",
                    params: {
                        buyBtnText: "立即抢购",
                        goodsTabStoreShow: "1",
                        showGoodsOldPrice: "0",
                        showGoodsTag: "0",
                        liststyle: "1"
                    },
                    style: {
                        margintop: "10",
                        marginbottom: "0",
                        goodsTabColor: "#333333",
                        goodsTabActiveColor: "#ff2d4b",
                        goodsTitleColor: "#262626",
                        goodsPriceColor: "#ed2822",
                        goodsOldPriceColor: "#777777",
                        buyBtnColor: "#fe5455",
                        goodsTabBackground: "#ffffff",
                        goodsTabSelectBackground: "#ffffff"
                    },
                    data: {
                        C0123456789101: {
                            TabsTitle: "品质正餐",
                            imgTitle: "../addons/hello_banbanjia/plugin/diypage/static/template/default3/img-card-1.jpg",
                            goodsdata: "0",
                            goods: {
                                C0123456789101: {
                                    sid: "0",
                                    goods_id: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%",
                                    store: {
                                        id: "1",
                                        title: "这里是门店名称",
                                        logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                                        send_price: "15",
                                        delivery_price: "5",
                                        delivery_time: "30"
                                    }
                                },
                                C0123456789102: {
                                    sid: "0",
                                    goods_id: "0",
                                    thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                    price: "20.00",
                                    old_price: "10.00",
                                    title: "这里是商品标题",
                                    store_title: "这里是门店名称",
                                    discount: "5",
                                    sailed: "20",
                                    comment_good_percent: "88%",
                                    store: {
                                        id: "1",
                                        title: "这里是门店名称",
                                        logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                                        send_price: "15",
                                        delivery_price: "5",
                                        delivery_time: "30"
                                    }
                                }
                            }
                        }
                    },
                    max: 1
                },
                storesTab: {
                    name: "商户选项卡",
                    params: {
                        showdiscount: "1",
                        discountstyle: "1",
                        showhotgoods: "1",
                        storeactivity: b.storeactivity
                    },
                    style: {
                        margintop: "10",
                        storesTabColor: "#333333",
                        storesTabActiveColor: "#ff2d4b",
                        storesTabBackground: "#ffffff",
                        storesTabSelectBackground: "#ffffff",
                        storeTitleColor: "#333333",
                        scoreColor: "#ff2d4b",
                        deliveryTitleBgcolor: "#ff2d4b",
                        deliveryTitleColor: "#ffffff"
                    },
                    data: {
                        C0123456789101: {
                            TabsTitle: "品质好店",
                            imgTitle: "../addons/hello_banbanjia/plugin/diypage/static/template/default3/img-card-1.jpg",
                            storedata: "0",
                            storenum: "6",
                            categoryid: "0",
                            categoryname: "请选择分类",
                            activitytype: "discount",
                            stores: {
                                C0123456789101: {
                                    store_id: 0,
                                    logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                                    title: "这里是门店名称",
                                    score: "5",
                                    sailed: "888",
                                    send_price: "15",
                                    delivery_price: "5",
                                    delivery_title: "平台专送",
                                    delivery_time: 30,
                                    activity: {
                                        items: {
                                            C0123456789101: {
                                                type: "discount",
                                                title: "满35减12;满60减20"
                                            },
                                            C0123456789102: {
                                                type: "couponCollect",
                                                title: "可领2元代金券"
                                            }
                                        },
                                        num: 2
                                    },
                                    hot_goods: {
                                        C0123456789101: {
                                            sid: "0",
                                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                                            price: "20.00",
                                            old_price: "10.00",
                                            title: "这里是商品标题",
                                            store_title: "这里是门店名称",
                                            discount: "5",
                                            sailed: "20",
                                            comment_good_percent: "88%"
                                        },
                                        C0123456789102: {
                                            sid: "0",
                                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-2.jpg",
                                            price: "20.00",
                                            old_price: "10.00",
                                            title: "这里是商品标题",
                                            store_title: "这里是门店名称",
                                            discount: "5",
                                            sailed: "20",
                                            comment_good_percent: "88%"
                                        },
                                        C0123456789103: {
                                            sid: "0",
                                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-3.jpg",
                                            price: "20.00",
                                            old_price: "10.00",
                                            title: "这里是商品标题",
                                            store_title: "这里是门店名称",
                                            discount: "5",
                                            sailed: "20",
                                            comment_good_percent: "88%"
                                        }
                                    }
                                },
                                C0123456789102: {
                                    store_id: 0,
                                    logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-2.jpg",
                                    title: "这里是门店名称",
                                    score: "5",
                                    sailed: "888",
                                    send_price: "15",
                                    delivery_price: "5",
                                    delivery_title: "平台专送",
                                    delivery_time: 45
                                },
                                C0123456789103: {
                                    store_id: 0,
                                    logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                                    title: "这里是门店名称",
                                    score: "5",
                                    sailed: "888",
                                    send_price: "15",
                                    delivery_price: "5",
                                    delivery_title: "平台专送",
                                    delivery_time: 55,
                                    hot_goods: {
                                        C0123456789101: {
                                            sid: "0",
                                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-4.jpg",
                                            price: "20.00",
                                            old_price: "10.00",
                                            title: "这里是商品标题",
                                            store_title: "这里是门店名称",
                                            discount: "5",
                                            sailed: "20",
                                            comment_good_percent: "88%"
                                        },
                                        C0123456789102: {
                                            sid: "0",
                                            thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-5.jpg",
                                            price: "20.00",
                                            old_price: "10.00",
                                            title: "这里是商品标题",
                                            store_title: "这里是门店名称",
                                            discount: "5",
                                            sailed: "20",
                                            comment_good_percent: "88%"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    max: 1
                },
                urltags: {
                    name: "标签组",
                    params: {},
                    style: {
                        margintop: "10",
                        fontSize: "10",
                        background: "#ffffff"
                    },
                    data: {
                        C0123456789101: {
                            text: "标签一",
                            color: "#333333",
                            linkurl: ""
                        },
                        C0123456789102: {
                            text: "标签二",
                            color: "#333333",
                            linkurl: ""
                        },
                        C0123456789103: {
                            text: "标签三",
                            color: "#333333",
                            linkurl: ""
                        }
                    }
                }
            }
        },
        b.initSortable = function () {
            $("#app-preview").sortable({
                opacity: .8,
                placeholder: "highlight",
                items: ".drag:not(.fixed)",
                revert: 100,
                scroll: !1,
                start: function (a, b) {
                    var c = b.item.height();
                    $(".highlight").css({
                        height: c + 22 + "px",
                        "margin-bottom": "10px"
                    }),
                        $(".highlight").html('<div><i class="icon icon-plus"></i> 放置此处</div>'),
                        $(".highlight div").css({
                            "line-height": c + 16 + "px",
                            "font-size": "16px",
                            color: "#999",
                            "text-align": "center",
                            border: "2px dashed #eee"
                        })
                },
                stop: function (a, c) {
                    b.initEditor()
                },
                update: function (a, c) {
                    b.sortItems()
                }
            }),
                $("#app-preview").disableSelection(),
                $(document).on("mousedown", "#app-preview .drag", function () {
                    $(this).hasClass("selected") || ($("#app-preview").find(".drag").removeClass("selected"), $(this).addClass("selected"), b.selected = $(this).data("itemid"), b.initEditor())
                })
        },
        b.sortItems = function () {
            var a = {};
            $("#app-preview .drag").each(function () {
                var c = $(this).data("itemid");
                a[c] = b.items[c]
            }),
                b.items = a
        },
        b.initEditor = function (a) {
            void 0 === a && (a = !0);
            var c = b.selected,
                d = -50;
            if ("page" != b.selected) {
                var e = $(".selected").position().top;
                d = e || 0
            }
            if (a && ($("#app-editor").unbind("animate").animate({
                "margin-top": d + 100 + "px"
            }), setTimeout(function () {
                $("body").unbind("animate").animate({
                    scrollTop: d + 100 + "px"
                }, 1e3)
            }, 1e3)), b.selected) {
                if ("page" == b.selected) {
                    var f = tmodtpl("tpl-editor-page", b);
                    $("#app-editor .inner").html(f)
                } else {
                    var g = $.extend(!0, {}, b.items[b.selected]);
                    g.itemid = b.selected;
                    var f = tmodtpl("tpl-editor-" + g.id, g);
                    $("#app-editor .inner").html(f)
                }
                $("#app-editor").attr("data-editid", b.selected).show()
            }
            if ($("#app-editor .js-selectGoods").length > 0 && ($(document).off("click", ".js-selectGoods"), $(document).on("click", ".js-selectGoods", function () {
                b.childid = $(this).closest(".item").data("id"),
                    b.parentid = $(this).closest(".item").data("parentid");
                var a = $(this).data("callback");
                irequire(["web/hello"], function (c) {
                    3 == b.type ? c.selectgoods(a, {
                        mutil: 0,
                        store_id: b.store_id
                    }) : c.selectgoods(a, {
                        mutil: 0
                    })
                })
            })), $("#app-editor .js-selectGohomeGoods").length > 0 && ($(document).off("click", ".js-selectGohomeGoods"), $(document).on("click", ".js-selectGohomeGoods", function () {
                b.childid = $(this).closest(".item").data("id");
                var a = $(this).data("callback"),
                    c = b.selected,
                    d = b.items[c].params.type,
                    e = b.items[c].params.sid;
                irequire(["web/hello"], function (b) {
                    b.selectGohomeGoods(a, {
                        type: d,
                        sid: e
                    })
                })
            })), $("#app-editor .js-selectStore").length > 0 && ($(document).off("click", ".js-selectStore"), $(document).on("click", ".js-selectStore", function () {
                b.childid = $(this).closest(".item").data("id"),
                    b.parentid = $(this).closest(".item").data("parentid");
                var a = $(this).data("callback");
                irequire(["web/hello"], function (b) {
                    b.selectStore(a, {
                        mutil: 0
                    })
                })
            })), $("#app-editor .slider").length > 0 && $("#app-editor .slider").each(function () {
                var a = $(this).data("decimal"),
                    b = ($(this).data("multiply"), $(this).data("value"));
                a && (b *= a),
                    $(this).slider({
                        slide: function (b, c) {
                            var d = c.value;
                            a && (d /= a),
                                $(this).siblings(".input").val(d).trigger("propertychange"),
                                $(this).siblings(".count").find("span").text(d)
                        },
                        value: b,
                        min: $(this).data("min"),
                        max: $(this).data("max")
                    })
            }), $("#app-editor .form-items").length > 0 && (b.initSortableChild(), $("#addChild").unbind("click").click(function () {
                var a = b.selected,
                    c = b.items[a].id,
                    d = b.parts[c].data,
                    e = $(this).closest(".form-items").data("max");
                if (e && b.length(b.items[a].data) >= e) return void Notify.error("最大添加 " + e + " 个！");
                var f = {},
                    g = 0;
                if ($.each(d, function (a, b) {
                    0 == g && (f = b, g++)
                }), f) {
                    var h = b.getId("M", 0);
                    void 0 === b.items[a].data && (b.items[a].data = {}),
                        f = $.extend(!0, {}, f),
                        b.items[a].data[h] = f
                }
                b.initItems(a),
                    b.initEditor(!1)
            }), $(".addStoreItem").unbind("click").click(function () {
                var a = b.selected,
                    c = $(this).closest(".form-items").data("parentid"),
                    d = {
                        store_id: 0,
                        logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-3.jpg",
                        title: "这里是门店名称",
                        score: "5",
                        sailed: "888",
                        send_price: "15",
                        delivery_price: "5",
                        delivery_title: "平台专送",
                        delivery_time: 55,
                        hot_goods: {
                            C0123456789101: {
                                sid: "0",
                                thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-4.jpg",
                                price: "20.00",
                                old_price: "10.00",
                                title: "这里是商品标题",
                                store_title: "这里是门店名称",
                                discount: "5",
                                sailed: "20",
                                comment_good_percent: "88%"
                            },
                            C0123456789102: {
                                sid: "0",
                                thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-5.jpg",
                                price: "20.00",
                                old_price: "10.00",
                                title: "这里是商品标题",
                                store_title: "这里是门店名称",
                                discount: "5",
                                sailed: "20",
                                comment_good_percent: "88%"
                            }
                        }
                    },
                    e = b.getId("M", 0);
                b.items[a].data[c].stores[e] = d,
                    b.initItems(a),
                    b.initEditor(!1)
            }), $(".addItem").unbind("click").click(function () {
                var a = b.selected,
                    c = $(this).closest(".form-items").data("parentid"),
                    d = {
                        sid: "0",
                        goods_id: "0",
                        thumb: "../addons/hello_banbanjia/plugin/diypage/static/img/default/goods-1.jpg",
                        price: "20.00",
                        old_price: "10.00",
                        goodsTabTitle: "美食",
                        title: "这里是商品标题",
                        store_title: "这里是门店名称",
                        discount: "5",
                        sailed: "20",
                        comment_good_percent: "88%",
                        store: {
                            id: "1",
                            title: "这里是门店名称",
                            logo: "../addons/hello_banbanjia/plugin/diypage/static/img/default/store-1.jpg",
                            send_price: "15",
                            delivery_price: "5",
                            delivery_time: "30"
                        }
                    },
                    e = b.getId("M", 0);
                b.items[a].data[c].goods[e] = d,
                    b.initItems(a),
                    b.initEditor(!1)
            }), $("#app-editor .form-items .item .btn-del").unbind("click").click(function () {
                var a = $(this).closest(".item").data("id"),
                    c = b.selected,
                    d = $(this).closest(".form-items").data("min"),
                    e = $(this).closest(".form-items").data("parentid");
                if (d) {
                    if ("goodsTab" == b.items[c].id && void 0 !== e) var f = b.length(b.items[c].data[e].goods);
                    else if ("storesTab" == b.items[c].id && void 0 !== e) var f = b.length(b.items[c].data[e].stores);
                    else var f = b.length(b.items[c].data);
                    if (f <= d) return void Notify.error("至少保留 " + d + " 个！")
                }
                Notify.confirm("确定删除吗", function () {
                    "goodsTab" == b.items[c].id && void 0 !== e ? delete b.items[c].data[e].goods[a] : "storesTab" == b.items[c].id && void 0 !== e ? delete b.items[c].data[e].stores[a] : delete b.items[c].data[a],
                        b.initItems(c),
                        b.initEditor(!1)
                })
            })), $("#app-editor .form-richtext").length > 0) {
                var h = {
                    autoClearinitialContent: !1,
                    toolbars: [
                        ["fullscreen", "source", "preview", "|", "bold", "italic", "underline", "strikethrough", "forecolor", "backcolor", "|", "justifyleft", "justifycenter", "justifyright", "|", "insertorderedlist", "insertunorderedlist", "blockquote", "emotion", "removeformat", "|", "rowspacingtop", "rowspacingbottom", "lineheight", "indent", "paragraph", "fontsize", "|", "inserttable", "deletetable", "insertparagraphbeforetable", "insertrow", "deleterow", "insertcol", "deletecol", "mergecells", "mergeright", "mergedown", "splittocells", "splittorows", "splittocols", "|", "anchor", "map", "print", "drafts", "|", "link"]
                    ],
                    elementPathEnabled: !1,
                    initialFrameHeight: 300,
                    focus: !1,
                    maximumWords: 9999999999999
                },
                    j = {
                        type: "image",
                        direct: !1,
                        multiple: !0,
                        tabs: {
                            upload: "active",
                            browser: "",
                            crawler: ""
                        },
                        path: "",
                        dest_dir: "",
                        global: !1,
                        thumb: !1,
                        width: 0
                    };
                UE.registerUI("myinsertimage", function (a, b) {
                    a.registerCommand(b, {
                        execCommand: function () {
                            require(["fileUploader"], function (b) {
                                b.show(function (b) {
                                    if (0 != b.length) if (1 == b.length) a.execCommand("insertimage", {
                                        src: b[0].url,
                                        _src: b[0].url,
                                        width: "100%",
                                        alt: b[0].filename
                                    });
                                    else {
                                        var c = [];
                                        for (i in b) c.push({
                                            src: b[i].url,
                                            _src: b[i].url,
                                            width: "100%",
                                            alt: b[i].filename
                                        });
                                        a.execCommand("insertimage", c)
                                    }
                                }, j)
                            })
                        }
                    });
                    var c = new UE.ui.Button({
                        name: "插入图片",
                        title: "插入图片",
                        cssRules: "background-position: -726px -77px",
                        onclick: function () {
                            a.execCommand(b)
                        }
                    });
                    return a.addListener("selectionchange", function () {
                        var d = a.queryCommandState(b); - 1 == d ? (c.setDisabled(!0), c.setChecked(!1)) : (c.setDisabled(!1), c.setChecked(d))
                    }),
                        c
                }, 48),
                    UE.registerUI("myinsertvideo", function (a, b) {
                        a.registerCommand(b, {
                            execCommand: function () {
                                require(["fileUploader"], function (b) {
                                    b.show(function (b) {
                                        if (b) {
                                            var c = b.isRemote ? "iframe" : "video";
                                            a.execCommand("insertvideo", {
                                                url: b.url,
                                                width: 300,
                                                height: 200
                                            }, c)
                                        }
                                    }, {
                                        fileSizeLimit: 512e4,
                                        type: "video",
                                        allowUploadVideo: !0
                                    })
                                })
                            }
                        });
                        var c = new UE.ui.Button({
                            name: "插入视频",
                            title: "插入视频",
                            cssRules: "background-position: -320px -20px",
                            onclick: function () {
                                a.execCommand(b)
                            }
                        });
                        return a.addListener("selectionchange", function () {
                            var d = a.queryCommandState(b); - 1 == d ? (c.setDisabled(!0), c.setChecked(!1)) : (c.setDisabled(!1), c.setChecked(d))
                        }),
                            c
                    }, 20),
                    UE.registerUI("mylink", function (a, b) {
                        var c = new UE.ui.Button({
                            name: "selectUrl",
                            title: "系统链接",
                            cssRules: "background-position: -622px 80px;",
                            onclick: function () {
                                $("#" + this.id).attr({
                                    "data-toggle": "selectUrl",
                                    "data-callback": "selectUrlCallback"
                                })
                            }
                        });
                        return a.addListener("selectionchange", function () {
                            var d = a.queryCommandState(b); - 1 == d ? (c.setDisabled(!0), c.setChecked(!1)) : (c.setDisabled(!1), c.setChecked(d))
                        }),
                            c
                    }),
                    "undefined" != typeof UE && UE.delEditor("rich");
                var k = UE.getEditor("rich", h);
                k.ready(function () {
                    var a = b.items[c],
                        d = a.params.content;
                    d = $.base64.decode(d),
                        k.setContent(d),
                        k.addListener("contentChange", function () {
                            var a = k.getContent();
                            a = $.base64.encode(a),
                                $("#richtext").html(a).trigger("change")
                        })
                })
            }
            $("#app-editor").find(".diy-bind").bind("input propertychange change", function () {
                var a = $(this),
                    d = a.data("bind"),
                    e = a.data("bind-child"),
                    f = a.data("bind-parent"),
                    g = a.data("bind-init"),
                    h = "",
                    i = this.tagName;
                if (c || b.selectedItem("page"), "INPUT" == i) {
                    if ("checkbox" == a.attr("type")) h = [],
                        a.closest(".form-group").find("input[type=checkbox]").each(function () {
                            var a = this.checked,
                                b = $(this).val();
                            a && h.push(b)
                        });
                    else {
                        var j = a.data("placeholder");
                        h = a.val(),
                            h = "" == h ? j : h
                    }
                } else "SELECT" == i ? h = a.find("option:selected").val() : "TEXTAREA" == i && (h = a.val());
                h = $.trim(h),
                    "page" == c ? (e ? (b.page[e] || (b.page[e] = {}), b.page[e][d] = h) : b.page[d] = h, b.initPage(!1), "keyword" == d && $.post(biz.url("diypage/page/keyword"), {
                        id: b.id,
                        keyword: h
                    }, function (c) {
                        0 == c.status ? (a.closest(".form-group").addClass("has-error"), b.keyworderr = !0) : (a.closest(".form-group").removeClass("has-error"), b.keyworderr = !1)
                    }, "json")) : (e ? f ? b.items[c][f][e][d] = h : b.items[c][e][d] = h : b.items[c][d] = h, b.initItems(c)),
                    g && b.initEditor(!1)
            })
        },
        b.initSortableChild = function () {
            $("#app-editor .inner").sortable({
                opacity: .8,
                placeholder: "highlight",
                items: ".item",
                revert: 100,
                scroll: !1,
                cancel: ".goods-selector,input,select,.btn,btn-del",
                start: function (a, b) {
                    var c = b.item.height();
                    $(".highlight").css({
                        height: c + 22 + "px"
                    }),
                        $(".highlight").html('<div><i class="fa fa-plus"></i> 放置此处</div>'),
                        $(".highlight div").css({
                            "line-height": c + 16 + "px"
                        })
                },
                update: function (a, c) {
                    b.sortChildItems()
                }
            })
        },
        b.initTpl = function () {
            tmodtpl.helper("tomedia", function (a) {
                return 0 == a.indexOf("images/") ? b.attachurl + a : "string" != typeof a ? "" : 0 == a.indexOf("http://") || 0 == a.indexOf("https://") || 0 == a.indexOf("../addons/hello_banbanjia/") ? a : 0 == a.indexOf("images/") || 0 == a.indexOf("audios/") ? b.attachurl + a : void 0
            }),
                tmodtpl.helper("decode", function (a) {
                    return $.base64.decode(a)
                }),
                tmodtpl.helper("count", function (a) {
                    return b.length(a)
                }),
                tmodtpl.helper("toArray", function (a) {
                    var b = ($.makeArray(a), []);
                    return $.each(a, function (a, c) {
                        b.push(c)
                    }),
                        b
                }),
                tmodtpl.helper("strexists", function (a, b) {
                    return !(!a || !b) && -1 != a.indexOf(b)
                }),
                tmodtpl.helper("inArray", function (a, b) {
                    if (!a || !b) return !1;
                    if ("string" == typeof a) {
                        var c = a.split(",");
                        if ($.inArray(b, c) > -1) return !0
                    }
                    return !1
                }),
                tmodtpl.helper("define", function (a) { })
        },
        b.initGotop = function () {
            $(window).bind("scroll resize", function () {
                $(window).scrollTop() > 300 ? $("#gotop").show() : $("#gotop").hide(),
                    $("#gotop").unbind("click").click(function () {
                        $("body").animate({
                            scrollTop: "0px"
                        }, 1e3)
                    })
            })
        },
        b.getNear = function (a) {
            var c = [],
                d = 0,
                e = 0,
                f = 0;
            $.each(b.items, function (b, g) {
                c[d] = b,
                    b == a && (e = d - 1, f = d + 1),
                    d++
            });
            var g = c[e],
                h = c[f];
            return h || (g || !1)
        },
        b.getItemNum = function (a) {
            if (!a || !b.items) return -1;
            var c = 0;
            return $.each(b.items, function (b, d) {
                d.id == a && c++
            }),
                c
        },
        b.sortChildItems = function () {
            var a = {},
                c = b.selected;
            $("#app-editor .form-items .item").each(function () {
                var d = $(this).data("id");
                a[d] = b.items[c].data[d]
            }),
                b.items[c].data = a,
                b.initItems(c)
        },
        b.length = function (a) {
            if (void 0 === a) return 0;
            var b = 0;
            for (var c in a) b++;
            return b
        },
        b.callbackGoods = function (a) {
            if (!a) return void Notify.error("回调数据错误，请重试！");
            var c = b.selected,
                d = b.childid,
                e = b.parentid;
            "goodsTab" == b.items[c].id && void 0 !== e ? b.items[c].data[e].goods[d] = {
                sid: a.sid,
                goods_id: a.id,
                title: a.title,
                thumb: a.thumb,
                price: a.price,
                old_price: a.old_price,
                discount: a.discount,
                store_title: a.store_title,
                sailed: a.sailed,
                comment_good_percent: a.comment_good_percent,
                store: a.store
            } : b.items[c].data[d] = {
                sid: a.sid,
                goods_id: a.id,
                title: a.title,
                thumb: a.thumb,
                price: a.price,
                old_price: a.old_price,
                discount: a.discount,
                store_title: a.store_title,
                sailed: a.sailed,
                comment_good_percent: a.comment_good_percent,
                store: a.store
            },
                b.initItems(c),
                b.initEditor(!1),
                b.childid = null
        },
        b.callbackStore = function (a) {
            if (!a) return void Notify.error("回调数据错误，请重试！");
            var c = b.selected,
                d = b.childid,
                e = b.parentid;
            "storesTab" == b.items[c].id && void 0 !== e ? b.items[c].data[e].stores[d] = {
                store_id: a.id,
                logo: a.logo,
                title: a.title,
                score_cn: a.score_cn,
                sailed: a.sailed,
                send_price: a.send_price,
                delivery_price: a.delivery_price,
                delivery_title: a.delivery_title,
                delivery_time: a.delivery_time,
                activity: a.activity,
                hot_goods: a.hot_goods,
                content: a.content,
                shopSign: a.shopSign
            } : b.items[c].data[d] = {
                store_id: a.id,
                logo: a.logo,
                title: a.title,
                score_cn: a.score_cn,
                sailed: a.sailed,
                send_price: a.send_price,
                delivery_price: a.delivery_price,
                delivery_title: a.delivery_title,
                delivery_time: a.delivery_time,
                activity: a.activity,
                hot_goods: a.hot_goods,
                content: a.content,
                shopSign: a.shopSign
            },
                console.dir(b.items[c].data[d]),
                b.initItems(c),
                b.initEditor(!1),
                b.childid = null
        },
        b.callbackGohomeGoods = function (a, c) {
            if (!a) return void Notify.error("回调数据错误，请重试！");
            var d = b.selected,
                e = b.childid;
            b.items[d].data[e] = {
                id: a.id,
                sid: a.sid,
                thumb: a.thumb,
                price: a.price,
                old_price: a.oldprice,
                title: a.name,
                discount: a.discount,
                falesailed_total: a.falesailed_total ? a.falesailed_total : a.sailed,
                sailed_percent: a.sailed_percent,
                peoplenum: a.peoplenum,
                peopleimg: {
                    C0123456789101: "",
                    C0123456789102: "",
                    C0123456789103: ""
                }
            },
                a.userlist && a.userlist.length > 0 && (b.items[d].data[e].peoplenum = a.userlist.length, a.userlist[0] && (b.items[d].data[e].peopleimg.C0123456789101 = a.userlist[0].avatar), a.userlist[1] && (b.items[d].data[e].peopleimg.C0123456789102 = a.userlist[1].avatar), a.userlist[2] && (b.items[d].data[e].peopleimg.C0123456789103 = a.userlist[2].avatar)),
                b.initItems(d),
                b.initEditor(!1),
                b.childid = null
        },
        b.iconcat = function (a, b) {
            for (var c = a.concat(), d = 0; d < b.length; d++) - 1 === c.indexOf(b[d]) && c.push(b[d]);
            return c
        },
        b.checkPluginExist = function (a) {
            return -1 != b.plugins.indexOf(a)
        },
        b.initSave = function () {
            $(".btn-save").unbind("click").click(function () {
                return $(this).data("status") ? void Notify.error("正在保存，请稍候。。。") : (b.data = {}, b.data = {
                    page: b.page,
                    items: b.items
                }, b.page.title ? ($(".btn-save").data("status", 1).text("保存中..."), void irequire(["hello"], function (a) {
                    3 == b.type ? $.post(a.getUrl("store/decoration/home"), {
                        data: b.data
                    }, function (a) {
                        var a = a.message;
                        if (0 != a.errno) return Notify.error(a.message),
                            void $(".btn-save[data-type='save']").text("保存门店首页").data("status", 0);
                        Notify.success("保存成功！", a.url)
                    }, "json") : $.post(a.getUrl("diypage/diyPage/post"), {
                        id: b.id,
                        data: b.data
                    }, function (a) {
                        var a = a.message;
                        if (0 != a.errno) return Notify.error(a.message),
                            void $(".btn-save[data-type='save']").text("保存页面").data("status", 0);
                        Notify.success("保存成功！", a.url)
                    }, "json")
                })) : (Notify.error("页面标题是必填项"), void $("#page").trigger("click")))
            })
        },
        b
});