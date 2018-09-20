const header = document.querySelector('.header');
const sticky = header.offsetTop;
const cart = document.querySelector('.cart');
const checkout = document.querySelector('.shopping-cart-card');
const title = document.querySelector('.food-title');
const price = document.querySelector('.price');
const orders = document.querySelectorAll('.order-now');
const checkoutBtn = document.querySelector('.item-checkout');
const itemsContainer = document.querySelector('.all-items');
const popUp = document.querySelector('.pop-up');
const close = document.querySelector('.close-pop-up');
const deleteItem = document.querySelector('.delete');
const menu =  document.querySelector('.menu');
const nav =  document.querySelector('.nav');
const content =  document.querySelector('.content');
const modal = document.getElementById('modal-id');
const openLogin =  document.querySelector('.login-modal');
const submit = document.querySelector('.submit');

let tax = document.querySelector('.total-tax');
let subTotal = document.querySelector('.sub-total');
let total = document.querySelector('.total-price');
let items = [];

document.addEventListener('DOMContentLoaded', (event) => {
  startApp();
});

const startApp = () =>{
  window.onscroll = () => stickyHeader();
  const path = window.location.pathname;
  if( path.includes('index.html')){
    popUp.onclick = () => popUp.style.display = 'none';
    document.querySelector('.content').onclick = () => checkout.classList.remove('openCart');
    checkOutOrders();
    viewCart();
    orderFood();
    closePopUp();
    login();
    gotoDashboard();
  }
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }
  menuToggle();
  toggleprofileNav();
  return;
}



const gotoDashboard = () => {
  const uname = document.getElementById('uname').value;
  submit.addEventListener('click',(e)=>{
    e.preventDefault();
    console.log(uname.trim() == "admin")
    if(uname.trim() == "admin"){
      return window.location.href = 'admin.html';
    }
   return window.location.href = 'user.html';

  });
}

const login = () =>{
  openLogin.addEventListener('click',()=>{
    modal.style.display='block';
  });
}

const menuToggle = ()=> {
  menu.addEventListener('click', toggleMenu);
  content.addEventListener('click', (e)=> {
      nav.classList.remove('open');
  });
}

const toggleMenu = (evt) => {
  evt.stopPropagation();
  return nav.classList.toggle('open');
}

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

const viewCart = () => {
  cart.addEventListener('click',toggleCart)
}

const toggleCart = (evt) => {
  evt.stopPropagation();
  checkout.classList.toggle('openCart');
  populateCart();
}
const createNode = (element) => {
  return document.createElement(element);
}
const appendNode = (parent,child) => {
  parent.appendChild(child);
}

const orderFood = () => {
  orders.forEach((order)=>{
    order.title = 'Add food to cart';
    order.addEventListener('mouseover',()=>{
      if(order.title == 'added'){
        return order.title = 'Food Added Already';
      }
    });
    
    order.addEventListener('click', (evt)=>{
      let title = order.getAttribute('data-title');
      let price = order.getAttribute('data-price');
      let img = order.getAttribute('data-image-src');
      let qty = 1;
      const isAdded = items.find((element)=> element.title === title);
      if(!isAdded){
        order.title = 'added';
        calculatePrices(price,qty);
        return items.push({title,price,qty,img});
      }
      popUp.style.display = 'block';
      return;
    });
  });
}

const calculatePrices = (price,qty) => {
  subTotal.textContent = (subTotal.textContent*1) + (price*qty);
  tax.textContent = tax.textContent*1 + (price * 0.05);
  total.textContent =  (tax.textContent * 1 + subTotal.textContent * 1);
  return
}

const closePopUp = () => {
  close.addEventListener('click',()=>{
    popUp.style.display = 'none';
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
  console.log(price);
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
      itemsContainer.removeChild(foodItem);
      emptyCart();
    });
  });
}


