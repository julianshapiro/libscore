// add percentage counts to the legend in (up arrow 34%)

/***************
     Vars
***************/

var hiddenVariables = [
	/* jQueryUI ($.ui) */
	"$.fn.autocomplete", "$.fn.tooltip", "$.fn.tabs", "$.widget", "$.fn.button", "$.fn.mouse", "$.fn.menu", "$.position",
	"$.fn._focus", "$.fn._show", "$.fn._hide", "$.fn._addClass", "$.fn._removeClass", "$.fn._toggleClass", "$.fn.__toggle",
	"$.fn.selectable", "$.fn.progressbar", "$.fn.buttonset", "$.effects", "$.fn.effect", "$.fn.draggable", "$.fn.droppable",
	"$.fn.datepicker", "$.datepicker", "$.fn.dialog", "$.fn.slider", "$.fn.sortable", "$.fn.resizable",
	"$.fn.accordion", "$.fn.scrollParent", "$.fn.uniqueId", "$.fn.removeUniqueId", "$.fn.focus",
	"$.fn.disableSelection", "$.fn.enableSelection", "$.fn.zIndex", "$.fn.toggleClass", "$.fn.switchClass",
	"$.fn.cssUnit", "$.data", "$.focusable", "$.tabbable", "$.Widget", "$.fn.propAttr",
	/* Ajax Form */
	"$.fieldValue", "$.fn.fieldValue", "$.fn.ajaxSubmit", "$.fn.formToArray", "$.fn.ajaxFormUnbind", "$.fn.clearForm", "$.fn.formSerialize",
	"$.fn.fieldSerialize", "$.fn.enable", "$.fn.clearInputs", "$.fn.clearFields", "$.fn.resetForm",
	/* Google Search (GSearch) */
	"GSearchForm", "GwebSearch", "GcustomwebSearch", "GbookSearch", "GblogSearch", "GvideoSearch", "GnewsSearch", "GlocalSearch",
	"GcustomimageSearch", "GpatentSearch", "GSearchControl", "GsearcherOptions", "GdrawOptions", "GimageSearch",
	/* Google Misc. */
	"CreativeToolset", "CreativeToolsetProxy", "ExpandableAdSlotFactory", "DhtmlExpandableIframeFactory", "GPT_jstiming", "GA_jstiming", "ToolbarApi",
	/* Keywords */
	"DEBUG", "Analytics", "Fx", "Try", "Chain", "Selectors", "Class", "Form", "Window", "Events", "Elements", "Options", "Type", "Toggle", "Position",
	"Browser", "Asset", "Field", "Insertion", "Color", "Request", "Tips", "Group", "Effect", "Native", "Builder", "Control", "Locale", "Table",
	/* GSAP */
	"Ease", "Strong", "Power4", "Quint", "Power3", "Quart", "Power2", "Cubic", "Quad", "Power1", "Linear", "Power0", "Back", "BackOut", "BackIn",
	"BackInOut", "SlowMo", "BounceOut", "BounceIn", "SteppedEase", "BounceInOut", "Bounce", "CircOut", "CircIn", "CircInOut", "CSSPlugin", "Circ",
	"ElasticOut", "ElasticIn", "ElasticInOut", "Elastic", "ExpoOut", "ExpoIn", "ExpoInOut", "Expo", "SineOut", "RoughEase", "SineIn", "Sine", "SineInOut", "EaseLookup",
	/* Temporary */
	"IframeBase", "Iframe", "IFrame", "IframeProxy", "IframeWindow"
];

/* Google misc., Drupal Webform, ClickTale, Baidu, Wordpress, Misc. */
var hiddenVariableGroups = /^(Goog_.+|G(A|S)_google.+|WebForm_.+|WR[A-z]{1,2}|ClickTale[A-z]+|BAIDU_[A-z]+|\$(\.fn)?\.wpcf7[A-z].+|Sys\$[A-z].+|[A-Z][0-9]{1,2}|[A-z]$|[A-Z][a-z]$)/;

/***************
    Elements
***************/

