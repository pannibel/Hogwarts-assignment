"use strict";

// comment index
// !
// *
// ?
// TODO

// * STAGE: FETCHING FAMILIES AND BLOOD STATUS (done)

// LETS START THIS S

// GLOBAL OBJECTS AND VARIABLES
const studentURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const familiesURL = "https://petlatkea.dk/2021/hogwarts/families.json";

let studentJSON;
let familiesJSON;

// Arrays
let allStudents = [];
let expelledStudents = [];
let currentArray;
let GryffindorPrefects = [], SlytherinPrefects = [], HufflepuffPrefects = [], RavenclawPrefects = [];
let housePrefects;
let pureBloods = [], halfBloods = [], muggleBorns = [];
let inqSquad = [];
let studentNumber;

// For students
let fullname, house, gender, firstname, middlename, lastname, nickname, image, blood, firstletter;
let index = 1;
let id;
let foundStudent;

// For filtering, sorting and searching
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
    blood: "",
    isPrefect: false,
    isExpelled: false,
    isInq: false,
};

// for styling changes
let allstudButton = document.querySelector("#all_students");
let gryfButton = document.querySelector("#gryf");
let slyButton = document.querySelector("#sly");
let hufButton = document.querySelector("#huf");
let ravButton = document.querySelector("#rav");
let fnSortButton = document.querySelector("[data-sort='first_name");
let lnSortButton = document.querySelector("[data-sort='last_name");
let hSortButton = document.querySelector("[data-sort='house");

// EVENTLISTENER FUNCTIONS
// buttons
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

        // all students button for style change
    allstudButton.addEventListener("click", buttonsReset);
    
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

// making the allstudents button be colored
function buttonsReset() {
    allstudButton.style = "background-color: #000; color: #ECE4DF";
    gryfButton.style = "";
    slyButton.style = "";
    hufButton.style = "";
    ravButton.style = "";
}




//* FETCHING YAY
window.addEventListener("DOMContentLoaded", event => {
    start();
});

async function start() {
    console.log("start");

    await loadFamilyJSON();
    await loadStudentJSON();
    prepareData();

    // later
    registerButtons();
    enterKey();
}

async function loadStudentJSON() {
    const resp = await fetch(studentURL);
    const data = await resp.json();
    console.log("Student JSON loaded");
    studentJSON = data;
}

async function loadFamilyJSON() {
    const resp = await fetch(familiesURL);
    const data = await resp.json();
    console.log("Families JSON loaded");
    familiesJSON = data;
}

function prepareData() {
    if (studentJSON.length > familiesJSON.length) {
        console.log("There are more students than families");
      } else {
        console.log("There are more students than families");
      }
    // when loaded, prepare data objects
    prepareObjects(studentJSON);
}

function prepareObjects(studentJSON) {
    console.log("prepareObjects");

    allStudents = studentJSON.map(cleanData);
    console.log(allStudents);
    currentArray = allStudents;

    bloodArrays();

    displayList(allStudents);
    buttonsReset();
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

    // adding images
    if (lastname && !lastname.includes("-")) {
        image = lastname.toLowerCase() + "_" + firstname[0].toLowerCase() + ".png";
    } else if (lastname.includes("-")) {
        let afterhyphen = lastname.substring(lastname.indexOf("-")+1);
        image = afterhyphen.toLowerCase() + "_" + firstname[0].toLowerCase() + ".png";
    } else if (!lastname) {
        image = "";
    }


    //adding blood status
    if (!familiesJSON.half.includes(lastname) && !familiesJSON.pure.includes(lastname)) {
        blood = "muggleborn";
    };
    if (familiesJSON.half.includes(lastname)) {
        blood = "half-blood";
    };
    if (familiesJSON.pure.includes(lastname)) {
        blood = "pureblood";
    };
    
    
    const student = Object.create(Student);
        student.firstname = firstname;
        student.middlename = middlename;
        student.lastname = lastname;
        student.nickname = nickname;
        student.gender = gender;
        student.house = house;
        student.image = image;
        student.index = index++;
        student.blood = blood;

    return student;
}



