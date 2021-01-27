"use strict";


alert()
var request = window.navigator.mozContacts.getAll(filter);
var count = 0;

request.onsuccess = function() {
    if (this.result) {
        count++;

        // Display the name of the contact
        console.log("Name of Contact" + this.result.name);

        // Display the Mobile number of the contact
        console.log("Number of Contact" + this.result.tel[0].value);


        // Move to the next contact which will call the request.onsuccess with a new result
        this.continue();

    } else {
        alert(count + 'contacts found.');
    }
}

request.onerror = function() {
    console.log('Something goes wrong!');
}



////////////////////
//NOTFICATION//////
//////////////////

$(document).ready(function() {













    //////////////////////////
    ////KEYPAD TRIGGER////////////
    /////////////////////////
    function handleKeyDown(evt)

    {

        switch (evt.key) {
            case 'Enter':
                break;

            case 'Backspace':
                break;

            case 'SoftLeft':
                break;
            case 'SoftRight':
                break;

            case 'ArrowDown':
                break;

            case 'ArrowUp':
                break;

        }
    }







    document.addEventListener('keydown', handleKeyDown);


    //////////////////////////
    ////BUG OUTPUT////////////
    /////////////////////////

    if (debug == true) {
        $(window).on("error", function(evt) {

            console.log("jQuery error event:", evt);
            var e = evt.originalEvent; // get the javascript event
            console.log("original event:", e);
            if (e.message) {
                alert("Error:\n\t" + e.message + "\nLine:\n\t" + e.lineno + "\nFile:\n\t" + e.filename);
            } else {
                alert("Error:\n\t" + e.type + "\nElement:\n\t" + (e.srcElement || e.target));
            }
        });

    }




});