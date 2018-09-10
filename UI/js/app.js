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
let items = [];

document.addEventListener('DOMContentLoaded', (event) => {
    startApp();
});

const startApp = () =>{
  window.onscroll = () => stickyHeader();
  // window.onclick = () => popUp.style.display = 'none';
  viewCart();
  orderFood();
  closePopUp();
  return;
}
const stickyHeader = () => {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
} 

const getQuantity = () => {
  qty.className = 'qty';
  qty.type = 'textbox';
  qty.addEventListener('change',(evt)=>{
    return evt.target.value;
  });
  return 1;
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
    order.addEventListener('mouseover',()=>{
      if(order.title == 'added'){
        return order.title = 'Food Added Already';
      }
      order.title = 'Add food to cart';
    });
    
    order.addEventListener('click', (evt)=>{
      let title = order.getAttribute('data-title');
      let price = order.getAttribute('data-price');
      let img = order.getAttribute('data-image-src');
      const isAdded = items.find((element)=> element.title === title);
      if(!isAdded){
        order.title = 'added';
        return items.push({title,price,img});
      }
      popUp.style.display = 'block';
      return;
    });
  });
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

const increaseQty = (value) => {
  return value + 1;
}
const decreaseQty = (value) => {
  return value - 1;
}

const adjustQty = (minus,plus,qty,itemQty) =>{
  minus.addEventListener('click',(e)=>{
    if(qty < 2) return itemQty.textContent = qty;
    qty = decreaseQty(qty);
    itemQty.textContent = qty;
  });
  plus.addEventListener('click',(e)=>{
    qty = increaseQty(qty);
    itemQty.textContent = qty;
  });
}
const populateCart = () => {
  itemsContainer.innerHTML ='';
  checkoutBtn.disabled = false;

  if(items.length < 1){
    itemsContainer.innerHTML ='';
    let noItem = createNode('p');
    noItem.textContent = 'Cart is Empty';
    noItem.className = 'noItems';
    checkoutBtn.disabled = true;
    appendNode(itemsContainer,noItem);
  }
  items.forEach((item,i)=>{
    let qty = 1;
    let {foodItem,itemImage,itemPrice,itemTitle} = getItem();
    let {itemQty,plus,minus,deleteItem,foodItemFooter} =getItemFooter();
    itemImage.setAttribute('src',`${item.img}`);
    itemPrice.textContent = item.price;
    itemTitle.textContent = item.title;
    itemQty.textContent = qty;
    appendNode(itemsContainer,foodItem);
    appendNode(foodItem,itemImage);
    appendNode(foodItem,itemTitle);
    appendNode(foodItem,itemPrice);
    appendNode(foodItem,foodItemFooter);
    appendNode(foodItemFooter,minus);
    appendNode(foodItemFooter,itemQty);
    appendNode(foodItemFooter,plus);
    appendNode(foodItemFooter,deleteItem);
    adjustQty(minus,plus,qty,itemQty);
    deleteItem.addEventListener('click',()=>{
      items.splice(i,1);
      itemsContainer.removeChild(foodItem);
    });
  });
}

