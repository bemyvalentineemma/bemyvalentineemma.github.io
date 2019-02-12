//Get All

function getAll() {
    displayHome();
    getStaff();
    getCourses();
    getNews();
    getNotices();
    getComments();
}
let phoneNumber = "";

//Staff


function getStaff() {
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/people";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        showStaff(resp.list);
    }
    xhr.send(null);
}

function showStaff(staff) {
    let tableContent = "";
    const addRecord = (record) => {
        tableContent += '<table class="staff"><td><img class="profilepics" src=" ' + getImg(record.profileUrl[1], record.imageId) + '"></td></tr><td class="names">' +
            record.legalFirstName + " " + record.legalLastName + '</td></tr><td class="job">' + record.jobtitles[0] + '</td></tr><td class="icons"><a href="mailto:' + record.emailAddresses + '">&#128233;</a><a href = "tel:+6493737999;ext=' + record.extn + '">' + '	&#128222;' + '</a><a href = " ' + getVCard(record.profileUrl[1]) + '">&#128213;</a></td></tr> <tr></table>\n';
    }
    staff.forEach(addRecord)
    document.getElementById("showStaff").innerHTML = tableContent;
}

function getImg(personId, ImageId) {
    if (ImageId != null) {
        return 'https://unidirectory.auckland.ac.nz/people/imageraw/' + personId + '/' + ImageId + '/small';
    } else {
        return 'http://redsox.uoa.auckland.ac.nz/ups/logo-192x192.png'
    }

}

function getVCard(personId) {
    return 'http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/vcard?u=' + personId;
}

//Courses

function getCourses() {
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/courses?orderby=level";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        sortCourses(resp.data);
    }
    xhr.send(null);
}

function sortCourses(courses) {
    courses = courses.sort(function (a, b) {
        var x = a.catalogNbr.toLowerCase();
        var y = b.catalogNbr.toLowerCase();
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    });
    showCourses(courses);
}

function showCourses(courses) {
    let tableContent = "";
    const addRecord = (record) => {
        tableContent += "<table class='course'><td class='coursetitle'>" + record.titleLong + "</br>" + record.subject + record.catalogNbr + "</td></tr><td class='description'>'" + record.description + "</td></tr><td class='prereqs'>" + record.rqrmntDescr + "</td></tr><td><button onclick='displayTimetable("+record.catalogNbr+")'>Timetable</button></td></tr></table>\n";
        // createTimeTable(record.catalogNbr)
    }
    courses.forEach(addRecord)
    document.getElementById("showCourses").innerHTML = tableContent;
}


// Timetable

// createTimeTable("111")

function createTimeTable(courseNo) {
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/course?c=" + courseNo;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        showTimeTable(resp.data);
    }
    xhr.send(null);
}

function showTimeTable(timetable) {
    let tableContent = "<tr class='orderTitle'><th></th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr>\n";
    let time = "<td></td>";
    let mon = "<td></td>";
    let tue = "<td></td>";
    let wed = "<td></td>";
    let thu = "<td></td>";
    let fri = "<td></td>";
    // tableContent += time + mon + tue + wed + thu + fri + ' </tr>\n';
    const addRecord = (record) => {

        for (j = 0; j < record.meetingPatterns.length; j++) {
            if (record.meetingPatterns[j].startTime.substring(0, 2) == i && record.meetingPatterns[j].endDate.substring(5, 7) > 8) {
                rowspan = record.meetingPatterns[j].endTime.substring(0, 2) - record.meetingPatterns[j].startTime.substring(0, 2)
                switch (record.meetingPatterns[j].daysOfWeek) {
                    case "mon":
                        mon = "<td class='lec' rowspan=" + rowspan + ">" + record.component + "</br>" + record.meetingPatterns[j].location + "</td>";
                        break;
                    case "tue":
                        tue = "<td class='lec' rowspan=" + rowspan + ">" + record.component + "</br>" + record.meetingPatterns[j].location + "</td>";
                        break;
                    case "wed":
                        wed = "<td class='lec' rowspan=" + rowspan + ">" + record.component + "</br>" + record.meetingPatterns[j].location + "</td>";
                        break;
                    case "thu":
                        thu = "<td class='lec' rowspan=" + rowspan + ">" + record.component + "</br>" + record.meetingPatterns[j].location + "</td>";
                        break;
                    case "fri":
                        fri = "<td class='lec' rowspan=" + rowspan + ">" + record.component + "</br>" + record.meetingPatterns[j].location + "</td>";
                        break;
                }
            }
        }
    }
    for (i = 9; i < 18; i++) {
        timetable.forEach(addRecord);
        let time = i
        if(time > 12){
            time = time - 12;
        }
        tableContent += '<th>' + time + '</th>' + mon + tue + wed + thu + fri + ' </tr>\n'
        mon = "<td></td>";
        tue = "<td></td>";
        wed = "<td></td>";
        thu = "<td></td>";
        fri = "<td></td>";

    }
    document.getElementById("timetable").innerHTML = tableContent;
}

//Create News 

