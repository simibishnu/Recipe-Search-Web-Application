function getCountryByName(event){
    let countryButton = event.target
    let countryName = countryButton.innerText

    window.location.href = `/getCountry?countryName=${countryName}`

}