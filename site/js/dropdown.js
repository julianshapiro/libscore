var dropdown = $("#dropDown"),
 dropdownLib = $("#dropDown ul.lib"),
 dropdownLoader = $("#dropDown .loader"),
 input = $("input");

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