//* BIG BUILDLIST FUNCTION WITH FILTERING AND SORTING

// FILTERING FOR PREFECTS, EXPELLED, INQ SQUAD, BLOOD STATUS
function selectFilter() {
    console.log("selectFilter");
    console.log("You selected", this.value);
    const option = this.value;

    if (option < 4) {
        currentArray = allStudents;
        console.log(`Current array is allStudents`);
    } else {
        currentArray = expelledStudents;
        console.log(`Current array is expelledStudents`);
    }
    buttonsReset();
    setFilter(option);
}

// HOUSE FILTERING
function selectHouse(event) {
    const houseFilter = event.target.dataset.filter;
    console.log(`User selected ${houseFilter}`);

    currentArray = allStudents;
    console.log(`Current array is allStudents`);
    setFilter(houseFilter);

    // plus resetting the dropdown value to 1 so it looks good
    resetDropdown();
}

function setFilter(filter) {
    console.log("setFilter");
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
    console.log("filterList");

    // for house
    if (settings.filterBy === "gryf"){
        filteredList = currentArray.filter(isGryf);
        // styling
        gryfButton.style = "background-color: #984535; color: #ECE4DF";
        allstudButton.style = "";
        slyButton.style = "";
        hufButton.style = "";
        ravButton.style = "";
    };
    if (settings.filterBy === "sly"){
        filteredList = currentArray.filter(isSly);
        // styling
        slyButton.style = "background-color: #4D7D4F; color: #ECE4DF";
        allstudButton.style = "";
        gryfButton.style = "";
        hufButton.style = "";
        ravButton.style = "";
    };
    if (settings.filterBy === "huf"){
        filteredList = currentArray.filter(isHuf);
        // styling
        hufButton.style = "background-color: #C0A344; color: #ECE4DF";
        allstudButton.style = "";
        gryfButton.style = "";
        slyButton.style = "";
        ravButton.style = "";
    };
    if (settings.filterBy === "rav"){
        filteredList = currentArray.filter(isRav);
        // styling
        ravButton.style = "background-color: #5582A2; color: #ECE4DF";
        allstudButton.style = "";
        gryfButton.style = "";
        slyButton.style = "";
        hufButton.style = "";
    };

    // for general
    if (settings.filterBy === "2") {
        filteredList = currentArray.filter(isPref);
    };
    if (settings.filterBy === "3") {
        filteredList = currentArray.filter(isInq);
    };
    if (settings.filterBy === "4") {
        filteredList = currentArray.filter(isExp);
    };


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
    
    
    function isPref(student) {
        return student.isPrefect === true;
    }
    
    function isInq(student) {
        return student.isInq === true;
    }
    
    function isExp(student) {
        return student.isExpelled === true;
    }
    
    return filteredList;
}

function resetDropdown() {
    console.log("resetDropdown");
    document.querySelector("#options").selectedIndex = 0;
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
        sortedList = sortedList.sort(sortByFirstname);
        fnSortButton.style = "background-color: #000; color: #ECE4DF";
        lnSortButton.style = "";
        hSortButton.style = "";

        if (direction === -1) {
            fnSortButton.textContent = "First name A-Z"
        } else {
            fnSortButton.textContent = "First name Z-A"
        }
    };

    if (settings.sortBy === "last_name") {
        sortedList = sortedList.sort(sortByLastname);
        lnSortButton.style = "background-color: #000; color: #ECE4DF";
        fnSortButton.style = "";
        hSortButton.style = "";

        if (direction === -1) {
            lnSortButton.textContent = "Last name A-Z"
        } else {
            lnSortButton.textContent = "Last name Z-A"
        }
    };

    if (settings.sortBy === "house") {
        sortedList = sortedList.sort(sortByHouse);
        hSortButton.style = "background-color: #000; color: #ECE4DF";
        fnSortButton.style = "";
        lnSortButton.style = "";

        if (direction === -1) {
            hSortButton.textContent = "House A-Z"
        } else {
            hSortButton.textContent = "House Z-A"

        }
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
    const currentList = filterList(currentArray);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}