var $html = $("html"),
	$body = $("body"),
	$input = $("input"),
	$header_code = $("#header-code"),
	$header_code_object = $("#header-code-object"),
	$header_code_property = $("#header-code-property"),
	$header_logo = $("#header-logo"),
	$main = $("main"),
	$slogan = $("#slogan"),
	$subSlogan = $("#subSlogan"),
	$data = $("#data"),
	$data_table = $("#data table"),
	$data_cols = $("#data_cols"),
	$data_scroll = $("#data_scroll"),
	$data_lib = $("#data-lib"),
	$data_name = $("#data-name"),
	$badge_container = $(".badge-container"),
	$about = $("#about"),
	$sectionHeader_search = $("#sectionHeader--search"),
	$search_ = $("#search_"),
	$search = $("#search"),
	$searchSymbols = $("#searchSymbols"),
	$queryButtons = $("#queryButtons span"),
	$howTo = $("#howTo"),
	$footer = $("footer"),
	$subscribe_ = $("#subscribe_"),
	$subscribe = $("#subscribe"),
	$searchWrap = $("#searchWrap"),
	$badge = $("#badge"),
	$compare = $(".addData input"),
	$dropdownInputs = $(".addData input, #search"),
	$compareChart = $(".chartHolder"),
	$bigNumber = $('.bigNumber'),
  $hasRendered;


/**************
    Global
**************/

$body.on("click", "a", function(event) {
	if (event.target.id !== "view_trending_data") {
		event.preventDefault();
		window.open(event.target.href)
	}
});

var dataType = 'script';

$body.on("click", "[data-query]", function(event) {
	var target = event.target,
		dataQuery = target.getAttribute("data-query");
	dataType = target.getAttribute("data-type");


	if (dataQuery !== null) {
		var query = dataQuery || $(target).text();

		for (var i = 0; i < query.length; i++) {
			(function(j) {
				setTimeout(function() {
					$search.val(query.slice(0, j + 1));

					if (j === query.length - 1) {
						setTimeout(function() {
							UI.query($search[0]);
						}, 75);
					}
				}, j * (18 - Math.min(12, query.length)) * 3);
			})(i);
		}
	}
});

$(window).on("scroll", function() {
	$data_scroll.hide();
});

/***************
    Helpers
***************/

$search.one("mouseup", function() {
	$search.select();
});

/***************
    History
***************/

window.onhashchange = function() {
	var path = window.location.hash;
	var rawPath = path.replace("#", "");
	$search.val(rawPath);
	UI.query(event.target);
}

/**************
      UI
**************/
var dropdown = $("#dropDown");
var dropdownLib = $("#dropDown ul.lib");
var dropdownLoader = $("#dropDown .loader");
var input = $("input");

//hide dropdown if click outside
$(document).mouseup(function (e){
  if (!dropdown.is(e.target) && !input.is(e.target) && dropdown.has(e.target).length === 0) {
    dropdown.removeClass('show');
  }
});

var compare = false;

//for keyup throttle
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

