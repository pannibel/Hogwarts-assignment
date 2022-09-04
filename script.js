"use strict"

let studentJSON;
let firstname;
let middlename;
let lastname;
let nickname;
let hyphenname;

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
        /* console.log(student.fullname);
        console.log(student.gender);
        console.log(student.house); */

        let fullname = student.fullname;
        let gender = student.gender;
        let house = student.house;

// cleaning extra spaces
        fullname = fullname.replace(/\s+/g, ' ').trim();

// convert them into variables we want
        // making first names
        if (fullname.includes(" ")) {
            firstname = fullname.substring(fullname[0], fullname.indexOf(" "));
            firstname = firstname[0].toUpperCase()+firstname.substring(1).toLowerCase();
            console.log(firstname);
        } else {
            firstname = fullname.substring(0);
            firstname = firstname[0].toUpperCase()+firstname.substring(1).toLowerCase();
            console.log(firstname);
        }

        // making middle names (if they have it)
        if (fullname.includes(" ") && !fullname.lastIndexOf(" ") === fullname.indexOf(" ")) {
            middlename = fullname.substring(fullname.indexOf(" ")+1, fullname.lastIndexOf(" "));
            middlename = middlename[0].toUpperCase()+middlename.substring(1).toLowerCase();
            console.log(middlename);
        } else {
            middlename = undefined;
            console.log(middlename);
        }

        // making last names (if they have it)
        // hyphen cases
        if (fullname.includes(" ") && fullname.includes("-")) {
            let beforehyphen = fullname.substring(fullname.lastIndexOf(" ")+1, fullname.indexOf("-"))
            let afterhyphen = fullname.substring(fullname.indexOf("-"));
            afterhyphen[1].toUpperCase();
            lastname = beforehyphen+afterhyphen;
            console.log(lastname);
        } else if (fullname.includes(" ")) {
            lastname = fullname.substring(fullname.lastIndexOf(" ")+1);
            lastname = lastname[0].toUpperCase()+lastname.substring(1).toLowerCase();
            console.log(lastname);
        } else {
            lastname = undefined;
            console.log(lastname);
        }

        // making nicknames (if they have it)
        if (fullname.includes(`"`)) {
            nickname = fullname.substring(fullname.indexOf("\"")+1, fullname.lastIndexOf("\""));
            console.log(nickname);
        } else {
            nickname = "";
            console.log(nickname);
        }

    });



// BUILDING A NEW OBJECT PROTOTYPE

/* const Student = {
    firstname: "",
    middlename: "",
    lastname: "",
    nickname: "",
    gender: "",
    house: "",
    image: "",
} */

//const student = Object.create(Student);


}