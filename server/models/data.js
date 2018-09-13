import config from '../config/config';

let ordersData = [
  {
    id: 1,
    userId: 1,
    title: 'bacon cheeseburger',
    decription: `This burger tastes like an actual bacon cheeseburger made with beef and bacon, and that's why it's good. `,
    price: 1250,
    ingredient: ['beef', 'cheese', 'bacon'],
    calorie: 440,
    payment: 'payment on delivery',
    status: 'accepted',
    imageUrl: `${config.origin}/bacon-cheesburger.jpg`
  },
  {
    id: 2,
    userId: 4,
    title: 'Double Double',
    decription: `There's one small change that can take the Double-Double from “best burger ever” `,
    price: 1550,
    ingredient: ['beef', 'vegetables', 'bacon'],
    calorie: 550,
    payment: 'Bank Transfer',
    status: 'pending',
    imageUrl: `${config.origin}/double-double.jpg` 
  },

];
let usersData = [];

export default {
  ordersData,
  usersData,
};
