const adminNav = document.querySelectorAll('.admin-nav-orders');
const contentContainer = document.querySelectorAll('.admin-content-food');
// const newFood = document.querySelector('.admin-new-food');

const toggleprofileNav =() =>{
  adminNav.forEach((nav)=>{
    nav.addEventListener('click',setFocus);
  });
  // newFood.addEventListener('click',setFocus);
  return;
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

toggleprofileNav();
