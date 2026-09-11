import { loadAPIFixData } from "./fix-handlers.js";
loadAPIFixData(6)
    .catch(err => console.error(err))
    .then(data => console.log(data));
// updateAPIUsage(4)
//     .catch(err => console.error(err))
//     .then(data => console.log(data));
