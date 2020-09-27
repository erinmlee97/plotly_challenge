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
        }) 
    })
  };

// Build function to get data
  function barChart(sample) {
    var url = `/samples/${sample}`
    d3.json(url).then(function(data) {
      var xValues = data.sample_values;
      var yValues = data.otu_ids;
      var labels = data.otu_labels;

        // Bar Chart
        var trace1 = {
            x: xValues.slice(0,10).reverse(),
            y: yValues.slice(0,10).map(object => `OTU ${object}`).reverse(),
            hovertext: labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }

        var data = [trace1];

        var layout = {
            title: "Top 10 OTUs"
        };

        plotly.newPlot("bar", data, layout)

    });
};

function init() {
    // Use d3 to select the drop down menu
    var selector = d3.select("#selDataset");
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample)
        });
        // Use 1st sample to build plots
        const firstSample = sampleNames[0];
        barChart(firstSample);
        buildMetadata(firstSample);
    });
};

init()
