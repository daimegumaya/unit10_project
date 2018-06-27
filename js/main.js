  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDoGRo6zw9IucW-56beYd34kcZu2kpPOLc",
    authDomain: "reservation-site-project10.firebaseapp.com",
    databaseURL: "https://reservation-site-project10.firebaseio.com",
    projectId: "reservation-site-project10",
    storageBucket: "reservation-site-project10.appspot.com",
    messagingSenderId: "190867630028"
  };
  firebase.initializeApp(config);

// Connect to Database
var database = firebase.database();

// Create emptiy object ‘reservationData’ where user input will be populated
var reservationData = {};

// Add click event to reservation day li in the dropdown
$('.reservation-day li').on('click', function() {
  // update the value of the property 'day' on the object 'reservationData' to have a value of clicked element's text
  reservationData.day = $(this).text();
});

// Add sbmit event to reservation form
$('.reservations').on('submit', function(event) {
  // Prevent the default action when form submit
  event.preventDefault();
  // Add user input 'name' with getting value to the 'reservationData' object
  reservationData.name = $('.reservation-name').val()
  // create section for reservation data in the database
  var reservationReference = database.ref('reservations');
  // Post reservation information data to Firebase database
  reservationReference.push(reservationData);
});
  // Create reservation function
function getReservations() {
  // listen any changes to the database 
  database.ref('reservations').on('value', function(results) {
    // get all reservations in the results from the database
    var allReservations = results.val();
    // remove any reservations the are that displaied current reservations list
    $('reservations').empty();
    // iterate through each reservation from database 
    for (var reservation in allReservations) {
    // create an object literal with the data we'll pass to Handlebars
      var context = {
      name: allReservations[reservation].name,
      day: allReservations[reservation].day,
      reservationId: reservation
      };
      // get html from Hndlebars template
      var source = $("#reservation-template").html();
      // compile template
      var template = Handlebars.compile(source);
      // 
      var reservationListItem = template(context);
      // append the newly created list item to the list
      $('.reservation-list').append(reservationListItem);
    }
      
  });
}
// When page loads, get reservations
getReservations();

// Click event to delete reservations
$('.cancel').on('click', function(event){
  event.preventDefault();
  // find ID for the resevation we want to delete
  var id = $(event.target).parent().data('id');

  // find resevation data whose objectId is equal to the id we're searching with
  var reservation = database.ref('reservations/' + id);

  reservation.remove()
});

// initialize map
function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.8054491, lng: -73.9654415},
    zoom: 10,
    scrollwheel: false
    //styles: [    
    
  });

  var styleOptions = [
    {
     stylers: [
        { hue: '#00ffe6' },
        { saturation: -20 }
      ]
    },{
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { lightness: 100 },
        { visibility: 'simplified' }
      ]
    },{
      featureType: 'road',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    }  
  ];

  var styledMapOptions = { name: '' }
  var sampleType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
  map.mapTypes.set('sample', sampleType);
  map.setMapTypeId('sample');

var marker = new google.maps.Marker({
    position: {lat: 40.8054491, lng: -73.9654415},
    map: map,
    title: 'Monks Café'
  });
}


