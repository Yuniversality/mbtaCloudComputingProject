import MBTA from 'mbta-client';

// Instantiate MBTA with your API key
const mbta = new MBTA("7642597d510e4e7c91b681eb54d1470a");

/*
    To get other stop ids, uncomment these 2 lines, run
    the file, and pick a stop id from the terminal output
*/
// const stopNames = await mbta.fetchStopsByRoute('Orange');
// console.log(stopNames)


// Hardcoded starting station to Green Street
// Descending is false bc descending would give latest trains first, not soonest
// To try other stop ids, uncomment lines 10 + 11 and read directions above
const sortedDeparture = await mbta.fetchPredictions({
    stop: 'place-grnst',
    sort: 'departure_time',
    descending: false,
});

// Hardcoded ending station to Downtown Crossing
// Descending is false bc descending would give latest trains first, not soonest
// To try other stop ids, uncomment lines 10 + 11 and read directions above
const sortedArrival = await mbta.fetchPredictions({
    stop: 'place-dwnxg',
    sort: 'arrival_time',
    descending: false,
});

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
            // console.log("Leaving train time: ", leavingTimeString);
            let leavingTimeDate = new Date(leavingTimeString);
                let arrivingTimeString = arrivalSorted["data"][y]["attributes"]["arrival_time"];
                // console.log("Arriving train time: ", arrivingTimeString);
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

let travelTime = calculateTravelTime(sortedDeparture, sortedArrival);
if (travelTime[0] > 0 && travelTime[1] != "none")
{
    console.log("We found a train between stations");
    console.log("It will take: ", travelTime[0], travelTime[1]);
}
else
{
    console.log("Could not find a train between stations")
}
