![Robo-Boogie](http://roboboogie.codeclub.org.uk/assets/img/logo%401x.png)

Robo-boogie is a web-based robot dancing game made for [Code Club](http://www.codeclub.org.uk) by [Hover Studio](http://hoverstud.io). 

You can check the app out online at [roboboogie.codeclub.org.uk](http://roboboogie.codeclub.org.uk)

We learned a lot building the app so we've put the code up here in the hopes it might interesting/helpful to somebody! 

## Getting up and running

There are a couple of things you'll need installed to begin:

1. Node and NPM installed (a good guide is available [on Shape Shed](http://shapeshed.com/setting-up-nodejs-and-npm-on-mac-osx/))
2. A PHP/MySQL server to run the API

The app is divided into two parts: A frontend Backbone JS app and a Codeigniter PHP API for saving the dances. 

### Frontend 

The front end relies on grunt, both to run the development server and the build task. To install the necessary packages run

    npm install

…from the root folder. 

The `dev` folder contains the projects files and API files. To run the front end of the app, start the express server using:

    grunt server

The app should now be available at `http://0.0.0.0:8000/` in your web browser. 

The dev folder can then be complied and minified into to the `/build/` folder using the grunt task:

    grunt build

Details of what happens during this task can be found in `Gruntfile.js`. 

### Sound

Sound files can be placed into:

    /dev/assets/music/loops/

Then added to the JSON file 

    /dev/assets/data/soundtracks.json

### Backend API

Firstly you'll need to set up a local testing domain (e.g. http://codeclub.dev) and point it to `/dev/api/`. We use [VirtualhostX](https://clickontyler.com/virtualhostx/) for this kind of thing and can heartily recommend it. 

The MySQL database schema is in `schema.sql` in the project root. You should run this in your favourite MySQL GUI (we use [Sequel Pro](http://www.sequelpro.com/)) and then update your database connection settings in:

    /dev/api/application/config/database.php

Also you'll need to ensure your API url is correctly entered in:

    /dev/assets/js/config/urlConfig.js


## Thanks

- Clare Sutcliffe, for asking us to do this!
- Timothy Winchester, for his illustrated Robots
- Tef Thomas, for help getting the thing up and running
- Calum Gunn, for helping us integrate the iFrame dances
- Guy Kogus, for advice on hard maths
- Tom Judd, for animation advice and tips

Also you should check out the accompanying promo animation by our sister company [Animade](http://animade.tv) over on [Code Club's Youtube Channel](http://www.youtube.com/watch?v=sGtaIJTPbWU). 



