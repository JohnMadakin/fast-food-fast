const menuToggle = (content,nav)=> {
  const menu =  document.querySelector('.menu');
  menu.addEventListener('click', toggleMenu);
  content.addEventListener('click', (e)=> {
      nav.classList.remove('open');
  });
}

const toggleMenu = (evt) => {
  evt.stopPropagation();
  const nav =  document.querySelector('.nav');
  return nav.classList.toggle('open');
};

if(window.location.pathname.includes('user.html') || window.location.pathname.includes('signup.html') || window.location.pathname.includes('admin.html') ){
  const content =  document.querySelector('.content');
  const nav =  document.querySelector('.nav');
  menuToggle(content,nav);
}

if(window.location.pathname.includes('index.html')){
  menuToggle(content,nav);
}
