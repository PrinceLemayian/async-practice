'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////
const getCountryData = function (country) {
  const request = new XMLHttpRequest();

  request.open(
    'GET',
    `https://api.restcountries.com/countries/v5/names.common/${country}`,
  );
  request.setRequestHeader('Authorization', `Bearer ${CONFIG.API_KEY}`);
  request.send();

  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText).data.objects[0];
    console.log(data);

    const html = `
<article class="country">
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
  });
};

getCountryData('portugal');
getCountryData('united states');
getCountryData('kenya');
