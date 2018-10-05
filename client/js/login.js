const loginUsers = document.querySelector('.submit');

const signIn = () => {
  const url = `${baseUrl}/api/v1/auth/login`;
  loginUsers.addEventListener('click', (e)=> {
    e.preventDefault();
    const username = document.querySelector('#uname').value;
    const password = document.querySelector('#psw').value;
    if (!validateUserText(username)) {
      loginMessage.style.backgroundColor = 'red';
      loginMessage.textContent = `username is invalid`;
      return loginMessage.style.display = 'block';
    }
    if (!validateStringLength(password)) {
      loginMessage.style.backgroundColor = 'red';
      loginMessage.textContent = `password length is too short`;
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
          loginMessage.style.display = 'block';
          loginMessage.style.backgroundColor = 'red';
          return loginMessage.textContent = 'username entered is invalid'
        }
        if(data.message === 'invalid password'){
          loginMessage.style.display = 'block';
          loginMessage.style.backgroundColor = 'red';
          return loginMessage.textContent = 'password entered is invalid'
        }
        if (data.status == 'Success') {
          localStorage.setItem('fastfoodUser',data.token);
          try{
            const decoded = jwt_decode(data.token);
            if(decoded.usertype === 'fastFOODnser_#23') {
              loginMessage.textContent = 'login successful'
              loginMessage.style.display = 'block';
              return  window.location.href = 'admin.html';
            }else if (decoded.usertype === 'fastf00DuSER_$1'){
              loginMessage.style.backgroundColor = 'green';
              loginMessage.textContent = 'login successful'
              loginMessage.style.display = 'block';
              return  window.location.href = 'user.html';
            }
          }catch {
            loginMessage.textContent = 'login fail'
            loginMessage.style.display = 'block';
            loginMessage.style.color = 'red';
            return  window.location.href = 'signup.html';
          }        
        } 
      })
      .catch(err => {
        console.log('error: ',err);
      })
      
    
  });

};

login();
signIn();
