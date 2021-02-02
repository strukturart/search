"use strict";


let debug = true;
let count = 0;
let listObj;
let tab_index = 0
let tab_index_last;
let init = false;
let status = "search"
const box = document.getElementById('box-list')
document.getElementById('search').focus();


window.addEventListener('DOMContentLoaded', function() {




    ////////////
    //TABINDEX NAVIGATION
    ///////////
    function nav(move) {


        let elem = document.activeElement;

        // Setup siblings array and get the first sibling
        var siblings = [];

        if (elem.id == "search") {
            document.querySelector("li[tabindex='0']").focus()


            return false;
        }
        if (elem.id != "search") {

            var sibling = elem.parentNode.firstChild;

            // Loop through each sibling and push to the array
            while (sibling) {
                if (sibling.hasAttribute("tabindex")) {
                    siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
            }
        }





        if (move == "+1" && init && tab_index < siblings.length - 1 && siblings.length > 0) {

            tab_index++
            siblings[tab_index].focus()

            siblings[tab_index].scrollIntoView({
                block: "start"
            });


        }
        if (move == "-1" && tab_index > -1) {

            //search field 
            if (document.activeElement == document.querySelector("ul li:first-child")) {

                document.querySelector("input#search").focus(); //sets focus to element
                var val = document.querySelector("input#search").value; //store the value of the element
                document.querySelector("input#search").value = ''; //clear the value of the element
                //set that value back. 
                setTimeout(function() {
                    document.querySelector("input#search").value = val;
                }, 1);

                return false;
            }

            tab_index--

            siblings[tab_index].focus()

            siblings[tab_index].scrollIntoView({
                block: "start"
            });;

        }
    }


    //add tabindex attr dyn.
    let divs;
    let i;

    let set_tabindex = function() {
        divs = document.querySelectorAll('li')
        for (i = 0; i < divs.length; ++i) {
            divs[i].tabIndex = i
        }
    }


    ///////
    //list all contacts
    /////

    let contact_list = function() {
        count = 0;

        let a;
        let b;

        if (!window.navigator.mozContacts) {
            console.log("fail")
            return false;
        }
        var request = window.navigator.mozContacts.getAll({
            sortBy: "familyName",
            sortOrder: "ascending"
        });


        request.onsuccess = function() {
            if (this.result) {
                if (this.result.name != "") {
                    count++;
                    // Display the name of the contact
                    a = document.createElement('li')
                    b = document.createElement('div')
                    b.setAttribute("class", "name");
                    b.setAttribute("data-id", this.result.id);
                    b.innerText = this.result.name

                    a.appendChild(b)
                    box.appendChild(a)
                }

                this.continue();

            } else {
                //alert("No more contacts");
                //init search
                var options = {
                    valueNames: ['name'],
                    fuzzySearch: {
                        searchClass: "fuzzy-search",
                        location: 0,
                        distance: 50,
                        threshold: 0.1,
                        multiSearch: true
                    }
                };

                listObj = new List('box', options);
                listObj.on("searchComplete", function() {
                    set_tabindex();
                })

                init = true;


            }
        }

        request.onerror = function() {
            alert('Something goes wrong!');
        }


    }


    /////
    ////search
    ////


    let a, b;
    let content = document.getElementById("ul#box-list")
    //content.innerHTML = "";
    let search = function(term) {
        var options = {
            filterValue: term,
            filterBy: ["name", "familyName"],
            filterOp: "contains",
            filterLimit: 10,
            sortBy: "familyName",
            sortOrder: "ascending"
        }
        console.log(term)

        let search_rq = window.navigator.mozContacts.find(options);


        search_rq.onsuccess = function() {

            tab_index = 0


            if (search_rq.result.length > 1) {
                content.innerHTML = "";
                for (let k = 0; k < search_rq.result.length; k++) {
                    var person = search_rq.result[k];

                    // Display the name of the contact
                    a = document.createElement('li')
                    b = document.createElement('div')
                    b.setAttribute("class", "name");
                    //b.setAttribute("data-id", person.givenName[0]);
                    b.innerText = person.givenName[0]

                    a.appendChild(b)
                    box.appendChild(a)

                }



            } else {
                console.log("Sorry, there is no such contact.")
            }
        };


        search_rq.onerror = function() {
            toaster("Uh! Something goes wrong, no result found!");
        };
    }


    //contact_list()
    bottom_bar("", "", "options")


    /////////
    ////live search
    ////////


    let live_search_trigger;
    let search_listener = document.getElementById('search')

    search_listener.addEventListener("focus", start);
    search_listener.addEventListener("blur", end);


    function start() {

        document.activeElement.parentElement.scrollIntoView({
            block: "start"
        });;

        bottom_bar("", "", "options")
        //start search
        //in kaios the keypress a-z are not recognized
        //therefore this detour

        live_search_trigger = setInterval(() => {

            if (search_listener.value != "") {
                //listObj.fuzzySearch(search.value);
                search(search_listener.value)
                console.log(search_listener.value)
            }
            // if (search_listener.value == "") box.innerHTML = "";;
        }, 1000);
    }


    function end() {
        clearInterval(live_search_trigger);
        bottom_bar("search", "select", "options")

    }


    let view_contacts = function() {
        tab_index = tab_index_last;
        document.querySelector("ul#box-list li[tabindex='" + tab_index + "']").focus()
        bottom_bar("search", "select", "options")

        document.getElementById("content-box").style.display = "none"
        status = "search";

    }



    ///////
    //open single contact
    ///////

    let open_contact = function() {
        tab_index_last = tab_index;
        let c_id = document.activeElement.firstChild.getAttribute("data-id")
        var options = {
            filterValue: c_id,
            filterBy: ["id"],
            filterOp: "equals"

        }

        var search = window.navigator.mozContacts.find(options);

        search.onsuccess = function() {

            let content_a;
            let content = document.getElementById("content")
            content.innerHTML = "";
            tab_index = 0
            let p;

            if (search.result.length === 1) {
                var person = search.result[0];

                if (person.tel.length == 0) {
                    alert("this contact does not contain a phone number")
                    return false;
                }

                for (let i = 0; i < person.tel.length; i++) {
                    p = person.tel[i].value;
                    p = p.replace(/\s+/g, '');

                    content_a = document.createElement('li')
                    content_a.setAttribute("class", "content-item");
                    content_a.setAttribute("data-number", p);
                    content_a.innerText = p
                    content_a.tabIndex = i
                    content.appendChild(content_a)

                }
                bottom_bar("sms", "", "call")

                document.getElementById("content-box").style.display = "block"
                document.querySelector("ul#content > li:first-child").focus()
                status = "content";



            } else {
                alert("Sorry, there is no such contact.")
            }
        };

        search.onerror = function() {
            alert("Uh! Something goes wrong, no result found!");
        };
    }


    ///////////
    ///go to search field
    //////////

    let open_search = function() {

        document.activeElement.parentElement.scrollIntoView({
            block: "start"
        });;

        document.getElementById("search").focus();

    }

    //////////////////////////
    ////KEYPAD TRIGGER////////////
    /////////////////////////
    function handleKeyDown(evt)


    {


        switch (evt.key) {


            case 'Enter':
                evt.preventDefault();
                if (status == "search") open_contact();
                break;

            case 'Backspace':
                evt.preventDefault();
                if (status == "content") {
                    view_contacts()
                    break;
                }
                if (status == "search") {
                    window.close()
                    break;
                }

                break;

            case 'SoftLeft':
                if (status == "content") {
                    sms(document.activeElement.getAttribute("data-number"));
                    break;
                }

                if (status == "search") {
                    open_search()
                    break;
                }

                break;
            case 'SoftRight':
                if (status == "content") {
                    call(document.activeElement.getAttribute("data-number"));
                    break;
                }
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


})

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