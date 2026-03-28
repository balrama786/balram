(function ($, window, document, undefined) {
  "use strict";
  var $ripple = $(".js-ripple");
  $ripple.on("click.ui.ripple", function (e) {
    var $this = $(this);
    var $offset = $this.parent().offset();
    var $circle = $this.find(".c-ripple__circle");
    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;
    $circle.css({
      top: y + "px",
      left: x + "px",
    });
    $this.addClass("is-active");
  });
  $ripple.on("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function (e) {
    $(this).removeClass("is-active");
  });
})(jQuery, window, document);
var scrollLink = $("#myScrollspy");

$(document).ready(function () {
  var scrollLink = $('#myScrollspy .nav-item a[href^="#"]');

  // Smooth scrolling
  scrollLink.click(function (e) {
    e.preventDefault();
    $("body,html").animate(
      {
        scrollTop: $(this.hash).offset().top - 20,
      },
      500
    );
  });
});
$(document).ready(function () {
  $(".view-more-btn").on("click", function () {
    var $this = $(this);
    var $content = $this.prev(".features-hide-content");
    var $core = $this.closest(".core-features");

    $content.toggleClass("show");

    if ($content.hasClass("show")) {
      $this.html('View Less <i class="fa fa-angle-down" aria-hidden="true"></i>');
      $core.addClass("active");
    } else {
      $this.html('View More <i class="fa fa-angle-up" aria-hidden="true"></i>');
      $core.removeClass("active");
    }
  });
});








document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop();

  // Find all links
  document.querySelectorAll(".nav-link").forEach(link => {
    const linkHref = link.getAttribute("href");

    if (linkHref === currentPage) {
      // Highlight active link
      link.classList.add("active");

      // Open parent menus
      let parent = link.closest(".nav-item");
      while (parent) {
        if (parent.classList.contains("menu")) {
          parent.classList.add("active"); // highlight parent
          let submenu = parent.querySelector(".sub-menu");
          if (submenu) submenu.style.display = "block"; // keep open
        }
        parent = parent.parentElement.closest(".nav-item");
      }
    }
  });
});