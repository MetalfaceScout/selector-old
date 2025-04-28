import { randomInteger, chooseRandomAmountFromArray } from "./rand.js";

const teamFormats = {
    "7playerStandard" : [
        "Commander",
        "Heavy",
        "Scout1",
        "Scout2",
        "Scout3",
        "Ammo",
        "Medic"
    ],
    "6playerStandard" : [
        "Commander",
        "Heavy",
        "Scout1",
        "Scout2",
        "Ammo",
        "Medic"
    ],
    "5playerStandard" : [
        "Commander",
        "Heavy",
        "Scout",
        "Ammo",
        "Medic"
    ],
    "4playerScouts" : [
        "Scout1",
        "Scout2",
        "Ammo",
        "Medic"
    ],
    "4playerQueenBee" : [
        "Ammo1",
        "Ammo2",
        "Ammo3",
        "Medic"
    ]
}


class Team {
    constructor (playerArray, format) {

        this.teamArray = playerArray;
        this.format = format;

        if (this.teamArray.length != teamFormats[format].length) {
            console.error("teamConstructor: Team length does not match format");
            return;
        }

        this.positionIndex = new Object;
        for (let i = 0; i < this.teamArray.length; i++) {
            this.positionIndex[teamFormats[format][i]] = this.teamArray[i];
        }

    }

    getTotalRank() {
        let totalRank = 0;
        this.teamArray.forEach(element => {
            totalRank += element.level;
        });
        return totalRank;
    }

    getAverageRank() {
        return Math.round((this.getTotalRank()/this.getPlayerCount())* 10)/10;
    }

    getPlayerCount() {
        return this.teamArray.length;
    }

    getPlayerPositionFromIndex(index) {
        return teamFormats[this.format][index];
    }

    getPlayerPositionByName(name) {
        for (let i = 0; i < this.teamArray.length; i++) {
            if (this.getPlayerNameFromIndex(i) == name) {
                return teamFormats[this.format][i];
            }
        }
        return -1;
    }

    getPlayerNameFromIndex(index) {
        let position = this.getPlayerPositionFromIndex(index);
        return this.positionIndex[position].name;
    }

    getPositionIndexArray(index) {
        return this.positionIndex;
    }

    setByIndex(index, player) {
        this.teamArray[index] = player;
        this.assignPositionsFromArrayIndexes();
    }

    setByPosition(position, player) {
        this.positionIndex[position] = player;
    }

    getByIndex(index) {
        return this.teamArray[index]
    }

    getNameByIndexHTML(index) {
        return "<p>" + this.teamArray[index].name + "</p>";
    }

    assignPositionsFromArrayIndexes() {
        this.positionIndex = new Object;
        for (let i = 0; i < this.teamArray.length; i++) {
            this.positionIndex[teamFormats[this.format][i]] = this.teamArray[i];
        }
    }

    randomizePositions() {

        const reorderedTeam = [];

        if (Math.random() < 0.5) {
            this.teamArray.reverse()
        }
    
        for (let i = 0; i < teamFormats[this.format].length; i++) {
            //randomly pop something
            const ChosenIndex = randomInteger(0, this.teamArray.length-1);
            const ChosenName = this.teamArray[ChosenIndex];
            this.teamArray.splice(ChosenIndex, 1);
            reorderedTeam.push(ChosenName);
        }
        this.teamArray = reorderedTeam;

        this.assignPositionsFromArrayIndexes();
    }

}

class Player {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getLevel() {
        return this.level;
    }

    setLevel(level) {
        this.level = level;
    }

}

/* Returns a team object from an array of names, each bound based on index position.*/
function createTeamRandom(playerArray, format) {
    return new Team(chooseRandomAmountFromArray(playerArray, teamFormats[format].length), format)
}

export {Team, Player, createTeamRandom, teamFormats}