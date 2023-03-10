mapboxgl.accessToken = mapToken;

console.log("working mapbox!")

const heightOutput = window.innerWidth;

let initZoomMap = 3;
if(heightOutput<450){
    initZoomMap=2
}else if(heightOutput<750){
    initZoomMap=2.5
}
console.log("working mapbox!", initZoomMap, heightOutput)


const map = new mapboxgl.Map({
container: 'cluster-map',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/light-v11',
center: [-103.5917, 40.6699],
zoom: initZoomMap
});

map.addControl(new mapboxgl.NavigationControl());
console.log(campgrounds);
map.on('load', () => {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map.addSource('campgrounds', {
type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ campgrounds
data: campgrounds,
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'campgrounds',
filter: ['has', 'point_count'],
paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
'circle-color': [
'step',
['get', 'point_count'],
'#b5e48c',
5,
'#76c893',
15,
'#34a0a4'
],
'circle-radius': [
'step',
['get', 'point_count'],
20,
50,
30,
150,
40
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'campgrounds',
filter: ['has', 'point_count'],
layout: {
'text-field': ['get', 'point_count_abbreviated'],
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'campgrounds',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#e85d04',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
// inspect a cluster on click
map.on('click', 'clusters', (e) => {
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('campgrounds').getClusterExpansionZoom(
clusterId,
(err, zoom) => {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', (e) => {
        console.log(e.features[0]);
        //console.dir(e);
        const coordinates = e.features[0].geometry.coordinates.slice();
        const campTitle = e.features[0].properties.title;
        const campLocation = e.features[0].properties.location;
        const campLink = e.features[0].properties.link;
        const campImgThumbnail = e.features[0].properties.imgThumbnail; //e.features[0].images[0].url.thumbnail;
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
 
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
                // `<p>${e.features[0].properties}</p>`
                `<strong><b>${campTitle}</b></strong><br>${campLocation}<br><img src="${campImgThumbnail}" class="img-thumbnail" alt="camp image" crossorigin><br><a href="/campgrounds/${campLink}">show more</a>  `
)
.addTo(map);
});
 
map.on('mouseenter', 'clusters', () => {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', () => {
map.getCanvas().style.cursor = '';
});
});