import {Team, Player, createTeamRandom, teamFormats} from "./team.js";
import { chooseRandomAmountFromArray, randomBool, randomInteger, randomizeArray } from "./rand.js";
import { copyTo } from "./array.js";
import { Matchmaker } from "./matchmaker.js";
import { Fetcher } from "./fetcher.js";



const playerPool = [];
const teamHistory = [];

let format = document.getElementById("formatSelect").value;
let fetcher = new Fetcher();

let team1;
let team2;

let ignoreMVP = false;
//some DOM stuff I can use
// let li = document.createElement("li");
// listItem.innerHTML = restaurantName;
// listitem.classList.add("list-item")


const FETCH_URL = "https://metalface.me/players.json"

async function main() {
    const request = await fetch(FETCH_URL);
    const players = await request.json();
    copyTo(players, playerPool);
    console.log("Player pool retrieved at " + FETCH_URL);
    console.log("Player pool size: " + playerPool.length);
    
    

    setTimeout(() => {
        fetcher.setRanksFromPool(playerPool)
    },1000);

    setTimeout(() => {
        bindPlayerPool();
    },1500);

}

function generateTeam() {

    if (playerPool.length < teamFormats[format].length*2) {
        console.error("Player pool is too small to generate a team");
        return -1;
    }

    let players = [];
    copyTo(playerPool, players);

    if (randomBool()) {
        players.reverse();
    }

    let newPlayerPool = chooseRandomAmountFromArray(players, teamFormats[format].length*2);
    if (Math.random() < 0.5) {
        newPlayerPool.reverse();
    }
    const team1Players = chooseRandomAmountFromArray(newPlayerPool, teamFormats[format].length);
    newPlayerPool.reverse();
    const team2Players = chooseRandomAmountFromArray(newPlayerPool, teamFormats[format].length);
    team1 = createTeamRandom(team1Players, format);
    team2 = createTeamRandom(team2Players, format);
    bindTeam(team1, 1);
    bindTeam(team2, 2);
}

/* Binds a team object to the HTML, causing the player's names to show on the document.*/
function bindTeam(team, teamIndex) {
    let html = ""
    for (let i = 0; i < team.getPlayerCount(); i++) {
        html += "<div class=\"classTag\"\>\n" + "<p>" + team.getPlayerPositionFromIndex(i) + "</p>\n";
        html += "</div>\n " + "<p>" + team.getPlayerNameFromIndex(i) + "</p>";
    }
    let teamElement = document.getElementById("team" + teamIndex);
    teamElement.innerHTML = html;

    let teamStatsElement = document.getElementById("team" + teamIndex + "stats");
    teamStatsElement.innerHTML = "Average Rank: " + team.getAverageRank();
    
}

function bindPlayerPool() {
    let list = document.getElementById("playerPoolList");
    let listString = "";
    for (let i = 0; i < playerPool.length; i++) {
        listString += "<li>" + playerPool[i].name + " --- " + playerPool[i].level + "</li>";
    }
    list.innerHTML = listString;
}

function updateFormat(formatString) {
    format = formatString;
    team1 = {};
    team2 = {};

}

function setError() {
    
}


/* -------------------------- Events */
let randomizeTeam1 = document.getElementById("randomizeTeam1");
randomizeTeam1.addEventListener("click", (event) => {
    team1.randomizePositions();
    bindTeam(team1, 1);
});

let randomizeTeam2 = document.getElementById("randomizeTeam2");
randomizeTeam2.addEventListener("click", (event) => {
    team2.randomizePositions();
    bindTeam(team2, 2)
});

let addPlayerButton = document.getElementById("addPlayerButton");
addPlayerButton.addEventListener("click", (event) => {
    //on click, must add player
    let addPlayerField = document.getElementById("addPlayerNameInput");
    let addPlayerRank = document.getElementById("addPlayerRankInput");

    const name = addPlayerField.value;
    let rank = parseInt(addPlayerRank.value);

    let error = 0;

    if (name == "") {
        console.error("Name or rank is empty");
        error = 1;
    }

    if (isNaN(rank)) {
        console.error("Could not parse rank");
        error = 1;
    }

    if (rank < 0 || rank > 40 ) {
        console.error("Rank is not between 0 and 40");
        error = 1;
    }

    playerPool.forEach(element => {
        if (element.name == name) {
            console.error("Name is duplicate");
            error = 1;
        }
    });

    let newRank = fetcher.getAvgMVPfromName(name);
    if (newRank != -1 && ignoreMVP == false) {
        rank = newRank;
    }

    if (isNaN(rank)) {
        console.error("Could not parse rank");
        error = 1;
    }

    if (error == 0) {
        playerPool.push(new Player(name, rank));
        bindPlayerPool();
    }

});

let removePlayerButton = document.getElementById("removePlayerButton");
removePlayerButton.addEventListener("click", (event) => {
    let removePlayerField = document.getElementById("removePlayerNameInput");
    for (let i = 0; i < playerPool.length; i++) {
        if (playerPool[i].name == removePlayerField.value) {
            playerPool.splice(i, 1);
        }
    }
    bindPlayerPool();
});

let generateRandomTeamButton = document.getElementById("generateRandomTeamsButton");
generateRandomTeamButton.addEventListener("click", generateTeam);

let matchmakeRandomButton = document.getElementById("matchmakeRandom");
matchmakeRandomButton.addEventListener("click", (e) => {
    let match = new Matchmaker(playerPool, 0, format);
    if (match != -1) {
        team1 = match.getTeam1();
        team2 = match.getTeam2();
        bindTeam(match.getTeam1(), 1);
        bindTeam(match.getTeam2(), 2);
    }
})

let formatSelector = document.getElementById("formatSelect");
formatSelector.addEventListener("change", (e) => {
    updateFormat(formatSelector.value);
});

let mvpCheckBox = document.getElementById("mvpCheckbox")
mvpCheckbox.addEventListener("change", (e) => {
	if (mvpCheckbox.checked) {
		ignoreMVP = true
	} else {
		ignoreMVP = false
	}
});

window.onload = main();
