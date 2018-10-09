const header = document.querySelector('.header');
const sticky = header.offsetTop;
const menuContainer = document.querySelector('.tab-content-container');
const baseUrl = 'https://edafe-fast-food-fast.herokuapp.com';
// const loginMessage = document.querySelector('.login-message');
const waiting = document.querySelector('.spinner');
const cart = document.querySelector('.cart');
const checkout = document.querySelector('.shopping-cart-card');
const deleteItem = document.querySelector('.delete');
const title = document.querySelector('.food-title');
const price = document.querySelector('.price');
const checkoutBtn = document.querySelector('.item-checkout');
const itemsContainer = document.querySelector('.all-items');
const content =  document.querySelector('.content');
const close = document.querySelector('.close-pop-up');
const nav =  document.querySelector('.nav');
const modal = document.getElementById('modal-id');
const openLogin =  document.querySelector('.login-modal');


let tax = document.querySelector('.total-tax');
let subTotal = document.querySelector('.sub-total');
let total = document.querySelector('.total-price');
let cartItems = 0;
let items = [];

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
    console.log(err)
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
  <h1 class="order-now" data-price="2250" data-title="${menu.name}" data-image-src="${menu.imageurl}">add to cart</h1>
  
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
        order.textContent = 'added';
        cartItems = cartItems + 1;
        calculatePrices(price,qty);
        items.push({title,price,qty,img,itemid});
        return localStorage.orders = JSON.stringify(items)
      }
      popUp.style.display = 'block';
      return;
    });
  });
  
};

const calculatePrices = (price,qty) => {
  subTotal.textContent = (subTotal.textContent*1) + (price*qty);
  tax.textContent = tax.textContent*1 + (price * 0.05);
  total.textContent =  (tax.textContent * 1 + subTotal.textContent * 1);
  return
}

const viewCart = () => {
  cart.addEventListener('click',toggleCart)
}

const toggleCart = (evt) => {
  evt.stopPropagation();
  checkout.classList.toggle('openCart');
  populateCart();
};

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
  items.forEach((item,i)=>{
    let {foodItem,itemImage,itemPrice,itemTitle} = getItem();
    let {itemQty,plus,minus,deleteItem,foodItemFooter} =getItemFooter();
    itemImage.setAttribute('src',`${item.img}`);
    itemPrice.textContent = item.price;
    itemTitle.textContent = item.title;
    itemQty.textContent = item.qty;
    appendNode(itemsContainer,foodItem);
    appendNode(foodItem,itemImage);
    appendNode(foodItem,itemTitle);
    appendNode(foodItem,itemPrice);
    appendNode(foodItem,foodItemFooter);
    appendNode(foodItemFooter,minus);
    appendNode(foodItemFooter,itemQty);
    appendNode(foodItemFooter,plus);
    appendNode(foodItemFooter,deleteItem);
    adjustQty(minus,plus,item.qty,itemQty,itemPrice,i,item);
    
    deleteItem.addEventListener('click',()=> {
      let itemTax = item.price*0.05;
      subTotal.textContent = subTotal.textContent*1 - item.price*1;
      tax.textContent = tax.textContent*1 - itemTax*1;
      total.textContent = subTotal.textContent*1 + tax.textContent*1;
      items.splice(i,1);
      localStorage.orders = JSON.stringify(items)
      itemsContainer.removeChild(foodItem);
      emptyCart();
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
    // document.querySelector('.cart-arrow').style.left = ``;
  }
}

const adjustAllPrices = (price, value,index,item,adjustment) => {
  if (adjustment === true) {
    items.splice(index,1,{
      title:item.title,
      price,
      qty:value,
      img:item.img,
    });
    subTotal.textContent = price * 1;
    tax.textContent =  (price * 0.05);
    total.textContent = (tax.textContent * 1 + subTotal.textContent * 1);
    return
  }
  items.splice(index,1,{
    title:item.title,
    price,
    qty:value,
    img:item.img,
  });
  subTotal.textContent =  price * 1;
  tax.textContent =  (price * 0.05);
  total.textContent = (tax.textContent * 1 + subTotal.textContent * 1);
  return;
}

const increaseQty = (value,price,index,item) => {
  value = value + 1;
  price = value*price;
  adjustAllPrices(price,value,index,item,true);
  return {value,price};
}
const decreaseQty = (value,price,index,item) => {
  value = value - 1;
  price = value*price;
  adjustAllPrices(price,value,index,item,false);
  return {value,price};
}

const adjustQty = (minus,plus,qty,itemQty,itemPrice,index,item) =>{
  let price = itemPrice.textContent;
  let currentPrice = price;
  minus.addEventListener('click',(e)=>{
    if(qty < 2) return itemQty.textContent = qty;
    let previousPrice = price;
    let qtyItem = decreaseQty(qty,currentPrice,index,item);
    qty =  qtyItem.value;
    // price = currentPrice*qty;
    itemQty.textContent = qtyItem.value;
    itemPrice.textContent = qtyItem.price;
  });
  plus.addEventListener('click',(e)=>{
    let previousPrice = price;
    let qtyItem = increaseQty(qty,currentPrice,index,item);
    qty =  qtyItem.value;
    // price = currentPrice*qty;
    itemQty.textContent = qtyItem.value;
    itemPrice.textContent = qtyItem.price;
  });
}

const getItemFooter = () => {
  let foodItemFooter = createNode('div');
  let plus = createNode('div');
  let minus = createNode('div');
  let itemQty = createNode('p');
  let deleteItem = createNode('div');
  plus.className = 'plus';
  minus.className= 'minus';
  itemQty.className = 'item-qty';
  deleteItem.className = 'delete';
  foodItemFooter.className = 'item-footer';
  return {
    plus,
    minus,
    itemQty,
    deleteItem,
    foodItemFooter
  }
}
const getItem = () => {
  let foodItem = createNode('div');
  let itemImage = createNode('img');
  let itemTitle = createNode('p');
  let itemPrice = createNode('p');
  foodItem.className = 'item';
  itemImage.className = 'cart-image';
  itemTitle.className = 'item-title';
  itemPrice.className = 'item-price';

  return {
    foodItem,
    itemImage,
    itemPrice,
    itemTitle,
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

const menuToggle = ()=> {
  const menu =  document.querySelector('.menu');
  menu.addEventListener('click', toggleMenu);
  content.addEventListener('click', (e)=> {
      nav.classList.remove('open');
  });
}

const toggleMenu = (evt) => {
  evt.stopPropagation();
  return nav.classList.toggle('open');
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
    document.querySelector('.login-modal').innerHTML= 'Go to your Dashboard';
    document.querySelector('.login-modal').onclick = function(event) {
      document.getElementById('modal-id').style.display='none'
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
menuToggle();
closePopUp();
closeCart();
checkOutOrders();
window.onscroll = () => stickyHeader();
