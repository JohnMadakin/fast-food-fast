const foodTabContent = document.querySelectorAll('.tab-content');
const tabLinks = document.querySelectorAll('.food-tablinks');

function toggleFoodTabNav(evt) {
  toggleContents();
  const selectedTab = this.getAttribute('data-foodtabs');
  document.getElementById(`${selectedTab}`).style.display = "block";
    evt.currentTarget.className += " active";
}

const toggleContents = () => {
  foodTabContent.forEach((content,i)=>{
    content.style.display = 'none';
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }) 
  return;
}

const foodTabs = () => {
  tabLinks.forEach((tab)=>{
    tab.addEventListener('click',toggleFoodTabNav);
  });
  return;
}
foodTabs();
