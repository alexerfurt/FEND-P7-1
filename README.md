# FEND-P7-1 Neighborhood Web App

Check out on: http://alexerfurt.github.io/dist/index.html

### Getting started

NPM and Bower has been used as a package manager, Bootstraps "dashboard" theme as a front-end template and Gulp for build automation. The following gulp-plugins will be needed to reconstruct files within the 'dist' directory out of the production files within the 'src' folder:

* gulp-uglify
* gulp-inline-css
* gulp-image-optimization
* gulp-htmlmin
* gulp-jshint
* gulp-cssnano
* gulp-notify

See also package.json file for all dependencies. All of them can be installed using the "npm install --save-dev <GULP_PLUGIN>" command via terminal (MAC) or equivalent consoles.

#### About the project

This app shows some of my favorite places in Dublins Grand Canal area. App and data is powered by the Google Maps and Yelp API. You can see my favorite places as markers on the map as well as a list on the left side. Selecting a place either way will let the marker bounce and a Google Maps Infowindow pop up. There you can find more information about the selected place such as name, address, phone number as well as Yelp ratings and reviews. Furthermore, the sidebar provides a search function which will filter the list as well as the marker display on the map in real time.

#### Citation and used resources

Most of the core application code was written by myself. Nevertheless I would not have made it without inspiration from Udacity fellows and other developers as well as tons of great online resources out there. The following were the most used resources for this project:

* Udacity Classes & Materials
* Udacity's Discussion Forum (https://discussions.udacity.com/c/nd001-neighborhood-map-project)
* Github and repos from other developers
* Google Developers & Map API Documentation (https://developers.google.com/maps/documentation/javascript/tutorial)
* Knockout Documentation (http://knockoutjs.com/documentation/introduction.html)
* Yelp API Documentation (https://www.yelp.ie/developers/documentation/v2/overview)
* Bootstrap Documentation (http://getbootstrap.com/getting-started/#examples)
* StackOverflow
* W3School
* Bytespider API Reference
* StackOverflow
* Google Developers