(function ( $ ) {
	var genders = [
		"agender",
		"androgyne",
		"androgynous",
		"bigender",
		"cis female",
		"cis feminine",
		"cis male",
		"cis masculine",
		"cis woman",
		"demigirl",
		"demiguy",
		"female",
		"feminine",
		"femme",
		"genderqueer",
		"genderweird",
		"gender fluid",
		"intergender",
		"male",
		"man",
		"masculine",
		"neutrois",
		"nonbinary",
		"other",
		"pangender",
		"trans female",
		"trans male",
		"trans man",
		"trans feminine",
		"trans femme",
		"trans woman",
		"woman"
	];
	$.fn.genderField = function(action) {
		genders.sort();
		// size our dropdown box based on the input box
		function resize(input) {
			var totalWidth = input.outerWidth();
			var totalHeight = input.outerHeight()+input.position().top;
			var leftOffset = (input.position().left+parseInt(input.css('margin-left'),10));
			input.parent().find(".genderField-dropdown")
				.width(totalWidth)
				.css('top',totalHeight.toString()+"px")
				.css('left',leftOffset.toString()+"px");
		}
		// find genders based on the current input
		// insert into the correct position alphabetically
		function findGenders(dropdown,value) {
			var components;
			var count = 0;
			// split our value up by components to search
			var valueComponents = value.split(/\s+/);
			var found = false;
			// for each gender
			for(var i=0;i<genders.length;i++) {
				found = false;
				// we split it into tokens based on whitespace
				components = genders[i].split(/\s+/);
				// and search each token of the gender
				for(var j = 0; j<components.length; j++) {
					// against each token of our value
					for (var k = 0; k < valueComponents.length; k++) {
						// if there is a partial match starting at the beginning of both tokens
						if (components[j].indexOf(valueComponents[k]) === 0) {
							// insert or append if the element doesn't exist in the list
							if (dropdown.find("span."+genders[i].replace(/\s/,"_")).length==0) {
								var added = false
								var element = $("<span class='"+genders[i].replace(/\s/,"_")+"'>"+genders[i]+"</span>");
								// search through all genders listed to find where to insert
								dropdown.find("span").each(function() {
									if ($(this).text() > genders[i] && !added) {
										element.insertBefore($(this));
										// record that we added this element so we don't add it again
										added = true;
									}
								});
								// if we didnt add our element by the end, do it now
								if (!added)
									element.appendTo(dropdown);
								// add our click event to the element
								element.click(function() {
									dropdown.parent().find('input').val($(this).text()).focus();
									findGenders(dropdown, $(this).text());
								});
							}
							// we found a match for this gender, so record it and break out
							found = true;
							break;
						}
					}
					// break out if we found a match
					if (found) break;
				}
				// if there was no match found, remove the gender we're looking at from the list
				if (!found)
					dropdown.find("span."+genders[i].replace(/\s/,"_")).remove();
			}
			// prefer not to disclose is placed at the bottom
			// if it's already in the list, put it back at the bottom
			if (dropdown.find("span.prefer_not_to_disclose").length==0) {
				$("<span class='prefer_not_to_disclose'>prefer not to disclose</span>").appendTo(dropdown)
				.click(function() {
					dropdown.parent().find('input').val($(this).text()).focus();
					findGenders(dropdown, $(this).text());
				});
			}
			else
				dropdown.find("span.prefer_not_to_disclose").detach().appendTo(dropdown);
		}
		if (typeof action == "undefined" || typeof action == "object") {
			var options = {
				showArrow: true,
				additionalGenders: []
			};
			if (typeof action == "object") {
				options = $.extend({}, options, action);
			}
			if (typeof options.additionalGenders.length !== "undefined" && options.additionalGenders.length>0) {
				genders = genders.concat(options.additionalGenders);
			}
			var wrapper = $("<div></div>").css('position','relative').css('display',this.css('display')).addClass("genderField-wrapper");
			if (options.showArrow)
				wrapper.addClass("genderFieldSelectArrow");
			this.addClass("genderField").wrap(wrapper);
			
			var dropdown = $("<div></div>").addClass("genderField-dropdown");
			this.parent().append(dropdown);			
			resize(this);
			dropdown.hide();
			findGenders(dropdown, this.val());
			var self = this;
			
			var UP = 38;
			var DOWN = 40;
			var ENTER = 13;
			
			this.on("keydown", function(event) {
				if (self.is(":focus")) {
					var dropdown = self.parent().find('.genderField-dropdown');
					if (event.keyCode==UP) {
						event.returnValue=false;
						event.preventDefault();
						if (dropdown.find(".selected").length==0) {
							var child = dropdown.find("span:last-child").addClass("selected");
							dropdown.scrollTop(0);
							dropdown.scrollTop(child.position().top-child.height());
						}
						else if (dropdown.find("span.selected").prev().length>0) {
							var child = dropdown.find("span.selected").removeClass("selected").prev().addClass("selected");
							dropdown.scrollTop(0);
							dropdown.scrollTop(child.position().top-child.height());
						}
						else {
							dropdown.find("span.selected").removeClass("selected");
							var child = dropdown.find("span:last-child").addClass("selected");
							dropdown.scrollTop(0);
							dropdown.scrollTop(child.position().top-child.height());
						}
					}
					else if (event.keyCode==DOWN) {
						event.returnValue=false;
						event.preventDefault();
						if (dropdown.find(".selected").length==0) {
							var child = dropdown.find("span:first-child").addClass("selected");
							dropdown.scrollTop(0);
						}
						else if (dropdown.find("span.selected").next().length>0) {
							var child = dropdown.find("span.selected").removeClass("selected").next().addClass("selected");
							dropdown.scrollTop(0);
							dropdown.scrollTop(child.position().top-child.height());
						}
						else {
							dropdown.find("span.selected").removeClass("selected");
							var child = dropdown.find("span:first-child").addClass("selected");
							dropdown.scrollTop(0);
							dropdown.scrollTop(child.position().top-child.height());
						}
					}
					else if (event.keyCode==ENTER) {
						event.returnValue=false;
						event.preventDefault();
						self.val(dropdown.find("span.selected").text());
						findGenders(dropdown, dropdown.find("span.selected").text());
						dropdown.find("span.selected").removeClass("selected");
						dropdown.scrollTop(0);
					}
				}
			});

			this.data('lastValue',this.val());
			this.keyup(function(event) {
				var dropdown = $(this).parent().find('.genderField-dropdown');
				var value = $(this).val();
				if (value == self.data('lastValue') && value != "")
					return;
				self.data('lastvalue',value);
				findGenders(dropdown,value);
			});
			this.change(function(event) {
				var dropdown = $(this).parent().find('.genderField-dropdown');
				var value = $(this).val();
				findGenders(dropdown,value);
			});
			this.mouseup(function(event) {
				setTimeout(function() {
					var dropdown = self.parent().find('.genderField-dropdown');
					var value = self.val();
					findGenders(dropdown,value);
				},40);
			});
			this.focus(function(event) {
				var dropdown = $(this).parent().find('.genderField-dropdown');
				var value = $(this).val();
				dropdown.show();
				resize(self);
				findGenders(dropdown,value);
			});
			
			this.blur(function(event) {
				setTimeout(function() {
					if ($(document.activeElement).parents('.genderField-wrapper').length==0) {
						var dropdown = $(self).parent().find('.genderField-dropdown');
						dropdown.hide();
					}
				},200);
			});
			
			return this;
		}
		else if (action == "resize") {
			resize();
		}
	};
}( jQuery ));