//* SEARCHING
function receiveInput() {
    let input = document.querySelector("#input").value;
    console.log(input);

    currentArray = allStudents;

    setSearch(input);
    resetDropdown();
}

function setSearch(input) {
    settings.searchBy = input;
    
    searchResults();
}

function findResults(searchedStudents) {

    searchedStudents = allStudents.filter(findMe);

    function findMe(student) {
        if (student.lastname.toLowerCase().includes(settings.searchBy) ||
        student.firstname.toLowerCase().includes(settings.searchBy)) 
        return student;
    }

    console.log(searchedStudents);
    return searchedStudents;
}

function searchResults() {
    const searchedList = findResults(allStudents);
    displayList(searchedList);
    buttonsReset();
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
    clone.querySelector("div.student").setAttribute("id", `${student.index}`);
    clone.querySelector(".inq_badge").setAttribute("id", `inq_badge${student.index}`);
    clone.querySelector(".prefect_badge").setAttribute("id", `prefect_badge${student.index}`);

    // if student is inq
    let i_badge = clone.querySelector(`#inq_badge${student.index}`);
    if (student.isInq) {
        i_badge.classList.remove("hidden");
    } else {
       i_badge.classList.add("hidden");
    }

    // if student is pref
    let p_badge = clone.querySelector(`#prefect_badge${student.index}`);
    if (student.isPrefect) {
        p_badge.classList.remove("hidden");
    } else {
        p_badge.classList.add("hidden");
    }

    // append clone to list
    document.querySelector("#student_list").appendChild(clone);

    // eventlistener for opening the pop-up
    document.querySelectorAll("#fullname").forEach(button => {
        button.addEventListener("click", selectStudent)
    });

}


//? FOUNDSTUDENT FUNCTION TO USE FOR ACTING ON ONE STUDENT
// this one gets the student index number and assigns it to the global id variable
function getStudentId(student) {
    console.log("getStudentId");
    console.log(student);

    id = parseInt(student);
    console.log(id);

    return id;
}

// this one finds a whole student in currentArray and assigns it to the global foundStudent variable
function findStudent(currentArray) {
    console.log("findStudent");
    foundStudent = currentArray.find(hasId);

    function hasId(object) {
        return object.index === id;
    }

    console.log(foundStudent);
    return foundStudent;
}



//* POP UP OF STUDENT
function selectStudent(event) {
    const selectedStudent = event.target.parentElement.parentElement.id;
    console.log(`User selected ${selectedStudent}`);

    getStudentId(selectedStudent);
    findStudent(currentArray);
    popupStudent(foundStudent);
}

