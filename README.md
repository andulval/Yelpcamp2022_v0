# Yelpcamp2022
[Link to the website](https://yelpcamp2022-v0.vercel.app/)

## 👨🏻‍💻 About the project
YelpCamp is a full-stack responsive website. Users can create and review campgrounds with geocoding. In order to review or create a campground, you must have an account. 
The project is an extension of the web application made during web dev bootcamp course by Colt Steele on the Udemy platform. 
This project is being created using Node.js, Express, MongoDB, and Bootstrap. Passport.js is used to handle authentication.

## 🚀 Functionalities
>Everyone can view the camps and reviews without signing up or logging in.

>The user will have to login to add or edit the campground details or any comments.

>The user can only edit/delete the campgrounds and comments that they have added.

>All the data will be persistent and is stored in the mongoDB.

## 🚀 Technologies Used:
>HTML5 - markup language for creating web pages and web applications

>CSS3 - used for describing the presentation of a document written in a markup language

>Bootstrap - free and open-source front-end web framework for designing websites and web applications quickly

>DOM Manipulation - is a platform and language-neutral interface that allows programs and scripts to dynamically access and update the content, structure, and style of a document

>Node.js - pen-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side

>Express.js - for building web applications and APIs and connecting middleware

>REST - REST (REpresentational State Transfer) is an architectural style for developing web services

>MongoDB - open-source cross-platform document-oriented NoSQL database program to store details like users info, campgrounds info and comments

>PassportJS - authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application

>Data Associations - associating user data with the respective campgrounds and comments using reference method

>Vercel - cloud platform as a service used as a web application deployment model

## 🖼️ Screenshots
>HomePage
![home](https://res.cloudinary.com/ddlzbo6ut/image/upload/v1684538052/github%20screenshots/yelpcamp_0_o7vgyv.png)

>All Campgrounds
![All campgrounds](https://res.cloudinary.com/ddlzbo6ut/image/upload/v1684538043/github%20screenshots/yelpcamp_1_dvc1gw.png)

->Single Campground ShowPage
![showPage](https://res.cloudinary.com/ddlzbo6ut/image/upload/v1684538026/github%20screenshots/yelpcamp2_dkpmt2.png)

->Login & Register page

![login](https://res.cloudinary.com/ddlzbo6ut/image/upload/v1684537992/github%20screenshots/yelpcamp3_n5mift.png)

![register](https://res.cloudinary.com/ddlzbo6ut/image/upload/v1684537997/github%20screenshots/yelpcamp4_tddn3n.png)

->Create new campground

![login](https://res.cloudinary.com/ddlzbo6ut/image/upload/v1684587204/github%20screenshots/yelpcamp5_cfzm71.png)


## 💻 Getting started

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)


**Clone the project and access the folder**

```bash
$ git clone https://github.com/francianepovoa/crwn-clothing.git

$ cd crwn-clothing

```

**Follow the steps below**

```bash
# Install the dependencies
$ yarn

# Run the web app
$ yarn dev
```

## 💻 Backend Technologies

Technologies that I used to develop this backend app
### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [nodemon](https://nodemon.io/)
- [Express](https://expressjs.com/)
- [body-parser](https://github.com/expressjs/body-parser)
- [dotenv](https://github.com/motdotla/dotenv)

## Set your firebase config

Remember to replace the `config` variable in your `firebase.utils.js `with your own config object from the firebase dashboard! Navigate to the project settings and scroll down to the config code. Copy the object in the code and replace the variable in your cloned code.

![enter image description here](https://camo.githubusercontent.com/4ed8b6a189ef7358611a7301b8b5fc41f8b5ac8a02ffda9b0f72cd725015b914/68747470733a2f2f692e6962622e636f2f3679774d6b42662f53637265656e2d53686f742d323031392d30372d30312d61742d31312d33352d30322d414d2e706e67)

## Set your stripe publishable key


Set the `publishableKey` variable in the `stripe-button.component.jsx` with your own publishable key from the stripe dashboard.

![enter image description here](https://camo.githubusercontent.com/fb711e324a7e95a935e5db8ca73549c48e4fc3f8cd1a31ad893a8f18f72bd23e/68747470733a2f2f692e6962622e636f2f646a51546d56462f53637265656e2d53686f742d323031392d30372d30312d61742d322d31382d35302d414d2e706e67)

## 🤔 How to contribute 

**Follow the steps below**

```bash
# Clone your fork
$ git clone https://github.com/francianepovoa/crwn-clothing.git

$ cd crwn-clothing

# Create a branch with your feature
$ git checkout -b your-feature

# Make the commit with your changes
$ git commit -m 'feat: Your new feature'

# Send the code to your remote branch
$ git push origin your-feature
```

After your pull request is merged, you can delete your branch

## 📝 Project License

This project is under the MIT license.
