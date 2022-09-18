"use strict";

// comment index
// !
// *
// ?
// TODO

// * STAGE: DISPLAYING THE LIST OF STUDENTS, WITH SORTING, FILTERING, SEARCHING, AND POP-UP

// LETS START THIS S

// GLOBAL OBJECTS AND VARIABLES
let studentJSON;
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


//* FETCHING YAY
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
    studentJSON = await response.json();

    // when loaded, prepare data objects
    prepareObjects(studentJSON);
    //console.log(studentJSON);
}

function prepareObjects(studentJSON) {
    console.log("prepareObjects");

    allStudents = studentJSON.map(cleanData);
    console.log(allStudents);
    displayList(allStudents);
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
    }
    
    
    const student = Object.create(Student);

        // set properties on the object to the variables
        student.firstname = firstname;
        student.middlename = middlename;
        student.lastname = lastname;
        student.nickname = nickname;
        student.gender = gender;
        student.house = house;

    return student;
}

//* DISPLAYING LIST OF STUDENTS
function displayList(students) {
    // TODO clear the list
    //document.querySelector("#list tbody").innerHTML = "";

    // ! build a new list
    //students.forEach(displayStudent);
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
