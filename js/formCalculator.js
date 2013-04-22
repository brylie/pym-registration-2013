/* jshint laxcomma: true */
    // Static variables
    var dateToday= new Date(); // Date used for discount calculation
    var discountEnd = new Date(2013,05,21);
    var deadline = new Date(2013,07,13);
    
    // Price sets
    var commuterPrices = [ 
    /* 
     * Prices for commuters
     * Organized by age group
     * Prices ordered as:
     * [daily, discount, weekly]
     */
        [0, 0, 0] // >= 0 && <= 5
        ,[30, 15, 125] // >= 6 && <= 12 
        ,[45, 22.5, 200] // >= 13 && <= 25
        ,[75, 37.5, 350] // >= 26
    ];
    var overnightAccommodationsPrices = [
        /*
	 * Organized by type of accommodation
	 * Subsequently ordered by age group
	 * Prices ordered as [week, day]
	 */
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
            , [300,60] // >= 13 && <= 25
            , [null,null] // >= 26 Not applicable
        ]
        , [ // YAF
            [null,null] // >= 0 && <= 5 Not applicable
            , [null,null] // >= 6 && <= 12 Not applicable
            , [300,60] // >= 13 && <= 25
            , [425, 90] // >= 26
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
    var ageAtAnnualSession = "#text-515117b1e3db0";
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
    var firstChoiceRegistrationFees = "#text-5158cf384d951";
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
/*
 * Utility functions
 */
   var getAgeGroup = function() {
     /* 
      * Get the value for the age group selection
      * Adjust the value to be one of zero through four
      * Set to zero if no age group is selected (i.e. ageGroupSelected < 2)
      * This will make it easier for the registration fee calculator
      * return int (in range 0-4 inclusive)
      */
     var ageGroupSelected = parseInt(jQuery(ageGroupList).val(), 10);
     var ageGroupAdjusted = (ageGroupSelected >= 2) ? ageGroupSelected - 2 : undefined;
     return ageGroupAdjusted;
   };
   var getCommuterOrOvernight = function() {
      /*
      * Determine whether commuter or overnight is selected
      * return 'commuter' or 'overnight' (all lowercase)
      */
      var attendanceTypeSelected = jQuery(attendanceRadio).val();
      var attendanceType
      switch (attendanceTypeSelected) {
	case "0":
	  attendanceType = "commuter";
	  break;
	case "1":
	  attendanceType = "overnight";
	  break;
	default:
	  attendanceType = undefined;
      }
      return attendanceType;
   }
   var getFirstChoiceAccommodations = function() {
    /*
     * Get the value for the 'First Choice Accommodations' selection
     * Adjust the value to remove the null options
     * This will make the value align with the price structure
     * return int (in range 0 - 7 inclusive)
     */
    var accommodationsSelection = parseInt(jQuery(overnightFirstChoiceSelect).val(), 10);
    var accommodationsAdjusted = (accommodationsSelection >= 1) ? accommodationsSelection - 1 : undefined;
    return accommodationsAdjusted;
   }
   var updateAgeGroupSelect = function() {
    var age = parseInt(jQuery(ageAtAnnualSession).val(), 10);
    if (age >= 0 && age <= 5) {
      jQuery(ageGroupList).val(2);
    } else if (age >= 6 && age <= 12) {
      jQuery(ageGroupList).val(3);
    } else if (age >= 13 && age <= 25) {
      jQuery(ageGroupList).val(4);
    } else if (age >= 26) {
      jQuery(ageGroupList).val(5);
    } else {
      jQuery(ageGroupList).val(0);
    }
    jQuery(ageGroupList).change();
    jQuery(ageGroupList).attr("disabled", true);
   };
/*
 * Commuter section
 */
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
       * Determine which specific days are selected
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
    };
    
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
        var ageGroup = getAgeGroup();
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
	jQuery(commuterFeesSubTotal).change();
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
	jQuery(overnightPartialSessionAmountOfDays).change();
	jQuery(overnightPartialSessionAmountOfDays).attr("readonly", true);
    };