$dropdownInputs.on('keydown paste', function(e){

	//keyboard up and down handling.
	var thisField = $(this);
	var thisItem = dropdown.find('li.selected');
	var nextItem = thisItem.next('li');
	var prevItem = thisItem.prev('li');
	var type = e.which;

	var thisInput = thisField[0].form.className;

	if(thisInput == 'addData') {
		compare = true;
		dropdown.addClass('compare');

	} else {
		compare = false;
		dropdown.removeClass('compare');
	}

	if (type == 13) {
		//if we click enter and there is nothign selected in the dropdown then we append then query, otherwise we query directly
  	if(thisItem[0] == undefined) {
  		//we want to submit the form, as  nothing is selected
  		if(compare) {
		 		$("form.addData").submit();
		 		$bigNumber.fadeOut('500');
		 	} else {
		 		UI.query(event.target);
		 	}
  	} else {
  		var findMe = thisItem.contents().filter(function() {
		    return this.nodeType == 3;
			}).text();

  		if(compare) {
  			$compare.val(findMe);
  			$bigNumber.fadeOut('500');
		 		$("form.addData").submit();
		 	} else {
		 		if(thisItem.hasClass('script')) {
		 			$search.val('script:' + findMe);
		 		} else {
		 			$search.val(findMe);
		 		}
		 		UI.query(event.target);
		 	}
  	}
  	dropdown.removeClass('show');
  	return false;
  }

	if ((type == 40) || (type == 38) || (type == 13)) {
		//if nothing is yet selected
		if((nextItem[0] == undefined) && (thisItem[0] == undefined)) {
			//if down
			if(type == '40'){
				dropdownLib.find("li:first-child").addClass('selected');
			}
		} else {
			var selected = $('.selected');
			var heightThis = selected.outerHeight();
			var heightThreshold = heightThis * 6;
			var selectedParent = selected.parent('ul');
			var parentCount = selectedParent.find('li').length;
			var totalHeight = parentCount * heightThis;

			if(type == '40'){
				var distanceFromTop = selected.position().top + heightThis;
				var newScroll = currentScroll + heightThis;
				var skipThreshold = newScroll + heightThreshold;

				if(dropdownLib.find('li:last-child').hasClass('selected')) {
					//console.log('end');
				} else {
					thisItem.removeClass('selected');
					nextItem.addClass('selected');

					// scroll down
					if(distanceFromTop >= heightThreshold ) {
						var currentScroll = dropdownLib.scrollTop();
						newScroll = currentScroll + heightThis;
						skipThreshold = newScroll + heightThreshold;
						dropdownLib.scrollTop(newScroll);
					}
				}
			} else if(type == '38') {
				var distanceFromTop = selected.position().top;
				var currentScroll = dropdownLib.scrollTop();

				//if it isnt the first item of libs continue
				if(dropdownLib.find('li:first-child').hasClass('selected')) {
					//console.log('beginning');
				} else {
					thisItem.removeClass('selected');
					prevItem.addClass('selected');

					//scroll up
					if(distanceFromTop <= 0 ) {
						var newScroll = currentScroll - heightThis;
						dropdownLib.scrollTop(newScroll);
					}
				}
			}
		}
		return false;
	}

	delay(function(){
    var values = thisField.val();
		var searchURL = '//api.libscore.com/v1/search/' + values;

		dropdownLoader.show();

		if(values == '') {
			dropdown.removeClass('show');
		} else {
			dropdown.addClass('show');
		}
		dropdownLib.html('');

		//need to write conditional, if field isnt empty, run search
		if(values != '') {
			$.ajax({
				url: searchURL,
				dataType: "json",
				success: function (response) {
					dropdownLoader.fadeOut(200);
					$data.find('.noHover').hide();

					if(response.length > 0) {
						$('h3.lib').removeClass('notFound').text("Libraries & Scripts");
						$.each(response, function( index, value ) {
						  dropdownLib.append("<li class='" + value.type + "'>" + value.name + "<span>" + value.type + "</span></li>")
						});
					} else {
						$('h3.lib').addClass('notFound').text("No Matches Found");
						dropdownLib.empty();
					}
				}
			});
		}
	}, 200 );
});

var compareError = 'Not a valid search, try again!'
//clear compare input if error and focus
$compare.on('focus', function(){
	var currentCopy = $(this).val();
	if(currentCopy == compareError) {
		$compare.val('');
	}
});
var scriptClick = false;

$('body').on('click', '#dropDown li', function(e){

	var thisItem = $(this);

 	var findMe = thisItem.contents().filter(function() {
    return this.nodeType == 3;
	}).text();

 	if(compare) {
 		if(thisItem.hasClass('script')) {
 			$compare.val(findMe);
 			scriptClick = true;
 		} else {
 			$compare.val(findMe);
 			scriptClick = false;
 		}

 		$("form.addData").submit();

 	} else {

 		if(thisItem.hasClass('script')) {
 			$search.val('script:' + findMe);
 		} else {
 			$search.val(findMe);
 		}
 		UI.query(event.target);
 	}
 	dropdown.removeClass('show');
});

$("form.addData").on('submit', function(){
	$bigNumber.fadeOut('500');
});

var hashOnLoad = window.location.hash;

