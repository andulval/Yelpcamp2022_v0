mapboxgl.accessToken = mapToken; //zmnienna wzieta z oblcizcenia strony html z wczesniejszym EJS - we  passing data through ejs to JS script
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 5, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

// Set marker options.
const marker = new mapboxgl.Marker({
  color: "#226699",
  draggable: false,
}).setLngLat(campground.geometry.coordinates)
.addTo(map);

// const popup = new mapboxgl.Popup({ offset: 40 })
//   .setLngLat(campground.geometry.coordinates)
// .setHTML(`<strong><b>${campground.title}</b></strong><br>${campground.location}`)
// .addTo(map);

  //`<h4>${campground.title}</h4><p>${campground.location}</p>`
