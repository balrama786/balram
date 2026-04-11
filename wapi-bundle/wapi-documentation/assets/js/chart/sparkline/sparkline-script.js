(function ($) {
  "use strict";
  var sparkline_chart = {
    init: function () {
      setTimeout(function () {
        $("#simple-line-chart-sparkline").sparkline(
          [5, 10, 20, 14, 17, 21, 20, 10, 4, 13, 0, 10, 30, 40, 10, 15, 20],
          {
            type: "line",
            width: "100%",
            height: "150",
            tooltipClassname: "chart-sparkline",
            lineColor: "#059669",
            fillColor: "transparent",
            highlightLineColor: "#059669",
            highlightSpotColor: "#059669",
            targetColor: "#059669",
            performanceColor: "#059669",
            boxFillColor: "#059669",
            medianColor: "#059669",
            minSpotColor: "#059669",
          }
        );
      });
    },
  };
  sparkline_chart.init();
})(jQuery);
