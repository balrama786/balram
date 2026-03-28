(function ($) {
  "use strict";

  if (localStorage.getItem("theme") === "dark") {
    $("body").addClass("dark-only");
    $(".mode i").removeClass("fa-moon-o").addClass("fa-lightbulb-o");
  }

  // Toggle theme and persist
  $(".mode").on("click", function (e) {
    e.preventDefault();
    const isDark = !$("body").hasClass("dark-only");

    $(".mode i").toggleClass("fa-moon-o fa-lightbulb-o");
    $("body").toggleClass("dark-only");

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // font size
  $(".decrease").on("click", function () {
    $(".content").addClass("font-decrease").removeClass("font-increase");
  });

  $(".increase").on("click", function () {
    $(".content").addClass("font-increase").removeClass("font-decrease");
  });

  $(".reset").on("click", function () {
    $(".content").removeClass("font-decrease").removeClass("font-increase");
  });

  $(".toggle-sidebar").on("click", function () {
    $(".left-sidebar").toggleClass("open");
    $(".sidebar-overlay").addClass("show");
  });

  $(".sidebar-close").on("click", function () {
    $(".left-sidebar").removeClass("open");
  });

  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 600) {
      $(".tap-top").fadeIn();
    } else {
      $(".tap-top").fadeOut();
    }
  });
  $(".tap-top").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      600
    );
    return false;
  });
})(jQuery);

// Side bar Menu
$(".sidebar-button").click(function () {
  $(".bg-overlay, .left-sidebar").addClass("show");
});
$(".button-close, .bg-overlay").click(function () {
  $(".bg-overlay, .left-sidebar").removeClass("show");
});

// sidebar active
$(document).ready(function () {
  var current = window.location.pathname.split("/").pop();

  $(".nav-sidebar a").each(function () {
    var link = $(this).attr("href");

    if (link && link !== "#!" && current === link) {
      $(this).addClass("active");

      // Case 1: If this link is inside a sub-menu (child item)
      var parentTitle = $(this).closest("ul.sub-menu").prev(".title");
      if (parentTitle.length) {
        parentTitle.addClass("active");
        parentTitle.next("ul.sub-menu").css("display", "block");
      }
      
      // Case 2: If this link is inside a nested sub-menu (grandchild item)
      var nestedParentTitle = $(this).closest("ul.nested-sub-menu").prev(".title");
      if (nestedParentTitle.length) {
        nestedParentTitle.addClass("active");
        nestedParentTitle.next("ul.nested-sub-menu").css("display", "block");
        
        // Also open the parent menu
        var mainParentTitle = $(this).closest("ul.sub-menu").prev(".title");
        if (mainParentTitle.length) {
          mainParentTitle.addClass("active");
          mainParentTitle.next("ul.sub-menu").css("display", "block");
        }
      }
      // Case 3: If it's a top-level item (no sub-menu)
      else if (!$(this).closest("li").find("ul.sub-menu").length) {
        $(this).closest(".title").addClass("active");
      }
    }
  });

  // Handle clicks manually
  $(".nav-sidebar a").on("click", function () {
    $(".nav-sidebar a").removeClass("active");
    $(".nav-sidebar .title").removeClass("active");

    $(this).addClass("active");

    var nestedParentTitle = $(this).closest("ul.nested-sub-menu").prev(".title");
    if (nestedParentTitle.length) {
      // If clicked inside nested sub-menu
      nestedParentTitle.addClass("active");
      
      // Also keep parent menu active
      var mainParentTitle = $(this).closest("ul.sub-menu").prev(".title");
      if (mainParentTitle.length) {
        mainParentTitle.addClass("active");
      }
    } else {
      var parentTitle = $(this).closest("ul.sub-menu").prev(".title");
      if (parentTitle.length) {
        // If clicked inside sub-menu
        parentTitle.addClass("active");
      } else if (!$(this).closest("li").find("ul.sub-menu").length) {
        // If clicked on a top-level link (no sub-menu)
        $(this).closest(".title").addClass("active");
      }
    }
  });
});

// Enhanced menu toggle for nested sub-menus
$(document).ready(function () {
  $(".nav-sidebar .menu > .title").on("click", function (e) {
    e.preventDefault();

    const parentItem = $(this).parent(".menu");
    const subMenu = parentItem.children(".sub-menu, .nested-sub-menu");
    
    // Check if this is a nested menu item
    const isNestedMenu = parentItem.closest("ul.sub-menu").length > 0;
    
    if (!isNestedMenu) {
      // This is a top-level menu - close all other top-level menus
      $(".nav-sidebar > .menu")
        .not(parentItem)
        .removeClass("active")
        .children(".sub-menu")
        .stop(true, true)
        .slideUp(300, function () {
          $(this).css("display", "none");
        });
    } else {
      // This is a nested menu - only close sibling nested menus
      parentItem.siblings(".menu")
        .removeClass("active")
        .children(".nested-sub-menu")
        .stop(true, true)
        .slideUp(300, function () {
          $(this).css("display", "none");
        });
    }
    
    // Toggle current menu
    if (parentItem.hasClass("active")) {
      parentItem.removeClass("active");
      subMenu.stop(true, true).slideUp(300, function () {
        $(this).css("display", "none");
      });
    } else {
      parentItem.addClass("active");
      subMenu.stop(true, true).slideDown(300, function () {
        $(this).css("display", "block");
      });
    }
  });
});