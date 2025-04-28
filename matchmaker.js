import { copyTo } from "./array.js";
import { chooseRandomAmountFromArray, randomBool } from "./rand.js";
import { createTeamRandom, teamFormats, Team } from "./team.js";

class Matchmaker {
    constructor (pool, mode, format) {
        this.team1 = team1;
        this.team2 = team2;
        this.pool = [];
        copyTo(pool, this.pool);
        this.pool.forEach((elt) => {
            elt.level = Math.round(elt.level);
        })
        this.mode = mode;
        this.format = format;
        switch (mode) {
            case 0:
                this.matchmakeRandom();
                break;
            default:
                return;
        }
    }

    matchmakeRandom() {
        console.log("Starting matchmaking...")
        

        if (this.pool.length < teamFormats[this.format].length*2) {
            console.error("Player pool is too small to generate a team");
            return -1;
        }

        if (randomBool()) {
            this.pool.reverse();
        }

        const team1Array = chooseRandomAmountFromArray(this.pool, teamFormats[this.format].length);
        this.team1 = createTeamRandom(team1Array, this.format);
        const team2Array = [];
        
        this.team1.teamArray.forEach(element => {
            let matchedPlayer = 0;
            let k = Math.floor(Math.random()*2);
            let s = 0; //scalar
            //bounce bewteen the ranks looking for the closest player
            for (let j = Math.round(structuredClone(element.level)); j <= 50; k++, s++, k % 2 == 0 ? j += s : j -= s) {
                if (j > 0 && j < 50)  {
                    matchedPlayer = this.selectRandomFromRank(j);
                    if (matchedPlayer != 0) {
                        console.log("Matched player " + matchedPlayer.name + " with " + element.name);
                        console.log("Rank difference: " + Math.abs(Math.round(structuredClone(element.level)) - Math.round(structuredClone(matchedPlayer.level))));
                        team2Array.push(structuredClone(matchedPlayer));
                        break;
                    }
                }
            }
            this.removePlayerFromPool(matchedPlayer.name);
        });
        this.team2 = new Team(team2Array, this.format)
    }

    matchmakeLowRankFirst() {

    }

    matchmakeHighRankFirst() {

    }

    getTeam1() {
        return this.team1;
    }

    getTeam2() {
        return this.team2;
    }

    selectRandomFromRank(rank) {
        const tempPool = [];
        copyTo(this.pool, tempPool);
        for (let i = 0; i < tempPool.length; i++) {
            if (tempPool[i].level != rank) {
                tempPool.splice(i, 1);
                i -= 1;
            }
        }

        if (tempPool.length == 0) {
            return 0;
        }
        return chooseRandomAmountFromArray(tempPool, 1)[0];
    }

    //Select a player from the pool with the lowest rank + or - 1. This does not modify the pool.
    selectLowRankingPlayerRandom(pool = this.pool) {
        let lowest = this.findLowestRankInPool(pool);

        if (randomBool()) {
            lowest += 1;
        }

        //Make sure there's a player with that rank
        let tryAgain = 1;
        while (tryAgain) {
            pool.forEach(element => {
                if (element.level == lowest) {
                    tryAgain = 0;
                }
            });
            if (tryAgain == 1) {
                lowest -= 1;
            }
            if (lowest < 0) {
                console.error("selectLowRankingPlayerRandom: WE SHOULD NOT BE HERE!")
                tryAgain = 0;
            }
        }
        return this.selectRandomFromRank(lowest);
    }

    //Select a player from the pool with the highest rank + or - 1. This does not modify the pool.
    selectHighRankingPlayerRandom(pool = this.pool) {
        //Find the highest rank in the pool
        let highest = this.findHighestRankInPool(pool);
    
        //Randomly subtract a rank
        if (randomBool()) {
            highest -= 1;
        }

        //Make sure there's a player with that rank
        let tryAgain = 1;
        while (tryAgain) {
            pool.forEach(element => {
                if (element.level == highest) {
                    tryAgain = 0;
                }
            });
            if (tryAgain == 1) {
                highest -= 1;
            }
            if (highest < 0) {
                console.error("selectHighRankingPlayerRandom: WE SHOULD NOT BE HERE!")
                tryAgain = 0;
            }
        }
        
        return this.selectRandomFromRank(highest);
    }

    //Remove a player from the pool. Returns 1 if a player was deleted, 0 if not.
    removePlayerFromPool(playerName) {
        let removed = 0;
        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i].name == playerName) {
                this.pool.splice(i, 1);
                removed = 1;
            }
        }
        return removed;
    }

    //Finds the highest rank in the pool. Returns an int, not a player.
    findHighestRankInPool(pool = this.pool) {
        let highest = 0;
        pool.forEach(element => {
            if (element.level > highest) {
                highest = element.level;
            }
        });
        return highest;
    }

    //Finds the lowest rank in the pool. Also returns an int.
    findLowestRankInPool(pool = this.pool) {
        let lowest = 10;
        pool.forEach(element => {
            if (element.level < lowest) {
                lowest = element.level;
            }
        });
        return lowest;
    }

}

export { Matchmaker };
