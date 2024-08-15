chrome.runtime.onMessage.addListener(function (message) {
    // Find the distance divs
    let distanceDivs = document.getElementsByClassName('ivN21e tUEI8e fontBodyMedium');

    // Convert to array to use later
    let distanceDivsArray = Array.from(distanceDivs);

    // Check that there are no existing fuel divs
    let fuelDivs = document.getElementsByClassName('ivN21e tUEI8e fontBodyMedium FuelCost');

    if (fuelDivs.length == 0) {
        // Create a new node for the fuel cost
        distanceDivsArray.forEach(function (div) {
            // Get distance and convert it to a number, considering commas for thousands
            var distanceDiv = Array.from(div.children).find(child => {
                return /miles|km/.test(child.textContent);
            });
    
            // If distanceDiv is found, extract the distance
            if (distanceDiv) {
                var textContent = distanceDiv.textContent.replace(',', '');
                var matches = textContent.match(/[\d\.]+/);
                var distance = matches ? parseFloat(matches[0]) : null;
            } 

            if (distance !== null) {
                // Make a new fuel cost div
                var clone = div.cloneNode(true);
                clone.className += ' FuelCost';

                // Insert the fuel cost div after the original div in the DOM
                div.parentNode.insertBefore(clone, div.nextSibling);

                // Update the new node with the relevant div
                updateTripCostDisplay(distance, clone);
            }
        });
    }
});

function calculateTripCost(distance, callback) {
    // Retrieve stored values from chrome.storage.sync
    chrome.storage.sync.get([
        'efficiency',
        'efficiencyUnit',
        'fuelPrice',
        'priceUnit',
        'currency',
        'mapUnit',
        'costPerKilometre',
        'costPerMile',
    ], function (data) {
        if (data.costPerKilometre && data.costPerMile && data.currency) {
            let cost;
            // Check the map unit and calculate the cost accordingly
            if (data.mapUnit === 'miles') {
                cost = distance * data.costPerMile;
            } else { // Assuming the default is kilometers
                cost = distance * data.costPerKilometre;
            }
            // Format the cost to two decimal places and include the currency
            const formattedCost = `${data.currency}${cost.toFixed(2)}`;

            // Callback function to use the computed cost
            callback(formattedCost);
        } else {
            const divInfo = "Please input vehicle data in the extension popup to calculate fuel cost";
            callback(divInfo);
        }
    });
}

function updateTripCostDisplay(distance, div) {
    calculateTripCost(distance, function (cost) {
        if (div) {
            div.innerHTML = `Fuel Cost: ${cost}`;
        }
    });
}
