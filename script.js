"use strict";

// comment index
// !
// *
// ?
// TODO

// * STAGE: DISPLAYING THE LIST OF STUDENTS, WITH SORTING, FILTERING, SEARCHING, AND POP-UP

// LETS START THIS S

// GLOBAL OBJECTS AND VARIABLES
let fullname, house, gender, firstname, middlename, lastname, nickname, image, firstletter;
let allStudents = [];

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

// FETCHING YAY
window.addEventListener("DOMContentLoaded", event => {
    start();
});

function start() {
    console.log("start");

    // ! later
    //registerButtons();
    loadData();
}

async function loadData() {
    const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const studentJSON = await response.json();

    // when loaded, prepare data objects
    prepareObjects(studentJSON);
    //console.log(studentJSON);
}

function prepareObjects(jsonData) {
    console.log("prepareObjects");

    allStudents = jsonData.map(prepareObject);
    displayList(allStudents);
}

function prepareObject(jsonObject) {
    const student = Object.create(Student);

    fullname = jsonObject.fullname;
    gender = jsonObject.gender;
    house = jsonObject.house;

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

    // making first names and last names
    if (fullname.includes(" ") && fullname.lastIndexOf(" ") === fullname.indexOf(" ")) {
        firstname = texts[0];
        lastname = texts[1]; 
    } else {
        firstname = texts[0];
    }

    // making middle names (if they have it)
    if (fullname.includes(" ") && fullname.lastIndexOf(" ") != fullname.indexOf(" ") && !fullname.includes(`"`)) {
        firstname = texts[0];
        middlename = texts[1];
        lastname = texts[2];
    } else {
        middlename = "";
    }

    // making nicknames (if they have it)
    if (fullname.includes(`"`)) {
        firstname = texts[0];
        nickname = texts[1];
        lastname = texts[2];
    } else {
        nickname = "";
    }

    //adding images
    if (lastname && !lastname.includes("-")) {
        image = lastname.toLowerCase() + "_" + firstname[0].toLowerCase() + ".png";
    } else if (lastname.includes("-")) {
        let afterhyphen = lastname.substring(lastname.indexOf("-")+1);
        image = afterhyphen.toLowerCase() + "_" + firstname[0].toLowerCase() + ".png";
    }

    return student;
}

function newData(student) {
    // set properties on the object to the variables
    student.firstname = firstname;
    student.middlename = middlename;
    student.lastname = lastname;
    student.nickname = nickname;
    student.gender = gender;
    student.house = house;

    // add the object to an array of data objects
    allStudents = Array.from(student);
    console.log(allStudents);
};

// DISPLAYING LIST OF STUDENTS
function displayList(students) {
    // TODO clear the list
    //document.querySelector("#list tbody").innerHTML = "";

    // ! build a new list
    //students.forEach(displayStudent);

    // just for now
    students.forEach(newData);
}

function displayStudent(student) {
    // TODO create clone
    // const clone = document.querySelector("template #student").content.cloneNode(true);
    
    // TODO set clone data
    /* clone.querySelector("[data-field=firstname]").textContent = student.firstname;
    clone.querySelector("[data-field=middlename]").textContent = student.middlename;
    clone.querySelector("[data-field=lastname]").textContent = student.lastname;
    clone.querySelector("[data-field=nickname]").textContent = student.nickname;
    clone.querySelector("[data-field=gender]").textContent = student.gender;
    clone.querySelector("[data-field=house]").textContent = student.house;
 */
    // TODO append clone to list
    // document.querySelector("#list tbody").appendChild( clone );
}
