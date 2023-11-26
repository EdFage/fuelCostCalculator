chrome.runtime.onMessage.addListener(function (message) {
    //find the distance divs
    let distanceDivs = document.getElementsByClassName(
        'ivN21e tUEI8e fontBodyMedium'
    )

    //make an array to use later
    let distanceDivsArray = Array.from(distanceDivs)

    //check that there are no exisitng fuel divs
    let fuelDivs = document.getElementsByClassName(
        'ivN21e tUEI8e fontBodyMedium FuelCost'
    )

    if (fuelDivs.length == 0) {
        //create a new node for the fuel cost
        distanceDivsArray.forEach(function (div, index) {
            // Get distance
            var textContent = div.textContent
            var matches = textContent.match(/[\d\.]+/)
            var distance = matches ? parseFloat(matches[0]) : null

            // Make a new fuel cost div
            var clone = div.cloneNode(true)
            clone.className += ' FuelCost'

            // Insert the fuel cost div after the original div in the DOM
            div.parentNode.insertBefore(clone, div.nextSibling)

            //Update the new node with the relevant div
            updateTripCostDisplay(distance, clone)
        })
    }
})

function updateTripCostDisplay(distance, div) {
    calculateTripCost(distance, function (cost) {
        if (div) {
            div.innerHTML = `${cost}`
        }
    })
}

function calculateTripCost(distance, callback) {
    // Retrieve stored values from chrome.storage.sync
    chrome.storage.sync.get(
        [
            'efficiency',
            'efficiencyUnit',
            'fuelPrice',
            'priceUnit',
            'currency',
            'mapUnit',
            'costPerKilometre',
            'costPerMile',
        ],
        function (data) {
            let cost
            // Check the map unit and calculate the cost accordingly
            if (data.mapUnit === 'miles') {
                cost = distance * data.costPerMile
            } else {
                cost = distance * data.costPerKilometre
            }
            // Format the cost to two decimal places and include the currency
            const formattedCost = `${data.currency}${cost.toFixed(2)}`

            // Callback function to use the computed cost
            callback(formattedCost)
        }
    )
}
