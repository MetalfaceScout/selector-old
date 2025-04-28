

const CENTER_ID_LIST = {
    "stg" : 17,
    "llt" : 10,
}

class Fetcher {
    constructor () {

        fetch("./csv/stg.csv")
        .then(response => response.text())
        .then(text => {
            this.parsed_csv = CSVJSON.csv2json(text, {parseNumbers: true});
            this.loaded = true;
            console.log("Fetched " + this.parsed_csv.length + " players from lfstats csv.");
        })
    }

    isReady() {
        if (this.loaded) {
            return true
        }
        return false
    }

    getAvgMVPfromName(name) {
        let stats = this.parsed_csv.filter(
            function(data) {
                return data.Name == name
            }
        );
        if (stats[0]) {
            return stats[0]["Avg MVP"]
        }
        return -1;
    }

    setRanksFromPool(pool) {
        pool.forEach(element => {
            let avgMvp = this.getAvgMVPfromName(element.name);
            if (avgMvp != -1) {
                element.level = avgMvp;
            }
        });
    }
}

export {Fetcher}