var UI = {
	loading: false,
	error: function() {
		$search.addClass('error');
		$data.html("<p class='noHover'>No libraries or scripts were detected!</p>");

		$.Velocity.RunSequence([
			{ elements: $search_, properties: "callout.shake", options: { duration: 1050, sequenceQueue: false } }
		]);
	},
	query: function() {
		var data = $search.val();
		function request (query, callback) {
			var API = {
					hostname: "//api.libscore.com/v1/",
					librariesPath: "libraries/",
					sitesPath: "sites/",
					scriptsPath: "scripts/"
				},
				queryNormalized;

			function ajax(url) {
				$search.removeClass('error');
				UI.loading = true;
				$data_table.removeClass('show');
				$data_lib.removeClass("show");
				$data_cols.removeClass("show");
				$body.addClass("results");
				$searchSymbols.addClass("show");
				$html.css("cursor", "wait");
				$badge.fadeOut(400);
				$("#data-lib").removeClass('open');

				setTimeout(function(){
					$body.removeClass('slim');

					$.ajax({
						url: API.hostname + url,
						dataType: "json",
						complete: function() {
							$searchSymbols.removeClass("show");
							$html.css("cursor", "default");
						},
						success: function (response) {

							if (response && response.meta) {
								$(window).scrollTop(0);
								callback(response);
								$data_table.addClass('show');
								$data_lib.addClass("show");
								$data_cols.addClass("show");

								var tableHeight = $("#data table").outerHeight();
								var docHeight = $(window).height() - $("footer").outerHeight();

								if(tableHeight > docHeight) {
									setTimeout(function(){
										$data_scroll.fadeIn(1000);
									}, 1000);
								}
							} else {
								error: UI.error
							}
						},
						error: UI.error
					});
				}, 700);
			}

			$data_scroll.fadeOut(500);
			query = $.trim(query.replace(/^(^https?:\/\/)?(www\.)?/i, "").replace(/^jQuery\./i, "$.").replace(/\.js$/i, ""));
			$search.val(query);

			window.history.pushState(null, null, '#' + query);

			if (/^[-A-z0-9]+\.[-A-z0-9]+$/.test(query)) {
				queryNormalized = "site";
				query = query.toLowerCase();
			} else if (/^script: ?[-A-z0-9]+/.test(query)) {
				queryNormalized = "script";
				query = query.replace(/^script: */, "").toLowerCase();
			} else {
				queryNormalized = query;
			}

			switch (queryNormalized) {
				case "site":
					UI.requestTarget = "site";
					ajax(API.sitesPath + query + "/?");
					break;
				case "sites":
					UI.requestTarget = "sites";
					ajax(API.sitesPath + "?limit=1000");
					break;
				case "script":
					UI.requestTarget = "script";
					ajax(API.scriptsPath + query + "?limit=1000");
					break;
				case "scripts":
					UI.requestTarget = "scripts";
					ajax(API.scriptsPath + "?limit=1000");
					break;
				case "libs":
					UI.requestTarget = "libs";
					ajax(API.librariesPath + "?limit=1500");
					break;

				default:
					UI.requestTarget = "lib";
					ajax(API.librariesPath + query + "?limit=1000");
			}
		}

		function prettifyName (name, type) {
			var prettified = name || "";
			var truncated = false;

			if (name && name.length > 40) {
				truncated = true;
				prettified = prettified.slice(0, 37);
			}

			if (truncated) {
				prettified = "<span title='" + name + "'>" + prettified + "…</span>";
			}

			if (type === "mobile") {
				prettified += " <span title='Appears on the mobile version of this site.' class='accent'>[mobile]</span>";
			}

			return prettified;
		}

		function prettifyNumber (number, isRank) {
			var prettified = numeral(number).format("0,0").replace(/,/g, "<span class='accent'>,</span>");

			if (isRank === true) {
				prettified = "<span class='text-grey'>#</span>" + prettified;
			}
			return prettified;
		}

		var matches;
		request(data, function(response) {

			var $html = "";
			var $columns;
			var $chartLabel;
      var $chartSubLabel;

			if (response.scripts) {
				response.libraries = response.libraries.concat(response.scripts.map(function(obj) { obj.name = "script:" + obj.name; return obj; }));
			}

			matches = (response.results || response.sites || response.libraries);
			matches.forEach(function(match) {
				var $matchData;

				if (hiddenVariables.indexOf((match.library || match.name)) !== -1 || hiddenVariableGroups.test((match.library || match.name))) {
					return;
				}

				switch (UI.requestTarget) {
					case "site":
						$data_name.text(data);
						$columns = "<h3 class='middle'><span>Site: </span><a class='site' target= '_blank' href='//" + data + "'>" + data + "</a></h3><div class='left'>library</div><div class='right'>site count</div>";

						var isScript = /^script:/.test(match.name);

						if (isScript) {
						  $matchData = "<td><span data-type='script' data-query='script:" + match.name.replace(/^script:/, "") + "'>" + prettifyName(match.name, match.type) + "</span> <span class='text-green'></span></td>";
						} else {
							$matchData = "<td><span  data-type='lib' data-query='" + match.name + "'>" + prettifyName(match.name, match.type) + "</span><a href='//" + (match.github ? ("github.com/" + match.github) : "github.com/julianshapiro/libscore/issues/1") + "' data-hint='Click to help track down this library.' class='github'></a></td>";
						}

						$matchData += "<td>" + prettifyNumber(match.count) + "</td>";
						break

					case "sites":

						$chartLabel = 'Top Sites';
						$columns = "<h3 class='middle'><span>Top Sites</span></h3><div class='left'>site</div><div class='right'>site rank</div>";
						$matchData = "<td><span data-type='site' data-query='" + match.url + "'>" + prettifyName(match.url) + "</span> <span class='text-green'></span></td>";
						$matchData += "<td>" + prettifyNumber(match.rank, true) + "</td>";
						break;

					case "lib":

						$libCount = Number(response.count[0]).toLocaleString('en');
						$bigNumber.text($libCount);
						$bigNumber.fadeIn('500');
						$data_name.html($search.val() + "<span class='close'>Close Graph</a>");
						$badge_container.html('');
						// $badge_container.append("<a class='badge' id='direction' title='View the Libscore "+ $search.val() +" Badge' href='//107.170.240.125/badge/" + $search.val() + ".svg'></a>");

						var diff = (response.count[0] - response.count[1]) / response.count[1];
						var percentChange = (diff * 100).toFixed(2);

						if(percentChange < 0) {
							$badge_container.append("<span class='negative' id='direction' title='"+ $search.val() +" has decreased "+ percentChange +"% since the last crawl'>"+ percentChange + "%</span>");
						} else {
							$badge_container.append("<span class='positive' id='direction' title='"+ $search.val() +" has increased "+ percentChange +"% since the last crawl'>"+ percentChange + "%</span>");
						}

						$badge_container.append("<span class='number' id='direction' title='"+ $search.val() +" is used by "+ $libCount + " Sites'>"+ $libCount + " Sites</span>");
						$body.addClass("slim").removeClass("script");
						$chartLabel = data;
            $chartSubLabel = response.count;
						$columns = "<div class='left'>Sites </div></div><div class='right'>site rank</div>";
						$matchData = "<td><span data-type='site' data-query='" + match.url + "'>" + prettifyName(match.url) + "</span><a class='text-green' href='//" + match.url + "'></a></td>";
						$matchData += "<td>" + prettifyNumber(match.rank, true) + "</td>";
						break;

					case "libs":
						$chartLabel = 'Top Libs';
						$columns = "<div class='left'>library</div><div class='right'>site count</div>";
						$matchData = "<td><span data-type='lib' data-query='" + match.library + "'>" + prettifyName(match.library) + "</span><a href='//" + (match.github ? ("github.com/" + match.github) : "github.com/julianshapiro/libscore/issues/1") + "' data-hint='Click to help track down this library.' class='github'></a></td>";
						$matchData += "<td>" + prettifyNumber(match.count[0]) + "</td>";
						break;

					case "script":
						$scriptCount = Number(response.count[0]).toLocaleString('en');
						$bigNumber.text($scriptCount);
						$bigNumber.fadeIn('500');
						$data_name.html($search.val() + "<span class='close'>Close Graph</a>");
						$badge_container.html('');
						// $badge_container.append("<a class='badge' id='direction' title='View the Libscore "+ $search.val() +" Badge' href='//api.libscore.com/badge/" + $search.val() + ".svg'></a>");

						var diff = (response.count[0] - response.count[1]) / response.count[1];
						var percentChange = (diff * 100).toFixed(2);

						if(percentChange < 0) {
							$badge_container.append("<span class='negative' id='direction' title='"+ $search.val() +" has decreased "+ percentChange +"% since the last crawl'>"+ percentChange + "%</span>");
						} else {
							$badge_container.append("<span class='positive' id='direction' title='"+ $search.val() +" has increased "+ percentChange +"% since the last crawl'>"+ percentChange + "%</span>");
						}

						$badge_container.append("<span class='number' id='direction' title='"+ $search.val() +" is used by "+ $scriptCount + " Sites'>"+ $scriptCount + " Sites</span>");

						$body.addClass("slim script");
						$chartLabel = data;
            $chartSubLabel = response.count;
						$columns = "<div class='left'>Sites</div><div class='right'>site rank</div>";
						$matchData = "<td><span data-type='script' data-query='" + match.url + "'>" + prettifyName(match.url) + "</span><a class='text-green' href='//" + match.url + "'></a></td>";
						$matchData += "<td>" + prettifyNumber(match.rank, true) + "</td>";
						break;

					case "scripts":
						$chartLabel = 'Top Scripts';
						$columns = "<div class='left'>script</div><div class='right'>site count</div>";
						$matchData = "<td><span data-type='script' data-query='script:" + match.script + "'>" + prettifyName(match.script) + "</span> <span class='text-green'></span></td>";
						$matchData += "<td>" + prettifyNumber(match.count[0]) + "</td>";
						break;
				}

				$html += "<tr>" + $matchData + "</tr>";
			});

      //if data is available, we are creating a chart, if not, destroying it.
      if(typeof $chartSubLabel === 'undefined'){
        if($hasRendered == true){
          $compareChart.highcharts().destroy();
          $hasRendered = false;
        }
      } else {
        $hasRendered = true;

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
            categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug'],
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
            name: $chartLabel,
            data: $chartSubLabel.reverse(),
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
      };

      var chartData = [];
      var searchedQueries = [];
      var newQuery = '';

      $("[data-query]").on('click',function(){
      	searchedQueries = [];
      });

      $(document).on('submit','#mainSearch',function(){
      	searchedQueries = [];
      });

      $(document).on('submit','form.addData',function(){
      	var searchInput = $(this).find('input');
				newQuery = searchInput.val();

				//check to see if user already searched for item (exists in chart) to avoid dupes
				if(jQuery.inArray(newQuery, searchedQueries) == -1) {
					//searchInput.val('');
			 		getData();
			 	} else {
			 		//searchInput.val(newQuery + " already exists on the chart!")
			 	}

			 	searchedQueries.push(newQuery);
	    	return false
	    });

      function getData() {
      	var API = {
					hostname: "//api.libscore.com/v1/",
				}
				$('.addData .loader').addClass('show');

				if(scriptClick == false) {
					var path = 'libraries/';
				} else {
					var path = 'scripts/';
				}

      	$.ajax({
					url: API.hostname + path + newQuery + '?limit=1000',
					dataType: "json",
					success: function (response) {

						if (response && response.meta) {
							chartData = response.count;

							if(chartData.length == 0){
								searchError();
							} else {
								setData();
							}
							$('.addData .loader').removeClass('show');
						}
					}
				});
      }

      function searchError() {
      	$compare.val(compareError)
      	$compare.blur();
      }

      function compareOverage() {
      	$compare.val('You can only compare 4 libraries/scripts at once');
      	$compare.prop('disabled', true);
      	$compare.css('opacity', '.5');
      }

      var index = -1;

      function setData() {
        var chart = $compareChart.highcharts(),
         series = chart.series[0];
        var currentGadient= [];
        index = index + 1;

        // this number needs to change if we add mroe gradients
        if(index < 3){

					var gradients = [
						[
							['rgba(73,115,214,.15)'],
							['rgba(73,115,214,.07)']
						],
						[
							['rgba(240,120,50,.25)'],
							['rgba(240,120,50,.1)'],
						],
						[
							['rgba(255,50,210,.19)'],
							['rgba(255,50,210,.07)'],
						]
					]

					var colors = ['rgba(73,115,214,1)', 'rgba(240,120,50,1)', 'rgba(255,50,210,1)'];

				  var resultantGradient = [];
					gradients[index].forEach(function(gradient, index) {
						resultantGradient.push([index, gradient[0]]);
					});

					var colorChoice = colors[index];

					//this sets the color for the legend label
	        chart.options.legend.itemStyle.color = colorChoice;

	        chart.addSeries({
	          name: newQuery,
	          data: chartData.reverse(),
	          color: colorChoice,
	          lineColor: colorChoice,
	          fillColor: {
	            linearGradient: [0, 0, 0, 300],
	            stops: resultantGradient
	          },
	          marker: {
	            lineColor: colorChoice
	          }
	        });
	      } else {
	      	compareOverage();
	      }
      }

      $chartSubLabel = '';

			$data_table
				.scrollTop = 0;

			if ($html) {

				$data_cols.html($columns);
				$data_table.html($html);
			} else {
				$data_cols.html("");
				$data_table.html("<p class='noHover'>No libraries or scripts were detected!</p>");
			}

			if (matches.length > 900) {
				$data_table.append("<div id='data_more'><span>Results after 1,000 are not shown. Query our <a href='https://github.com/julianshapiro/libscore'>API</a> for a complete list.</span></div>");
			}

			setTimeout(function() {
				$("#data").resize();
			}, 2000);
		});
	}
};

