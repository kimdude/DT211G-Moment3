"use strict"
//Fetching elements from html-document
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const mainMenu = document.getElementById("navContainer");
const courseCode = document.getElementById("courseCodes");
const courseName = document.getElementById("courseNames");
const courseProgress = document.getElementById("courseProgressions");
const input = document.getElementById('filterSearch');

//Checking value of null and adding eventlisteners if variable exists
openBtn.addEventListener('click', displayMenu);
closeBtn.addEventListener('click', displayMenu);
if(courseCode !== null) {
    courseCode.addEventListener('click', sortCode);
}
if(courseCode !== null) {
    courseName.addEventListener('click', sortName);
}
if(courseCode !== null) {
    courseProgress.addEventListener('click', sortProgress);
}
if(courseCode !== null) {
    input.addEventListener('input', inputFilter);
}

//Display schedule when window onload
window.onload = () => {
    if(courseCode !== null) {
        sendSchedule() 
    };
}

//Toggle main menu i mobile-version
function displayMenu() {
    const style = window.getComputedStyle(mainMenu);

    if(style.display === "none") {
        mainMenu.style.display = "block";
        openBtn.style.display = "none";
    } else {
        mainMenu.style.display = "none";
        openBtn.style.display = "block";
    }
}

//Fetching json-file with try/catch och async/await
async function getSchedule() {
    try {
        const response = await fetch('https://webbutveckling.miun.se/files/ramschema_ht24.json'); //Awaits for fetch of json-file to finish

        if (!response.ok) {
            throw new Error('Nätverksproblem - felaktigt svar från servern.'); //Checks if fetch is okay or has errors
        }

        const data = await response.json(); //Awaits response and converts json-file to javascript-array
        return data;

    } catch (error) {
        console.error('Ett fel har uppstått:', error.message); //Consoles incase of error and lets rest of program continue
    }
}

//Sending schedule to display
async function sendSchedule() {
    const data = await getSchedule();
    displaySchedule(data);
}

//Sort schedule after code
async function sortCode() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const data = await getSchedule();

    const sortedData = data.sort((a,b) => {
        if (a.code > b.code) { //Returns 1 if a should be listed after b
            return 1;
        } if (a.code < b.code) { //Returns -1 if a should be listed before b
            return -1;
        } else {
            return 0;   //Returns 0 if a and b are equal
        }
    });

    displaySchedule(sortedData)
}

//Sort schedule after name
async function sortName() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const data = await getSchedule();

    const sortedData = data.sort((a,b) => {
        if (a.coursename > b.coursename) { //Returns 1 if a should be listed after b
            return 1;
        } if (a.coursename < b.coursename) { //Returns -1 if a should be listed before b
            return -1;
        } else {
            return 0;   //Returns 0 if a and b are equal
        }
    });

    displaySchedule(sortedData)
}

//Sort schedule after progress
async function sortProgress() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const data = await getSchedule();

    const sortedData = data.sort((a,b) => {
        if (a.progression > b.progression) { //Returns 1 if a should be listed after b
            return 1;
        } if (a.progression < b.progression) { //Returns -1 if a should be listed before b
            return -1;
        } else {
            return 0;   //Returns 0 if a and b are equal
        }
    });

    displaySchedule(sortedData)
}

async function inputFilter() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    const inputValue = input.value.toLowerCase();
    const data = await getSchedule();

    const search = data.filter((data) => 
        data.code.toLowerCase().includes(inputValue)||
        data.coursename.toLowerCase().includes(inputValue)
    );

    displaySchedule(search);
}

//Adding data to table
async function displaySchedule(e) {
    for(let i = 0; i < e.length; i++) {
        //Fetching table from HTML-document
        const tbody = document.getElementById('tableBody');
        const tableRow = document.createElement('tr');

        tbody.appendChild(tableRow);

        //Add course code to table
        const code = e[i].code;
        const codeNode = document.createTextNode(code);
        const codeData = document.createElement('td');

        tableRow.appendChild(codeData);
        codeData.appendChild(codeNode);

        //Add course names to table
        const name = e[i].coursename;
        const nameNode = document.createTextNode(name);
        const nameData = document.createElement('td');        

        tableRow.appendChild(nameData);
        nameData.appendChild(nameNode);

        //Add course progression to table
        const progress = e[i].progression;
        const progressNode = document.createTextNode(progress);
        const progressData = document.createElement('td');

        tableRow.appendChild(progressData);
        progressData.appendChild(progressNode);
    }
}