function getNews() {
    const xhr = new XMLHttpRequest();
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/news";
    xhr.open("GET", uri, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        showNews(resp);
    }
    xhr.send(null);
}

function showNews(news) {
    let tableContent = "";
    const addRecord = (record) => {
        tableContent += '<a class="news" target="_blank" href="' + record.linkField + '"><table class="news"><td class="title">' + record.titleField + '</td></tr><td class="publish">' + record.pubDateField.substring(0, 16) + '</td></tr><td class="desc">' + record.descriptionField + '</td></tr></table></a>';
    }
    news.forEach(addRecord)
    document.getElementById("showNews").innerHTML = tableContent;
}

//Create Notices
function getNotices() {
    const xhr = new XMLHttpRequest();
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/notices";
    xhr.open("GET", uri, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        showNotices(resp);
    }
    xhr.send(null);
}

function showNotices(notice) {
    let tableContent = "";
    const addRecord = (record) => {
        tableContent += '<a class="news" target="_blank" href="' + record.linkField + '"><table class="news"><td class="title">' + record.titleField + '</td></tr><td class="publish">' + record.pubDateField.substring(0, 16) + '</td></tr><td class="desc">' + record.descriptionField + '</td></tr></table></a>';
        // tableContent += record.descriptionField;
    }
    notice.forEach(addRecord)
    document.getElementById("showNotices").innerHTML = tableContent;
}



function postComment() {
    var name = document.getElementById("name").value;
    var comment = document.getElementById("comment").value;
    
    // document.getElementById("commentArea").innerHTML = comment;
    // document.getElementById("test").innerHTML = comment;
    const xhr = new XMLHttpRequest();
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/comment?name=" + name;
    // document.getElementById("commentArea").innerHTML = uri;
    xhr.open("POST", uri, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
        // POST succeeds; do something
    }
    xhr.send(JSON.stringify("" + comment));
}

function getComments() {
    const xhr = new XMLHttpRequest();
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/htmlcomments";
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        document.getElementById("showComments").innerHTML = xhr.responseText;
    }
    xhr.send(null);
}


let currentTab = "";

function displayHome() {
    if (currentTab != "home") {
        currentTab = "home";
        showNoTabs();
        document.getElementById("homeTab").style.borderBottom = "2px solid #507FA8";
        document.getElementById("showHome").style.display = "inline";
        localStorage.setItem('show', 'true');
    }
}

function displayCourses() {
    if (currentTab != "course") {
        currentTab = "course";
        showNoTabs();
        document.getElementById("coursesTab").style.borderBottom = "2px solid #507FA8";
        document.getElementById("showCourses").style.display = "inline";
        localStorage.setItem('showCourses', 'true');
    }
}

function displayTimetable(number) {
    createTimeTable(number);
    if (currentTab != "timetable") {
        currentTab = "timetable";
        showNoTabs();
        // document.getElementById("coursesTab").style.borderBottom = "2px solid #507FA8";
        document.getElementById("timetable").style.display = "inline";
        // localStorage.setItem('showCourses', 'true');
    }
}

function displayStaff() {
    if (currentTab != "staff") {
        currentTab = "staff";
        showNoTabs();
        document.getElementById("staffTab").style.borderBottom = "2px solid #507FA8";
        document.getElementById("showStaff").style.display = "inline";
        localStorage.setItem('show', 'true');
    }
}

function displayNews() {
    if (currentTab != "news") {
        currentTab = "news";
        showNoTabs();
        document.getElementById("newsTab").style.borderBottom = "2px solid #507FA8";
        document.getElementById("showNews").style.display = "inline";
        localStorage.setItem('show', 'true');
    }
}

function displayNotices() {
    if (currentTab != "notices") {
        currentTab = "notices";
        showNoTabs();
        document.getElementById("noticesTab").style.borderBottom = "2px solid #507FA8";
        document.getElementById("showNotices").style.display = "inline";
        localStorage.setItem('show', 'true');
    }
}

function displayGuestbook() {
    if (currentTab != "guestbook") {
        currentTab = "guestbook";
        showNoTabs();
        document.getElementById("guessbookTab").style.borderBottom = "2px solid #507FA8";
        document.getElementById("showGuestbook").style.display = "inline";
        localStorage.setItem('show', 'true');
    }
}

function showNoTabs() {

    document.getElementById("homeTab").style.borderBottom = "none";
    document.getElementById("coursesTab").style.borderBottom = "none";
    document.getElementById("staffTab").style.borderBottom = "none";
    document.getElementById("newsTab").style.borderBottom = "none";
    document.getElementById("noticesTab").style.borderBottom = "none";
    document.getElementById("guessbookTab").style.borderBottom = "none";

    document.getElementById("showHome").style.display = "none";
    document.getElementById("showCourses").style.display = "none";
    document.getElementById("showStaff").style.display = "none";
    document.getElementById("showNews").style.display = "none";
    document.getElementById("showNotices").style.display = "none";
    document.getElementById("showGuestbook").style.display = "none";
    document.getElementById("timetable").style.display = "none";
}