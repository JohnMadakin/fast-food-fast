DROP  TABLE IF EXISTs ORDERITEMS;
DROP  TABLE IF EXISTs MENU;
DROP TABLE IF EXISTs ORDERS;
DROP TABLE IF EXISTs USERS;
CREATE TABLE IF NOT EXISTS USERS(
    id SERIAL UNIQUE,
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    phoneNo VARCHAR(11) NOT NULL UNIQUE,
    deliveryAddress VARCHAR(100),
    imageUrl VARCHAR(300),
    userType VARCHAR(50) NOT NULL,
    username VARCHAR(25) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    email VARCHAR (50) NOT NULL UNIQUE,
    date_joined timestamp default now()
);

CREATE TABLE IF NOT EXISTS ORDERS(
    id SERIAL UNIQUE,
    userid INT NOT NULL,
    paymentMethod varchar(25),
    orderStatus varchar(25),
    deliveryAddress VARCHAR(100),
    total INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES USERS(id),
    date_created timestamp default  now() 
);

CREATE TABLE IF NOT EXISTS MENU(
    id SERIAL UNIQUE,
    userid INT NOT NULL,
    title VARCHAR(25) NOT NULL,
    price INT NOT NULL,
    calorie INT,
    description TEXT NOT NULL,
    imageUrl VARCHAR(300),
    ingredient VARCHAR(50),
    primary key(id),
    FOREIGN KEY (userId) REFERENCES USERS(id),
    date_created timestamp default now() 
);

CREATE TABLE IF NOT EXISTS ORDERITEMS (
  id SERIAL UNIQUE,
  ordersId INT NOT NULL REFERENCES ORDERS(id) ON DELETE CASCADE,
  menuid INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (ordersID) REFERENCES ORDERS(id),
  FOREIGN KEY (menuid) REFERENCES MENU(id),
  date_created timestamp default  now() 

);
