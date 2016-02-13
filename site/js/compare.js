var $compareChart = $(".chartHolder"),
$data_name = $("#data-name"),
$header_code = $("#header-code"),
$header_logo = $("#header-logo"),
$slogan = $("#slogan"),
$search_ = $("#search_"),
$search = $("#search"),
$queryButtons = $("#queryButtons span"),
$howTo = $("#howTo"),
$dropdownInputs = $(".addData input, #search"),
$data = $("#data"),
$compare = $(".addData input");

$data_name.html("Graph title");

$compareChart.highcharts({
  chart: {
    type: 'area',
    height: 375,
    backgroundColor: 'transparent',
    spacingBottom: 50,
    style: {
      fontFamily: '"Avenir Medium", "Lucida Grande", sans-serif',
      fontSize: '12px'
    }
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: ['Jan', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    title: {
      enabled: false
    },
    lineColor: '#dcdcdc',
    lineWidth: 1,
    labels: {
    	y: 25,
      align: 'center',
      style: {
        fontSize: '12px',
        color: '#29BD66',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 'bold'
      }
    },
    tickInterval: null,
    tickPosition: "outside",
    pointPadding: null,
    groupPadding: null,
    borderWidth: null,
  },
  yAxis: {
    min: 0,
    title: {
      text: '',
    },
    gridLineColor: 'transparent',
    lineColor: '#dcdcdc',
    lineWidth: 1,
    labels: {
      align: 'right',
      step: 1,
      style: {
        fontSize: '12px',
        color: '#29BD66',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 'bold'
      }
    },
  },
  credits: {
    enabled: false
  },
  navigation: {

  },
  legend: {
    align: 'right',
    enabled: true,
    itemDistance: 20,
    floating: true,
    y: 40,
    x: 10,
    verticalAlign: 'bottom',
    itemMarginTop: 5,
    itemStyle: {
      color: '#29BD66',
      fontSize: 15,
      fontWeight: '400'
    },
    itemHoverStyle: {
    	color: '#1CAD57'
    },
    symbolRadius: 5,
    symbolHeight: 8,
    symbolWidth: 8,
    symbolPadding: 6
  },
  series: [{
    name: 'DemoA',
    data: [400,300,123,205,799],
    color: '#29BD66'
  },
  {
    name: 'DemoV',
    data: [23,45,223,555,999],
    color: '#29BD66'
  },
  {
    name: 'DemoC',
    data: [223,545,923,1055,1999],
    color: '#29BD66'
  }],
  tooltip: {
    useHTML: true,
    headerFormat: '<h4 style="font-size: 11px; margin: 5px 0 7px 0; text-transform: uppercase; letter-spacing: 1px; color: #bcbcbc;">{point.key} Penetration</h4>',
    pointFormat: '<h2 style="font-size:16px; margin: 0; display: inline; color: #3a3a3a">{series.name}: <span style="color: #29BD66;">{point.y} Sites</span></h2>',
    borderColor: '#29BD66',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    shadow: false,
    positioner: function(boxWidth, boxHeight, point) {
      var chart = this.chart,
        distance = this.distance,
        ret = {},
        swapped,
        first = ['y', chart.chartHeight, boxHeight, point.plotY + chart.plotTop - 8],
        second = ['x', chart.chartWidth, boxWidth, point.plotX + chart.plotLeft],

        preferFarSide = point.ttBelow || (chart.inverted && !point.negative) || (!chart.inverted && point.negative),

        firstDimension = function (dim, outerSize, innerSize, point) {
          var roomLeft = innerSize < point - distance,
            roomRight = point + distance + innerSize < outerSize,
            alignedLeft = point - distance - innerSize,
            alignedRight = point + distance;

          if (preferFarSide && roomRight) {
            ret[dim] = alignedRight;
          } else if (!preferFarSide && roomLeft) {
            ret[dim] = alignedLeft;
          } else if (roomLeft) {
            ret[dim] = alignedLeft;
          } else if (roomRight) {
            ret[dim] = alignedRight;
          } else {
            return false;
          }
        },

        secondDimension = function (dim, outerSize, innerSize, point) {
          if (point < distance || point > outerSize - distance) {
            return false;

          } else if (point < innerSize / 2) {
            ret[dim] = 1;
          } else if (point > outerSize - innerSize / 2) {
            ret[dim] = outerSize - innerSize - 2;
          } else {
            ret[dim] = point - innerSize / 2;
          }
        },
        swap = function (count) {
          var temp = first;
          first = second;
          second = temp;
          swapped = count;
        },
        run = function () {
          if (firstDimension.apply(0, first) !== false) {
            if (secondDimension.apply(0, second) === false && !swapped) {
              swap(true);
              run();
            }
          } else if (!swapped) {
            swap(true);
            run();
          } else {
            ret.x = ret.y = 0;
          }
        };

      if (chart.inverted || this.len > 1) {
        swap();
      }
      run();

      return ret;
    },
    style: {
      color: '#333333',
      fontSize: '13px',
      padding: '15px'
    }
  },
  plotOptions: {
    area: {
      lineColor: '#29BD66',
      lineWidth: 2,
      fillColor: {
        linearGradient: [0, 0, 0, 300],
        stops: [
          [0, 'rgba(41,189,102,.12)'],
          [1, 'rgba(148,196,168,.1)']
        ]
      },
      marker: {
        lineWidth: 2,
        radius: 6,
        lineColor: '#29BD66',
        fillColor: '#fafafa',
        states: {
          hover: {
            enabled: true,
            radiusPlus: 3,
            lineWidth: 0,
            lineWidthPlus: 0
          }
        }
      },
      states: {
        hover: {
          lineWidthPlus: 0
        }
      },
      pointPlacement: "on"
    }
  }
});

$(window).load(function() {
  $.Velocity.RunSequence([
    { elements: $header_logo.add($slogan).add($search_).add($queryButtons).add($howTo).add($howTo.find("p")), properties: "transition.fadeIn", options: { stagger: 50, duration: 300 } },
    { elements: $header_code, properties: "transition.fadeIn", options: { sequenceQueue: false, duration: 500
      , begin:
      function() {
          var hash = window.location.hash.slice(1);
          var hashOnLoad = window.location.hash;
          
          if (hash) {
            $search.attr("placeholder", hash);
            $search.val(hash);
            UI.query();
          } else if (hashOnLoad.includes("script")) {
            var newQuery = hashOnLoad.replace("#", "");
            $search.attr("placeholder", newQuery);
            $search.val(newQuery);
            UI.query();
          } else {
            $search.attr("placeholder", "search for a JavaScript variable (case sensitive) or a domain name...");
          }
        }
      }
    }
  ]);
});