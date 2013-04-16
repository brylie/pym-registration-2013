/* jshint laxcomma: true */
    // Static variables
    var date = new Date(); // Date used for discount calculation
    // Price sets
    var commuterPrices = [ // [daily, discount, weekly]
        0 // null (placeholder selection)
        ,0 // null (placeholder selection)
        ,[0, 0, 0] // >= 0 && <= 5
        ,[30, 15, 125] // >= 6 && <= 12 
        ,[45, 22.5, 200] // >= 13 && <= 25
        ,[75, 37.5, 350] // >= 26
    ];
    var overnightAccommodationsPrices = [
        // Organized by type of accommodation
        // Prices ordered as [week, day
        [ //Camping
            [0,0] // >= 0 && <= 5
            , [125,30] // >= 6 && <= 12
            , [200,45] // >= 13 && <= 25
            , [350,75] // >= 26
        ]
        , [ // Floor Space
            [0,0] // >= 0 && <= 5
            , [180,40] // >= 6 && <= 12
            , [300,60] // >= 13 && <= 25
            , [425,90] // >= 26
        ]
        , [ // JYM
            [null,null] // >= 0 && <= 5 Not applicable
            , [null,null] // >= 6 && <= 12 Not applicable
            , [300,60] // >= 13 && <= 25 (applicable)
            , [null,null] // >= 26 Not applicable
        ]
        , [ // YAF
            [null,null] // >= 0 && <= 5 Not applicable
            , [null,null] // >= 6 && <= 12 Not applicable
            , [300,60] // >= 13 && <= 25 (applicable)
            , [425, 90] // >= 26 (applicable)
        ]
        , [ // Dormitory
            [0,null] // >= 0 && <= 5
            , [230,null] // >= 6 && <= 12
            , [300,null] // >= 13 && <= 25
            , [550,null] // >= 26
        ]
        , [ // Semi-private, shared bath
            [0,0] // >= 0 && <= 5
            , [340,70] // >= 6 && <= 12
            , [670,140] // >= 13 && <= 25
            , [670,140] // >= 26
        ]
        , [ // Single, shared bath
            [950,200] // >= 0 && <= 5
            , [950,200] // >= 6 && <= 12
            , [950,200] // >= 13 && <= 25
            , [950,200] // >= 26
        ]
        , [ // Semi-private, private bath
            [0,null] // >= 0 && <= 5
            , [500,null] // >= 6 && <= 12
            , [750,null] // >= 13 && <= 25
            , [750,null] // >= 26
        ]
    ];
    // Form elements
    var ageGroupList = "#custom_list-5153b344f2fa7";
    var attendanceRadio = "input:radio[name=custom_list-51512c144f9fb]:checked";
    //Commuter form elements
    var monCheckbox = "#custom_list-51512492726cc-0";
    var tueCheckbox = "#custom_list-51512492726cc-1";
    var wedCheckbox = "#custom_list-51512492726cc-2";
    var thuCheckbox = "#custom_list-51512492726cc-3";
    var friCheckbox = "#custom_list-51512492726cc-4";
    var satCheckbox = "#custom_list-51512492726cc-5";
    var days = [
           monCheckbox
           ,tueCheckbox
           ,wedCheckbox
           ,thuCheckbox
           ,friCheckbox
           ,satCheckbox
       ];
    var commuterAmountOfDays = "#text-515525726e966";
    var commuterFeesSubTotal = "#text-5155132f62cc6";
    // Overnight form elements
    var overnightAttending = "input:radio[name=custom_list-51552d7af14b2]:checked";
    var overnightAttendingFull = "#custom_list-51552d7af14b2-0";
    var overnightAttendingPartial = "#custom_list-51552d7af14b2-1";
    // Partial fields
    var overnightPartialSessionArrival = "#custom_list-51512d65f3ccd";
    var overnightPartialSessionDeparture = "#custom_list-51512e25e75c3";
    var overnightPartialSessionAmountOfDays = "#text-5155020930b2e";
    // Overnight choices
    var overnightFirstChoiceSelect = "#custom_list-5151316b82122";
    var overnightFirstChoiceFeesSubtotal = "#text-5155c5a3c3e6f";
    var overnightSecondChoiceSelect = "#custom_list-5155391ed978e";
    var overnightSecondChoiceFeesSubtotal = "#text-5155c5a7b1cd9";
    // Roomate preferences
    var overnightRoommatePreferences = "#custom_list-515137f3e9e63";
    // Final fees and payment elements
    var firstChoiceSubTotal = "#text-5158cf384d951";
    var secondChoiceSubTotal = "#text-5158cf3c9326f";
    var totalFeesFromAbove = "#text-515621f626b6e";
    var earlyDiscountRadio = "input:radio[name=custom_list-5156340d5ee07]:checked";
    // TODO: set the earlyDiscountRadio based on Date() ?
    // Donation and discount
    var optionalDonation = "#text-515621fd28e1c";
    var financialAid = "#text-5156220059f2d";
    // Total and subtotal
    var subTotalFees = "#text-515621f92963c";
    var totalFeesDue = "#text-5156220324787";
    //Payment section
    var amountEnclosed = "#text-515622061f15c";
    var balanceDueOnArrival = "#text-51563412d9e9e";
    // End of initial variables
    // Begin form functions
    var countCommuterDays = function() {
      /* 
       * count the number of commuter days checked
       * return an integer
       */
        var numberOfDaysChecked = 0;
        for (var i=0;i < days.length;i++) {
          if (jQuery(days[i]).is(":checked")) {
            numberOfDaysChecked += 1;
          };
        };
        return numberOfDaysChecked;
    };
    var determineCommuterDaysChecked = function() {
      /* 
       * return an array of day values
       * based on commuter day checkboxes
       * return array of numeric day values
       */
      var commuterDaysCheckedList = [];
      for (var i=0;i < days.length;i++) {
	if (jQuery(days[i]).is(":checked")) {
	  commuterDaysCheckedList.push(parseInt(i));
        };
      };
      return commuterDaysCheckedList;
    }
    var updateCommuterAmountOfDaysField = function() {
      /*
       * Update the 'commuter amount of days' field
       * based on the count of commuter days checked
       * return null ?
       */
        var numberOfDays = countCommuterDays();
        // update the form element
        jQuery(commuterAmountOfDays).val(numberOfDays);
        jQuery(commuterAmountOfDays).change();
    };
    var calculateCommuterFeesSubTotal = function() {
      /*
       * calculate the commuter fees subtotal
       * based on the age group and number of days checked
       * if five or more days are checked, default to weekly rate
       * Saturday and Monday fees are based on the discount rate
       * return float ?
       */
        var ageGroup = parseInt(jQuery(ageGroupList).val(), 10);
        var numberOfDays = parseInt(jQuery(commuterAmountOfDays).val(), 10);
	var specificDays = determineCommuterDaysChecked();
	var subTotal = 0; // integer
	
        if (numberOfDays < 5) { // sum daily prices
          for (i=0;i<days.length;i++) {
	    if (specificDays[i] > 0 && specificDays[i] < 5) { // not Monday or Saturday
	      subTotal += commuterPrices[ageGroup][0]; // add full day rate to subtotal
	    } else if (specificDays[i] === 0 || specificDays[i] === 5) { // is Monday or Saturday
	      subTotal += commuterPrices[ageGroup][1]; // add discount price to subtotal
	    } else { // otherwise add zero (catch all)
	      subTotal += 0;
	    }
	  };
	} else if (numberOfDays >= 5 && numberOfDays <= 6) { // set to weekly rate
	  subTotal = commuterPrices[ageGroup][2]; 
	} else { // Catch all
            subTotal = 0;
        }
        return subTotal;
    };
    var updateCommuterFeesSubTotalField = function() {
      /*
       * Update the 'commuter sub total' field
       * based on the commuter fees subtotal calculation
       * return null ?
       */
        var subTotal = calculateCommuterFeesSubTotal();
        jQuery(commuterFeesSubTotal).val(subTotal);
    };
    var calculatePartialSessionLength = function() {
        var lengthOfStay;
        // type cast both values with parseInt() to perform subtraction later
        // list index of day of arrival matches day of week
        var dayOfArrival = parseInt(jQuery(overnightPartialSessionArrival).val(), 10);
        // add one to the day of departure to match the day of the week
        // this is to offset the index of the day in the selection list
        var dayOfDeparture = parseInt(jQuery(overnightPartialSessionDeparture).val(), 10) + 1;
        if (dayOfDeparture > dayOfArrival) { // make sure departing after arrival
            lengthOfStay = dayOfDeparture - dayOfArrival;
        } else { // zero is catch all
            lengthOfStay = 0;
        }
        if (lengthOfStay > 0) { // make sure they are staying
            return lengthOfStay;
        } else {
            return null;
        }
    };
    var updateAmountOfDaysField = function() {
        var lengthOfStay = calculatePartialSessionLength();
        jQuery(overnightPartialSessionAmountOfDays).val(lengthOfStay);
    };
    var modifyAccommodationsChoices = function() {
        // check whether overnight attending full or partial is selected
        // Set the select values to zero (no choice)
        jQuery(overnightFirstChoiceSelect).val("0");
        jQuery(overnightSecondChoiceSelect).val("0");
        //if full, show options 5 and 8
        //if partial, hide options 5 and 8
        if (jQuery(overnightAttending).val() === "0") { // Full
            jQuery(overnightFirstChoiceSelect + " option[value=5]").show();
            jQuery(overnightFirstChoiceSelect + " option[value=8]").show();
            jQuery(overnightSecondChoiceSelect + " option[value=5]").show();
            jQuery(overnightSecondChoiceSelect + " option[value=8]").show();
        } else if (jQuery(overnightAttending).val() === "1") { // Partial
            jQuery(overnightFirstChoiceSelect + " option[value=5]").hide();
            jQuery(overnightFirstChoiceSelect + " option[value=8]").hide();
            jQuery(overnightSecondChoiceSelect + " option[value=5]").hide();
            jQuery(overnightSecondChoiceSelect + " option[value=8]").hide();
        }
        return null;
    };   
    var updateRoommatePreferencesField = function() {
        var firstChoiceAccommodations = parseInt(jQuery(overnightFirstChoiceSelect).val(), 10);
        var overnightRoommatePreferencesField = jQuery(overnightRoommatePreferences);
        // Check if First Choice Accommodations is JYM (3) or YAF (4)
        if (firstChoiceAccommodations === 3) { // JYM
            overnightRoommatePreferencesField.val("4");
        } else if (firstChoiceAccommodations === 4) { // YAF
            overnightRoommatePreferencesField.val("5");
        } else if (firstChoiceAccommodations === 1) { // Camping
            overnightRoommatePreferencesField.val("2");
        } else if (firstChoiceAccommodations === 7) { // Single - Shared Bath
            overnightRoommatePreferencesField.val("3");
	} else {
            overnightRoommatePreferencesField.val("1"); // Blank
        }
        jQuery(overnightRoommatePreferences).change();
    };
    var attachEvents = function() {
        // Day checkbox events
        for (var i=0;i < days.length;i++) {
          jQuery(days[i]).click(updateCommuterAmountOfDaysField);
         }
         // Commuter SubTotal field update triggers
         jQuery(commuterAmountOfDays).change(updateCommuterFeesSubTotalField);
         jQuery(ageGroupList).change(updateCommuterFeesSubTotalField);

         // Partial session event triggers
         jQuery(overnightPartialSessionArrival).change(updateAmountOfDaysField);
         jQuery(overnightPartialSessionDeparture).change(updateAmountOfDaysField);

         // Overnight accommodations list modifier based on selection
         jQuery(overnightAttendingFull).click(modifyAccommodationsChoices);
         jQuery(overnightAttendingPartial).click(modifyAccommodationsChoices);
         
         // Roommate preferences auto-select
         jQuery(overnightFirstChoiceSelect).click(updateRoommatePreferencesField);
         jQuery(overnightAttendingFull).click(updateRoommatePreferencesField);
         jQuery(overnightAttendingPartial).click(updateRoommatePreferencesField);
    };
    jQuery(document).load(attachEvents());
