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
const loginUser = document.querySelector('.submit');
const message = document.querySelector('.pop-up-message');
const validEmail = document.querySelector('.email');
const waiting = document.querySelector('.waiting');

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
}

const checkValidKeys = key => {
  return key.name && key.value;
};

const validateForm = (formdata) => {
  const formInputs = Object.keys(formdata)
  formInputs.forEach(element => {
    if(formdata[element] === '') {
      popUp.style.display = 'block';
      message.textContent = "field can't be empty";
    }
  })

}

const checkValidEmail = (email) => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = reg.test(String(email).toLowerCase());
  if (!isValid) return false;
  return true;
};



const postForm = (formData, uploadImage) => {
  const url = 'https://api.cloudinary.com/v1_1/fast-food-fast/upload';
  const url2 = `${baseUrl}/api/v1/auth/signup`;
  popUp.style.display = 'block';
  message.textContent = 'please wait... signing you up';
  fetch(url, {
    method: 'POST',
    body: uploadImage,
  })
  .then(res => res.json())
  .then((data)=>{
    if(data.secure_url !== ''){
      formData.imageUrl = data.secure_url;
      return  fetch(url2, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        }
      })
    }
  })
  .then((res)=> res.json())
  .then((data) => {
    if (data.status == 'Success') {
      localStorage.setItem('fastfoodUser',data.token);
      return  window.location.href = 'user.html';
    } else if((data.status !== 'Success')){
      return window.location.href = 'signup.html';
    }
  })
  .catch(err => {
    popUp.style.display = 'none';
  })

};

const submitForm = (e) => {
  e.preventDefault();
  const preset = 'usersprofileimages';
  const formData = convertFormValues(formValues.elements);
  validateForm(formData)
  const imageUrl = image.files[0];
  const uploadImage = new FormData();
  uploadImage.append('file',imageUrl);
  uploadImage.append("upload_preset", preset);
  if(formData.confirmpassword === formData.password) {
    delete formData.confirmpassword;
    return postForm(formData, uploadImage);
  }
};

const closePop = (e) =>{
  popUp.style.display = 'none';
}

const startApp = ()  => {
  checkPasswordEquality();
  checkPwdEquality();
  closePopup.addEventListener('click', closePop);
  submit.addEventListener('click', submitForm);
  validEmail.addEventListener('blur', () => {
    if(!checkValidEmail(validEmail.value)){
      popUp.style.display = 'block';
      message.textContent = 'invalid email format';
    }
  });
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }

}


startApp();