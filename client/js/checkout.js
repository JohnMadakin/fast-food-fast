const allitems = document.querySelector('.all-items');
const sub = document.querySelector('.sub-total');
const tax = document.querySelector(' .total-tax');
const deliveryCost = document.querySelector('.delivery-cost');
const totalCost = document.querySelector(' .total-price');
const itemCheckout = document.querySelector('.item-checkout');
const errorMessage = document.querySelector('.error-message');
const message = document.querySelector('.pop-up-message');
const popUp = document.querySelector('.pop-up');
const closePop = document.querySelector('.close-pop-up');
const waiting = document.querySelector('.waiting');

let total = 0;
const baseUrl = 'https://edafe-fast-food-fast.herokuapp.com';
let items = [];
let status = 'pending';
let deliveryAddress = '';
let payment = 'payondelivery';
let cartItems;


const verifyUsers = () => {
  const token = localStorage.getItem('fastfoodUser');
  const decoded = jwt_decode(token);
  try {
    if (decoded.usertype === 'fastf00DuSER_$1') {
      if (localStorage.orders) {
        items = JSON.parse(localStorage.orders);
      }
      deliveryAddress = decoded.address;
      total = calculateTotal(items);
      console.log(items)
      items.forEach(item => {
        const itemsContainer = document.createElement('div');
        itemsContainer.innerHTML = `<div class="item checkout-item">
        <img class="checkout-cart-image" src="${item.img}" />
        <p class="item-title checkout-item-title">${item.title}</p>
        <div class="checkout-qty"><input class="quantity" type="number" min="1" max="50" step="1" value="${item.qty}"></div>
        <div class="group-price-delete">
            <p class="checkout-item-price">${item.price}</p>
        </div>
    </div>`;
        allitems.appendChild(itemsContainer);
      });
    } else {
      return window.location.href = 'signup.html';
    }
  } catch (err) {
    return window.location.href = 'signup.html';
  }
};

const calculateTotal = (orders) => {
    const init = 0;
    const total = orders.reduce((acc, curr) => {
      return (acc + curr.price);
    }, init);
    return total;
};

const setQuantity = () => {
  const quantity = document.querySelectorAll('.quantity');
  quantity.forEach((quan,i)=>{
    quan.addEventListener('change', (e) => {
      const priceView = document.querySelectorAll('.checkout-item-price');
      let qty = e.target.value;
      console.log(qty)
      let itemPrice = items[i].itemPrice * qty;
      console.log('-->', itemPrice)
      priceView[i].textContent = itemPrice;
      items[i].price = itemPrice;
      items[i].qty = parseInt(qty);
      let subTotalValue = calculateTotal(items);
      sub.textContent = subTotalValue.toFixed(2);
      const taxvalue = subTotalValue *0.05;
      tax.textContent = taxvalue.toFixed(2);
      const totalValue = subTotalValue*1 + taxvalue*1;
      totalCost.textContent = totalValue.toFixed(2);
      console.log('all items => ', items)

    });
  });
}

const displayAmount = () => {
  sub.textContent = total.toFixed(2);
  tax.textContent = (total * 0.05).toFixed(2);
  totalCost.textContent = (total*0.05 + total*1).toFixed(2);
};

const placeOrder = (items) => {
  const url = `${baseUrl}/api/v1/orders`;
  const customerOrder = items.map((item) => {
    delete item.price;
    delete item.title;
    delete item.img;
    item.quantity = item.qty;
    delete item.qty;
    delete item.itemPrice;
  });
  let orders = [...items];
  const myOrder = {
    orders,
    status,
    payment,
    deliveryAddress,
  };
  const token = localStorage.getItem('fastfoodUser');
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(myOrder),
    headers: {
      "Content-Type": "application/json",
      "x-auth": token,
    }
  })
  .then((res)=> res.json())
  .then((data) => {
    if(data.status = 'Success'){
      let empty = [];
      allitems.innerHTML = '';
      sub.textContent = 0;
      tax.textContent = 0;
      totalCost.textContent = 0;
      localStorage.orders = JSON.stringify(empty)
      message.textContent = 'Order Successfully Placed';
      waiting.style.display = 'none';
      return popUp.style.display = 'block';
    }
    message.textContent = `${status.message}`;
    return popUp.style.display = 'block';
  })
  .catch((err) => {
    console.log('error ',err)
  });
};

const orderItems = () => {
  itemCheckout.addEventListener('click', (e) => {
    placeOrder(items);
  });
};

const closePopUAlert = () => {
  closePop.addEventListener('click', () => {
    popUp.style.display = 'none';
  });
};

window.onclick = function(event) {
  popUp.style.display = "none";
}

verifyUsers();
setQuantity();
orderItems();
displayAmount();
closePopUAlert();