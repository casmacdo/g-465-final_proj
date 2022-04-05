// script that pulls GEE pollution data for specified years!
var region =
  ee.Geometry.Polygon(
    [[[-74.89788681934836, 46.17955456708541],
    [-74.89788681934836, 45.03443324885425],
    [-72.31609970997336, 45.03443324885425],
    [-72.31609970997336, 46.17955456708541]]], null, false); // The rough extent of our study region 

// Create list of the pollutants that we wish to study

var poll = [
  ['COPERNICUS/S5P/NRTI/L3_NO2', "NO2_column_number_density", 'L3_NO2'], // Nitrogen Dioxide
  ['COPERNICUS/S5P/NRTI/L3_CO', "CO_column_number_density", 'L3_CO'], // Carbon Monoxide
  ['COPERNICUS/S5P/NRTI/L3_HCHO', "tropospheric_HCHO_column_number_density", "L3_HCHO"], // Formaldehyde
  ['COPERNICUS/S5P/NRTI/L3_SO2', "SO2_column_number_density"] // Sulfur dioxide
];

// make list of study years 

var year = [2018, 2019, 2020, 2021];

// iterate over the desired pollution data

poll.forEach(function (poll) { // for loop that iterates over the pollution list
  year.forEach(function (year) {
    var collection = ee.ImageCollection(poll[0]) // assign the image collection to variable 
      .select(poll[1]) //select band of interest
      .filterDate(year + '-09-01', year + '-12-31') // select study period
      .filterBounds(region); // set geometry
    var meanImage = collection.mean(); // calculate the mean of the images

    var scale = collection.first().select(poll[1]).projection().nominalScale(); // get the scale of each image

    //Export the image to your Google Drive: look at the task tab in Google Earth Engine

    Export.image.toDrive({
      image: meanImage.clip(region),//specify image to be exported and clip to Montreal boundaries
      region: region, // clip the image according to polygon created earlier
      scale: scale, // from the scale_of_data
      folder: 'GEE' // the output folder
    });
  });
});