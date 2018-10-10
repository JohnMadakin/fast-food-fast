const foodList = document.querySelectorAll('.food-item-list');
const contentContainer = document.querySelectorAll('.admin-content-food');
const adminNav = document.querySelectorAll('.admin-nav-orders');
const adminContents = document.querySelectorAll('.admin-orders');
const popUp = document.querySelector('.pop-up');
const confirm = document.querySelector('.pop-up-open');
const cancel = document.querySelector('.cancel');
const editTitle = document.querySelector('.food-imgcontainer-title');
const baseUrl =  'https://edafe-fast-food-fast.herokuapp.com';
const adminContent = document.querySelector('.admin-content');
const orderContainer = document.querySelector('.order-menu-group');
const userProfileContainer = document.querySelector('.userProfileContainer');
const logout = document.querySelector('.logout');
const defaultImage = 'https://res.cloudinary.com/fast-food-fast/image/upload/v1538500928/usersprofileimages/img_avatar_m4xaqf.png';
let userId;

const logoutUsers = () => {
  logout.addEventListener('click',(e) => {
    localStorage.removeItem('fastfoodUser');
    return window.location.href = 'index.html';
  });
}

const verifyUsers = () => {
  const token = localStorage.getItem('fastfoodUser');
  try{
    const decoded = jwt_decode(token);
    userId = decoded.id;
    if(decoded) {
      const pageTitle = createNode('h1');
      let imgSrc;
      appendNode(adminContent, pageTitle);
      pageTitle.className = 'dashboard';
      pageTitle.textContent = `Hello ${decoded.firstname}, Welcome to your dashboard`;
      const userImage = createNode('img');
      appendNode(userProfileContainer, userImage);

      userImage.className = 'userProfile';
      if(decoded.imageurl === ""){
        imgSrc = defaultImage;
        userImage.setAttribute('src',imgSrc);
        return;
      }
      userImage.setAttribute('src', decoded.imageurl || decoded.imageUrl );
      return;
    }else {
      return window.location.href = 'signup.html';
    }
  
  }catch {
    return window.location.href = 'signup.html';
  }
}


const createNode = (element) => {
  return document.createElement(element);
}
const appendNode = (parent,child) => {
  parent.appendChild(child);
}

const populateUserInfo = (data, user) => {
  data.forEach((order)=>{
    if (order.orderstatus === 'pending') {
      const paymentStatus = createNode('p');
      appendNode(adminContent, paymentStatus);
      paymentStatus.className = 'payment-status';
    }
  });
  
}

const toggleprofileNav =() =>{
  adminNav.forEach((nav)=>{
    nav.addEventListener('click',setFocus);
  });
  // newFood.addEventListener('click',setFocus);
  return;
}

const login = () =>{
  openLogin.addEventListener('click',()=>{
    modal.style.display='block';
  });
}

const toggleContent =() =>{
  contentContainer.forEach((cont,i)=>{
    cont.style.display = "none";
    adminNav[i].className = adminNav[i].className.replace(" active", " ");
  });
  return;
}

function setFocus (e){
  toggleContent();
  const selectedNav = this.getAttribute('data-nav');
  document.querySelector('.dashboard').style.display = "none";
  document.getElementById(`${selectedNav}`).style.display = "block";
  e.target.className += " active";
}

const loadOrders = () => {
  const token = localStorage.getItem('fastfoodUser');
  const url = `${baseUrl}/api/v1/users/2/orders`;
  fetch(url,  {
    method: 'GET',
    headers: {
      "x-auth": token,
    }
  })
  .then(res => res.json())
  .then((data) => {
    if(data.message === 'order not found'){
      document.querySelector('.admin-title').textContent = `You have No pending Orders`;
      document.querySelector('.order-status').textContent = `You have No confirmed Orders`;
      adminContents.forEach((each)=>{
        each.innerHTML = '';
      });
    }
    if(data.status === 'Success'){
      const userPending = document.querySelector('#user-pending');
      const userConfirm = document.querySelector('#user-confirm');
      data.ordersItem.forEach((order,i) => {
        if(data.ordersInfo[i].orderstatus === 'pending'){
          getOrders(userPending,data.ordersInfo[i],order,i);
        }
        if(data.ordersInfo[i].orderstatus === 'confirmed'){
          getOrders(userConfirm,data.ordersInfo[i],order,i);
        }

      });
    }
  })
  .catch((err)=> {
    console.log(err)
    // waiting.style.display = 'none';
  });
}

const getOrders = (userPanel,ordersInfo,order,i) => {
  const userOrder = document.createElement('div');
  userOrder.innerHTML = `<div class="admin-order">
  <h2 class="order-status">${ordersInfo.orderstatus}</h2>
  
  <div class="order-menu"><h3 class="order-menu-title">Order</h3>
    <div class="admin-arrow"></div>
  </div>
  <div class="order-menu-group">
      <p class="payment-status">Payment Status</p>
      <span >${ordersInfo.paymentmethod}</span>
      <p class="admin-food-list">Food List</p>
      <div class="admin-food-items">
        <ul class='user-food-list'>
        </ul>
      </div>
      <h3 class="order-status confirmed">Home Address:${ordersInfo.deliveryaddress}</h3>  
  </div>
  
</div>`;
userPanel.appendChild(userOrder);
const userFoodList = document.querySelectorAll('.user-food-list');
order.forEach((item )=> {
  const itemList = document.createElement('li');
  itemList.className = 'admin-food-item';
  itemList.innerHTML = `${item.title} <span class="admin-order-qty">${item.quantity}</span>`;
  userFoodList[i].appendChild(itemList);
});

}

verifyUsers();
toggleprofileNav();
logoutUsers();
loadOrders();