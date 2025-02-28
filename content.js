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
            // Get distance and convert it to a number, considering international formats
            var distanceDiv = Array.from(div.children).find(child => {
                // Include χλμ (Greek for km) in the regex
                return /miles|km|χλμ\.?/.test(child.textContent);
            });
    
            // If distanceDiv is found, extract the distance
            if (distanceDiv) {
                var textContent = distanceDiv.textContent
                    .replace('\u00a0', '') // Replace non-breaking spaces
                    .replace(' ', '')      // Replace normal spaces
                    .trim();              // Remove any trailing/leading whitespace
                
                // Enhanced regex to capture numbers with either dots or commas
                var matches = textContent.match(/([\d,\.]+)/);
                var distance = null;
                
                if (matches) {
                    let rawDistance = matches[0];
                    
                    // First, determine the format by looking at the pattern
                    let isEuropeanDecimal = /^\d+,\d{1,2}$/.test(rawDistance); // Matches patterns like "17,2" or "17,20"
                    let hasThousandsSeparator = /^\d{1,3}(,\d{3})+$/.test(rawDistance); // Matches patterns like "1,000" or "1,000,000"

                    if (isEuropeanDecimal) {
                        // Handle European decimal format (e.g., "17,2")
                        rawDistance = rawDistance.replace(',', '.');
                    } else if (hasThousandsSeparator) {
                        // Handle thousands separators (e.g., "1,000")
                        rawDistance = rawDistance.replace(/,/g, '');
                    }
                    
                    distance = parseFloat(rawDistance);
                    console.log(distance);
                    
                    // Verify that we got a valid number
                    if (isNaN(distance)) {
                        console.error('Failed to parse distance from:', textContent);
                        return;
                    }
                }
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

// Rest of the code remains the same
function calculateTripCost(distance, callback) {
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
            if (data.mapUnit === 'miles') {
                cost = distance * data.costPerMile;
            } else {
                cost = distance * data.costPerKilometre;
            }
            const formattedCost = `${data.currency}${cost.toFixed(2)}`;
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