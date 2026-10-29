function showTime() {
    var today = new Date();
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];

    var day = days[today.getDay()];

    var hours = today.getHours();
    var minutes = today.getMinutes();
    var sec = today.getSeconds();

    var ampm = " Am";

    if (hours >= 12) {
        var ampm = " Pm";
    }

    if (hours > 12) {
        hours = hours - 12;
    }
    if (hours == 0) {
        hours = 12;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }



    document.getElementById("result").innerHTML =
        hours + ":" + minutes + ":" + sec + ampm ;
}
showTime();
setInterval(showTime, 1000);
