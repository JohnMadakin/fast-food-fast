const header = document.querySelector('.header');
const sticky = header.offsetTop;
const content =  document.querySelector('.content');
const menuContainer = document.querySelector('.tab-content-container');
const baseUrl = 'http://localhost:3002' || 'https://edafe-fast-food-fast.herokuapp.com';
const waiting = document.querySelector('.spinner');
const cart = document.querySelector('.cart');
const checkout = document.querySelector('.shopping-cart-card');
const deleteItem = document.querySelector('.delete');
const title = document.querySelector('.food-title');
const price = document.querySelector('.price');
const checkoutBtn = document.querySelector('.item-checkout');
const itemsContainer = document.querySelector('.all-items');
const close = document.querySelector('.close-pop-up');
const nav =  document.querySelector('.nav');
const modal = document.getElementById('modal-id');
const openLogin =  document.querySelector('.login-modal');
const popUp =  document.querySelector('.pop-up');

let tax = document.querySelector('.total-tax');
let subTotal = document.querySelector('.sub-total');
let total = document.querySelector('.total-price');
let items = [];
let cartItems;

const initiateCartStorage = () => {
  if (localStorage.orders) {
    return items = JSON.parse(localStorage.orders);
  }
};

const stickyHeader = () => {
  if (window.scrollY > sticky) {
    const height = header.offsetHeight;
    document.querySelector('body').style.paddingTop = `${height}px`;
    header.classList.add("sticky");
    checkout.classList.remove('openCart')
    } else {
    document.querySelector('body').style.paddingTop = `0`;
    header.classList.remove("sticky");
  }
} 

