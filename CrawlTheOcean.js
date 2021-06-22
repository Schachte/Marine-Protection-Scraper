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
    // "Montserrat",
    "Turks and Caicos Islands (British overseas territory)",
    "Aruba (Constituent country in the Kingdom of the Netherlands)",
    "Curaçao (Constituent country in the Kingdom of the Netherlands)",
    "Sint Maarten (Constituent country in the Kingdom of the Netherlands)",
    // "Saba (Special municipality of the Netherlands)",
    // "Sint Eustatius (Special municipality of the Netherlands)",
    "Saint Barthélemy (Overseas collectivity of France)",
    "Saint Martin (Overseas collectivity of France)",
    "Guadeloupe (French overseas region)",
    "Martinique (French overseas region)",
    "Puerto Rico (U.S. territory)",
    "United States Virgin Islands (U.S. territory)"
]


    const matchRelevantData = (country) => {
        let relevancyFix = country.replace(/\([^\)]*\)/g, '')  
            .match(/(\S+)/g)
            .map((item) => item.trim())
            .filter((item) => item != null)
            .filter((item) => item.trim() != '')
            .join("+");
        return relevancyFix
    }

    const cleanseCountryName = (country) => {
        let lowerCountry = country.toLowerCase();
        return matchRelevantData(lowerCountry)
    }

    const cleanseAndGenerate = (countries, type) => {
        let relevantUrls = []
        for (let country in countries) {
            const currentCountry = cleanseCountryName(countries[country])
            if (type === "country") {
                let cleansedCountry = countryUrl.replace("country_term", currentCountry)
                relevantUrls.push(cleanseCountryName(cleansedCountry))
            } else if (type === "region") {
                let cleansedCountry = mpaUrl.replaceAll("country_term", currentCountry)
                relevantUrls.push(cleanseCountryName(cleansedCountry))
            }
        }
        return relevantUrls
    }

    function extractItems() {
        let data = [];
        let elements = document.getElementsByClassName('card--site');
        for (var element of elements)
            data.push(element.textContent);
        return data
    }

    function parseResultCount() {
        let data = [];
        let elements = document.getElementsByClassName('search__results-bar');
        for (var element of elements){
            data.push(element.innerText.match(/\(([^)]+)\)/)[1])
        }

        return data
    }

    function loadCountryPage() {
        document.getElementsByClassName('card--country')[0].click();
        return []
    }

    function loadCountryPercentData() {
        return document.getElementsByClassName('card__number-large')[1].innerText
    }

    async function scrapeInfiniteScroll(page) {
        return await page.evaluate(parseResultCount)
    }

    async function extractRegionData() {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        page.setViewport({width: 1280, height: 926})
        const regionsUrls = cleanseAndGenerate(countriesOfInterest, "region")

        for (let region in regionsUrls) {
            await page.goto(regionsUrls[region])
            await page.waitForSelector('.card--site');

            const items = await scrapeInfiniteScroll(
                page,
                extractItems
            )
            countryData[countriesOfInterest[region]] = {...countryData[countriesOfInterest[region]], mpaCount: items[0]}
        }
    }

    async function extractCountryData() {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        page.on('console', consoleObj => console.log(consoleObj.text()));
        page.setViewport({width: 1280, height: 926})

        const countriesUrls = cleanseAndGenerate(countriesOfInterest, "country")
        for (let country in countriesUrls) {
            await page.goto(countriesUrls[country])
            await page.waitForSelector('.card--country');
            await page.evaluate(loadCountryPage)
            await page.waitForSelector('.card__number-large');
            const result = await page.evaluate(loadCountryPercentData)
            countryData[countriesOfInterest[country]] = {...countryData[countriesOfInterest[country]], marinePercentCovered: result}
        }
    }

    async function run() {
        await extractRegionData()
        await extractCountryData()
        console.log(countryData)
    }
    run()
