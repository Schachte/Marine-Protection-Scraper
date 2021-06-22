const puppeteer = require("puppeteer")


const countryUrl = "https://www.protectedplanet.net/en/search-areas?search_term=country_term&geo_type=country"
const mpaUrl = "https://www.protectedplanet.net/en/search-areas?filters%5Blocation%5D%5Btype%5D=country&geo_type=site&filters%5Bdb_type%5D%5B%5D=wdpa&filters%5Bis_type%5D%5B%5D=marine&filters%5Blocation%5D%5Boptions%5D%5B%5D=country_term+&filters%5Blocation%5D%5Boptions%5D%5B%5D=country_term"

let countryData = {}

let countriesOfInterest = [
    "Antigua and Barbuda",
    "Bahamas",
    "Barbados",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "Grenada",
    "Haiti",
    "Jamaica",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Trinidad and Tobago",
    "Anguilla (British overseas territory)",
    "British Virgin Islands (British overseas territory)",
    "Cayman Islands (British overseas territory)",
    "Montserrat",
    "Turks and Caicos Islands (British overseas territory)",
    "Aruba (Constituent country in the Kingdom of the Netherlands)",
    "Curaçao (Constituent country in the Kingdom of the Netherlands)",
    "Sint Maarten (Constituent country in the Kingdom of the Netherlands)",
    "Saba (Special municipality of the Netherlands)",
    "Sint Eustatius (Special municipality of the Netherlands)",
    "Saint Barthélemy (Overseas collectivity of France)",
    "Saint Martin (Overseas collectivity of France)",
    "Guadeloupe (French overseas region)",
    "Martinique (French overseas region)",
    "Puerto Rico (U.S. territory)",
    "United States Virgin Islands (U.S. territory)"
]

console.log(countriesOfInterest.length)