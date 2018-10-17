const search = document.querySelector('.search-food');
const searchBtn = document.querySelector('.search-food-btn');
const searchMessage = document.querySelector('.search-message');
const searchResult = document.querySelector('.search-result');

const searchMenu = () => {
  searchBtn.addEventListener('click', queryMenuDb);
};

const validateFoodName = (string) => {
  if (typeof string !== 'string') return false;
  if (string.length < 2 || string.length > 25) return false;
  const validString = /^[a-zA-Z  -]+$/;
  return string.trim().match(validString);
};

const queryMenuDb = (e) => {
  console.log('--> ', search.value);
  const query = search.value;
  if(!validateFoodName(query)){
    console.log(validateFoodName(query))
    setTimeout(function () {
      searchMessage.textContent = 'Invalid Menu Name';
      searchMessage.style.display = 'block';
    }, 1000);
    return false;
  }
  waiting.style.display = 'block';
  const url = `${baseUrl}/api/v1/search?query=${query}`;
  fetch(url, {
    method: 'GET'
  })
  .then(res => res.json())
  .then((data) => {
    searchResult.innerHTML = '';
    if(data.message === 'No Search Results Found'){
      searchMessage.textContent = 'No Search Result Found';
      searchMessage.style.display = 'block';
      waiting.style.display = 'none';
    }
    if(data.status === 'success'){
      waiting.style.display = 'none';
      searchResult.style.display = 'flex';
      data.data.forEach((menu) => {
        const menuCard = document.createElement('div');
        menuCard.innerHTML = `<div class="card">
          <h1 class="food-title">${menu.name}</h1>
          <div class="space"></div>
          <div class="food-group">
          <img class="food-img" alt="bacon" src="${menu.imageurl}">
          <div class="food-more">
              <h2>Details</h2>
              <ul class="details">
                <li class="price">${menu.price}</li>
                <li class="calorie">${menu.calorie}</li>
                <li class="ingredient">${menu.ingredient}</li>
              </ul>
            </div>
            </div>
          <hr/>
          <p class="food-des">${menu.description}</p>
          <h1 class="order-now" data-price="2250" data-title="${menu.name}" data-image-src="${menu.imageurl}">add to cart</h1>
          
        </div>`;
        searchResult.appendChild(menuCard);
        });
        const myOrders = document.querySelectorAll('.order-now');
        placeOrder(myOrders, data.data);

    }
  })
  .catch((err)=>{
    console.log(err);
  });
}

searchMenu();