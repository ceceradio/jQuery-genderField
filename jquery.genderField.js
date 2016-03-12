(function ( $ ) {
    var genders = [
        "Agender",
        "Androgyne",
        "Androgynous",
        "Bigender",
        "Boi",
        "Butch",
        "Cis Female",
        "Cis Feminine",
        "Cis Male",
        "Cis Man",
        "Cis Masculine",
        "Cis Woman",
        "Demigirl",
        "Demiguy",
        "Female",
        "Feminine",
        "Femme",
        "Genderqueer",
        "Genderweird",
        "Gender Fluid",
        "Intergender",
        "Intersex",
        "Male",
        "Man",
        "Masculine",
        "Neutrois",
        "Nonbinary",
        "Other",
        "Pangender",
        "Third Gender",
        "Trans Female",
        "Trans Feminine",
        "Trans Male",
        "Trans Man",
        "Trans Masculine",
        "Trans Woman",
        "Woman"
    ];
    // generate search map
    function generateSearchMap(genders) {
        var genderSearchMap = {};
        for(var i=0;i<genders.length;i++) {
            var components = genders[i].split(/\s+/);
            for(var j = 0; j<components.length; j++) {
                var lowercaseTerm = components[j].toLowerCase();
                for (var subTermLength = 1; subTermLength <= lowercaseTerm.length; subTermLength++) {
                    var subTerm = lowercaseTerm.substring(0,subTermLength);
                    if (!genderSearchMap.hasOwnProperty(subTerm)) {
                        genderSearchMap[subTerm] = [];
                    }
                    genderSearchMap[subTerm].push(genders[i]);
                }
            }
        }
        return genderSearchMap;
    }
    // size our dropdown box based on the input box
    function resize(input) {
        var dropdown = input.parent().find(".genderField-dropdown");
        var innerWidth = dropdown.outerWidth() - dropdown.innerWidth();
        var totalWidth = input.outerWidth()-innerWidth;
        var totalHeight = input.outerHeight()+input.position().top;
        var leftOffset = (input.position().left+parseInt(input.css('margin-left'),10));
        // possible ie7 workaround for position().left returning an incorrect value
        if (input.position().left==0 && parseInt(input.css('left'),10) > 0) {
            leftOffset += parseInt(input.css('left'),10)
        }
        dropdown.width(totalWidth)
            .css('top',totalHeight.toString()+"px")
            .css('left',leftOffset.toString()+"px");
    }
    
    function findGenders(allGenders, genderSearchMap, dropdown, value) {
        // split our value up by components to search
        var valueComponents = value.split(/\s+/);
        var foundGenders = [];
        if (value) {
        for (var k = 0; k < valueComponents.length; k++) {
            var lowercaseTerm = valueComponents[k].toLowerCase();
            if (genderSearchMap.hasOwnProperty(lowercaseTerm)) {
            foundGenders = foundGenders.concat(genderSearchMap[lowercaseTerm]);
            }
        }
        }
        else {
        foundGenders = allGenders;
        }
        foundGenders = uniq(foundGenders);
        return foundGenders;
    }
    // sort an array and ensure uniqueness
    function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    }
    $.fn.genderField = function(action) {
        var localGenders = genders.slice();
        var genderSearchMap = {};
        localGenders.sort();
        function addDropdownGenders(dropdown) {
            dropdown.empty();
            for (var i = 0; i < localGenders.length; i++) {
                var genderLabel = (options.lowercase)?localGenders[i].toLowerCase():localGenders[i];
                var element = $("<span class='"+localGenders[i].replace(/\W/g,"_")+"'>"+genderLabel+"</span>");
                element.appendTo(dropdown);
            }
            if (options.allowPreferNotToDisclose) {
                $("<span class='prefer_not_to_disclose'>prefer not to disclose</span>").appendTo(dropdown)
            }
            setAllClickEvents(dropdown);
        }
        function setDropdownGenders(dropdown, genders) {
            dropdown.find('span').hide().addClass('hiddenGender').removeClass('shownGender');
            for (var i = 0; i < genders.length; i++) {
                dropdown.find("."+genders[i].replace(/\W/g,"_")).show().addClass('shownGender').removeClass('hiddenGender');
            }
            if (dropdown.find("span").length == 0)
                dropdown.hide();
            else
                dropdown.show();
        }
        function setAllClickEvents(dropdown) {
            dropdown.find('span').click(function() {
                dropdown.parent().find('input').val($(this).text()).focus();
                var foundGenders = findGenders(localGenders, genderSearchMap, dropdown, $(this).text());
                setDropdownGenders(dropdown, foundGenders);
                if (dropdown.find("span").length == 1)
                    dropdown.hide();
            })
        }
        if (typeof action == "undefined" || typeof action == "object") {
            var options = {
                showArrow: true,
                additionalGenders: [],
                lowercase: true,
                allowPreferNotToDisclose: true
            };
            if (typeof action == "object") {
                options = $.extend({}, options, action);
            }
            if (typeof options.additionalGenders.length !== "undefined" && options.additionalGenders.length>0) {
                localGenders = localGenders.concat(options.additionalGenders);
            }
            if (typeof options.genders !== "undefined" && typeof options.genders.length !== "undefined" && options.genders.length>0) {
                localGenders = options.genders;
            }

            this.each(function(idx,element) {
                var $this = $(element);
                var wrapper = $("<div></div>").css('position','relative').css('display',$this.css('display')).addClass("genderField-wrapper");
                if (options.showArrow)
                    wrapper.addClass("genderFieldSelectArrow");
                if (options.lowercase) {
                    for(var i = 0; i < localGenders.length; i++) {
                        localGenders[i] = localGenders[i].toLowerCase();
                    }
                }
                genderSearchMap = generateSearchMap(localGenders);
                $this.addClass("genderField").wrap(wrapper);

                var dropdown = $("<div></div>").addClass("genderField-dropdown");
                $this.parent().append(dropdown);
                resize($this);
                var foundGenders = findGenders(localGenders, genderSearchMap, dropdown, $this.val());
                addDropdownGenders(dropdown);
                setDropdownGenders(dropdown, foundGenders);
                dropdown.hide();
                var self = $this;

                var UP = 38;
                var DOWN = 40;
                var ENTER = 13;

                dropdown.mouseenter(function() {
                    dropdown.data('focus',true);
                });
                dropdown.mouseout(function() {
                    dropdown.data('focus',false);
                });

                $this.on("keydown", function(event) {
                    if (self.is(":focus")) {
                        var dropdown = self.parent().find('.genderField-dropdown');
                        if (event.keyCode==UP) {
                            event.returnValue=false;
                            event.preventDefault();
                            if (dropdown.find(".selected").length==0) {
                                var child = dropdown.find("span.shownGender").last().addClass("selected");
                                dropdown.scrollTop(0);
                                dropdown.scrollTop(child.position().top-child.height());
                            }
                            else if (dropdown.find("span.selected").prev(".shownGender").length>0) {
                                var child = dropdown.find("span.shownGender.selected").removeClass("selected").prev().addClass("selected");
                                dropdown.scrollTop(0);
                                dropdown.scrollTop(child.position().top-child.height());
                            }
                            else {
                                dropdown.find("span.selected").removeClass("selected");
                                var child = dropdown.find("span.shownGender").last().addClass("selected");
                                dropdown.scrollTop(0);
                                dropdown.scrollTop(child.position().top-child.height());
                            }
                        }
                        else if (event.keyCode==DOWN) {
                            event.returnValue=false;
                            event.preventDefault();
                            if (dropdown.find(".selected").length==0) {
                                var child = dropdown.find("span.shownGender").first().addClass("selected");
                                dropdown.scrollTop(0);
                            }
                            else if (dropdown.find("span.selected").next(".shownGender").length>0) {
                                var child = dropdown.find("span.shownGender.selected").removeClass("selected").next().addClass("selected");
                                dropdown.scrollTop(0);
                                dropdown.scrollTop(child.position().top-child.height());
                            }
                            else {
                                dropdown.find("span.selected").removeClass("selected");
                                var child = dropdown.find("span.shownGender").first().addClass("selected");
                                dropdown.scrollTop(0);
                                dropdown.scrollTop(child.position().top-child.height());
                            }
                        }
                        else if (event.keyCode==ENTER) {
                            event.returnValue=false;
                            event.preventDefault();
                            self.val(dropdown.find("span.selected").text());
                            var foundGenders = findGenders(localGenders, genderSearchMap, dropdown, dropdown.find("span.selected").text());
                            setDropdownGenders(dropdown, foundGenders);
                            dropdown.find("span.selected").removeClass("selected");
                            dropdown.scrollTop(0);
                        }
                    }
                });

                $this.data('lastValue',$this.val());
                $this.keyup(function(event) {
                    var dropdown = $(this).parent().find('.genderField-dropdown');
                    var value = $(this).val();
                    if (value == self.data('lastValue') && value != "")
                        return;
                    self.data('lastValue',value);
                    var foundGenders = findGenders(localGenders, genderSearchMap, dropdown, value);

                    setDropdownGenders(dropdown, foundGenders);
                });
                $this.change(function(event) {
                    var dropdown = $(this).parent().find('.genderField-dropdown');
                    var value = $(this).val();
                    var foundGenders = findGenders(localGenders, genderSearchMap, dropdown, value);
                    setDropdownGenders(dropdown, foundGenders);
                });
                $this.mouseup(function(event) {
                    setTimeout(function() {
                        var dropdown = self.parent().find('.genderField-dropdown');
                        var value = self.val();
                        var foundGenders = findGenders(localGenders, genderSearchMap, dropdown, value);
                        setDropdownGenders(dropdown, foundGenders);
                    },40);
                });
                $this.focus(function(event) {
                    var dropdown = $(this).parent().find('.genderField-dropdown');
                    var value = $(this).val();
                    dropdown.show();
                    resize(self);
                    var foundGenders = findGenders(localGenders, genderSearchMap, dropdown, value);
                    setDropdownGenders(dropdown, foundGenders);
                });

                $this.blur(function(event) {
                    var dropdown = self.parent().find('.genderField-dropdown');
                    setTimeout(function() {
                        if ($(document.activeElement).parents('.genderField-wrapper').length==0 && dropdown.data('focus') == false) {
                            dropdown.hide();
                        }
                    },200);
                });
                dropdown.blur(function(event) {
                    var dropdown = self.parent().find('.genderField-dropdown');
                    setTimeout(function() {
                        if ($(document.activeElement).parents('.genderField-wrapper').length==0) {
                            dropdown.hide();
                        }
                    },200);
                });
            });
            return this;
        }
        else if (action == "resize") {
            resize();
        }
    };
}( jQuery ));