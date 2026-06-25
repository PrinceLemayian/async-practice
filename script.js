'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////

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
  countriesContainer.style.opacity = 1;
};
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

const getCountryData = function (country) {
  fetch(`https://api.restcountries.com/countries/v5/names.common/${country}`, {
    headers: { Authorization: `Bearer ${CONFIG.API_KEY}` },
  })
    .then(response => response.json())
    .then(data => {
      renderCountry(data.data.objects[0]);
      const neighbour = data.data.objects[0].borders[0];

      if (!neighbour) return;

      // Country 2
      return fetch(
        `https://api.restcountries.com/countries/v5/codes.alpha_3/${neighbour}`,
        {
          headers: { Authorization: `Bearer ${CONFIG.API_KEY}` },
        },
      );
    })
    .then(response => response.json())
    .then(data => renderCountry(data.data.objects[0], 'neighbour'));
};

getCountryData('kenya');
