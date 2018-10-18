const formValues = document.querySelector('.signup-form');
const submit = document.querySelector('.signup-submit');
const image = document.querySelector('.imageUrl');
const conPwd = document.querySelector('#confirmpwd');
const pwd = document.querySelector('#pwd');
const pwdLabel = document.querySelector('.checkPasswords');
const popUp = document.querySelector('.pop-up');
const closePopup = document.querySelector('.close-pop-up');
const baseUrl = 'https://edafe-fast-food-fast.herokuapp.com';
const openLogin =  document.querySelector('#login-modal');
const modal = document.getElementById('modal-id');
const message = document.querySelector('.pop-up-message');
const validEmail = document.querySelector('.email');
const username = document.querySelector('.username');
const firstname = document.querySelector('.firstname');
const lastname = document.querySelector('.lastname');
const phoneNo = document.querySelector('.phone-no');
const deliveryAd = document.querySelector('.delivery-address');
let imageLink = '';
let isImageUpload = false

const waiting = document.querySelector('.waiting');
const signupnMessage = document.querySelector('.signup-message');
let validated = false;

/** https://code.lengstorf.com/get-form-values-as-json/
 * This function takes in an array of element and converts it to json
 * @param {array} elements 
 */
const convertFormValues = (elements) => {
  return [].reduce.call(elements, (data, element) => {
    if (checkValidKeys(element)) {
      data[element.name] = element.value;
    }
    return data;
  }, {})
};

const login = () =>{
  openLogin.addEventListener('click',()=>{
    modal.style.display='block';
  });
}

const checkPasswordEquality = () => {
  conPwd.addEventListener('keyup', (e) => {
    if (e.target.value !== pwd.value ) {
      return pwdLabel.style.display = 'block';
    }
    return pwdLabel.style.display = 'none';
  });
};

const checkPwdEquality = () => {
  pwd.addEventListener('blur', (e) => {
    if (e.target.value !== conPwd.value ) {
      return pwdLabel.style.display = 'block';
    }
    return pwdLabel.style.display = 'none';
  });
};

const validateText = (text) => {
  const validText = /^[0-9a-zA-Z\s #$&()%;,_@+|?!\.\-]+$/;
  if (text.length >= 10 && text.length <= 150 && !!text.match(validText)) {
    return true;
  }
  return false;
};

const checkValidKeys = key => {
  return key.name && key.value;
};

const validateUserText = (string) => {
  if (typeof string !== 'string') return false;
  if (string.length < 6 || string.length > 20 ) {
    return false;
  }
  const validString = /^[0-9a-zA-Z_]+$/;
  return string.trim().match(validString);
};

 const validatePhoneNo = (phone) => {
  const validPhoneChar = /^[0][7-9][0-9][0-9]\d{7}$/g;
  return phone.trim().match(validPhoneChar);
};

 const validateString = (string) => {
  if (typeof string !== 'string') return false;
  if (string.length < 2 || string.length > 25) return false;
  const validString = /^[a-zA-Z-]+$/;
  return string.trim().match(validString);
};

const checkValidEmail = (email) => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = reg.test(String(email).toLowerCase());
  if (!isValid) return false;
  return true;
};

const uploadImageToServer = () => {
  const url = 'https://api.cloudinary.com/v1_1/fast-food-fast/upload';
  const preset = 'usersprofileimages';
  image.addEventListener('change', () => {
    signupnMessage.style.display = 'block';
    signupnMessage.style.backgroundColor = 'orange';
    signupnMessage.textContent = 'uploading image, please wait';
    submit.disabled = true;
    const imageUrl = image.files[0];
    const uploadImage = new FormData();
    uploadImage.append('file', imageUrl);
    uploadImage.append("upload_preset", preset);
    fetch(url, {
      method: 'POST',
      body: uploadImage,
    })
    .then(res => res.json())
    .then((data)=>{
      if(data.secure_url !== ''){
        submit.disabled = false;
        signupnMessage.style.display = 'block';
        signupnMessage.style.backgroundColor = 'green';
        signupnMessage.textContent = 'image uploaded';
        imageLink = data.secure_url;
        isImageUpload = true;
        return imageLink;
      }
      imageLink = '';
    })
    .catch((err)=>{
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = 'couldnt upload image';
    })
  });
}

const postForm = (formData) => {
  const url = `${baseUrl}/api/v1/auth/signup`;
  console.log('--> ', imageLink);
  if(imageLink == ''){
    isImageUpload = true;
  }
  if(isImageUpload === true ){
    fetch(url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
      .then((data) => {
        if (data.status == 'Success') {
          signupnMessage.style.display = 'block';
          signupnMessage.style.backgroundColor = 'green';
          signupnMessage.textContent = 'Successfully Signed up';
          localStorage.setItem('fastfoodUser', data.token);
          return window.location.href = 'user.html';
        } else if (data.status !== 'Success') {
          signupnMessage.style.display = 'block';
          signupnMessage.style.backgroundColor = 'red';
          signupnMessage.textContent = `${data.message}`;
  
        }
      })
    .catch(err => {
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = 'Couldnt sign you up. Check your network Connection';
  })
  }
 
};

const validateStringLength = (string) => {
  if (string.length >= 6 && string.length <= 300) {
    return true;
  }
  return false;
};

const validateImageUrl = (url) => {
  const reg = /\.(jpe?g|png|)$/i;
  if (reg.test(url)) return true;
  return false;
};

function validateForm (formData) {
  const formInputs = Object.keys(formData)
  for(element of formInputs) {
    if(element === 'email' && !checkValidEmail(formData[element])) {
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = `invalid email`;
      return false;
    }
    if(element === 'password' && !validateStringLength(formData[element])) {
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = `invalid password length`;
      return false;
    }
    if(element === 'username' && !validateUserText(formData[element])) {
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = `invalid username entered`;
      return false;
    }
    if(element === 'firstname' && !validateString(formData[element])) {
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = `invalid firstname entered`;
      return false;
    }
    if(element === 'lastname' && !validateString(formData[element])) {
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = `invalid lastname entered`;
      return false;
    }
    if(element === 'phoneNo' && !validatePhoneNo(formData[element])) {
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = `invalid phone number entered`;
      return false;
    }
    if(element === 'deliveryAddress' && !validateText(formData[element])) {
      signupnMessage.style.display = 'block';
      signupnMessage.style.backgroundColor = 'red';
      signupnMessage.textContent = `invalid address entered`;
      return false;
    }

  }

}

const submitForm = (e) => {
  e.preventDefault();
  signupnMessage.style.display = 'none';
  const formData = convertFormValues(formValues.elements);
  if(formData.confirmpassword !== formData.password){
    signupnMessage.style.display = 'block';
    signupnMessage.style.backgroundColor = 'red';
    signupnMessage.textContent = `passwords do not match`;
    return false;
  }
  delete formData.confirmpassword;
  formData.imageUrl = imageLink;
  if(validateForm(formData) === false){
    return false;
  }
  return postForm(formData);
};

const closePop = (e) =>{
  popUp.style.display = 'none';
};

const verifyUsers = () => {
  const token = localStorage.getItem('fastfoodUser');
  if (token) {
    return window.location.href = 'index.html';
  }
  return true;
};

const startApp = ()  => {
  verifyUsers();
  checkPasswordEquality();
  checkPwdEquality();
  uploadImageToServer();
  closePopup.addEventListener('click', closePop);
  formValues.addEventListener('submit', submitForm);
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }

}

startApp();
