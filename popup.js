//Things to do once popup has loaded
document.addEventListener('DOMContentLoaded', function () {
    var efficiencyInput = document.getElementById('efficiency')
    var efficiencyUnitSelect = document.getElementById('efficiencyUnit')
    var fuelPriceInput = document.getElementById('fuelPrice')
    var priceUnitSelect = document.getElementById('priceUnit')
    var currencySelect = document.getElementById('currency')
    var mapUnitSelect = document.getElementById('mapUnit')
    var saveButton = document.getElementById('saveButton')


    // Fetch and pre-fill the form with previously saved values
    chrome.storage.sync.get(
        [
            'efficiencyInputted',
            'efficiencyUnit',
            'fuelPrice',
            'priceUnit',
            'currency',
            'mapUnit',
            'costPerKilometre',
            'costPerMile',
        ],
        function (items) {
            if (items.efficiencyInputted) {
                efficiencyInput.value = items.efficiencyInputted
            }
            if (items.efficiencyUnit) {
                efficiencyUnitSelect.value = items.efficiencyUnit
            }
            if (items.fuelPrice) {
                fuelPriceInput.value = items.fuelPrice
            }
            if (items.priceUnit) {
                priceUnitSelect.value = items.priceUnit
            }
            if (items.currency) {
                currencySelect.value = items.currency
            }
            if (items.mapUnit) {
                mapUnitSelect.value = items.mapUnit
            }
        }
    )

    // Do the conversions 
    saveButton.addEventListener('click', function () {
        var efficiencyInputted = parseFloat(document.getElementById('efficiency').value)
        var efficiencyUnit = document.getElementById('efficiencyUnit').value
        var fuelPrice = parseFloat(document.getElementById('fuelPrice').value)
        var priceUnit = document.getElementById('priceUnit').value
        var currency = document.getElementById('currency').value
        var mapUnit = document.getElementById('mapUnit').value

        var costPerMile, costPerKilometre

        // Conversion factors
        const mpgUsToKpl = 0.425144
        const mpgUkToKpl = 0.354006
        const literToUSGallon = 3.785411784
        const literToUKGallon = 4.54609
        const mileToKilometre = 1.609344

        // Convert efficiency to KPL
        if (efficiencyUnit === 'mpg_us') {
            efficiency = efficiencyInputted * mpgUsToKpl
        } else if (efficiencyUnit === 'mpg_uk') {
            efficiency = efficiencyInputted * mpgUkToKpl
        } else if (efficiencyUnit === 'l_per_100_km'){
            efficiency = 100 / efficiencyInputted; // Converting L/100 km to KPL
        }
        else {
            efficiency = efficiencyInputted
        }
        // efficiency is now in KPL

        // Convert fuel price to price per liter
        var fuelPricePerliter
        if (priceUnit === 'us_gallon') {
            fuelPricePerliter = fuelPrice / literToUSGallon
        } else if (priceUnit === 'uk_gallon') {
            fuelPricePerliter = fuelPrice / literToUKGallon
        }
        else {
            fuelPricePerliter = fuelPrice
        }
        // Fuel price is now per liter

        // Calculate cost per kilometre and cost per mile
        costPerKilometre = fuelPricePerliter / efficiency
        costPerMile = costPerKilometre * mileToKilometre

        // Save settings and computed costs as floats
        chrome.storage.sync.set(
            {
                efficiency: efficiency,
                efficiencyInputted: efficiencyInputted,
                efficiencyUnit: efficiencyUnit,
                fuelPrice: fuelPrice,
                priceUnit: priceUnit,
                currency: currency,
                mapUnit: mapUnit,
                costPerKilometre: costPerKilometre.toFixed(6),
                costPerMile: costPerMile.toFixed(6),
            },
            function () {
                //maybe delete
            }
        )
        // Display the "Saved" message
        saveMessage.textContent = 'Saved! Refresh Google Maps to see changes'
        saveMessage.style.display = 'inline'

        // Hide the message after 2 seconds (2000 milliseconds)
        setTimeout(function () {
            saveMessage.style.display = 'none'
        }, 5000)
    })
})
