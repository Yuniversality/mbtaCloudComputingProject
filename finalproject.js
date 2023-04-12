import MBTA from 'mbta-client';


const mbta = new MBTA("7642597d510e4e7c91b681eb54d1470a");

// Fetch data, passing filters as options. Filter documentation for
// each function: https://api-v3.mbta.com/docs/swagger/index.html#/
const predictions = await mbta.fetchPredictions({ stop: 70002 });
// console.log(predictions)

// Use an array for filters that accept multiple values
const stops = await mbta.fetchStops({ id: 70004 });
// console.log(stops["data"])

// Some fetch functions accept a `type` or `route_type` filter. This can
// be provided as a string ('bus', 'subway', etc.) or route_type code:
// https://developers.google.com/transit/gtfs/reference/routes-file
// The filter must be valid for the MBTA endpoint, or the request will fail.
// E.g. `fetchRoutes` uses `type`, but `fetchPredictions` uses `route_type`.
const subwayRoutes = await mbta.fetchRoutes({ type: 'subway' });
// console.log(subwayRoutes["data"])

// Filter by `direction_id` to only get results going in one direction.
// `direction_id` maps to the index of the route's `direction_names`.
// Example: Red line `direction_names` are `['South', 'North']`.
// Include `direction_id: 1` in options for Northbound results.
const north = await mbta.fetchPredictions({ route: 'Red', direction_id: 1 });
// console.log(north["data"][0]["relationships"])

// Get results based on `latitude`/`longitude`, and optional `radius`.
const local = await mbta.fetchStops({ route_type: 1});
// console.log(local["data"])

// Sort by `arrival_time`, `departure_time`, etc. See MBTA docs for each
// endpoint's sort options. `descending: true` will reverse sort order.
const sorted = await mbta.fetchPredictions({
  stop: 42,
  sort: 'arrival_time',
  descending: true,
});
const pred = await mbta.fetchPredictions({ stop: 70003, sort: "arrival_time", descending: false})
// console.log(pred["data"][0])
// const stime = pred["data"][0]["attributes"]["departure_time"]
// console.log(stime)
const e = await mbta.fetchPredictions({trip: pred["data"][0]["relationships"]["trip"]["data"]["id"]})
// console.log(e)
console.log(e["data"])

// console.log(sorted["data"][0]["relationships"])

// Alerts have a number of extra filters. See MBTA docs for best practices.
const alerts = await mbta.fetchAlerts({
  sort: 'cause',
  activity: 'BOARD',
  datetime: 'NOW',
  severity: [2, 3],
});

const start = "Oak Grove"
// const test = await mbta.fetchStops({route_type: 1})
// for (let i = 0; i < test["data"].length; i++) {
//     if (test["data"][i]["attributes"]["name"] == start){
//         console.log(test["data"][i]["attributes"])
//         break
//     }
// }

// const pred = await mbta.fetchPredictions({trip: [56494372, 56494374]})
// console.log(pred["data"][0])
// console.log(test["data"][3]["attributes"])
// const test2 = await mbta.fetchStopsByName({name: "ForestHills"})
// console.log(test2)
// start = await mbta.fetchStopsByName()
