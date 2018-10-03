const foodList = document.querySelectorAll('.food-item-list');
const adminNav = document.querySelectorAll('.admin-nav-orders');
const popUp = document.querySelector('.pop-up');
const confirm = document.querySelector('.pop-up-open');
const cancel = document.querySelector('.cancel');
const editTitle = document.querySelector('.food-imgcontainer-title');
const baseUrl = 'http://localhost:3002';
const adminContent = document.querySelector('.admin-content');
const orderContainer = document.querySelector('.order-menu-group');
const userProfileContainer = document.querySelector('.userProfileContainer');
const logout = document.querySelector('.logout');
const defaultImage = 'https://res.cloudinary.com/fast-food-fast/image/upload/v1538500928/usersprofileimages/img_avatar_m4xaqf.png';
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
      userImage.setAttribute('src', decoded.imageurl);
      // getUserOrders(decoded);
      return;
    }else {
      return window.location.href = 'signup.html';
    }
  
  }catch {
    return window.location.href = 'signup.html';
  }
}

const getUserOrders = (user) => {
  fetch(`${baseUrl}/api/v1/orders/${user.id}`)
  .then((res) => res.json())
  .then(data => {
    // populateUserInfo(data, user);
  })
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

verifyUsers();
toggleprofileNav();
logoutUsers();