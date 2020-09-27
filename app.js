// Create a function to build charts
function buildCharts(id) {
    // Ude d3 to pull in data
    d3.json("data/samples.json").then((data)=> {
        console.log(data)
        // Find the wash frequency
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Frequency: ${wfreq}`)
        // filter samples by id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);
        // Get top 10 sample values for plot
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        // Get top 10 ids for plot
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        var OTU_id = OTU_top.map(d => "OTU " + d)
        // Get top 10 labels for plot
        var labels = samples.otu_labels.slice(0, 10);

        // Create Bar Graph
        var trace1 = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: "teal"},
            type:"bar",
            orientation: "h",
        };

        var data = [trace1];

        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
        Plotly.newPlot("bar", data, layout);

        // Create Bubble Chart
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };

        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        var data1 = [trace2];

        Plotly.newPlot("bubble", data1, layout_b); 

        // Create Gauge
        var data_g = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: `Weekly Washing Frequency ` },
            type: "indicator",
            
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                     steps: [
                      { range: [0, 2], color: "rgba(0,115,0,0.2)" },
                      { range: [2, 4], color: "rgba(0,115,0,0.4)" },
                      { range: [4, 6], color: "rgba(0,115,0,0.6)" },
                      { range: [6, 8], color: "rgba(0,115,0,0.8)" },
                      { range: [8, 9], color: "rgb(0,115,0)" },
                    ]}
                
            }
          ];
          var layout_g = { 
              width: 700, 
              height: 600, 
              margin: { t: 20, b: 40, l:100, r:100 } 
            };
          Plotly.newPlot("gauge", data_g, layout_g);
    })
};

// Create function to retrieve data
function getData(id) {
    // Use d3 to pull data
    d3.json("data/samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;
        console.log(metadata)

        // filter metadata
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Use d3 to select sample-metadata
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Create function for change event
function optionChanged(id) {
    buildCharts(id);
    getData(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        // Get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Call the functions to display the data and the plots to the page
        buildCharts(data.names[0]);
        getData(data.names[0]);
    });
}

init();

