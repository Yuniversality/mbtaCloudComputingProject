import MBTA from 'mbta-client';

const mbta = new MBTA("7642597d510e4e7c91b681eb54d1470a");

// Hardcoded beginning stop to be 70020 (Downtown Crossing - Forest Hills)
// Descending is false bc descending would give latest trains first, not soonest
const sortedDeparture = await mbta.fetchPredictions({
  stop: 70020,
  sort: 'departure_time',
  descending: false,
});

// Hardcoded ending stop to be 70010 (Ruggles - Forest Hills)
// Descending is false bc descending would give latest trains first, not soonest
const sortedArrival = await mbta.fetchPredictions({
  stop: 70010,
  sort: 'arrival_time',
  descending: false,
});

// Trip id of the train we're tracking
const tripId = sortedDeparture["data"][0]["relationships"]["trip"]["data"]["id"];
// Departure time of the train we're tracking
const departureTimeString = sortedDeparture["data"][0]["attributes"]["departure_time"];
const departureTimeDate = new Date(departureTimeString);

// console.log("tripId: ", tripId, " and it is of type: ", typeof tripId)
// console.log("Departure time: ", departureTimeString)

let travelTime = 0;
let unit = "";

for (let i in sortedArrival["data"])
{
  // console.log(sortedArrival["data"][i]["relationships"]["trip"]["data"]["id"])
  // console.log(typeof sortedArrival["data"][i]["relationships"]["trip"]["data"]["id"])
  // console.log(sortedArrival["data"])

  //if (sortedArrival["data"][i]["relationships"]["trip"]["data"]["id"] == sortedDeparture["data"][0]["relationships"]["trip"]["id"])
  if (sortedArrival["data"][i]["relationships"]["trip"]["data"]["id"] == tripId)
  {
    
    const arrivalTimeString = sortedArrival["data"][i]["attributes"]["arrival_time"];
    const arrivalTimeDate = new Date(arrivalTimeString);

    // Subtracting 2 dates and formatting to minutes: 
    // https://stackoverflow.com/questions/18023857/compare-2-iso-8601-timestamps-and-output-seconds-minutes-difference
    travelTime = arrivalTimeDate - departureTimeDate;
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
    
    //console.log("Arrival time: ", arrivalTimeString);
    //console.log("We got the same train")
  }
}


console.log("Travel time is: ", travelTime, unit);

/*
  To find direction the user is traveling, we take the starting station
    and ending station names and search for their indexes in this array
    and we subtract the ending station from the starting station index
  If the index > 0 (like from State to Assembly, 8 - 3 = 5), then the 
    user is going in the Oak Grove direction and we use the stop ids
    from the Oak Grove map/dictionary
  If the index < 0 (like from Haymarket to Downtown Crossing, 7 - 9 = -2),
    then the user is going in the Forest Hills direction and we use the
    stop ids from the Forest Hills map/dictionary
*/
const orangeLineStops = [
  "Oak Grove",
  "Malden Center",
  "Wellington",
  "Assembly",
  "Sullivan Square",
  "Community College",
  "North Station",
  "Haymarket",
  "State",
  "Downtown Crossing",
  "Chinatown",
  "Tufts Medical Center",
  "Back Bay",
  "Massachusetts Ave",
  "Ruggles",
  "Roxbury Crossing",
  "Jackson Square",
  "Stony Brook",
  "Green Street",
  "Forest Hills"
];

const orangeLineForestHills = new Map([
  ["Green Street", 70002],
  ["Stony Brook", 70004], 
  ["Jackson Square", 70006],
  ["Roxbury Crossing", 70008],
  ["Ruggles", 70010],
  ["Massachusetts Ave", 70012],
  ["Back Bay", 70012],
  ["Tufts Medical Center", 70016],
  ["Chinatown", 70018],
  ["Downtown Crossing", 70020],
  ["State", 70022],
  ["Haymarket", 70024],
  ["North Station", 70026],
  ["Community College", 70028],
  ["Sullivan Square", 70030],
  ["Wellington", 70032],
  ["Malden Center", 70034],
  ["Assembly", 70278]
]);

/*
  The stop ids going to Oak Grove are 
  stop id + 1 of the Forest Hills ones
*/ 
const orangeLineOakGrove = new Map([
  ["Green Street", 70003],
  ["Stony Brook", 70005], 
  ["Jackson Square", 70007],
  ["Roxbury Crossing", 70009],
  ["Ruggles", 70011],
  ["Massachusetts Ave", 70013],
  ["Back Bay", 70015],
  ["Tufts Medical Center", 70017],
  ["Chinatown", 70019],
  ["Downtown Crossing", 70021],
  ["State", 70023],
  ["Haymarket", 70025],
  ["North Station", 70027],
  ["Community College", 70029],
  ["Sullivan Square", 70031],
  ["Wellington", 70033],
  ["Malden Center", 70035],
  ["Assembly", 70279]
]);
