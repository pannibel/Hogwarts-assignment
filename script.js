"use strict";

// comment index
// !
// *
// ?
// TODO

// * STAGE: SELECTING STUDENTS AS PREFECTS (done), EXPELLING STUDENTS (done), EXPELLED STUDENTS FILTERING

// LETS START THIS S

// GLOBAL OBJECTS AND VARIABLES
let studentJSON;
let fullname, house, gender, firstname, middlename, lastname, nickname, image, firstletter;
let allStudents = [];
let studentNumber;
let index = 1;
let id;
let foundStudent;
const settings = {
    filterBy: "all",
    sortBy: "name",
    sortDir: "asc",
    searchBy: "",
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
    isPrefect: false,
    isExpelled: false,
    isInq: false,
};

// Arrays for prefects
let GryffindorPrefects = [], SlytherinPrefects = [], HufflepuffPrefects = [], RavenclawPrefects = [];
let housePrefects;

// Array for expelled
let expelledStudents = [];


//? EVENTLISTENERS

// BUTTONS
function registerButtons() {

        // filtering by house
    document.querySelectorAll("[data-action= 'housefilter']").forEach(button =>
        button.addEventListener("click", selectHouse));

        // filtering
    document.querySelector("#options").addEventListener("change", selectFilter);

        // sorting
    document.querySelectorAll("[data-action= 'sort']").forEach(button =>
        button.addEventListener("click", selectSort));

        // searching
    document.querySelector("#search_button").addEventListener("click", receiveInput);
}

// making the input field search on enter key press
function enterKey() {
    let inputField = document.getElementById("input");

    inputField.addEventListener("keypress", event => {
        if (event.key === "Enter") {
            console.log("enterkey");
            document.querySelector("#search_button").click();
        }
    })
}




//* FETCHING YAY
window.addEventListener("DOMContentLoaded", event => {
    start();
});

function start() {
    console.log("start");

    // later
    registerButtons();
    enterKey();
    loadData();
}

