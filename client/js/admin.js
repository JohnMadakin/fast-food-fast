const adminNav = document.querySelectorAll('.admin-nav-orders');
const contentContainer = document.querySelectorAll('.admin-content-food');
const newFood = document.querySelector('.new');
const createFood = document.querySelector('#create-id');
const popUp = document.querySelector('.pop-up');
const confirm = document.querySelector('.pop-up-open');
const cancel = document.querySelector('.cancel');
const editTitle = document.querySelector('.food-imgcontainer-title');
const baseUrl = 'https://edafe-fast-food-fast.herokuapp.com';
const adminContent = document.querySelector('.admin-content');
const save = document.querySelector('.submit');
const formValues = document.querySelector('.modal-content');
const image = document.querySelector('.upload-image');
const closePopup = document.querySelector('.close-pop-up');
const popUpAlert = document.querySelector('.pop-up-alert');
const saving = document.querySelector('.saving');
const message = document.querySelector('.pop-up-messages');
const dashboardTitle = document.querySelector('.dashboard');
const cancelbtn = document.querySelector('.cancel-btn');


let isImageUpload = false
let imageLink = '';
const closePop = (e) => {
  popUp.style.display = 'none';
  popUpAlert.style.display = 'none';
};

const createNewFood = () => {
  newFood.addEventListener('click', createNew);
};

const createNew = (evt) => {
  createFood.style.display='block';
};

const verifyUsers = () => {
  try{
    const token = localStorage.getItem('fastfoodUser');
    const decoded = jwt_decode(token);
    if (decoded.usertype === 'fastFOODnser_#23') {
      dashboardTitle.textContent = `Hello ${decoded.firstname}, Welcome to your Admin dashboard`;
    } else {
      return window.location.href = 'signup.html';
    }
  } catch(err) {
    return window.location.href = 'signup.html';
  }
};

function setFocus (e){
  toggleContent();
  const selectedNav = this.getAttribute('data-nav');
  document.querySelector('.dashboard').style.display = "none";
  document.getElementById(`${selectedNav}`).style.display = "block";
  e.target.className += " active";
}


const toggleprofileNav =() =>{
  adminNav.forEach((nav)=>{
    nav.addEventListener('click',setFocus);
  });
  return;
}

const toggleContent =() =>{
  contentContainer.forEach((cont,i)=>{
    cont.style.display = "none";
    adminNav[i].className = adminNav[i].className.replace(" active", " ");
  });
  return;
}

const convertFormValues = (elements) => {
  return [].reduce.call(elements, (data, element) => {
    if (checkValidKeys(element)) {
      data[element.name] = element.value;
    }
    return data;
  }, {})
};

const checkValidKeys = key => {
  return key.name && key.value;
};

const validateNumber = (number) => {
  const validNum = /^[0-9]+$/;
  if (!validNum.test(number)) {
    return false;
  }
  return true;
};

const validateFoodName = (string) => {
  if (typeof string !== 'string') return false;
  if (string.length < 2 || string.length > 25) return false;
  const validString = /^[a-zA-Z  -]+$/;
  return string.trim().match(validString);
};

const validateIngredients = (ingredients) => {
  const validText = /^[0-9a-zA-Z ,]+$/;
  if(ingredients.length > 20){
    return false;
  }
  if (!validText.test(ingredients)) {
    return false;
  }
  return true;
};

