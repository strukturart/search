"use strict";

let debug = true;
const box = document.getElementById('box')


document.querySelector("input").focus();

let tab_index = 0

function nav(move) {

    if (move == "+1") {
        tab_index++
        document.querySelector('[tabindex="' + tab_index + '"]').focus();
    }
    if (move == "-1") {
        tab_index--
        document.querySelector('[tabindex="' + tab_index + '"]').focus();
    }



}




var request = window.navigator.mozContacts.getAll({
    sortBy: "familyName",
    sortOrder: "descending"
});
var count = 0;

request.onsuccess = function() {
    if (this.result) {
        count++;

        // Display the name of the contact
        console.log("Name of Contact" + this.result.name);

        let jack = document.createElement('div')
        jack.innerText = this.result.name
        jack.setAttribute("tabindex", count);
        box.appendChild(jack)


        // Move to the next contact which will call the request.onsuccess with a new result
        this.continue();

    } else {
        //alert(count + 'contacts found.');
    }
}

request.onerror = function() {
    alert('Something goes wrong!');
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
                nav("+1")
                break;

            case 'ArrowUp':
                nav("-1")
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