import MBTA from '/mbta-client';

document.getElementById('testButton').addEventListener('click', travelTime('Red', 'Davis','Park Street'));

// Instantiate MBTA with your API key
const mbta = new MBTA("7642597d510e4e7c91b681eb54d1470a");
/*
    To get other stop ids, uncomment these 2 lines, run
    the file, and pick a stop id from the terminal output
*/
// const stopNames = await mbta.fetchStopsByRoute('Orange');
// console.log(stopNames)

async function getStopIds(mbtaLine, startingStation, endingStation)
{
    const stopNames = await mbta.fetchStopsByRoute(mbtaLine);
    let startingStationId = "";
    let endingStationId = "";

    for (let stop in stopNames)
    {
        if (stopNames[stop]["name"] == startingStation)
        {
            startingStationId = stopNames[stop]["id"];
        }
        else if (stopNames[stop]["name"] == endingStation)
        {
            endingStationId = stopNames[stop]["id"];
        }
        if ((startingStationId != "") && (endingStationId != ""))
        {
            break;
        }
    }
    console.log("Starting station id: ", startingStationId);
    console.log("Ending station id: ", endingStationId);
    return [startingStationId, endingStationId];
}

// getPredictedSchedules("Red", "Quincy Center", "Alewife");
async function getPredictedSchedules(stopIds)
{
    // stopIds[0] = startingStationId, stopIds[1] = endingStationId
    const sortedDeparture = await mbta.fetchPredictions({
        stop: stopIds[0],
        sort: 'departure_time',
        descending: false,
    });
    const sortedArrival = await mbta.fetchPredictions({
        stop: stopIds[1],
        sort: 'arrival_time',
        descending: false,
    });
    return [sortedDeparture, sortedArrival];
}

function calculateTravelTime(departureSorted, arrivalSorted)
{
    let travelTime = 0;
    let unit = "";

    for (let x in departureSorted["data"])
    {
        //console.log(departureSorted["data"][x]["attributes"]["departure_time"]);
        for (let y in arrivalSorted["data"])
        {
            let leavingTrainId = departureSorted["data"][x]["relationships"]["trip"]["data"]["id"];
            let arrivingTrainId = arrivalSorted["data"][y]["relationships"]["trip"]["data"]["id"];
            if (leavingTrainId == arrivingTrainId)
            {
            // console.log("Leaving train id: ", leavingTrainId);
            // console.log("Arriving train id: ", arrivingTrainId);
            let leavingTimeString = departureSorted["data"][x]["attributes"]["departure_time"];
            console.log("Leaving train time: ", leavingTimeString);
            let leavingTimeDate = new Date(leavingTimeString);
                let arrivingTimeString = arrivalSorted["data"][y]["attributes"]["arrival_time"];
                console.log("Arriving train time: ", arrivingTimeString);
                let arrivingTimeDate = new Date(arrivingTimeString);

                // Subtracting 2 dates and formatting to minutes: 
                // https://stackoverflow.com/questions/18023857/compare-2-iso-8601-timestamps-and-output-seconds-minutes-difference
                travelTime = arrivingTimeDate - leavingTimeDate;
                if (travelTime > 60000)
                {
                    travelTime = Math.floor(travelTime / 60000);
                    unit = " minute(s)";
                }
                else
                {
                    travelTime = Math.floor(travelTime / 1000);
                    unit = " second(s)";
                }
                return [travelTime, unit];
            }
        }
    }
    return [-1, "none"];
}

// Because of the logic of the API, it doesn't give you the departure time from
// a terminal station
//findTravelTime("Red", "Quincy Center", "Shawmut");
travelTime("Red", "Porter", "Alewife");
export async function travelTime(mbtaLine, startingStation, endingStation)
{
    //let mbtaLine = document.getElementById("").value;
    //let startingStation = document.getElementById("").value;
    //let endingStation = document.getElementById("").value;

    const stopIds = await getStopIds(mbtaLine, startingStation, endingStation);
    const sortedTimes = await getPredictedSchedules(stopIds);
    let timeTraveled = calculateTravelTime(sortedTimes[0], sortedTimes[1]);
    // travelTime[0] is a number, convert to string
    timeTraveled[0] = timeTraveled[0].toString();
    console.log("It will take: ", timeTraveled[0], timeTraveled[1]);
    return timeTraveled;
    document.getElementById("").textContent = "It will take: ", travelTime[0], travelTime[1];
}
