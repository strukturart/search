"use strict";

let debug = true;
let count = 0;

const box = document.getElementById('box')


document.querySelector("input").focus();

let tab_index = 0

function nav(move) {

    if (move == "+1" && tab_index < count) {
        tab_index++
        document.querySelector('[tabindex="' + tab_index + '"]').focus();


        var scrollDiv = document.querySelector('[tabindex="' + tab_index + '"]').offsetTop;
        window.scrollTo({
            top: scrollDiv,
            behavior: 'smooth'
        });
    }
    if (move == "-1" && tab_index > 0) {
        tab_index--
        document.querySelector('[tabindex="' + tab_index + '"]').focus();


        var scrollDiv = document.querySelector('[tabindex="' + tab_index + '"]').offsetTop;
        window.scrollTo({
            top: scrollDiv,
            behavior: 'smooth'
        });
    }



}


///////
//list all contacts
/////

let search_list = function(term) {

    if (!window.navigator.mozContacts) return false;
    var request = window.navigator.mozContacts.getAll({
        sortBy: "familyName",
        sortOrder: "descending"
    });

    request.onsuccess = function() {
        if (this.result) {
            count++;

            if (term != "") {

                if (this.result.name.includes(term)) {
                    let jack = document.createElement('div')
                    jack.innerText = this.result.name
                    jack.setAttribute("tabindex", count);
                    box.appendChild(jack)
                }

            } else {

                // Display the name of the contact
                let jack = document.createElement('div')
                jack.innerText = this.result.name
                jack.setAttribute("tabindex", count);
                box.appendChild(jack)
            }

            // Move to the next contact which will call the request.onsuccess with a new result
            this.continue();

        } else {
            //alert(count + 'contacts found.');
        }
    }

    request.onerror = function() {
        alert('Something goes wrong!');
    }


}

search_list("")












//////////////////////////
////KEYPAD TRIGGER////////////
/////////////////////////
function handleKeyDown(evt)



{
    if (document.activeElement.id == "search") {
        toaster(document.activeElement.value, 3000)


        while (box.firstChild) {
            box.removeChild(box.firstChild);
        }



        search_list(document.activeElement.value)





    }

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

////////////////////
//NOTFICATION//////
//////////////////

$(document).ready(function() {




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