﻿/*IndexBanners index*/
define(["jquery", "jIAn", "datePicker", "datePicker_zh_tw"], function($, jIAn) {
    var form = jIAn.form;
    var bindParam = function() {
            if ($("#kw").val() !== "") {
                form.add_variable("KeyWord", $("#kw").val());
            }

            form.add_variable("StartDate", $("#start").val());
            form.add_variable("EndDate", $("#end").val());
        },
        run = function(param) {
            $("a[rel=popover]").popover({
                html: true,
                trigger: "hover",
                placement: "right",
                content: function() { return "<img src=\"" + $(this).data("img") + "\" />"; }
            });

            $(".date-picker").datepicker({
                language: "zh-TW",
                todayHighlight: true,
                todayBtn: "linked",
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            });

            $("#search").click(function() {
                bindParam();
                form.submit_form("post", "/Ammas/Cms/IndexBanners");
            });

            $("#reset").click(function() {
                $("#start,#end,#kw").val("");
                $("#at").val("0");
            });

            $("#add").click(function() {
                form.add_variable("Entity.IndexBannerId", 0);
                bindParam();
                form.submit_form("post", "/Ammas/Cms/IndexBannerEdit");
            });

            $(":button[id*=\"edit_\"]").click(function() {
                var id = $(this).attr("id").split("_")[1];
                form.add_variable("Entity.IndexBannerId", id);
                bindParam();
                form.submit_form("post", "/Ammas/Cms/IndexBannerEdit");
            });

            $(":button[id*=\"delete_\"]").click(function() {
                var id = $(this).attr("id").split("_")[1];
                modal("confirm", "確定要刪除 ?", {
                    Click_OK: function(e) {
                        e.preventDefault();

                        $.when($.ajax({
                            type: "post",
                            url: "/Ammas/Cms/AjaxIndexBannerDelete",
                            data: { "Entity.IndexBannerId": id }
                        })).done(function(ajaxResult) {
                            var code = parseInt(ajaxResult.Code, 10);
                            if (code > 0) {
                                var parameter = [
                                    "StartDate=" + $("#start").val(),
                                    "EndDate=" + $("#end").val(),
                                    "KeyWord=" + $("#kw").val()
                                ].join("&");

                                form.add_variable("IsTransfer", true);
                                form.add_variable("Target", "/Ammas/Cms/IndexBanners");
                                form.add_variable("Method", "post");
                                form.add_variable("Parameter", parameter);
                                form.add_variable("Message", "Done");
                                form.submit_form("post", "/Misc/Message");
                                //$("#row_" + id).remove();
                            } else {
                                if (code === -1) {
                                    $("#warning").text("system error");
                                } else {
                                    $("#warning").text("something error... code:" + code);
                                }
                                $("#warning").css("display", "block");
                            }
                        }).fail(function() { $("#warning").text("Connection error").css("display", "block"); });
                    }
                });
            });
        };
    return (function() { return { run: run }; })();
});