/**************
    Events
**************/

/* Input behavior. */
$("input").on("keydown", function(event) {
	if (event.keyCode === 13 && this.value !== "") {
		if (event.target.id === "search" && this.value !== "variable (case sensitive) or domain...") {
			UI.query(event.target);
		} else if (this.id === "subscribe" && this.value) {
			$subscribe_
				.submit()
				.remove();
		}
	}
});

/**************
     Init
**************/
$(document).ready(function() {

    $('#script-tip').tooltipster({
    	interactive: true,
      animation: "fade",
      touchDevices: true,
      interactiveTolerance: 300,
      maxWidth: 320,
      offsetY: 10,
      onlyOne: true,
      content: $('<p>You can also search for sites containing an external script by prefixing a query with <i>script:</i>, e.g. <b class="tip-link" data-query="">script:stats.wp.com</b> or <b class="tip-link" data-query="">script:use.typekit.net</b></p>'),
      functionReady: function(){
      	$(".tip-link").on("click", function(){
		    	$('#script-tip').tooltipster('hide');
		    });
      }
    });

    $('#domain-tip').tooltipster({
    	interactive: true,
      animation: "fade",
      touchDevices: true,
      interactiveTolerance: 300,
      maxWidth: 320,
      offsetY: 10,
      onlyOne: true,
      content: $('<p>You can retrieve all libraries used on a site by querying for its domain name, e.g. <b data-query="">stripe.com</b> or <b data-query="">digitalocean.com</b></p>'),
      functionReady: function(){
      	$(".tip-link").on("click", function(){
		    	$('#domain-tip').tooltipster('hide');
		    });
      }
    });

    $('body').on('mouseover mouseenter', '#direction', function(){
	    $(this).tooltipster({
        interactive: false,
	      animation: "fade",
	      touchDevices: true,
	      interactiveTolerance: 300,
	      maxWidth: 270,
	      offsetY: 10,
	      onlyOne: true
	    });
	    $(this).tooltipster('show');
		});

    $(".directions").on('click', function(){
    	$(this).next('#howTo').addClass('reveal');
    	$("#subscribe_").addClass("revealedHowTo");
    	$(this).remove();
    	return false;
    });

    $("#header-logo").on("click", function (){
			if ($("body").hasClass("results")) {
  			window.history.pushState(null, null, '#');
  			$data_scroll.hide();
    		$body.removeClass();
				$data_table.empty();
				$data_table.removeClass("show");
				$data_lib.removeClass("show");
				$data_cols.removeClass("show");
				$searchSymbols.removeClass("show");
				$data.find('.noHover').hide();
			}
		});

		$(".showChart").on("click", function (){
			$("#data-lib").addClass('open');
			return false;
		});

		$('body').on('click', '.close', function(){
			$("#data-lib").removeClass('open');
		});
});