async function loadData() {
    const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    studentJSON = await response.json();

    // when loaded, prepare data objects
    prepareObjects(studentJSON);
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

// FILTERING FOR PREFECTS, EXPELLED, INQ SQUAD
function selectFilter() {
    console.log("selectFilter");
    console.log("You selected", this.value);
    const option = this.value;

    setFilter(option);
} 

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {

    if (settings.filterBy === "2") {
        filteredList = allStudents.filter(isPref);
    };
    if (settings.filterBy === "3") {
        filteredList = allStudents.filter(isInq);
    };
    if (settings.filterBy === "4") {
        filteredList = allStudents.filter(isExp);
    };

    return filteredList
};

function isPref(student) {
    return student.isPref === true;
}

function isSquad(student) {
    return student.isInq === true;
}

function isExp(student) {
    return student.isExpelled === true;
}

// HOUSE FILTERING
function selectHouse(event) {
    const houseFilter = event.target.dataset.filter;
    console.log(`User selected ${houseFilter}`);
    setHouse(houseFilter);
}

function setHouse(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
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
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}




//* SEARCHING
function receiveInput() {
    let input = document.querySelector("#input").value;
    console.log(input);

    setSearch(input);
}

function setSearch(input) {
    settings.searchBy = input;
    
    searchResults();
}

function findResults(searchedStudents) {

    searchedStudents = allStudents.filter(findMe);

    function findMe(student) {
        let stringvalues = Object.values(student).toString();
        stringvalues = stringvalues.toLowerCase();
        return stringvalues.includes(settings.searchBy);
    }

    console.log(searchedStudents);
    return searchedStudents;
}

function searchResults() {

    const searchedList = findResults(allStudents);
    displayList(searchedList);
}




//* DISPLAYING LIST OF STUDENTS
function displayList(students) {
    // clear the list
    document.querySelector("#student_list").innerHTML = "";

    // build a new list
    students.forEach(displayStudent);

    // updating the displayed students nr
    studentNumber = students.length;
    let displayNumber = document.getElementById("displayedNumber");
    displayNumber.textContent = `${studentNumber} results`;
}

function displayStudent(student) {
    // create clone
    const clone = document.querySelector("#template").content.cloneNode(true);
    
    // set clone data
    clone.querySelector("[data-field=photo]").src = `images/${student.image}`;
    clone.querySelector("[data-field=name]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
    clone.querySelector("[data-field=house]").textContent = student.house;
    clone.querySelector("div.student").setAttribute("id", `student${student.index}`);
    //clone.querySelector("[data-field=name]").addEventListener("click", selectStudent);

    // append clone to list
    document.querySelector("#student_list").appendChild(clone);

    // eventlistener for opening the pop-up
    document.querySelectorAll("#fullname").forEach(button => {
        button.addEventListener("click", selectStudent)
    })
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
        popupClone.querySelector("#p_button").setAttribute("id", `p_button${student.index}`);
        popupClone.querySelector("#i_button").setAttribute("id", `i_button${student.index}`);
        popupClone.querySelector("#e_button").setAttribute("id", `e_button${student.index}`);

    
        // append clone to list
        document.querySelector("#pop_up").appendChild(popupClone);   

        //closing the pop-up
        document.querySelectorAll("#close_button").forEach(button => {
            button.addEventListener("click", closePopup);
        });

        // prefect button eventlistener
        document.querySelectorAll(`#p_button${student.index}`).forEach(button => {
            button.addEventListener("click", changePrefectStatus);
        });

        // inq button eventlistener
     /*    document.querySelectorAll(`#i_button${student.index}`).forEach(button => {
            button.addEventListener("click", changeInqStatus);
        });
 */
        // expel button eventlistener
        document.querySelectorAll(`#e_button${student.index}`).forEach(button => {
            button.addEventListener("click", changeExpelledStatus);
        });
}


function selectStudent(event) {
    const selectedStudent = event.target.parentElement.parentElement.id;
    console.log(`User selected ${selectedStudent}`);

    setStudent(selectedStudent);
    openPopup(setStudent);
}

function setStudent(student) {
    console.log(student);

    id = student.substring(7);
    console.log(id);

    return id;
}

function openPopup() {
    document.querySelector(`#popup_student${id}`).classList.remove("hidden");
    document.querySelector(`#popup_student${id}`).classList.add("middle");
    document.querySelector("#container").classList.remove("hidden");
}

// close pop-up
function closePopup() {
    document.querySelector(`#popup_student${id}`).classList.add("hidden");
    document.querySelector(`#popup_student${id}`).classList.remove("middle");
    document.querySelector("#container").classList.add("hidden");
}



//* NAMING STUDENTS AS PREFECTS

function changePrefectStatus(event) {
    console.log("changePrefectStatus");

    const selectedStudent = event.target.parentElement.parentElement.id;
    
    getStudentId(selectedStudent);
    findStudent(allStudents);

    checkIfPrefect(findStudent);
}

//! THESE NEXT 2 FUNCTIONS ARE FOR EXPELLING AND INQ SQUAD AS WELL
// this one gets the student index number and assigns it to the global id variable
function getStudentId(student) {
    console.log("getStudentIndex");
    console.log(student);

    id = parseInt(student.substring(13));
    console.log(id);

    return id;
}

// this one finds a whole student in allStudents and assigns it to the global foundStudent variable
function findStudent(allStudents) {
    console.log("findStudent");
    foundStudent = allStudents.find(hasId);

    function hasId(object) {
        return object.index === id;
    }

    console.log(foundStudent);
    return foundStudent;
}



function checkIfPrefect() {
    console.log("checkIfPrefect");
    console.log(foundStudent);

    if (foundStudent.isPrefect) {
        console.log(`${foundStudent.firstname} ${foundStudent.lastname} is prefect of ${foundStudent.house}`);
        removeFromPrefects(foundStudent);
    } else if (!foundStudent.isPrefect) {
        console.log(`${foundStudent.firstname} ${foundStudent.lastname} is not prefect of ${foundStudent.house}`);
        checkHousePrefects(foundStudent);
    }
}

function checkHousePrefects(student) {
    console.log("checkHousePrefects");

    if (student.house === "Gryffindor") {
        housePrefects = GryffindorPrefects;
    };
    if (student.house === "Slytherin") {
        housePrefects = SlytherinPrefects;
    };
    if (student.house === "Hufflepuff") {
        housePrefects = HufflepuffPrefects;     
    };
    if (student.house === "Ravenclaw") {
        housePrefects = RavenclawPrefects;
    };


    if (housePrefects.length === 2) {
        console.log("Action not possible");
    } else if (housePrefects.length < 2) {
        console.log("Action possible");
        addToPrefects(student, housePrefects);
    }
}

function addToPrefects(student, housePrefects) {
    console.log("addToPrefects");

    housePrefects.push(student);
    student.isPrefect = true;

    const studentPButton = document.querySelector(`#p_button${student.index}`);
    console.log(studentPButton.id);
    studentPButton.textContent = "Remove from prefects";

    console.log(`${student.firstname} ${student.lastname} has been added to ${student.house} Prefects`);
    console.log(housePrefects);
}

function removeFromPrefects(student) {
    console.log("removeFromPrefects");

    if (student.house === "Gryffindor") {
        housePrefects = GryffindorPrefects;
    };
    if (student.house === "Slytherin") {
        housePrefects = SlytherinPrefects;
    };
    if (student.house === "Hufflepuff") {
        housePrefects = HufflepuffPrefects;    
    };
    if (student.house === "Ravenclaw") {
        housePrefects = RavenclawPrefects;
    };

    for(let i = 0; i < housePrefects.length; i++){
        if (housePrefects[i] === student) {  
            housePrefects.splice(i, 1); 
        }
    };

    const studentPButton = document.querySelector(`#p_button${student.index}`);
    console.log(studentPButton.id);
    studentPButton.textContent = "Select as prefect";

    student.isPrefect = false;
    console.log(`${student.firstname} ${student.lastname} has been removed from ${student.house} Prefects`)
    console.log(housePrefects);
}



//* EXPELLING STUDENTS

function changeExpelledStatus(event) {
    console.log("changeExpelledStatus");

    const selectedStudent = event.target.parentElement.parentElement.id;
    
    // these functions are higher up in prefect section
    getStudentId(selectedStudent);
    findStudent(allStudents);

    expelStudent(findStudent);
}

function expelStudent() {
    console.log("expelStudent");
    console.log(foundStudent);

    foundStudent.isExpelled = true;

    // removing the expelled student from the allStudent array
    for(let i = 0; i < allStudents.length; i++){
        if (allStudents[i] === foundStudent) {  
            allStudents.splice(i, 1); 
        }
    };

    // adding the expelled student to the expelled array
    expelledStudents.push(foundStudent);
    console.log(`${foundStudent.firstname} ${foundStudent.lastname} has been expelled!`);
    console.log("Expelled students: ", expelledStudents);

    // displaying the studentList instantly without the expelled student
    buildList();
    console.log(allStudents);
}


