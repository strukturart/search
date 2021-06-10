"use strict";

let count = 0;
let listObj;
let tab_index = 0;
let tab_index_last;
let init = false;
let status = "search";
const box = document.getElementById("box-list");
document.getElementById("search").focus();

window.addEventListener("DOMContentLoaded", function () {
  //translation
  let user_lang = window.navigator.userLanguage || window.navigator.language;
  if (!lang.hasOwnProperty(user_lang)) user_lang = "default";
  document.querySelector("input#search").placeholder = lang[user_lang].search;

  ////////////
  //TABINDEX NAVIGATION
  ///////////
  function nav(move) {
    let elem = document.activeElement;

    // Setup siblings array and get the first sibling
    var siblings = [];

    if (elem.id == "search") {
      document.querySelector("li[tabindex='0']").focus();
      status = "list";
      bottom_bar(
        lang[user_lang].search,
        lang[user_lang].select,
        lang[user_lang].sms
      );
      return false;
    }
    if (elem.id != "search") {
      var sibling = elem.parentNode.firstChild;

      // Loop through each sibling and push to the array
      while (sibling) {
        if (
          sibling.tabIndex != null &&
          sibling.tabIndex != undefined &&
          sibling.tabIndex > -1
        ) {
          siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
      }
    }

    if (
      move == "+1" &&
      tab_index < siblings.length - 1 &&
      siblings.length > 1
    ) {
      tab_index++;
      siblings[tab_index].focus();

      siblings[tab_index].scrollIntoView({
        block: "start",
      });
    }
    if (move == "-1" && tab_index > 0) {
      //search field
      if (
        document.activeElement == document.querySelector("ul li:first-child")
      ) {
        document.querySelector("input#search").focus(); //sets focus to element
        var val = document.querySelector("input#search").value; //store the value of the element
        document.querySelector("input#search").value = ""; //clear the value of the element
        //set that value back.
        setTimeout(function () {
          document.querySelector("input#search").value = val;
        }, 1);

        return false;
      }

      tab_index--;

      siblings[tab_index].focus();

      siblings[tab_index].scrollIntoView({
        block: "start",
      });
    }
  }

  //add tabindex attr dyn.
  let divs;
  let i;

  let set_tabindex = function () {
    divs = document.querySelectorAll("li");
    for (i = 0; i < divs.length; ++i) {
      divs[i].tabIndex = i;
    }
  };

  ///////
  //list all contacts
  /////

  let contact_list = function () {
    console.log("start reading contacts");
    count = 0;

    let a;
    let b;
    let tel = "";

    if (!window.navigator.mozContacts) {
      alert("fail");
      return false;
    }
    var request = window.navigator.mozContacts.getAll({
      sortBy: "familyName",
      sortOrder: "ascending",
    });

    request.onsuccess = function () {
      if (this.result) {
        if (this.result.name != null) {
          let be = this.result.name;
          console.log(be);
          if (this.result.name != "") {
            var y = this.result.hasOwnProperty("tel");
            if (
              this.result.tel != null &&
              this.result.tel.length >= 0 &&
              this.result.tel[0] != undefined
            )
              tel = this.result.tel[0].value;

            // Display the name of the contact
            a = document.createElement("li");
            b = document.createElement("div");
            b.setAttribute("class", "name");
            a.setAttribute("data-id", this.result.id);
            a.setAttribute("data-tel", tel);
            b.innerText = this.result.name;
            a.appendChild(b);
            box.appendChild(a);
          }
        }

        this.continue();
      } else {
        //init search

        set_tabindex();

        var options = {
          valueNames: ["name"],
          fuzzySearch: {
            searchClass: "fuzzy-search",
            location: 0,
            distance: 100,
            threshold: 0.1,
            multiSearch: true,
          },
        };

        listObj = new List("box", options);
        listObj.on("searchComplete", function () {
          set_tabindex();
        });

        init = true;
        listObj.fuzzySearch(search_listener.value.toString());
      }
    };

    request.onerror = function () {
      alert("Something goes wrong!");
    };
  };

  contact_list();
  bottom_bar("", "", lang[user_lang].settings);

  ///////
  //search by looping over contacts
  /////

  let search2 = function (term) {
    while (content_b.hasChildNodes()) {
      content_b.removeChild(content_b.firstChild);
    }
    count = 0;

    let a;
    let b;

    if (!window.navigator.mozContacts) {
      console.log("fail");
      return false;
    }
    var request = window.navigator.mozContacts.getAll({
      sortBy: "familyName",
      sortOrder: "ascending",
    });

    let contacts = [];

    request.onsuccess = function () {
      //alert(JSON.stringify(this.result))

      if (this.result) {
        if (this.result.name != null) {
          //alert(JSON.stringify(this.result))

          let be = this.result.name.toString();
          //term = term.replace(" ", "|");
          term = term.replace(" ", ".*");
          let flag = "gi"; //simple string with flags
          let dynamicRegExp = new RegExp(`${term}`, flag);

          let tel = "";

          if (this.result.tel.length > 0) {
            tel = this.result.tel[0].value;
          }

          if (be.search(dynamicRegExp) > -1 && this.result.name != "") {
            contacts.push({
              name: this.result.name,
              id: this.result.id,
              pos: be.search(dynamicRegExp),
              tel: tel,
            });
          }
        }

        this.continue();
      } else {
        while (content_b.hasChildNodes()) {
          content_b.removeChild(content_b.firstChild);
        }

        for (let i = 0; i < contacts.length; i++) {
          a = document.createElement("li");
          a.setAttribute("class", "name");
          a.setAttribute("data-id", contacts[i].id);
          a.setAttribute("data-tel", contacts[i].tel);
          a.innerText = contacts[i].name;
          box.appendChild(a);
        }
        set_tabindex();
        contacts.splice(0, contacts.length);
      }
    };

    request.onerror = function () {
      alert("Something goes wrong!");
    };
  };

  /////
  ////search methode contacts api
  ////

  let a, b;
  let content_b = document.getElementById("box-list");
  let search = function (term) {
    var options = {
      filterValue: term,
      filterBy: ["name"],
      filterOp: "contains",
      filterLimit: 100,
      sortBy: "familyName",
      sortOrder: "ascending",
    };

    let search_rq = window.navigator.mozContacts.find(options);

    search_rq.onsuccess = function () {
      tab_index = 0;

      if (search_rq.result.length > 1) {
        // Get the <ul> element with id="myList"

        // If the <ul> element has any child nodes, remove its first child node
        while (content_b.hasChildNodes()) {
          content_b.removeChild(content_b.firstChild);
        }
        for (let k = 0; k < search_rq.result.length; k++) {
          var person = search_rq.result[k];

          a = document.createElement("li");
          b = document.createElement("div");
          a.setAttribute("class", "name");
          a.setAttribute("data-id", person.id);
          a.innerText = person.name[0];

          //for short action
          //call button in list status
          if (person.tel.length) {
            let p = person.tel[0].value;
            p = p.replace(/\s+/g, "");
            a.setAttribute("data-tel", p);
          }

          //a.appendChild(b)
          box.appendChild(a);
        }
        set_tabindex();
      } else {
        console.log("Sorry, there is no such contact.");
        while (content_b.hasChildNodes()) {
          content_b.removeChild(content_b.firstChild);
        }
      }
    };

    search_rq.onerror = function () {
      toaster("Uh! Something goes wrong, no result found!");
    };
  };

  /////////
  ////live search
  ////////

  let search_listener = document.getElementById("search");

  search_listener.addEventListener("focus", search_active);
  search_listener.addEventListener("input", start_search);

  function start_search() {
    listObj.fuzzySearch(search_listener.value.toString());
  }

  function search_active() {
    bottom_bar("", "", lang[user_lang].settings);
    document.activeElement.parentElement.scrollIntoView();
  }

  let view_list = function () {
    tab_index = tab_index_last;
    document
      .querySelector("ul#box-list li[tabindex='" + tab_index + "']")
      .focus();
    bottom_bar(
      lang[user_lang].search,
      lang[user_lang].select,
      lang[user_lang].sms
    );

    document.getElementById("content-box").style.display = "none";
    status = "list";
  };

  ///////
  //open single contact
  ///////

  let open_contact = function () {
    tab_index_last = tab_index;
    let c_id = document.activeElement.getAttribute("data-id");
    var options = {
      filterValue: c_id,
      filterBy: ["id"],
      filterOp: "equals",
    };

    var search = window.navigator.mozContacts.find(options);

    search.onsuccess = function () {
      let content_a;
      let content = document.getElementById("content");
      content.innerHTML = "";
      tab_index = 0;
      let p;

      if (search.result.length === 1) {
        var person = search.result[0];

        if (person.tel.length == 0) {
          //alert("this contact does not contain a phone number");
          status = "list";
          return false;
        }

        for (let i = 0; i < person.tel.length; i++) {
          p = person.tel[i].value;
          p = p.replace(/\s+/g, "");

          content_a = document.createElement("li");
          content_a.setAttribute("class", "content-item");
          content_a.setAttribute("data-tel", p);
          content_a.innerText = p;
          content_a.tabIndex = i;
          content.appendChild(content_a);
        }
        bottom_bar(lang[user_lang].sms, "", lang[user_lang].call);

        document.getElementById("content-box").style.display = "block";
        document.querySelector("ul#content > li:first-child").focus();
        status = "content";
      } else {
        alert("Sorry, there is no such contact.");
      }
    };

    search.onerror = function () {
      alert("Uh! Something goes wrong, no result found!");
    };
  };

  ///////////
  ///go to search field
  //////////

  let open_search = function () {
    document.activeElement.parentElement.scrollIntoView({
      block: "start",
    });

    document.getElementById("search").focus();
    status = "search";
  };

  settings.load_settings();

  ///////////
  ///open settings
  //////////

  let open_settings = function () {
    tab_index = 0;
    document.getElementById("settings").style.display = "block";
    document.querySelector("input#callcard-00").focus();
    status = "settings";
    settings.load_settings();
    bottom_bar("save", "", "cancel");
  };

  let close_settings = function () {
    document.getElementById("settings").style.display = "none";
    bottom_bar("", "", lang[user_lang].settings);
    status = "search";
    open_search();
  };

  let save_settings = function () {
    settings.save_settings();
    toaster("saved successfully", 2000);
  };

  //////////////////////////
  ////KEYPAD TRIGGER////////////
  /////////////////////////
  function handleKeyDown(evt) {
    switch (evt.key) {
      case "Enter":
        evt.preventDefault();
        if (status == "list") open_contact();
        break;

      case "Backspace":
        evt.preventDefault();
        if (status == "content") {
          view_list();
          break;
        }
        if (status == "search" || status == "list") {
          window.close();
          break;
        }

        break;

      case "SoftLeft":
        if (status == "content") {
          if (document.activeElement.hasAttribute("data-tel")) {
            sms(document.activeElement.getAttribute("data-tel"));
          } else {
            alert(lang[user_lang].error_msg_1);
          }
          break;
        }

        if (status == "list") {
          open_search();
          break;
        }

        if (status == "settings") {
          save_settings();
          break;
        }

        break;
      case "SoftRight":
        if (status == "content") {
          if (document.activeElement.hasAttribute("data-tel")) {
            call(document.activeElement.getAttribute("data-tel"));
          } else {
            alert(lang[user_lang].error_msg_1);
          }
          break;
        }

        if (status == "search") {
          open_settings();
          break;
        }

        if (status == "settings") {
          close_settings();
          break;
        }

        if (status == "list") {
          if (document.activeElement.hasAttribute("data-tel")) {
            sms(document.activeElement.getAttribute("data-tel"), "");
          } else {
            alert(lang[user_lang].error_msg_1);
          }
        }

        break;

      case "Call":
        if (status == "list") {
          if (document.activeElement.hasAttribute("data-tel")) {
            call(document.activeElement.getAttribute("data-tel"));
          } else {
            alert(lang[user_lang].error_msg_1);
          }
        }
        break;

      case "#":
        if (status == "list") {
          let callcard = settings.load_settings();
          if (document.activeElement.hasAttribute("data-tel")) {
            call2(
              callcard[0] +
                document.activeElement.getAttribute("data-tel") +
                callcard[1]
            );
          } else {
            alert(lang[user_lang].error_msg_1);
          }
        }
        break;

      case "*":
        if (status == "list") {
          let callcard = settings.load_settings();
          if (document.activeElement.hasAttribute("data-tel")) {
            sms("", document.activeElement.getAttribute("data-tel"));
          } else {
            alert(lang[user_lang].error_msg_1);
          }
        }

        break;

      case "ArrowDown":
        if (init) nav("+1");
        break;

      case "ArrowUp":
        if (init) nav("-1");
        break;

      default:
        break;
    }
  }

  document.addEventListener("keydown", handleKeyDown);
});
