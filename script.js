'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const BASE_URL = 'https://api.restcountries.com/countries/v5';
const AUTH_OPTIONS = { headers: { Authorization: `Bearer ${CONFIG.API_KEY}` } };

const renderCountry = function (data, className = '') {
  const html = `
<article class="country ${className}">
          <img class="country__img" src="${data.flag.url_png}" />
          <div class="country__data">
            <h3 class="country__name">${data.names.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(1)} Million</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////

//
// const getCountryAndNeighbour = function (country) {
//   // AJAX call country1
//   const request = new XMLHttpRequest();
//
//   request.open(
//     'GET',
//     `https://api.restcountries.com/countries/v5/names.common/${country}`,
//   );
//   request.setRequestHeader('Authorization', `Bearer ${CONFIG.API_KEY}`);
//   request.send();
//
//   request.addEventListener('load', function () {
//     const data = JSON.parse(this.responseText).data.objects[0];
//
//     // Render country 1
//     renderCountry(data);
//
//     // Get neighbour country (2)
//     const [neighbour] = data.borders;
//
//     if (!neighbour) return;
//
//     // AJAX call country 2
//     const request2 = new XMLHttpRequest();
//
//     request2.open(
//       'GET',
//       `https://api.restcountries.com/countries/v5/codes.alpha_3/${neighbour}`,
//     );
//     request2.setRequestHeader('Authorization', `Bearer ${CONFIG.API_KEY}`);
//     request2.send();
//
//     request2.addEventListener('load', function () {
//       const data2 = JSON.parse(this.responseText).data.objects[0];
//
//       renderCountry(data2, 'neighbour');
//     });
//   });
// };
//
// getCountryAndNeighbour('united states');

const getJSON = function (
  url,
  errorMsg = 'Something went wrong',
  options = {},
) {
  return fetch(url, options).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

// const getCountryData = function (country) {
//   fetch(`https://api.restcountries.com/countries/v5/names.common/${country}`, {
//     headers: { Authorization: `Bearer ${CONFIG.API_KEY}` },
//   })
//     .then(response => {
//       if (!response.ok)
//         throw new Error(`Country not found (${response.status})`);
//
//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data.data.objects[0]);
//       const neighbour = data.data.objects[0].borders[0];
//
//       if (!neighbour) return;
//
//       // Country 2
//       return fetch(
//         `https://api.restcountries.com/countries/v5/codes.alpha_3/${neighbour}`,
//         {
//           headers: { Authorization: `Bearer ${CONFIG.API_KEY}` },
//         },
//       );
//     })
//     .then(response => response.json())
//     .then(data => renderCountry(data.data.objects[0], 'neighbour'))
//     .catch(err => {
//       console.error(`${err} ⚠️`);
//       renderError(`Something went wrong ⚠️ ${err.message}. Try again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

const getCountryData = function (country) {
  // Clear container first
  countriesContainer.innerHTML = '';
  countriesContainer.style.opacity = 0;
  // Country 1

  return getJSON(
    `${BASE_URL}/names.common/${country}`,
    'Country not found',
    AUTH_OPTIONS,
  )
    .then(data => {
      const countryData = data.data.objects[0];
      renderCountry(countryData);
      const neighbour = countryData.borders?.[0];

      if (!neighbour) throw new Error(`No neighbour found!`);

      // Country 2
      return getJSON(
        `${BASE_URL}/codes.alpha_3/${neighbour}`,
        'Country not found',
        AUTH_OPTIONS,
      );
    })
    .then(data => {
      const neighbourData = data.data.objects[0];
      renderCountry(neighbourData, 'neighbour');
    })
    .catch(err => {
      console.error(`${err} ⚠️`);
      renderError(`Something went wrong ⚠️ ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
//
// btn.addEventListener('click', function () {
//   btn.disabled = true;
//   getCountryData('kenya').finally(() => (btn.disabled = false));
// });

// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => resolve(position),
    //   (err) => reject(err),

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`,
      );
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Problem with geocoding (${response.status})`);

      return response.json();
    })
    .then(data => {
      const countryName = data.countryName;
      const city = data.city;
      console.log(`You are in ${city}, ${countryName}`);

      return getJSON(
        `${BASE_URL}/names.common/${countryName}`,
        'Country not found',
        AUTH_OPTIONS,
      );
    })
    .then(data => {
      const countryData = data.data.objects[0];
      renderCountry(countryData);
    })
    .catch(err => {
      console.error(`Something went wrong ${err.message}`);
      renderError(`Something went wrong ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', whereAmI);
