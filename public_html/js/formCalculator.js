    /* jshint laxcomma: true */
    // Static variables
    var date = new Date(); // Date used for discount calculation

    var commuterPrices = [
        0 // null
        ,0 // null
        ,0 // 0 - 5
        ,30 // 6 - 12
        ,45 // 13 - 25
        ,75 // 26 +
    ];
    var overnightAccommodationsPrices = [
        0 // null
        , 10 // Camping
        , 20 // Floor space
        , 30 // JYM floor space
        , 40 // YAF floor space (< 25)
        , 50 // YAF floor space (> 26)
        , 60 // Dormitory bed
        , 70 // Semi-private + shared bath
        , 80 // Single + shared bath
        , 90 // Semi-private + private bath
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
    var overnightRoomatePreferences = "#custom_list-515137f3e9e63";

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

    var countCommuterDays = function() {
        var daysChecked = 0;

        for (var i=0;i < days.length;i++) {
          if (jQuery(days[i]).is(":checked")) {
            daysChecked += 1;
          }
        }

        return daysChecked;
    };

    var updateCommuterAmountOfDaysField = function() {
        var numberOfDays = countCommuterDays();
        // update the form element
        jQuery(commuterAmountOfDays).val(numberOfDays);
        jQuery(commuterAmountOfDays).change();
    };

    var calculateCommuterFeesSubTotal = function() {
        var ageGroup = parseInt(jQuery(ageGroupList).val(), 10);
        var numberOfDays = parseInt(jQuery(commuterAmountOfDays).val(), 10);
        var subTotal = commuterPrices[ageGroup] * numberOfDays;
        if (subTotal > 0) {
            return subTotal;
        } else if (ageGroup <= 2) { // children 0 - 5 or no selection
            return 0;
        } 
        else {
            return null;
        }
    };
    var updateCommuterFeesSubTotalField = function() {
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
        //if full, show options 6 and 9
        //if partial, hide options 6 and 9
        if (jQuery(overnightAttending).val() === "0") { // Full
            jQuery(overnightFirstChoiceSelect + " option[value=6]").show();
            jQuery(overnightFirstChoiceSelect + " option[value=9]").show();
            jQuery(overnightSecondChoiceSelect + " option[value=6]").show();
            jQuery(overnightSecondChoiceSelect + " option[value=9]").show();
        } else if (jQuery(overnightAttending).val() === "1") { // Partial
            jQuery(overnightFirstChoiceSelect + " option[value=6]").hide();
            jQuery(overnightFirstChoiceSelect + " option[value=9]").hide();
            jQuery(overnightSecondChoiceSelect + " option[value=6]").hide();
            jQuery(overnightSecondChoiceSelect + " option[value=9]").hide()
        }
        return null;
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
    };

    jQuery(document).load(attachEvents());