function popupStudent(student) {
        // clear the list
        document.querySelector("#pop_up").innerHTML = "";
        document.querySelector("#container").classList.remove("hidden");

        // create clone
        const popupClone = document.querySelector("#popup_template").content.cloneNode(true);
        
        // set clone data
        popupClone.querySelector("[data-field=photo]").src = `images/${student.image}`;
        popupClone.querySelector("[data-field=name]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
        popupClone.querySelector("[data-field=nickname]").textContent = `${student.nickname}`;
        popupClone.querySelector("[data-field=house]").textContent = student.house;
        popupClone.querySelector("#crest").src = `images/${student.house}.png`;

        popupClone.querySelector(".popup_student").setAttribute("id", `popup${student.index}`);
        popupClone.querySelector("#p_button").setAttribute("id", `p_button${student.index}`);
        popupClone.querySelector("#i_button").setAttribute("id", `i_button${student.index}`);
        popupClone.querySelector("#e_button").setAttribute("id", `e_button${student.index}`);
        popupClone.querySelector("#blood_status").textContent = student.blood;

        // styling
        let popupBackground = popupClone.querySelector(".popup_student");
        if (student.house === "Gryffindor") {
            popupBackground.style = "background-color: #B65E4D";
        };
        if (student.house === "Slytherin") {
            popupBackground.style = "background-color: #659A68";
        };
        if (student.house === "Hufflepuff") {
            popupBackground.style = "background-color: #C0A344";
        };
        if (student.house === "Ravenclaw") {
            popupBackground.style = "background-color: #5582A2";
        };


        // if student is prefect
        let p_button = popupClone.querySelector(".p_button");

        if (student.isPrefect) {
            p_button.textContent = "Remove from prefects"
            if (student.house === "Gryffindor") {
                p_button.style = "background-color: #82392B"
            };
            if (student.house === "Slytherin") {
                p_button.style = "background-color: #3E6B40"
            };
            if (student.house === "Hufflepuff") {
                p_button.style = "background-color: #A68825"
            };
            if (student.house === "Ravenclaw") {
                p_button.style = "background-color: #335A76"
            };
        } else {
            p_button.textContent = "Select as prefect"
        };


        // if student is inq squad
        let i_button = popupClone.querySelector(`#i_button${student.index}`);

        if (student.isInq) {
            i_button.textContent = "Remove from inquisitorial squad";
            i_button.style = "background-color: black; color: #ECE4DF";
        };
        if (!student.isInq) {
            i_button.textContent = "Add to inquisitorial squad"
        };
        if (student.blood === "half-blood" || student.blood === "muggleborn") {
            i_button.classList.add("hidden");
        };

        // if student is expelled
        let e_button = popupClone.querySelector(`#e_button${student.index}`);

        if (student.isExpelled) {
            e_button.textContent = "Student is expelled"
            e_button.style = "background-color: black; color: #D33C1F";
            popupBackground.style = "background-color: #929292";

            const studentImage = popupClone.querySelector(`#popup${student.index} img`);
            studentImage.style = "filter: grayscale(1)";
        } else {
            e_button.textContent = "Expel"
        };


        // if for blood status

    
        // append clone to list
        document.querySelector("#pop_up").appendChild(popupClone);

        //closing the pop-up
        document.querySelectorAll("#close_button").forEach(button => {
            button.addEventListener("click", closePopup);
        });

        // prefect button eventlistener
        document.querySelectorAll(`#p_button${student.index}`).forEach(button => {
            button.addEventListener("click", checkIfPrefect);
        });

        // inq button eventlistener
        document.querySelectorAll(`#i_button${student.index}`).forEach(button => {
            button.addEventListener("click", changeInqStatus);
        });

        // expel button eventlistener
        if (!student.isExpelled) {
            document.querySelectorAll(`#e_button${student.index}`).forEach(button => {
                button.addEventListener("click", expelStudent);
            });
        }
}

// close pop-up
function closePopup() {
    document.querySelector(`#popup${id}`).classList.add("hidden");
    document.querySelector("#container").classList.add("hidden");
}



//* NAMING STUDENT AS PREFECT
function checkIfPrefect() {
    console.log("checkIfPrefect");
    console.log(foundStudent);

    if (foundStudent.isPrefect && !foundStudent.isExpelled) {
        console.log(`${foundStudent.firstname} ${foundStudent.lastname} is prefect of ${foundStudent.house}`);
        removeFromPrefects(foundStudent);
    } else if (!foundStudent.isPrefect && !foundStudent.isExpelled) {
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

    const p_badge = document.querySelector(`#prefect_badge${student.index}`);
    p_badge.classList.remove("hidden");

    if (student.house === "Gryffindor") {
        studentPButton.style = "background-color: #82392B"
    };
    if (student.house === "Slytherin") {
        studentPButton.style = "background-color: #3E6B40"
    };
    if (student.house === "Hufflepuff") {
        studentPButton.style = "background-color: #A68825"
    };
    if (student.house === "Ravenclaw") {
        studentPButton.style = "background-color: #335A76"
    };

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
    studentPButton.style = "";

    student.isPrefect = false;
    console.log(`${student.firstname} ${student.lastname} has been removed from ${student.house} Prefects`)
    console.log(housePrefects);

    buildList(currentArray);
}



//* EXPELLING STUDENT

function expelStudent() {
    console.log("expelStudent");
    console.log(foundStudent);

    foundStudent.isExpelled = true;

    const studentEButton = document.querySelector(`#e_button${foundStudent.index}`);
    studentEButton.textContent = "Student is expelled";
    studentEButton.style = "background-color: black; color: #D33C1F";
    studentEButton.removeEventListener("click", expelStudent);

    // removing the expelled student from the allStudent array
    for(let i = 0; i < allStudents.length; i++){
        if (allStudents[i] === foundStudent) {  
            allStudents.splice(i, 1); 
        }
    };

    // removing student from prefects and inq squad
    removeFromPrefects(foundStudent);
    removeFromInq(foundStudent);

    // adding the expelled student to the expelled array
    expelledStudents.push(foundStudent);
    console.log(`${foundStudent.firstname} ${foundStudent.lastname} has been expelled!`);
    console.log("Expelled students: ", expelledStudents);

    // displaying the studentList instantly without the expelled student
    buildList();
    console.log(allStudents);

    //styling
    const popupBackground = document.querySelector(`#popup${foundStudent.index}`);
    popupBackground.style = "background-color: #929292";

    const studentImage = document.querySelector(`#popup${foundStudent.index} img`);
    studentImage.style = "filter: grayscale(1)";

    const studentPButton = document.querySelector(`#p_button${foundStudent.index}`);
    studentPButton.removeEventListener("click", checkIfPrefect);

    const studentIButton = document.querySelector(`#i_button${foundStudent.index}`);
    studentIButton.removeEventListener("click", changeInqStatus);

    const studentName = document.querySelector(`#fullname`);
    studentName.removeEventListener("click", selectStudent);
}



//* BLOOD STATUS AND INQUISITORIAL SQUAD
function bloodArrays() {
    allStudents.forEach((student) => {
        
        if (student.blood === "pureblood") {
            pureBloods.push(student);
        };
        if (student.blood === "half-blood") {
            halfBloods.push(student);
        };
        if (student.blood === "muggleborn") {
            muggleBorns.push(student);
        }
    }
)
}

function changeInqStatus() {
    console.log("changeInqStatus");

    if (foundStudent.isInq && !foundStudent.isExpelled) {
        console.log(`${foundStudent.firstname} ${foundStudent.lastname} is already part of the inquisitorial squad`);
        removeFromInq(foundStudent);
    } else if (!foundStudent.isInq && !foundStudent.isExpelled) {
        console.log(`${foundStudent.firstname} ${foundStudent.lastname} is not part of the inquisitorial squad`);
        makeInq(foundStudent);
    }
}

function makeInq(student) {
    console.log("makeInq");

    inqSquad.push(student);
    student.isInq = true;

    const studentIButton = document.querySelector(`#i_button${student.index}`);
    studentIButton.textContent = "Remove from inquisitorial squad";
    studentIButton.style = "background-color: black";

    const i_badge = document.querySelector(`#inq_badge${student.index}`);
    i_badge.classList.remove("hidden");

    console.log(`${student.firstname} ${student.lastname} has been added to the Inquisitorial Squad`);
    console.log(inqSquad);
}

function removeFromInq(student) {
    console.log("removeInq");

    for(let i = 0; i < inqSquad.length; i++){
        if (inqSquad[i] === student) {  
            inqSquad.splice(i, 1); 
        }
    };

    student.isInq = false;

    const studentIButton = document.querySelector(`#i_button${student.index}`);
    studentIButton.textContent = "Add to inquisitorial squad";
    studentIButton.style = "";

    console.log(`${student.firstname} ${student.lastname} has been removed from the Inquisitorial Squad`);
    console.log(inqSquad);
    buildList(currentArray);
}
