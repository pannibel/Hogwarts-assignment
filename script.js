"use strict";

// comment index
// !
// *
// ?
// TODO

// * STAGE: DISPLAYING THE LIST OF STUDENTS (done), WITH SORTING (done), FILTERING (done), SEARCHING, AND POP-UP

// LETS START THIS S

// GLOBAL OBJECTS AND VARIABLES
let studentJSON;
let fullname, house, gender, firstname, middlename, lastname, nickname, image, firstletter;
let allStudents = [];
let index = 1;
const settings = {
    filterBy: "all",
    sortBy: "name",
    sortDir: "asc",
    selStudent: "",
};

// The prototype for all students: 
const Student = {
    firstname: "",
    middlename: "",
    lastname: "",
    nickname: "",
    gender: "",
    house: "",
    image: "",
};


//? EVENTLISTENERS

// BUTTONS
function registerButtons() {
    document.querySelectorAll("[data-action= 'housefilter']").forEach(button =>
        button.addEventListener("click", selectHouse));

/*     document.querySelectorAll("[data-action= 'filter']").forEach(button =>
        button.addEventListener("click", selectFilter)); */

    document.querySelectorAll("[data-action= 'sort']").forEach(button =>
        button.addEventListener("click", selectSort));
}



//* FETCHING YAY
window.addEventListener("DOMContentLoaded", event => {
    start();
});

function start() {
    console.log("start");

    // later
    registerButtons();
    loadData();
}

async function loadData() {
    const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    studentJSON = await response.json();

    // when loaded, prepare data objects
    prepareObjects(studentJSON);
    //console.log(studentJSON);
    document.querySelectorAll("#fullname").forEach(el => el.addEventListener("click", selectStudent));
}

function prepareObjects(studentJSON) {
    console.log("prepareObjects");

    allStudents = studentJSON.map(cleanData);
    console.log(allStudents);
    displayList(allStudents);
    popupList(allStudents);
}




//* CLEANING THE JSON DATA
function cleanData(object) {
    console.log("cleanData");

    fullname = object.fullname;
    gender = object.gender;
    house = object.house;

// GENERAL CHANGES
    // cleaning extra whitespaces
        fullname = fullname.replace(/\s+/g, ' ').trim();
        house = house.replace(/\s+/g, ' ').trim();

    // making all letters lowercase
        fullname = fullname.toLowerCase();
        house = house.toLowerCase();

    // capitalize first letters
        firstletter = fullname[0].toUpperCase();
        fullname = fullname.replace(fullname[0], firstletter);

        firstletter = house[0].toUpperCase();
        house = house.replace(house[0], firstletter);

    // capitalize first letter after " "
        let fullnameArr = fullname.split(" ");

        for (let i = 0; i < fullnameArr.length; i++) {
            fullnameArr[i] = fullnameArr[i][0].toUpperCase() + fullnameArr[i].substring(1);
        }

        fullname = fullnameArr.join(" ");

    // capitalize first letter after "-"
        let fullnameArr2 = fullname.split("-");

        for (let i = 0; i < fullnameArr2.length; i++) {
            fullnameArr2[i] = fullnameArr2[i][0].toUpperCase() + fullnameArr2[i].substring(1);
        }

        fullname = fullnameArr2.join("-");

    // capitalize first letter after "
        let fullnameArr3 = fullname.split(`"`);

        for (let i = 0; i < fullnameArr3.length; i++) {
            fullnameArr3[i] = fullnameArr3[i][0].toUpperCase() + fullnameArr3[i].substring(1);
        }

        fullname = fullnameArr3.join(`"`);


// CONVERTING THEM INTO VARIABLES WE WANT
    const texts = fullname.split(" ");

    // just firstname
    if (!fullname.includes(" ")) {
        firstname = texts[0];
        middlename = "";
        lastname = "";
        nickname = "";
    }

    // firstname + lastname
    else if (fullname.includes(" ") && fullname.lastIndexOf(" ") === fullname.indexOf(" ")) {
        firstname = texts[0];
        middlename = "";
        lastname = texts[1];
        nickname = ""; 
    }

    // firstname + middlename + lastname
    else if (fullname.includes(" ") && fullname.lastIndexOf(" ") != fullname.indexOf(" ") && !fullname.includes(`"`)) {
        firstname = texts[0];
        middlename = texts[1];
        lastname = texts[2];
        nickname = "";
    }

    // firstname + lastname + nickname
    else if (fullname.includes(`"`)) {
        firstname = texts[0];
        nickname = texts[1];
        lastname = texts[2];
    };

    //adding images
    if (lastname && !lastname.includes("-")) {
        image = lastname.toLowerCase() + "_" + firstname[0].toLowerCase() + ".png";

    } else if (lastname.includes("-")) {
        let afterhyphen = lastname.substring(lastname.indexOf("-")+1);
        image = afterhyphen.toLowerCase() + "_" + firstname[0].toLowerCase() + ".png";
    } else if (!lastname) {
        image = "";
    }
    
    
    const student = Object.create(Student);

        // set properties on the object to the variables
        student.firstname = firstname;
        student.middlename = middlename;
        student.lastname = lastname;
        student.nickname = nickname;
        student.gender = gender;
        student.house = house;
        student.image = image;
        student.index = index++;

    return student;
}



