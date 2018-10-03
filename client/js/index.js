const menuContainer = document.querySelector('.tab-content-container');
const baseUrl = 'http://localhost:3002';

const populatePage = () => {
  const url = `${baseUrl}/api/v1/menu`;
  fetch(url)
  .then(res => res.json())
  .then((data) => {
    console.log(data)
    const { menu } = data;
    menu.forEach((eachMenu) => {
      generateFoodCards(eachMenu);
    });
  })
  .catch((err)=> {
    console.log(err)
  });
}

const generateFoodCards = (menu) => {
  console.log(menuContainer);
  const card = createNode('div');
  const title = createNode('h1');
  const foodGroup = createNode('div');
  const foodImg = createNode('img');
  const foodMore = createNode('div');
  const details = createNode('h2');
  const otherDetails = createNode('ul');
  const price = createNode('li');
  const calorie = createNode('li');
  const ingredient = createNode('li');
  const line = createNode('hr');
  const foodDescription = createNode('p');
  const orderButton = createNode('h1');
  const space = createNode('div');
  appendNode(menuContainer, card);
  appendNode(card, title);
  appendNode(card, space);
  appendNode(card, foodGroup);
  appendNode(foodGroup, foodImg);
  appendNode(foodGroup, foodMore);
  appendNode(foodMore, details);
  appendNode(foodMore, otherDetails);
  appendNode(otherDetails, price);
  appendNode(otherDetails, calorie);
  appendNode(otherDetails, ingredient);
  appendNode(card, line);
  appendNode(card, foodDescription);
  appendNode(card, orderButton);
  card.className = 'card';
  title.className = 'food-title';
  foodImg.className = 'food-img';
  foodMore.className = 'food-more';
  foodGroup.className = 'food-group';
  details.className = 'details';
  price.className = 'price';
  space.className = 'space';
  calorie.className = 'calorie';
  ingredient.className = 'ingredient';
  orderButton.className = 'order-now';
  foodDescription.className = 'food-des';
  title.textContent = menu.name;
  price.textContent = menu.price;
  calorie.textContent = menu.calorie;
  foodDescription.textContent = menu.description;
  ingredient.textContent = menu.ingredient;
  foodImg.setAttribute('src', `${menu.imageurl}`);
  orderButton.textContent = 'add to cart';
  details.textContent = 'Details';

}

populatePage();
