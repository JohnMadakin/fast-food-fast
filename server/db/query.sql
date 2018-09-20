DROP TABLE MENU IF EXISTS;
DROP TABLE ORDERS IF EXISTS;
DROP TABLE USERS IF EXISTS;
CREATE TABLE USERS(
    id SERIAL UNIQUE,
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    phoneNo VARCHAR(11) NOT NULL,
    homeAddress VARCHAR(100),
    deliveryAddress VARCHAR(100),
    imageUrl VARCHAR(100),
    userType VARCHAR(25),
    username VARCHAR(25) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    email VARCHAR (50) NOT NULL UNIQUE,
    date_joined timestamp default now()
);

CREATE TABLE ORDERS(
    id SERIAL UNIQUE,
    userID INT NOT NULL,
    paymentMethod varchar(25),
    orderStatus varchar(25),
    deliveryAddress VARCHAR(100),
    FOREIGN KEY (userID) REFERENCES USERS(id),
    date_created timestamp default  now() 
);

CREATE TABLE ORDERITEMS (
  id SERIAL UNIQUE,
  ordersId INT NOT NULL REFERENCES ORDERS(ID) ON DELETE CASCADE,
  foodID INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (ordersID) REFERENCES ORDERS(id),
  date_created timestamp default  now() 

);

CREATE TABLE FOOD(
    id SERIAL UNIQUE,
    userid INT NOT NULL,
    title TEXT NOT NULL,
    price INT NOT NULL,
    calorie INT,
    description TEXT NOT NULL,
    menu VARCHAR(25),
    imageUrl VARCHAR(100),
    ingredient VARCHAR(50),
    primary key(id),
    FOREIGN KEY (userId) REFERENCES USERS(ID),
    date_created timestamp default now() 
);


