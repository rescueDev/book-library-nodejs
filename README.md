# BookShop WebSite

Simple replica of bookshop website.

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)


## General info: 

### Admin add or edit books and authors.

### After signup and/or login, User can add books to his cart and order them.

### Show order after payment simulation (still in progress...).


## Technologies

Project is created with:

- Node: 10.19 
- Bootstrap: 4
- Express: 4.17.1
- NoSQL DB: MongoDB
- Mongoose: 5.12.12

## Setup

### Clone the repo

```
git clone https://github.com/sa-borgia3/book-library-nodejs.git


### install node_modules folder

```
npm install
```

### create an .env file and put inside your MongoDB Atlas credentials and save it: 

```
DB_USER=YOUR_MONGO_USERNAME
DB_PASS=YOUR_MONGO_PASSWORD

```

### start node server 

```
npm start

```

### open your browser and visit localhost:3000