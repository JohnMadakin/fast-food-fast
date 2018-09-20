const adminNav = document.querySelectorAll('.admin-nav-orders');
const contentContainer = document.querySelectorAll('.admin-content-food');
const newFood = document.querySelector('.new');
const createFood = document.querySelector('#create-id');
const editFoods = document.querySelectorAll('.edit');
const editFoodForm = document.querySelector('.edit-food-content');
const deleteItem = document.querySelectorAll('.delete-item');
const foodList = document.querySelectorAll('.food-item-list');
const popUp = document.querySelector('.pop-up');
const confirm = document.querySelector('.pop-up-open');
const cancel = document.querySelector('.cancel');
const editTitle = document.querySelector('.food-imgcontainer-title');



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

const createNewFood = () => {
  newFood.addEventListener('click', createNew);
};
const editAllFoods = () => {
  editFoods.forEach((eachFood)=> {
    eachFood.addEventListener('click', editFood);
  }); 
};

const editFood = (evt) => {
  // console.log(evt.target.parentNode.children)
  let values = evt.target.parentNode.children;
  for(let i = 0; i< values.length; i++){
    if(values[i].className === 'food-item-title'){
      editFoodForm.children.title.value = values[i].textContent;
      editTitle.textContent = `Edit ${values[i].textContent}`;
    }
    if(values[i].className === 'food-item-cal'){
      editFoodForm.children.calorie.value = values[i].textContent;
    }
    if(values[i].className === 'food-item-ing'){
      editFoodForm.children.ingredient.value = values[i].textContent;
    }
    if(values[i].className === 'food-price'){
      editFoodForm.children.price.value = values[i].textContent;
    }
    if(values[i].className === 'food-description'){
      editFoodForm.children.description.value = values[i].textContent;
    }
    createFood.style.display='block';

  }
 
}
const createNew = (evt) => {
  createFood.style.display='block';
};

const closeModal = () => {
  window.onclick = function(event) {
    if (event.target == createFood) {
        createFood.style.display = "none";
    }
  }
}

const deleteFood = () => {
  for(let i = 0; i < deleteItem.length; i++){
    deleteItem[i].addEventListener('click',(evt) => {
      popUp.style.display = 'block';
      confirm.addEventListener('click',()=>{
        foodList[i].remove();
        popUp.style.display = 'none';
        return;
      });
      cancel.addEventListener('click',()=>{
        popUp.style.display = 'none';
        return;
      })
     
    });
  }
}

toggleprofileNav();
createNewFood();
closeModal();
editAllFoods();

deleteFood();