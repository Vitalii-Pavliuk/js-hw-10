import { fetchCountries } from "./fetchCountries";
import debounce from "lodash.debounce";
import Notiflix from "notiflix";

const refs = {
  searchInput: document.querySelector("#search-box"),
  countryList: document.querySelector(".country-list"),
  countryInfo: document.querySelector(".country-info"),
};

refs.searchInput.addEventListener("input", debounce(onInput, 300));

let inputValue = "";

function onInput(event) {
  inputValue = event.target.value.trim();

  if (!inputValue) {
    clearCountryList();
    clearCountryInfo();
    return;
  }

  fetchCountries(inputValue)
    .then((data) => {
      if (data.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
      }

      if (data.length >= 2 && data.length <= 10) {
        clearCountryList();
        clearCountryInfo();
        refs.countryList.insertAdjacentHTML("beforeend", createCountryList(data));
      }

      if (data.length === 1) {
        clearCountryList();
        clearCountryInfo();
        refs.countryInfo.insertAdjacentHTML("beforeend", createCountryCard(data));
      }

      if (data.status === 404) {
        Notiflix.Notify.failure(`Oops, there is no country with that name`)
      }
    })
    .catch((error) => {
      Notiflix.Notify.failure("Oops, something went wrong. Try again later.");
      console.error("Error:", error);
    });
}

const createCountryCard = (data) => {
  return data.map(({ name, capital, languages, population, flags }) => {
    return `
      <img src="${flags.png}" alt="${name.official}" width="45" height="45"/>
      <h3 class="country-title">${name.official}</h3>
      <p class="country-text"><span class="country-text-title">Country capital:</span> ${capital}</p>
      <p class="country-text"><span class="country-text-title">Population:</span> ${population}</p>
      <p class="country-text"><span class="country-text-title">Languages:</span> ${Object.values(languages)}</p>
    `;
  }).join("");
};

const createCountryList = (data) => {
  return data.map(({ name, flags }) => {
    return `
      <li class="country-list-item">
        <img src="${flags.png}" alt="${name.official}" width="40" height="40"/>
        <p class="list-country-text">${name.official}</p>
      </li>
    `;
  }).join("");
};

function clearCountryList() {
  refs.countryList.innerHTML = "";
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = "";
}
