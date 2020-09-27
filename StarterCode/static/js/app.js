// Create a function to get metadata
function buildMetadata(sample) {

    // Build function that builds the metadata panel
      var url = `/metadata/${sample}`;
      // Use d3 to select `#sample-metadata`
      d3.json(url).then((sample) => {
      // Use `.html("") to clear existing metadata
        let sample_metadata = d3.select("#sample-metadata"); 
        sample_metadata.html(""); 
      // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(sample).forEach(([key, value]) => {
          var row = sample_metadata.append("p");
          row.text(`${key}: ${value}`);
        }); 
        }); 
      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
  };

//   Build function to get data
  function buildChart(sample) {
    var url = `/samples/${sample}`
    d3.json(url).then(function(data) {
      var xValues = data.sample_values;
      var yValues = data.otu_ids;
      var labels = data.otu_labels;
    });
};