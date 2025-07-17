function initializeAddressAutocomplete() {
  const patientInput = document.getElementById("patientAddress");
  const billingInput = document.getElementById("billingAddress");

 // if (patientInput) {
 // new google.maps.places.Autocomplete(patientInput, { types: ["address"] });
 // }

 // if (billingInput) {
 //   new google.maps.places.Autocomplete(billingInput, { types: ["address"] });
 // }
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof google !== "undefined" && google.maps && google.maps.places) {
    initializeAddressAutocomplete();
  } else {
    console.warn("Google Places API not loaded. Autocomplete unavailable.");
  }
});
