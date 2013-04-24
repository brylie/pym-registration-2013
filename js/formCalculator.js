jQuery(document).ready( function() {
  "use strict";
  /* jshint laxcomma: true */
    // Static variables
    var dateToday= new Date(); // User's current date, used for discount calculation
    var discountEnd = new Date("May 21, 2013");
    var deadline = new Date("July 1, 2013");
    var discount = 0.05; // 5%
    var lateFee = 0.05; // 5%
    
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
    var earlyDiscountRadio = "input:radio[name='custom_list-5156340d5ee07']";
    // Donation, late fee, tuition, and discount
    var optionalDonationField = "#text-515621fd28e1c";
    var financialAidField = "#text-5156220059f2d";
    var discountField = "#text-5156341639bc6";
    var lateFeeField = "#text-5156341967a03";
    // Total and subtotal
    var registrationFeesField = "#text-515621f92963c";
    var totalFeesDueField = "#text-5156220324787";
    //Payment section
    var amountEnclosedField = "#text-515622061f15c";
    var balanceDueOnArrivalField = "#text-51563412d9e9e";
    // End of initial variables
    // Begin form functions
/*
 * General functions
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
   var isNumber = function(input) {
     /*
      * Test to make sure a value is numeric
      * and not text (e.g. the empty string '')
      * return boolean
      */
    return (!(isNaN(input)) && (typeof(input) !== "string") && input !== null);
   };
   var dollarFormat = function(input) {
    /*
     * convert number to dollar format string
     * will make sure there are two decimal places
     * or strip .00 for whole dollar values
     * e.g. 32.95 or 77
     * input number
     * return number
     */
    // make sure input is number
    var inputNumber = (isNumber(input)) ? input : 0;
    return inputNumber.toFixed(2).replace(".00","");
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
       * return number
       */
        var ageGroup = getAgeGroup();
        var numberOfDays = parseFloat(jQuery(commuterAmountOfDays).val(), 10);
	var specificDays = determineCommuterDaysChecked();
	var subTotal = 0; // integer
	
        if (numberOfDays < 5) { // sum daily prices
          for (var i=0;i<days.length;i++) {
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
        return (isNumber(subTotal)) ? subTotal : 0;
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
      var registrationFeesFixed = registrationFees.toFixed(2).replace(".00","")
      jQuery(overnightFirstChoiceFeesSubtotal).val(registrationFeesFixed);
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
      console.log("Updating total fees from above");
      var attendanceType = getCommuterOrOvernight();
      console.log("attendance type: " + attendanceType);
      //console.log("typeof: " + typeof(attendanceType));
      var totalFeesDue;
      var totalFeesDueFormatted; // For dollar formatting
      switch (attendanceType) {
	case 'commuter':
	  // commuter fees
	  console.log('inside commuter case');
	  totalFeesDue = parseFloat(jQuery(commuterFeesSubTotal).val());
	  break;
	case 'overnight':
	  console.log('inside overnight case');
	  // first choice registration fees
	  totalFeesDue = parseFloat(jQuery(overnightFirstChoiceFeesSubtotal).val());
	  break;
	default:
	  // zero
	  console.log("Error: No commuter or overnight selection detected.");
	  totalFeesDue = undefined;
      };
      // Make sure total fees due is defined, and is a number
      if (isNumber(totalFeesDue)) {
	totalFeesDueFormatted = dollarFormat(totalFeesDue);
	jQuery(totalFeesFromAbove).val(totalFeesDueFormatted);
	jQuery(totalFeesFromAbove).change();
	jQuery(totalFeesFromAbove).attr("readonly", true);
      }
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
      /*
       * Set the discount status
       * based on user date
       */
      var discountStatus = determineDiscountStatus();
      jQuery(earlyDiscountRadio).attr("disabled", true);
      switch(discountStatus) {
	case "discount":
	  jQuery(earlyDiscountRadio).filter('[value="0"]').attr("checked",true);
	  jQuery(earlyDiscountRadio).filter('[value="0"]').change();
	  break;
	case "full":
	  jQuery(earlyDiscountRadio).filter('[value="1"]').attr("checked",true);
	  jQuery(earlyDiscountRadio).filter('[value="1"]').change();
	  break;
	case "late":
	  jQuery(earlyDiscountRadio).filter('[value="2"]').attr("checked",true);
	  jQuery(earlyDiscountRadio).filter('[value="1"]').change();
	  break;
      }
    };
    var calculateEarlyDiscount = function() {
      /*
       * Calculate the discount price
       * based on Total Fees From Above field and discount percent
       * return number
       */
      var subtotal = parseFloat(jQuery(totalFeesFromAbove).val());
      var discountPrice = subtotal * discount;
      return (isNumber(discountPrice)) ? discountPrice : 0;
    };
    var updateEarlyDiscountField = function() {
      /*
       * Update early discount field
       * with dollar formatted value
       */
      var discountPrice = calculateEarlyDiscount();
      var discountPriceFormatted = dollarFormat(discountPrice);
      jQuery(discountField).val(discountPriceFormatted);
      jQuery(discountField).change();
      jQuery(discountField).attr("readonly", true);
    };
    var calculateLateFee = function() {
      /*
       * Calculate the late fee price
       * based on Total Fees From Above field and late fee percent
       * return number
       */
      var subtotal = parseFloat(jQuery(totalFeesFromAbove).val(), 10);
      var lateFeePrice = (subtotal * lateFee);
      return (isNumber(lateFeePrice)) ? lateFeePrice : null;
    };
    var updateLateFeeField = function() {
      /*
       * Update the late fee field
       * Value should be formatted for dollars
       */
      var lateFeePrice = calculateLateFee();
      var lateFeePriceFormatted = dollarFormat(lateFeePrice);
      jQuery(lateFeeField).val(lateFeePriceFormatted);
      jQuery(lateFeeField).change();
      jQuery(lateFeeField).attr("readonly", true);
    };
    var calculateRegistrationFees = function() {
      /*
       * Calculate registration fees
       * based on subtotal
       * apply discount or late fee if applicable
       * return number
       */
      var registrationFees;
      var subtotal = parseInt(jQuery(totalFeesFromAbove).val(), 10);
      var discountStatus = determineDiscountStatus();
      switch(discountStatus) {
	case "discount":
	  var discount = jQuery(discountField).val();
	  registrationFees = subtotal - discount;
	  break;
	case "full":
	  registrationFees = subtotal;
	  break;
	case "late":
	  var lateFee = jQuery(lateFeeField).val();
	  registrationFees = subtotal + lateFee;
	  break;
      }
      return (isNumber(registrationFees)) ? registrationFees : 0;
    };
    var updateRegistrationFeesField = function() {
      /*
       * Update registration fees field
       * with dollar formatted value
       */
      var registrationFees = calculateRegistrationFees();
      var registrationFeesFormatted = dollarFormat(registrationFees);
      jQuery(registrationFeesField).val(registrationFeesFormatted);
      jQuery(registrationFeesField).change();
      jQuery(registrationFeesField).attr("readonly", true);
    }
    var calculateTotalFeesDue = function() {
      /*
       * Calculate the total fees due
       * based on registration fees, donation, and financial aid values
       * return number
       */
      var donationValue = parseFloat(jQuery(optionalDonationField).val());
      var financialAidValue = parseFloat(jQuery(financialAidField).val());
      var registrationFeesValue = parseFloat(jQuery(registrationFeesField).val());
      // Make sure the donation and financial aid values are numeric
      var donation = (isNumber(donationValue)) ? donationValue : 0;
      var financialAid = (isNumber(financialAidValue)) ? financialAidValue : 0;
      var registrationFees = (isNumber(registrationFeesValue)) ? registrationFeesValue : 0;
      // Calculate total
      var totalFeesDue = registrationFees + donation - financialAid;
      
      return (isNumber(totalFeesDue)) ? totalFeesDue : 0;
    };
    var updateTotalFeesDueField = function() {
      /*
       * Update the total fees due field
       * with dollar formatted value
       */
      var totalFeesDue = calculateTotalFeesDue();
      var totalFeesDueFormatted = dollarFormat(totalFeesDue);
      jQuery(totalFeesDueField).val(totalFeesDueFormatted);
      jQuery(totalFeesDueField).change();
      jQuery(totalFeesDueField).attr("readonly", true);
    };
    
    var calculateBalanceDueOnArrival = function() {
      /*
       * Calculate balance due on arrival
       * based on total fees due and amount enclosed
       * if the value can't be calculated return zero
       * return number
       */
      var totalFeesDue = calculateTotalFeesDue();
      var amountEnclosedValue = parseFloat(jQuery(amountEnclosedField).val());
      //Make sure amount enclosed value is a number
      var amountEnclosed = (isNumber(amountEnclosedValue)) ? amountEnclosedValue : 0;
      var amountDue = totalFeesDue - amountEnclosed;
      return (isNumber(amountDue)) ? amountDue : 0; 
    };
    var updateBalanceDueOnArrivalField = function() {
      /*
       * Update the balance due on arrival field
       * with dollar formatted value
       */
      var balanceDueOnArrival = calculateBalanceDueOnArrival();
      var balanceDueOnArrivalFormatted = dollarFormat(balanceDueOnArrival);
      jQuery(balanceDueOnArrivalField).val(balanceDueOnArrivalFormatted);
      jQuery(balanceDueOnArrivalField).change();
      jQuery(balanceDueOnArrivalField).attr("readonly", true);
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
      
      // Calculate discount
      jQuery(totalFeesFromAbove).change(updateEarlyDiscountField);
      jQuery(totalFeesFromAbove).change(updateLateFeeField);
      
      // Calculate registration fees
      jQuery(totalFeesFromAbove).change(updateRegistrationFeesField);
      jQuery(lateFeeField).change(updateRegistrationFeesField);
      jQuery(discountField).change(updateRegistrationFeesField);
      
      // Calculate total fees due
      jQuery(registrationFeesField).change(updateTotalFeesDueField);
      jQuery(optionalDonationField).keyup(updateTotalFeesDueField);
      jQuery(financialAidField).keyup(updateTotalFeesDueField);
      
      // Calculate balance due on arrival
      jQuery(amountEnclosedField).keyup(updateBalanceDueOnArrivalField);
      // donationField.change()
      // financialAidField.change()
      // totalFeesDueField.change()

    };
    attachEvents();
    setDiscountStatusSelector();
});