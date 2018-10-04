const menuContainer = document.querySelector('.tab-content-container');
const baseUrl = 'https://edafe-fast-food-fast.herokuapp.com';
const loginUsers = document.querySelector('.submit');
const loginMessage = document.querySelector('.login-message');
const waiting = document.querySelector('.spinner');

const populatePage = () => {
  const url = `${baseUrl}/api/v1/menu`;
  fetch(url)
  .then(res => res.json())
  .then((data) => {
    const { menu } = data;
    waiting.style.display = 'none';
    menu.forEach((eachMenu) => {
      generateFoodCards(eachMenu);
    });
  })
  .catch((err)=> {
    console.log(err)
  });
}

const generateFoodCards = (menu) => {
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
menuContainer.appendChild(menuCard);

};

const signIn = () => {
  const url = `${baseUrl}/api/v1/auth/login`;
  loginUsers.addEventListener('click', (e)=> {
    e.preventDefault();
    const username = document.querySelector('#uname').value;
    const password = document.querySelector('#psw').value;
    const details = {username,password};
    if (username && password) {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(details),
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then((res)=> res.json())
      .then((data) => {
        if(data.message === 'invalid username'){
          loginMessage.style.display = 'block';
          loginMessage.style.color = 'red';
          return loginMessage.textContent = 'invalid username'
        }
        if (data.status == 'Success') {
          localStorage.setItem('fastfoodUser',data.token);
          try{
            const decoded = jwt_decode(data.token);
            if(decoded.usertype === 'fastFOODnser_#23') {
              loginMessage.textContent = 'login successful'
              loginMessage.style.display = 'block';
              return  window.location.href = 'admin.html';
            }else if (decoded.usertype === 'fastf00DuSER_$1'){
              loginMessage.textContent = 'login successful'
              loginMessage.style.display = 'block';
              return  window.location.href = 'user.html';
            }
          }catch {
            loginMessage.textContent = 'login fail'
            loginMessage.style.display = 'block';
            loginMessage.style.color = 'red';
            return  window.location.href = 'signup.html';
          }        
        } 
      })
      .catch(err => {
        console.log('error: ',err);
      })
      
    }
  });

};

signIn();
populatePage();
