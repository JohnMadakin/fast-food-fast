const allitems = document.querySelector('.all-items');

const verifyUsers = () => {
  const token = localStorage.getItem('fastfoodUser');
  const decoded = jwt_decode(token);
  console.log(token,decoded)

  try {
    if (decoded.usertype === 'fastf00DuSER_$1') {
      const items = localStorage.getItem('checkoutItems');
      console.log(items)
      items.forEach(item => {
        const itemsContainer = document.createElement('div');
        itemsContainer.innerHTML = `<div class="item checkout-item">
        <img class="checkout-cart-image" src="./images/wafflesfries.jpg" />
        <p class="item-title checkout-item-title">Waffle fries</p>
        <div class="minus checkout-minus"></div>
        <p class="item-qty checkout-item-qty">1</p>
        <div class="plus checkout-plus"></div>
        <div class="group-price-delete">
            <p class="checkout-item-price">N1250</p>
            <div class="delete checkout-delete" title="delete item"></div>
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

verifyUsers();