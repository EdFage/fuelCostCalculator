
chrome.runtime.onMessage.addListener( 
        function(message) {

            
            //find the distance divs
            let distanceDivs = document.getElementsByClassName("ivN21e tUEI8e fontBodyMedium");


            //make an array to use later 
            let distanceDivsArray = Array.from(distanceDivs);

            //check that there are no exisitng fuel divs
            let fuelDivs = document.getElementsByClassName("ivN21e tUEI8e fontBodyMedium FuelCost");



            if (fuelDivs.length == 0){
            
               

                //create a new node
                distanceDivsArray.forEach(function(div, index) {

                    
                    // Assuming the div is already present in the DOM
                    var textContent = div.textContent; // "56.6 miles"
                
                    // Use a regular expression to match the first number in the text
                    var matches = textContent.match(/[\d\.]+/);
                
                    // If a match is found, 'matches[0]' will contain the string "56.6"
                    // Convert it to a floating-point number
                    var distance = matches ? parseFloat(matches[0]) : null;
                
                    // Assuming myDiv is your original div with class="ivN21e tUEI8e fontBodyMedium"
                    var clone = div.cloneNode(true); // The 'true' parameter indicates a deep clone (copying all child nodes)
                    clone.className += " FuelCost";
                
                    // Insert the cloned node after the original myDiv in the DOM
                    div.parentNode.insertBefore(clone, div.nextSibling);
                
                    updateTripCostDisplay(distance, clone);
                
                    
                    })

            }            
        }

);

function updateTripCostDisplay(distance, div) {
    calculateTripCost(distance, function(cost) {
        if (div) {
            div.innerHTML = `${cost}`;
        }
    });
}

function calculateTripCost(distance, callback) {
    // Retrieve stored values from chrome.storage.sync
    chrome.storage.sync.get(['efficiency', 'efficiencyUnit', 'fuelPrice', 'priceUnit', 'currency', 'mapUnit', 'costPerKilometre', 'costPerMile'], function(data) {
        let cost;
        // Check the map unit and calculate the cost accordingly
        if (data.mapUnit === 'miles') {
            cost = distance * data.costPerMile;
        } else {
            cost = distance * data.costPerKilometre;
        }
        // Format the cost to two decimal places and include the currency
        const formattedCost = `${data.currency}${cost.toFixed(2)}`;

        // Callback function to use the computed cost
        callback(formattedCost);
    });
}





