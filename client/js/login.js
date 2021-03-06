const loginUsers = document.querySelector('.submit');
const spinner = document.querySelector('.login-spinner');
const loginMessage = document.querySelector('.login-message');

const signIn = () => {
  const url = `${baseUrl}/api/v1/auth/login`;
  loginUsers.addEventListener('click', (e)=> {
    e.preventDefault();
    spinner.style.display = 'block';
    const username = document.querySelector('#uname').value;
    const password = document.querySelector('#psw').value;
    if (!validateUserText(username)) {
      loginMessage.style.backgroundColor = 'red';
      loginMessage.textContent = `username is invalid`;
      spinner.style.display = 'none';
      return loginMessage.style.display = 'block';
    }
    if (!validateStringLength(password)) {
      loginMessage.style.backgroundColor = 'red';
      loginMessage.textContent = `password length is too short`;
      spinner.style.display = 'none';
      return loginMessage.style.display = 'block';

    }
    loginMessage.style.display = 'none';
    const details = {username,password};
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(details),
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then((res)=> res.json())
      .then((data) => {
        if(data.message === 'invalid username'){
          spinner.style.display = 'none';
          loginMessage.style.display = 'block';
          loginMessage.style.backgroundColor = 'red';
          return loginMessage.textContent = 'username entered is invalid'
        }
        if(data.message === 'invalid password'){
          spinner.style.display = 'none';
          loginMessage.style.display = 'block';
          loginMessage.style.backgroundColor = 'red';
          return loginMessage.textContent = 'password entered is invalid'
        }
        if (data.status == 'Success') {
          spinner.style.display = 'none';
          localStorage.setItem('fastfoodUser',data.token);
          try{
            const decoded = jwt_decode(data.token);
            if(decoded.usertype === 'fastFOODnser_#23') {
              loginMessage.textContent = 'login successful'
              loginMessage.style.display = 'block';
              loginMessage.style.backgroundColor = 'green';
              return  window.location.href = 'admin.html';
            }else if (decoded.usertype === 'fastf00DuSER_$1'){
              loginMessage.style.backgroundColor = 'green';
              loginMessage.textContent = 'login successful'
              loginMessage.style.display = 'block';
              return  window.location.href = 'user.html';
            }
          }catch {
            spinner.style.display = 'none';
            loginMessage.textContent = 'login fail'
            loginMessage.style.display = 'block';
            loginMessage.style.color = 'red';
            return  window.location.href = 'signup.html';
          }        
        } 
      })
      .catch(err => {
        spinner.style.display = 'none';
        loginMessage.textContent = 'Login failed, No Network'
        loginMessage.style.display = 'block';
        loginMessage.style.backgroundColor = 'red';
  })
      
    
  });

};

login();
signIn();
