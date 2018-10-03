const adminNav = document.querySelectorAll('.admin-nav-orders');
const contentContainer = document.querySelectorAll('.admin-content-food');
const newFood = document.querySelector('.new');
const confirm = document.querySelector('.pop-up-open');
const cancel = document.querySelector('.cancel');
const editTitle = document.querySelector('.food-imgcontainer-title');
const baseUrl = 'http://localhost:3002';
const adminContent = document.querySelector('.admin-content');
const save = document.querySelector('.submit');
const formValues = document.querySelector('.modal-content');
const image = document.querySelector('.upload-image');
const closePopup = document.querySelector('.close-pop-up');
const popUpAlert = document.querySelector('.pop-up-alert');

const closePop = (e) =>{
  popUp.style.display = 'none';
}

const verifyUsers = () => {
  try{
    const token = localStorage.getItem('fastfoodUser');
    const decoded = jwt_decode(token);
    console.log('decoded- ----> ', decoded)
    if (decoded.usertype === 'fastFOODnser_#23') {
      const pageTitle = createNode('h1');
      appendNode(adminContent, pageTitle);
      pageTitle.className = 'dashboard';
      pageTitle.textContent = `Hello ${decoded.firstname}, Welcome to your dashboard`;
      getUserOrders(decoded);
    } else {
      return window.location.href = 'signup.html';
    }
  }catch{
    return window.location.href = 'signup.html';
  }
  
}