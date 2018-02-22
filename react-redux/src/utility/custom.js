import $ from "jquery";
import slimScroll from "jquery-slimscroll";
import CryptoJS from 'crypto-js';

function custom(){

    $(document).ready(function() {
        $(function(){
            $(".inner-content").slimScroll({
                height: "100%",
                size: "5px",
                distance: "0",
                color: "#bbb"
            });

            $(".select-addons-tooltip .content-bg").slimScroll({
                height: "100%",
                size: "5px",
                distance: "0",
                color: "#bbb",
                alwaysVisible: true
            });

            $(".listed-intranet").slimScroll({
                height: "350px",
                size: "5px",
                distance: "0",
                color: "#bbb"
            });
            $(".order-process").hide();
        });

        $(".bootom-footer .actions .actions-left ul li > span").click(function() {
            $("input:checkbox").removeAttr("checked");
            $(".bootom-footer .actions .actions-left ul li").removeClass("open");
            $(this).parents("li").addClass("open");
        });

        $(".select-addons-tooltip .cancel-ok .cancel").click(function() {
            $(".bootom-footer .actions .actions-left ul li").removeClass("open");
        });

        $(".add-new-policy-block .applications,.enablingby .applications,.editing-path .applications").click(function() {
            $(this).addClass("open");
        });

        $(".visualization-icon").click(function() {
            $(".visualizations").addClass("open");
        });

        $(".world, .flower").click(function() {
            $(".world, .flower").removeClass("open");
            $(this).addClass("open");
        });

        $(".close-request ").click(function() {
            $(".request-device-location").removeClass("open");
        });

        $(".overall-close").on("click", function(){
            $(".addusermanagement.right-popup.open").removeClass("open");
        });

        $(".top-header .header-notification > span").click(function() {
            $(".top-header .header-notification").addClass("open");
        });

    });

    $(document).on("click", function (e) {
        if (!$(".bottom-form .publish em").is(e.target) && $(".bottom-form .publish em").has(e.target).length === 0) {
            $(".bottom-form").removeClass("open");
        }
        if (!$(".bootom-footer .actions .actions-left ul li, .select-addons-tooltip").is(e.target)
                    && $(".bootom-footer .actions .actions-left ul li, .select-addons-tooltip").has(e.target).length === 0) {
            $(".bootom-footer .actions .actions-left ul li").removeClass("open");
        }
        if (!$(".top-header .header-user-menu, .top-header .top-header-right .header-search img, .top-header .top-header-right .header-search").is(e.target)
                    && $(".top-header .header-user-menu, .top-header .top-header-right .header-search img, .top-header .top-header-right .header-search").has(e.target).length === 0) {
            $(".top-header .header-user-menu, .top-header .top-header-right").removeClass("open");
        }
        if (!$(".world, .flower").is(e.target)
                    && $(".world, .flower").has(e.target).length === 0) {
            $(".world, .flower").removeClass("open");
        }
        if (!$(".add-new-policy-block .applications, .add-new-policy-block .suggesstion-list,.enablingby .applications, .enablingby .suggesstion-list,.editing-path .applications, .editing-path .suggesstion-list").is(e.target)
                    && $(".add-new-policy-block .applications, .add-new-policy-block .suggesstion-list,.enablingby .applications, .enablingby .suggesstion-list,.editing-path .applications, .editing-path .suggesstion-list").has(e.target).length === 0) {
            $(".add-new-policy-block .applications,.enablingby .applications,.editing-path .applications").removeClass("open");
        }
        if (!$(".top-header .header-user-menu, .top-header .top-header-right .header-search img, .top-header .top-header-right .header-search").is(e.target)
                        && $(".top-header .header-user-menu, .top-header .top-header-right .header-search img, .top-header .top-header-right .header-search").has(e.target).length === 0) {
            $(".top-header .header-user-menu, .top-header .top-header-right").removeClass("open");
        }

        if (!$(".table-search .header-search").is(e.target) && $(".table-search .header-search").has(e.target).length === 0) {
            $(".table-search").removeClass("open");
        }
        if (!$(".monitoring-search .header-search").is(e.target)
                            && $(".monitoring-search .header-search").has(e.target).length === 0) {
            $(".monitoring-search").removeClass("open");
        }
        if (!$(".top-header .header-notification").is(e.target)
                            && $(".top-header .header-notification").has(e.target).length === 0) {
            $(".top-header .header-notification").removeClass("open");
        }
    });
    $(".top-header .top-header-right .header-search img").click(function() {
        $(".top-header .top-header-right .header-search").addClass("open");
    });

    $(".add-new-policy-block .applications,.enablingby .applications,.editing-path .applications").click(function() {
        $(this).addClass("open");
    });

}



export default custom;