/*
 * Overnight section
 */
    var determineOvernightAttendingChoice = function() {
    /*
      * Get overnight attending choice, 
      * convert to meaningful text
      * return 'full' or 'partial'
      */
      var attendingChoice = jQuery(overnightAttending).val();
      var attendingText;
      switch(attendingChoice) {
	case "0":
	  attendingText = "full";
	  break;
	case "1":
	  attendingText = "partial";
	  break;
	default:
	  attendingText = undefined;
	};
	return attendingText;
    };
    
    var modifyAccommodationsChoices = function() {
      /*
       * Modify the Accommodations Choices select box
       * Remove invalid choices based on partial or full duration
       * Reset the select box to prevent incorrect selection
       * Return undefined ? null ?
       */
        // check whether overnight attending full or partial is selected
        var overnightAttendingChoice = determineOvernightAttendingChoice();
        // Set the accommodation select values to zero (no choice)
	// to remove any active selection, preventing invalid choice
        jQuery(overnightFirstChoiceSelect).val("0");
        jQuery(overnightSecondChoiceSelect).val("0");
        // Modify the accommodation select options visibility       
        switch(overnightAttendingChoice) { 
	  case 'full': //if full, show options 5 and 8
            jQuery(overnightFirstChoiceSelect + " option[value=5]").show();
            jQuery(overnightFirstChoiceSelect + " option[value=8]").show();
            jQuery(overnightSecondChoiceSelect + " option[value=5]").show();
            jQuery(overnightSecondChoiceSelect + " option[value=8]").show();
	    break;
	  case 'partial': //if partial, hide options 5 and 8
            jQuery(overnightFirstChoiceSelect + " option[value=5]").hide();
            jQuery(overnightFirstChoiceSelect + " option[value=8]").hide();
            jQuery(overnightSecondChoiceSelect + " option[value=5]").hide();
            jQuery(overnightSecondChoiceSelect + " option[value=8]").hide();
	    break;
        }
        return undefined;
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

    var calculateOvernightFullRegistrationFees = function() {
      /*
	* calculate overnight full registration fees
	* based on first choice accommodations and age group
	* return integer
	*/
      var accommodations = getFirstChoiceAccommodations();
      var ageGroup = getAgeGroup();
      var registrationFee;
      if (typeof(ageGroup) === "number" && typeof(accommodations) === "number") {
	registrationFee = overnightAccommodationsPrices[accommodations][ageGroup][0];
      } else {
	registrationFee = null;
      }
      return registrationFee;   
    };

    var calculateOvernightPartialRegistrationFees = function() {
      /*
	* calculate overnight partial registration fees
	* based on first choice accommodations, age group, and duration of stay
	* return integer
	*/
      var accommodations = getFirstChoiceAccommodations();
      var ageGroup = getAgeGroup();
      var duration = parseInt(jQuery(overnightPartialSessionAmountOfDays).val(), 10);
      var registrationFee;
      // Make sure ageGroup, accommodations, and duration are numeric
      if (typeof(accommodations) === "number" && typeof(ageGroup) === "number" && typeof(duration) === "number") {
	registrationFee = overnightAccommodationsPrices[accommodations][ageGroup][1] * duration;
      } else {
	registrationFee = null;
      }
      return registrationFee;
    };

    var calculateOvernightRegistrationFees = function() {
      var overnightAttendingChoice = determineOvernightAttendingChoice();
      var registrationFees;
      switch(overnightAttendingChoice){
	case 'full':
	  registrationFees = calculateOvernightFullRegistrationFees();
	  break;
	case 'partial':
	  registrationFees = calculateOvernightPartialRegistrationFees();
	  break;
	default:
	  registrationFees = 0;
      };
      return registrationFees;
    };

    var updateOvernightRegistrationFeesField = function() {
      var registrationFees = calculateOvernightRegistrationFees();
      jQuery(overnightFirstChoiceFeesSubtotal).val(registrationFees);
      jQuery(overnightFirstChoiceFeesSubtotal).attr("readonly", true);
      jQuery(overnightFirstChoiceFeesSubtotal).change();
    };
/*
 * Final Fees and Payment Section
 */
    var updateTotalFeesFromAboveField = function() {
      /*
       * Determine whether attendance type is commuter or overnight
       * Update the total fees due field with appropriate value
       * return null
       */
      var attendanceType = getCommuterOrOvernight();
      var totalFeesDue;
      switch (attendanceType) {
	case 'commuter':
	  // commuter fees
	  totalFeesDue = jQuery(commuterFeesSubTotal).val();
	  break;
	case 'overnight':
	  // first choice registration fees
	  totalFeesDue = jQuery(overnightFirstChoiceFeesSubtotal).val();
	  break;
	default:
	  // null
	  totalFeesDue = null;
      }
      jQuery(totalFeesFromAbove).val(totalFeesDue);
      jQuery(totalFeesFromAbove).change();
    };
    var determineDiscountStatus = function() {
      /*
       * Determine discount eligibility
       * based on user date, discount date, and deadline date
       */
      if (dateToday <= discountEnd) {
        return "discount"
      } else if (dateToday > discountEnd && dateToday <= deadline) {
        return "full"
      } else if (dateToday > deadline) {
        return "late"
      }
    };
    var setDiscountStatusSelector = function() {
      discountStatus = determineDiscountStatus();
    }

/*
 * Events, etc..
 */
    var attachEvents = function() {
      // Age events
      jQuery(ageAtAnnualSession).keyup(updateAgeGroupSelect);
      
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

      // Overnight fees field update
      jQuery(overnightFirstChoiceSelect).click(updateOvernightRegistrationFeesField);
      jQuery(overnightAttendingFull).click(updateOvernightRegistrationFeesField);
      jQuery(overnightAttendingPartial).click(updateOvernightRegistrationFeesField);
      jQuery(overnightPartialSessionAmountOfDays).change(updateOvernightRegistrationFeesField);
      jQuery(ageGroupList).change(updateOvernightRegistrationFeesField);
      
      // Carry total fees values to end
      jQuery(commuterFeesSubTotal).change(updateTotalFeesFromAboveField);
      jQuery(overnightFirstChoiceFeesSubtotal).change(updateTotalFeesFromAboveField);
      
    };
    jQuery(document).load(attachEvents());
    