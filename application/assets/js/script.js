"use strict";

let debug = true;
let count = 0;
let listObj;
let tab_index = 0
const box = document.getElementById('box-list')

//focus input field on start
document.querySelector("input").focus();


function nav(move) {

    let list_count = document.querySelectorAll('li').length
    if (move == "+1" && tab_index < list_count) {
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


//add tabindex attr dyn.
let divs;
let i;

let set_tabindex = function() {
    divs = document.querySelectorAll('li')
    for (i = 0; i < divs.length; ++i) {
        divs[i].tabIndex = i + 1
    }
}


///////
//list all contacts
/////

let search_list = function() {
    count = 0;

    let a;
    let b;

    if (!window.navigator.mozContacts) {
        console.log("fail")
        return false;
    }
    var request = window.navigator.mozContacts.getAll({
        sortBy: "familyName",
        sortOrder: "descending"
    });


    request.onsuccess = function() {
        if (this.result) {
            count++;
            // Display the name of the contact
            a = document.createElement('li')
            //a.setAttribute("tabindex", count);


            b = document.createElement('div')
            b.setAttribute("class", "name");
            b.innerText = this.result.name

            a.appendChild(b)
            box.appendChild(a)


            this.continue();

        } else {
            //alert("No more contacts");


            var options = {
                valueNames: ['name'],
                fuzzySearch: {
                    searchClass: "fuzzy-search",
                    location: 0,
                    distance: 100,
                    threshold: 0.1,
                    multiSearch: true
                }
            };

            listObj = new List('box', options);
            listObj.on("searchComplete", function() {
                set_tabindex();
            })

            set_tabindex();


        }
    }

    request.onerror = function() {
        alert('Something goes wrong!');
    }


}

search_list()
bottom_bar("", "", "")



//trigger live search
let live_search_trigger;
let search = document.getElementById('search')

search.addEventListener("focus", start);
search.addEventListener("blur", end);


function start() {
    window.scrollTo(0, 0);
    live_search_trigger = setInterval(() => {

        if (search.value != "") {
            listObj.fuzzySearch(search.value);

        }
        if (search.value == "") listObj.search();
    }, 1500);
}


function end() {
    clearInterval(live_search_trigger);
}




//////////////////////////
////KEYPAD TRIGGER////////////
/////////////////////////
function handleKeyDown(evt)


{


    switch (evt.key) {


        case 'Enter':
            evt.preventDefault();
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

        default:
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