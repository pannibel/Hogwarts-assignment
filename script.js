"use strict"

let studentJSON;

let fullname;
let house;
let gender;

let firstname;
let middlename;
let lastname;
let nickname;
let firstletter;

let newStudentArray;

// FETCHING YAY

document.addEventListener("DOMContentLoaded", event => {
    init();
});

async function init() {
    await loadData();
    console.log("init");

    prepareData();
}

async function loadData() {
    const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    studentJSON = await response.json();
    console.log(studentJSON)
}


function prepareData() {
    console.log("prepareData");

// FOR EACH OBJECT IN THE JSON DATA:
// read the properties of the JSON object
    studentJSON.forEach(student => {

        fullname = student.fullname;
        gender = student.gender;
        house = student.house;

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
        // making first names
        if (fullname.includes(" ")) {
            firstname = fullname.substring(fullname[0], fullname.indexOf(" "));
        } else {
            firstname = fullname.substring(0);
        }

        // making middle names (if they have it)
        if (fullname.includes(" ") && fullname.lastIndexOf(" ") != fullname.indexOf(" ") && !fullname.includes(`"`)) {
            middlename = fullname.substring(fullname.indexOf(" ")+1, fullname.lastIndexOf(" "));
        } else {
            middlename = ""
        }

        // making last names (if they have it)
        // hyphen cases
        if (fullname.includes(" ")) {
            lastname = fullname.substring(fullname.lastIndexOf(" ")+1);
        } else {
            lastname = "";
        }

        // making nicknames (if they have it)
        if (fullname.includes(`"`)) {
            nickname = fullname.substring(fullname.indexOf("\"")+1, fullname.lastIndexOf("\""));
        } else {
            nickname = "";
        }

        console.log("first name:", firstname);
        console.log("middle name:", middlename);
        console.log("last name:", lastname);
        console.log("nickname:", nickname);
        console.log("house:", house);
        console.log("gender:", gender);
        console.log("");

        });


    // BUILDING A NEW OBJECT PROTOTYPE

    const Student = {
        firstname: "",
        middlename: "",
        lastname: "",
        nickname: "",
        gender: "",
        house: "",
        image: "",
    }

    // create a new object from prototype
    const student = Object.create(Student);

    // set properties on the object to the variables
    student.firstname = firstname;
    student.middlename = middlename;
    student.lastname = lastname;
    student.nickname = nickname;
    student.gender = gender;
    student.house = house;

    // add the object to an array of data objects
    newStudentArray = Array.from(student);

    console.log(newStudentArray)


}