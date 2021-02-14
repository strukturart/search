"use strict";

function notify(param_title, param_text, param_silent, requireInteraction) {

    var options = {
        body: param_text,
        silent: param_silent,
        requireInteraction: requireInteraction


    }


    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(param_title, options);

    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(param_title, options, action);

                document.addEventListener('visibilitychange', function() {
                    if (document.visibilityState === 'visible') {
                        // The tab has become visible so clear the now-stale Notification.                                                                                                                                      
                        notification.close();

                        toaster("yes", 2000)


                    }
                });


            }
        });
    }

}


//bottom bar
function bottom_bar(left, center, right) {
    document.querySelector("div#bottom-bar div#button-left").textContent = left;
    document.querySelector(
        "div#bottom-bar div#button-center"
    ).textContent = center;
    document.querySelector("div#bottom-bar div#button-right").textContent = right;

    if (left == "" && center == "" && right == "") {
        document.querySelector("div#bottom-bar").style.display = "none";
    } else {
        document.querySelector("div#bottom-bar").style.display = "block";
    }
}

//top bar
function top_bar(left, center, right) {
    document.querySelector("div#top-bar div.button-left").textContent = left;
    document.querySelector(
        "div#top-bar div.button-center"
    ).textContent = center;
    document.querySelector("div#top-bar div.button-right").textContent = right;

    if (left == "" && center == "" && right == "") {
        document.querySelector("div#top-bar").style.display = "none";
    } else {
        document.querySelector("div#top-bar").style.display = "block";
    }
}


function toaster(text, time) {
    document.querySelector("div#toast").innerHTML = text;
    var elem = document.querySelector("div#toast");
    var pos = -100;
    var id = setInterval(down, 5);
    var id2;

    function down() {
        if (pos == 0) {
            clearInterval(id);
            setTimeout(() => {
                id2 = setInterval(up, 5);
            }, time);
        } else {
            pos++;
            elem.style.top = pos + "px";
        }
    }

    function up() {
        if (pos == -1000) {
            clearInterval(id2);
        } else {
            pos--;
            elem.style.top = pos + "px";
        }
    }
}


function sms(number, body_content) {


    let sms = new MozActivity({
        name: "new",
        data: {
            type: "websms/sms",
            number: number,
            body: body_content
        }
    })

    sms.onsuccess = function() {

    };

    sms.onerror = function() {
        alert("The activity encounter en error: " + this.error);
    };

}



let call2 = function(tel_number) {
    navigator.mozTelephony.dial(tel_number, 1)
}




let call = function(number) {


    let activity = new MozActivity({
        name: "dial",
        data: {
            type: "webtelephony/number",
            number: number,
        }
    });

    activity.onsuccess = function() {

    };

    activity.onerror = function() {
        alert("The activity encounter en error: " + this.error);
    };



}







//wake up screen
function screenWakeLock(param1) {
    if (param1 == "lock") {
        lock = window.navigator.requestWakeLock("screen");

        lock.onsuccess = function() {
            toaster("screen-lock", 10000);

        };

        lock.onerror = function() {
            alert("An error occurred: " + this.error.name);
        };
    }

    if (param1 == "unlock") {
        if (lock.topic == "screen") {
            lock.unlock();
        }
    }
}