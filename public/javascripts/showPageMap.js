
mapboxgl.accessToken = 'pk.eyJ1IjoidGVhLWRldiIsImEiOiJjbGV4b2VxcmsybHl4M3VydjY3NWNhMjl3In0.fNaTP9mskssQg4uEbTBpYw';

const pinLocation = (campground.geometry.coordinates) || [-74.5, 40] ;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: pinLocation, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(pinLocation)
    .addTo(map);

    // const marker1 = new mapboxgl.Marker()
// .setLngLat([-74.5, 40])
// .addTo(map);



