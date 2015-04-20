atmLocator
==========
Locates Chase banks and Atms using GeoLocation.

##Hosted on GitHub Pages [Click Here](http://nathansass.github.io/atmLocator/) 

Technologies
- AngularJS
- Google Maps API
- HTML5 Geolocation
- JP Morgan Chase API

####Thoughts on a new(ish) technology: Angular

Programming was summed up to me in two ways. The first is that everything is always broken and the second is programming is just moving stuff around. I am hoping my implementation of this bank finder more closely resembles the second description.

There is a lot of buzz around front-end frameworks such as Ember, Backbone and Angular. Naturally, I was eager to see what all of the commotion was about. This Bank Finder app seemed like the perfect opportunity. The data was already there and all I had to do was coerce a presentation with the visuals from Google’s API and the information from Chase’s API.

As someone who is familiar with MVC architectures, it was easy to understand the reasoning behind the structuring of Angular. I found the two-way data binding and view-binding built into Angular to be highly advantageous over vanilla JavaScript. Two-way data binding keeps the model and view in sync. API calls are asynchronous and it was nice to be able to allow these processes to occur knowing that the view would automatically be updated. This process is complemented directly by view-binding. As my model was updated, I was able to feed in variables from the controller directly into the view. Without Angular, I would have relied on AJAX requests and appending/removing elements with JQuery.

This short exercise afforded me a valuable view into the strengths of a front-end framework. From prototyping to a full-scale application I can see how Angular leverages flexibility that is great for rapid prototyping or scaling into a full fledged product.
