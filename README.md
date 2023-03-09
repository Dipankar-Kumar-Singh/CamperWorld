
# Camper World

A Web-Application for Adding places that can be used a camp grounds,resting points,adventure location . 
 This website is designed to provide users with a platform to discover, add, edit, and delete campgrounds around the world. With an interactive map and authentication system, users can leave reviews and ratings for different campgrounds, helping others make informed decisions about their travel plans.

The map feature allows users to visualize the location of each campground and get a sense of its proximity to other points of interest. They can zoom in and out of the map to get a better view of the surrounding area and use filters to narrow down their search based on specific criteria.

One of the unique features of this website is its focus on user-generated content. By allowing users to add and review campgrounds, the site fosters a sense of community and encourages people to share their experiences with others. This creates a valuable resource for travelers, helping them find the best camping spots around the world.


## Demo


## Youtube Demo Link ▶️  https://youtu.be/GZHsrJlQma8

[![](https://markdown-videos.deta.dev/youtube/GZHsrJlQma8)](https://youtu.be/GZHsrJlQma8)
## Run Locally

Clone the project

```bash
  git clone https://github.com/Dipankar-Kumar-Singh/CamperWorld
```

Go to the project directory

```bash
  cd CamperWorld
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node app
```

 Optional : Seed the database . 
```bash
cd seeds/
node index.js index2.js index3.js inde43.js
```

Database  : MongoDB 6.0.4

## Tech Stack ⚒️

**Client:** HTML/CSS/BootStrap , EJS for templating

**Server:** Node, Express , MonogoDB , Passport library , JOI library, Mapbox-gl


# Features 🔅💎🔅

- ### Authentication  🔐
   - Used __Passport library__ for secure authentication 
   - Password is not sotred as plane text.
   - __Hashed__ Password is stored in DataBase along with __Salt__ 
   - Before Performting any data manupulation , user needs to be logeed in 
-  ### Three 3️⃣ Layer Data Validation
    #### Client Side 👤 : Bootstrap Validation 
    #### Server Side ⚙️ : MongoDB DataValidatio + JOI library 
- ### Interective Map 🗺️
    - __Cluster Map__ 🌍 on Front Page  
    - Location Preview 📌 on Individual Display Page
  
- ### Forword Geocoding  ➡️ 🌏 ⬅️ 
    Coordinate 📌 are been geocoded by the simple text location input , Easy to use by user

- ### Dark Mode 😁😄😄
    Easy On Eyes 
- ### Live previews

 


## Screenshots 📷
![App Screenshot](https://i.ibb.co/ZfPmk2c/Hight-quility-Screen-Short.png  )

![App Screenshot]( https://i.ibb.co/jk43Fyp/Index-Page.png )
![App Screenshot](https://i.ibb.co/z27xfLJ/Map-Zoomed.png)



![App Screenshot](https://i.ibb.co/TR7svM4/Index-all-location.png  )

![App Screenshot](https://i.ibb.co/kJmh62t/showPage.png)


![App Screenshot](https://i.ibb.co/4VkDmBG/register.png)


![App Screenshot](https://i.ibb.co/DGLXwV0/Login-Page.png)