const validateText = (text) => {
  const validText = /^[0-9a-zA-Z\s #$&()%;,_@+|?!\.\-]+$/;
  if (text.length >= 10 && text.length <= 150 && !!text.match(validText)) {
    return true;
  }
  return false;
};

function validateForm (formData) {
  const formInputs = Object.keys(formData)
  for(element of formInputs) {
    if(element === 'name' && !validateFoodName(formData[element])) {
      saving.style.display = 'block';
      saving.style.backgroundColor = 'red';
      saving.textContent = `invalid email`;
      return false;
    }
    if(element === 'price' && !validateNumber(formData[element])) {
      saving.style.display = 'block';
      saving.style.backgroundColor = 'red';
      saving.textContent = `invalid price length`;
      return false;
    }
    if(element === 'calorie' && !validateNumber(formData[element])) {
      saving.style.display = 'block';
      saving.style.backgroundColor = 'red';
      saving.textContent = `invalid calorie entered`;
      return false;
    }
    if(element === 'ingredient' && !validateIngredients(formData[element])) {
      saving.style.display = 'block';
      saving.style.backgroundColor = 'red';
      saving.textContent = `please list at most 3 ingrdients`;
      return false;
    }
    if(element === 'description' && !validateText(formData[element])) {
      saving.style.display = 'block';
      saving.style.backgroundColor = 'red';
      saving.textContent = `invalid Description entered`;
      return false;
    }

  }

}
const submitMenu = (e) => {
  e.preventDefault();
  const formData = convertFormValues(formValues.elements);
  formData.imageUrl = imageLink;
  if(validateForm(formData) === false){
    return false;
  }
  return postMenu(formData);
};

const uploadImageToServer = () => {
  const url = 'https://api.cloudinary.com/v1_1/fast-food-fast/upload';
  const preset = 'foodimages';
  image.addEventListener('change', () => {
    const imageUrl = image.files[0];
    const uploadImage = new FormData();
    uploadImage.append('file', imageUrl);
    uploadImage.append("upload_preset", preset);
    console.log(image)
    saving.style.display = 'block';
    saving.style.backgroundColor = 'orange';
    saving.textContent = 'uploading image, please wait';
    fetch(url, {
        method: 'POST',
        body: uploadImage,
      })
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then((data) => {
        console.log(data)
        if (data.secure_url !== '') {
          saving.style.display = 'block';
          saving.style.backgroundColor = 'green';
          saving.textContent = 'image uploaded';
          imageLink = data.secure_url;
          isImageUpload = true;
          return imageLink;
        }
        imageLink = '';
      })
      .catch((err) => {
        saving.style.display = 'block';
        saving.style.backgroundColor = 'red';
        saving.textContent = 'couldnt upload image';
      })
  });
  }

const postMenu = (formData) => {
  const url = `${baseUrl}/api/v1/menu`;
  saving.style.display = 'block';
  saving.style.backgroundColor = "orange";
  saving.textContent = 'please wait, saving menu';
  save.style.pointerEvents = 'none';
  save.style.backgroundColor = 'grey';
  save.textContent = 'Saving...';
  const token = localStorage.getItem('fastfoodUser');
  formData.price = parseInt(formData.price);
  formData.calorie = parseInt(formData.calorie);
  delete formData.pic;
  console.log('-----> ',formData)
  if(imageLink == ''){
    isImageUpload = true;
  }
  if(isImageUpload === true ){
    fetch(url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "x-auth": token,
      }
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status == 'Success') {
        saving.textContent = 'Menu Saved';
        saving.style.backgroundColor = "green";
        save.style.pointerEvents = 'unset';
        save.style.backgroundColor = 'orange';
        save.textContent = 'Save';
        setTimeout(function () {
          createFood.style.display = 'none';
        }, 3000);
        return true;
      } else if ((data.status !== 'Success')) {
        saving.textContent = `${data.message}`;
        saving.style.backgroundColor = "red";
        save.style.pointerEvents = 'unset';
        save.style.backgroundColor = 'orange';
        save.textContent = 'Save';
        return false;
      }
    })
    .catch(err => {
      console.log('error => ',err);
    });
  }
}

const closeMenu = () => {
  console.log('hello')
  createFood.style.display = 'none';
}

const saveMenu = () => {
  formValues.addEventListener('submit', submitMenu);
}
uploadImageToServer();
saveMenu();
toggleprofileNav();
createNewFood();
verifyUsers();
closePopup.addEventListener('click', closePop);
cancelbtn.addEventListener('click', closeMenu);
console.log(cancelbtn)
