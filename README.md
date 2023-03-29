## MovieMatch

Welcome, this is our assigmenent for our school project called: `project tech`. For this project we're going to make a application where all of our feature's are included in this common application. Take a look our [WIKI](https://github.com/Alexiatech/Tech-D-groepsopdracht/wiki) for more information! (written in `Dutch`). 

MovieMatch is a web application designed to help you discover movies. However, if you're unsure of what to watch, we have a feature that allows you to find movies that match your preferences. By answering a few questions, our algorithm will generate personalized recommendations to help you find movies that fit your mood. 

## Team TECH-D

Our team exists of 5 members from the TEC1 class. I would recommend you to read into our personal application's first before you will look at our common applicaiton. You'll be able to find our personal application behind our name's. 

1. `Alexia` feature: Register/login 
* [APPLICATION: Wish games](https://github.com/Alexiatech/Tech23)
> Managen van de github.
2. `Thijmen` feature: Liking (saving) 
* [APPLICATION: Anime Smarty](https://github.com/MrSmarto/BLOKTECH23)
> Managen van de github.
3. `Youri` feature: Filtering
* [APPLICATION: Kalender](https://github.com/YouriSaen/ProjectTech/)
4. `Lynn` feature: Create a profile 
* [APPLICATION: Pixeljobs](https://github.com/lynnwolters/matching-application)
5. `Lars` feature: Filtering 
* [APPLICATION: Fooduo](https://github.com/larsvv99/Project-Tech)

## ![concept](https://user-images.githubusercontent.com/118122875/224569879-7b376629-fc7b-401a-81b5-9f5e5917521d.png) Het concept

`MovieMatch is an application where users are easily matched to their favorite movies. There is a fun feature that, based on your input, matches you with the movies that best fit your preferences. You can save these movies to your favorite movies list.

## ![install](https://user-images.githubusercontent.com/118122875/224570019-3d6ab194-d3ef-458e-b9b6-d66a5cf39809.png) How to install

### Pre-installation:

Before you install the `MovieMates`, make sure to install:

### [Git](https://github.com/git-guides/install-git)
* First type `git install` in your terminal
* Type `git --version` the check if node is installed correctly
### [node.js](https://nodejs.org/en/)
* First type `node install` in your terminal
* Type `node --version` the check if node is installed correctly
> You'll recieve the what type of version you installed like:`v18.8.0` 
### [MongoDB](https://www.mongodb.com/blog)
`AANPASSEN ZODRA WE EEN DATABASE STRUCTUUR HEBBEN`
* Before you can start MovieMates you'll need to create a database with multiple collections. I use [MongoDB](https://www.mongodb.com/blog) to save up the data (information) for this application. Follow the steps underneath, you can also follow this [tutorial](https://www.mongodb.com/docs/atlas/getting-started/):
1. Create a cluster, i would recommend you to use the name cluster0
2. Create a database, choose your own name
3. Then you'll create the first collection called: `"DataFilms"`. In this collection we will store the information about the movies that we render in our application. Use the following template to set up your collection:
>  Using the correct names given in this tutorial, for the `collection` is super important!

| 'Field' (input)| 'Value' (input)| 
| ------------- |:-------------:|
| _ID (Automatic generated) | Random number made by mongoDB |
| title: | (You can put any title name here) | 
| episodes: | (You can put the amount of episodes here) | 
| release: | (You can put the release year (date) here | 
| descriptions: | (You can put any descriptions here) | 
| photo: | (example: "onepiece.jpg") | 
| ID: | (I recommend you to use number like: 1,2,3....) | 

```
4. add atleast `4 different items` into your collection `DataFilms`
```

5. Then you'll create the second collection called: `"savedFilms"`. In this collection we will store the information about the movies that the user wants to save.
>  Using the correct names given in this tutorial, for the `collection` is super important!
### [env.](https://www.codementor.io/@parthibakumarmurugesan/what-is-env-how-to-set-up-and-run-a-env-file-in-node-1pnyxw9yxj)
* Once you have created the databases you'll need to create an .env in the root of the folder you work from, for this application. This .env file should contain one variable.
```
MONGO_PASSWORD=yourpassword
```


### App-installation:

`AANPASSEN ZODRA WE KLAAR ZIJN`

Clone my respository to your local device:

```

git clone https://github.com/MrSmarto/BLOKTECH23

```

When you cloned this repository, created a replica of the database and added the env. file make sure to follow the following steps:
### [NPM](https://docs.npmjs.com/cli/v6/commands/npm-install)
* First type `npm install` in your terminal
* Type `npm --version` the check if node is installed correctly

### [Open your terminal](https://support.apple.com/nl-nl/guide/terminal/welcome/mac)
* In the terminal you type: `npm start` to start [node.js](https://nodejs.org/en/) server, which will start the Anime Smart on the web.
* The website should be visible with the link underneath:
```

http://localhost:1900/

```

* MovieMates only works for a mobile screen so make sure you switch to a mobile screens. You'll will be able to do this to open the inspector tool on google chrome by the following code for mac OS: `Option + ⌘ + J`, and the following code for windows: `Shift + CTRL + J on Windows)`.

## ![tech](https://user-images.githubusercontent.com/118122875/224570118-38da956b-ec96-4d47-8375-b5f07659883a.png) Technologies

| Courses| language | editor |
| ------------- |:-------------:| ------------- |
| Project Tech | GIT & Github | [ School's respository](https://github.com/MrSmarto/BLOKTECH23/wiki) |
| Frond-end Development | JS (ES6), EJS, html & CSS | Visual Studio Code |
| Back-end Development | node.js | Visual Studio Code & MongoDB |

## ![licence](https://user-images.githubusercontent.com/118122875/224570185-da93d583-8c14-4eee-bca6-f680ec919fc2.png) License

We're using a [MIT LICENSE](https://github.com/cmda-bt/pt-course-22-23/blob/main/LICENSE).

![anime-boy](https://user-images.githubusercontent.com/118122875/225022156-18510eaa-ec17-457e-8e8a-1bc5418d985c.gif)