//* BIG BUILDLIST FUNCTION WITH FILTERING AND SORTING

// HOUSE FILTERING
function selectHouse(event) {
    const housefilter = event.target.dataset.filter;
    console.log(`User selected ${housefilter}`);
    setHouse(housefilter);
}

function setHouse(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterHouse(houseList) {
    //let filteredList = allAnimals;
    if (settings.filterBy === "gryf"){
        houseList = allStudents.filter(isGryf);
    };
    if (settings.filterBy === "sly"){
        houseList = allStudents.filter(isSly);
    };
    if (settings.filterBy === "huf"){
        houseList = allStudents.filter(isHuf);
    };
    if (settings.filterBy === "rav"){
        houseList = allStudents.filter(isRav);
    };
    
    return houseList;
}

function isGryf(student) {
    return student.house === "Gryffindor"
}

function isSly(student) {
    return student.house === "Slytherin"
}

function isHuf(student) {
    return student.house === "Hufflepuff"
}

function isRav(student) {
    return student.house === "Ravenclaw"
}


// SORTING
function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;

    // toggle the direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }

    console.log(`User sorted by ${sortBy} - ${sortDir}`);
    setSort(sortBy, sortDir);
}  

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;

    buildList();
}

function sortList(sortedList) {

    let direction = 1;
    if (settings.sortDir === "asc") {
        direction = -1;
    } else {
        direction = 1;
    }


    if (settings.sortBy === "first_name") {
        sortedList = sortedList.sort(sortByFirstname)
    };

    if (settings.sortBy === "last_name") {
        sortedList = sortedList.sort(sortByLastname);
    };

    if (settings.sortBy === "house") {
        sortedList = sortedList.sort(sortByHouse);
    };
    

    function sortByFirstname(studentA, studentB) {
        if (studentA.firstname < studentB.firstname) {
                return 1 * direction;
            } else {
                return -1 * direction;
            }
    };
    
    function sortByLastname(studentA, studentB) {
        if (studentA.lastname < studentB.lastname) {
                return 1 * direction;
            } else {
                return -1 * direction;
            }
    };

    function sortByHouse(studentA, studentB) {
        if (studentA.house < studentB.house) {
                return 1 * direction;
            } else {
                return -1 * direction;
            }
    };

    return sortedList;
} 




//BUILDLIST
function buildList() {
    const currentList = filterHouse(allStudents);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}




//* DISPLAYING LIST OF STUDENTS
function displayList(students) {
    // clear the list
    document.querySelector("#student_list").innerHTML = "";

    // build a new list
    students.forEach(displayStudent);
}

function displayStudent(student) {
    // create clone
    const clone = document.querySelector("#template").content.cloneNode(true);
    
    // set clone data
    clone.querySelector("[data-field=photo]").src = `images/${student.image}`;
    clone.querySelector("[data-field=name]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
    clone.querySelector("[data-field=house]").textContent = student.house;
    clone.querySelector("div.student").setAttribute("id", `student${student.index}`);

    // append clone to list
    document.querySelector("#student_list").appendChild(clone);
}



//* POP UP OF STUDENT
function popupList(students) {
    // clear the list
    document.querySelector("#pop_up").innerHTML = "";

    // build a new list
    students.forEach(popupStudent);
}

function popupStudent(student) {
       // create clone
       const popupClone = document.querySelector("#popup_template").content.cloneNode(true);
        
       // set clone data
       popupClone.querySelector("[data-field=photo]").src = `images/${student.image}`;
       popupClone.querySelector("[data-field=name]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
       popupClone.querySelector("[data-field=nickname]").textContent = `${student.nickname}`;
       popupClone.querySelector("[data-field=house]").textContent = student.house;
       popupClone.querySelector(".popup_student").setAttribute("id", `popup_student${student.index}`);
       popupClone.querySelector(".popup_student").setAttribute("class", "hidden");
   
       // append clone to list
       document.querySelector("#pop_up").appendChild(popupClone);   
}


function selectStudent(event) {
    const selectedStudent = event.target.parentElement.parentElement.id;
    console.log(`User selected ${selectedStudent}`);

    showPopup(selectedStudent);
}

function showPopup(student) {
    console.log(student);

    let id = student.substring(7);
    console.log(id);

    document.querySelector(`#popup_student${id}`).classList.remove("hidden");

   /*  document.querySelector(`#student${student.index}`).addEventListener("click", () => {
        document.querySelector(`#popup_student${student.index}`).classList.remove("hidden")}); */
}