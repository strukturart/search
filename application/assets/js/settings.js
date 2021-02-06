const settings = ((_) => {

    function localStorageWriteRead(item, value) {
        if (item != "" && value != "" && value != "undefined" && item != "undefined") {
            localStorage.setItem(item, value);
        }

        return localStorage.getItem(item);
    }



    let save_settings = function() {

        localStorageWriteRead("callcard-00", document.getElementById("callcard-00").value)
        localStorageWriteRead("callcard-01", document.getElementById("callcard-01").value)
    }

    let load_settings = function() {
        document.getElementById("callcard-00").value = localStorage.getItem("callcard-00")
        document.getElementById("callcard-01").value = localStorage.getItem("callcard-01")
        let settings_arr = [localStorage.getItem("callcard-00"), localStorage.getItem("callcard-01")]
        return settings_arr;
    }



    return {
        load_settings,
        save_settings
    };
})();