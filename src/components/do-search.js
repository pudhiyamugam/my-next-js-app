/* 
 * Copyright (c) 2023-25 Zendalona
 * This software is licensed under the GPL-3.0 License.
 * See the LICENSE file in the root directory for more information.
  */
import { keyboardselect } from "@/utils/keydown-helpers.js";

export const geocodingAPI = "https://nominatim.geocoding.ai";
export const headerofNominatim = {
  referrerPolicy: "strict-origin-when-cross-origin",
  headers: {
    "User-Agent": "World-Map-Explorer/1.0",
  },
};
var placeIds = [];

let searchLoadingInterval; // To store the interval globally for cancellation


export function performSearch(inputField, excludedPlaceIds = []) {
  removeResults(); // Clear the previous search results
  //function to search places and show the suggestions
  return new Promise((resolve, reject) => {
    const query = inputField.value.trim();
    const loadingMessage = `<li style="justify-content: center;"><i class="fas fa-circle-notch fa-spin"></i></li>`;

    // Clear results if query length is insufficient
    if (query.length <= 2) {
      removeResults();
      return;
    }

    // Initialize the search results container
    let resultsContainer = initializeResultsContainer(inputField);

    // Display loading indicator
    resultsContainer.innerHTML = loadingMessage;
    searchLoadingInterval && clearInterval(searchLoadingInterval);
    searchLoadingInterval = setInterval(() => {
      notifyLoading();
    }, 2000);

    fetchSearchResults(query, excludedPlaceIds)
      .then((data) => {
        clearInterval(searchLoadingInterval);
        renderSearchResults(data, resultsContainer, inputField, resolve);
      })
      .catch((error) => {
        clearInterval(searchLoadingInterval);
        console.error("Error fetching search results:", error);
        reject(error);
      });
  });
}

// Clears the search results and associated event listeners
function clearSearchResults(searchResults) {
  if (searchResults) {
    searchResults.parentElement?.removeEventListener("keydown", keyboardselect);
    searchResults.remove();
  }
}

// Initializes the search results container
function initializeResultsContainer(inputField) {
  let container = inputField.nextElementSibling;
  if (!container || container.tagName !== "UL") {
    container = document.createElement("ul");
    container.id = "search-results";
    container.tabIndex = 7;
    container.setAttribute("aria-label", "Select your result");
    inputField.parentElement.parentNode.insertBefore(
      container,
      inputField.parentNode.nextSibling
    );
  }
  container.parentElement.addEventListener("keydown", keyboardselect);
  return container;
}

// Fetches search results from the API
function fetchSearchResults(query, excludedPlaceIds) {
  const url = `${geocodingAPI}/search.php?q=${encodeURIComponent(
    query
  )}&format=jsonv2&exclude_place_ids=${encodeURIComponent(excludedPlaceIds)}`;

  return fetch(url,headerofNominatim).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}

// Renders search results in the results container
function renderSearchResults(data, container, inputField, resolve) {
  notifySreenReader("Select from result");
  container.innerHTML = "";

  if (data.length === 0) {
    addNoResultsMessage(container);
    return;
  }

  let currentPlaceIds = data.map((result, index) => {
    const listItem = createResultListItem(result, () => resolve(result));
    container.appendChild(listItem);
    return result.place_id;
  });
  placeIds = placeIds.concat(currentPlaceIds);

  addMoreResultsOption(container, inputField, placeIds, resolve);
}

// Adds a "No Results Found" message
function addNoResultsMessage(container) {
  const noResultsItem = document.createElement("li");
  noResultsItem.textContent = "No results found";
  container.appendChild(noResultsItem);
}

// Adds a "More Results" option
function addMoreResultsOption(container, inputField, placeIds, resolve) {
  const moreResultsItem = document.createElement("li");
  moreResultsItem.textContent = "More results";
  moreResultsItem.tabIndex = 1;
  moreResultsItem.addEventListener("click", () => {
  removeResults();
    performSearch(inputField, placeIds).then(resolve);
    inputField.focus();
    container.scrollTop = 0;
  });
  container.appendChild(moreResultsItem);
}

// Creates a search result list item
function createResultListItem(result, onClick) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <span style="color: grey; display: flex;">${result.type}&nbsp</span>
    ${result.display_name}`;
  listItem.setAttribute("aria-label", result.display_name);
  listItem.tabIndex = 1;
  listItem.addEventListener("click", onClick);
  return listItem;
}

export function removeResults(){
  clearInterval(searchLoadingInterval);
  if(document.getElementById("search-results")){
    document.getElementById("search-results")?.parentElement?.removeEventListener('keydown', keyboardselect)
    document.getElementById("search-results")?.remove();
  }
}