$(window).load(function() {
	$.Velocity.RunSequence([
		{ elements: $header_logo.add($slogan).add($search_).add($queryButtons).add($howTo).add($howTo.find("p")), properties: "transition.fadeIn", options: { stagger: 50, duration: 300 } },
		{ elements: $header_code, properties: "transition.fadeIn", options: { sequenceQueue: false, duration: 500
			, begin:
			function() {
					var hash = window.location.hash.slice(1);

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

function stickyNav(){
	var scrollTop     = $(window).scrollTop(),
  elementOffset = $('#query').offset().top + 20,
  distance      = (elementOffset - scrollTop);

	if(scrollTop > distance){
		$("#searchWrap").addClass("sticky");
		$("#data, body").addClass("sticky");
	} else {
		$("#searchWrap").removeClass("sticky");
		$("#data, body").removeClass("sticky");
	}
}

if ($(window).width() < 850) {
	$(window).on('scroll', function() {
		stickyNav();
	});

	$(window).on('touchmove', function() {
		stickyNav();
	});

	$(".footer-chart").on('click', function (){
		$("#data-lib").toggleClass("slideUp");
		return false;
	});

	$(".close").on('click', function (){
		$("#data-lib").removeClass("slideUp");
		return false;
	});
}

$(window).resize( function(e){
  if ($(window).width() < 850) {
		$(window).on('scroll', function() {
			stickyNav();
		});
	}
});