const checkOutOrders = () => {
  checkoutBtn.addEventListener('click',()=>{
    window.location.href = 'checkout.html';
  });
}

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
    const order = document.querySelectorAll('.order-now');
    placeOrder(order, menu)
  })
  .catch((err)=> {
    waiting.style.display = 'none';
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
  <h1 class="order-now" data-price="${menu.price}" data-title="${menu.name}" data-image-src="${menu.imageurl}">add to cart</h1>
  
</div>`;
menuContainer.appendChild(menuCard);
};

const placeOrder = (orders,menu) => {
  orders.forEach((order, i) => {
    order.addEventListener('click', (evt)=> {
      let title = menu[i].name;
      let price = menu[i].price;
      let img = menu[i].imageurl;
      let qty = 1;
      let itemid = menu[i].id;
      const isAdded = items.find((element)=> element.title === title);
      if(!isAdded){
        // order.textContent = 'added';
        items.push({title,price,qty,img,itemid});
        return localStorage.orders = JSON.stringify(items)
      }
      popUp.style.display = 'block';
      return;
    });
  });
  
};

const viewCart = () => {
  cart.addEventListener('click',toggleCart)
}

const toggleCart = (evt) => {
  evt.stopPropagation();
  checkout.classList.toggle('openCart');
  populateCart();
  setQuantity();  
};

const calculateTotal = (orders) => {
  const init = 0;
  const total = orders.reduce((acc, curr) => {
    return (acc + curr.price);
  }, init);
  return total;
}

const setQuantity = () => {
  const quantity = document.querySelectorAll('.quantity');
  quantity.forEach((quan,i)=>{
    quan.addEventListener('change', (e) => {
      const priceView = document.querySelectorAll('.item-price');
      let qty = e.target.value;
      let itemPrice = cartItems[i].price * qty;
      priceView[i].textContent = itemPrice;
      items[i].price = itemPrice;
      items[i].qty = parseInt(qty);
      let subTotalValue = calculateTotal(items);
      subTotal.textContent = subTotalValue.toFixed(2);
      const taxvalue = subTotalValue *0.05;
      tax.textContent = taxvalue.toFixed(2);
      const totalValue = subTotalValue*1 + taxvalue*1;
      total.textContent = totalValue.toFixed(2);
      console.log('all items => ', items)

    });
  });
}

window.onclick = function(event) {
  if (event.target == modal) {
      modal.style.display = "none";
  }
}

const createNode = (element) => {
  return document.createElement(element);
}
const appendNode = (parent,child) => {
  parent.appendChild(child);
}

const populateCart = () => {
  itemsContainer.innerHTML ='';
  checkoutBtn.disabled = false;
  emptyCart();
  let subTotalValue = calculateTotal(items);
  subTotal.textContent = subTotalValue.toFixed(2);
  const taxvalue = subTotalValue *0.05;
  tax.textContent = taxvalue.toFixed(2);
  const totalValue = subTotalValue*1 + taxvalue*1;
  total.textContent = totalValue.toFixed(2);
  items.forEach((item,index)=>{
    const itemView = document.createElement('div');
    itemView.innerHTML = `<div class="item"><img class="cart-image" src="${item.img}">
    <p class="item-title">${item.title}</p>
    <p class="item-price">${item.price}</p>
    <div class="item-footer">
    <div class="qty"><input class="quantity" type="number" min="1" max="50" step="1" value="${item.qty}"></div>
    <div class="delete">
    </div>
    </div>
    </div>`;
    itemsContainer.appendChild(itemView);
    cartItems = JSON.parse(localStorage.orders);
    const deleteItem = document.querySelectorAll('.delete');
    deleteItem.forEach((deItem,i)=>{
      deItem.addEventListener('click',()=> {
        let itemTax = item.price*0.05;
        subTotal.textContent = subTotal.textContent*1 - item.price*1;
        tax.textContent = tax.textContent*1 - itemTax*1;
        total.textContent = subTotal.textContent*1 + tax.textContent*1;
        items.splice(i,1);
        localStorage.orders = JSON.stringify(items)
        itemsContainer.removeChild(itemView);
        const order = document.querySelectorAll('.order-now');
        order[i].textContent = 'add to cart';
        emptyCart();
      });
    });
  });
};

const emptyCart = () => {
  if(items.length < 1){
    itemsContainer.innerHTML ='';
    let noItem = createNode('p');
    noItem.textContent = 'Cart is Empty';
    noItem.className = 'noItems';
    checkoutBtn.disabled = true;
    subTotal.textContent = 0;
    tax.textContent = 0;
    total.textContent = 0;
    appendNode(itemsContainer,noItem);
  }
}

const validateUserText = (string) => {
  if (typeof string !== 'string') return false;
  const validString = /^[0-9a-zA-Z_]+$/;
  return string.trim().match(validString);
};
const validateStringLength = (string) => {
  if (string.length >= 6 && string.length <= 300) {
    return true;
  }
  return false;
};

const closePopUp = () => {
  close.addEventListener('click',()=>{
    popUp.style.display = 'none';
  });
};

const closeCart = () => {
  document.querySelector('.content').onclick = () => checkout.classList.remove('openCart');
};

const login = () =>{
  openLogin.addEventListener('click',()=>{
    modal.style.display='block';
  });
};

const verifyUsers = () => {
  const token = localStorage.getItem('fastfoodUser');
  if (token) {
    nav.innerHTML = '';
    nav.innerHTML = `<div class="user-login nav__item">My Dashboard</div>
    <div class="divider"></div>
    <div class="user-logout nav__item">Logout</div>
`;
    document.querySelector('.user-logout').addEventListener('click', (e) => {
      localStorage.removeItem('fastfoodUser');
      return window.location.href = 'index.html';
    });
    document.querySelector('.user-login').onclick = function (event) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.usertype === 'fastFOODnser_#23') {
          return window.location.href = 'admin.html';
        } else if (decoded.usertype === 'fastf00DuSER_$1') {
          return window.location.href = 'user.html';
        }
      } catch {
        return window.location.href = 'signup.html';
      }

    }
  }
}

verifyUsers();
initiateCartStorage();
populatePage();
viewCart();
closePopUp();
closeCart();
checkOutOrders();
window.onscroll = () => stickyHeader();
