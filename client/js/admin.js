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
      const pageTitle = createNode('h1');
      appendNode(adminContent, pageTitle);
      pageTitle.className = 'dashboard';
      pageTitle.textContent = `Hello ${decoded.firstname}, Welcome to your dashboard`;
    } else {
      return window.location.href = 'signup.html';
    }
  } catch(err) {
    return window.location.href = 'signup.html';
  }
};

const createNode = (element) => {
  return document.createElement(element);
};

const appendNode = (parent,child) => {
  parent.appendChild(child);
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

const validateForm = (formdata) => {
  const a = Object.keys(formdata)
  a.forEach(element => {
    if(formdata[element] === '') {
      throw popUpAlert.style.display = 'block';
    }
  })

}

const submitMenu = (e) => {
  e.preventDefault();
  const preset = 'foodimages';
  const formData = convertFormValues(formValues.elements);
  // validateForm(formData)
  const imageUrl = image.files[0];
  const uploadImage = new FormData();
  uploadImage.append('file',imageUrl);
  uploadImage.append("upload_preset", preset);
  postMenu(formData, uploadImage);
  // return popUp.style.display = 'block';
};

const postMenu = (formData, uploadImage) => {
  const url = 'https://api.cloudinary.com/v1_1/fast-food-fast/upload';
  const url2 = `${baseUrl}/api/v1/menu`;
  saving.style.display = 'block';
  fetch(url, {
    method: 'POST',
    body: uploadImage,
  })
    .then(res => res.json())
    .then((data)=>{
      if (data.secure_url !== '') {
        formData.imageUrl = data.secure_url;
        formData.price = parseInt(formData.price);
        formData.calorie = parseInt(formData.calorie);
        delete formData.pic;
        const token = localStorage.getItem('fastfoodUser');
        return  fetch(url2, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            "x-auth": token,
          }
        })
      }
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status == 'Success') {
        createFood.style.display = 'none';
        popUpAlert.style.display = 'block';
        message.textContent = 'Menu added'
      } else if ((data.status == 'failure')) {
        popUpAlert.style.display = 'block';
        message.textContent = 'Invalid Inputs'
      }
    })
    .catch(err => {
      console.log('error => ',err);
    });

}

const saveMenu = () => {
  save.addEventListener('click', submitMenu);
}

saveMenu();
toggleprofileNav();
createNewFood();
verifyUsers();
closePopup.addEventListener('click', closePop);
