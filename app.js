// Use d3 to pull in data
d3.json("data/samples.json").then((data)=> {
    window.data = data
    console.log(data)
    var data = data

    // Add id's to dropdown
    var idList = data.names;
    for (var i = 0; i < idList.length; i++) {
      selectBox = d3.select("#selDataset");
      selectBox.append("option").text(idList[i]);
    }

    // Set up default plot
    buildPlots(0)

    // Create a function to build charts
    function buildPlots(index) {
        // Pull data for plots
        var samples = data.samples[index].otu_ids;
        console.log(samples);
        var sampleValues = data.samples[index].sample_values;
        var labels = data.samples[index].otu_labels;
        var wfreq = data.metadata[+index].wfreq;
        console.log(`Wash Freq: ${wfreq}`);

        // Populate Demographic Data card
        var demoKeys = Object.keys(data.metadata[index]);
        var demoValues = Object.values(data.metadata[index])
        var demographicData = d3.select('#sample-metadata');
  
        // clear demographic data
        demographicData.html("");
  
        for (var i = 0; i < demoKeys.length; i++) {
            demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
      };

        // Slice and reverse data for horizontal bar chart
        var topSample = samples.slice(0, 10).reverse();
        var topSampleValues = sampleValues.slice(0, 10).reverse();
        var topToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
        var topLabels = topSample.map((otu => "OTU " + otu));
        var reversedLabels = topLabels.reverse();

        // Create Bar Graph
        var trace1 = {
            x: topSampleValues,
            y: reversedLabels,
            text: topToolTips,
            marker: {
            color: "teal"},
            type:"bar",
            orientation: "h",
        };

        var barData = [trace1];

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
        Plotly.newPlot("bar", barData, layout);

        // Create Bubble Chart
        var trace2 = {
            x: samples,
            y: sampleValues,
            text: labels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: samples,
                opacity: [1, 0.8, 0.6, 0.4]
            },
        };

        var layout2 = {
            xaxis:{title: "OTU Frequency"},
            height: 600,
            width: 1153,
            margin:{t: 50}
        };

        var bubbleData = [trace2];

        Plotly.newPlot("bubble", bubbleData, layout2); 

        // Create Gauge
        var trace3 = [{
            domain: { x: [0, 1], y: [0, 1] },
            title: { text: `Weekly Washing Frequency ` },
            type: "indicator",
            value: wfreq,
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
                bar: { color: "rgb(0,120,0)" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "transparent",
                    steps: [
                    { range: [0, 1], color: "rgba(0,115,0,0.1)" },
                    { range: [1, 2], color: "rgba(0,115,0,0.2)" },
                    { range: [2, 3], color: "rgba(0,115,0,0.3)" },
                    { range: [3, 4], color: "rgba(0,115,0,0.4)" },
                    { range: [4, 5], color: "rgba(0,115,0,0.5)" },
                    { range: [5, 6], color: "rgba(0,115,0,0.6)" },
                    { range: [6, 7], color: "rgba(0,115,0,0.7)" },
                    { range: [7, 8], color: "rgba(0,115,0,0.8)" },
                    { range: [8, 9], color: "rgb(0,115,0)" },
                    ]}
        }];

        gaugeData = trace3;

        var layout3 = { 
            width: 470, 
            height: 450, 
            margin: { t: 20, b: 20, l:50, r:50 } 
            };
        Plotly.newPlot("gauge", gaugeData, layout3);
    }

        // On button click, call refreshData()
        d3.selectAll("#selDataset").on("change", optionChanged);
  

        function optionChanged() {
          var dropdownMenu = d3.select("#selDataset");
          // Assign the value of the dropdown menu option to a variable
          var personsID = dropdownMenu.property("value");
          console.log(personsID);
          // Initialize an empty array for the person's data
          console.log(data)
      
          for (var i = 0; i < data.names.length; i++) {
            if (personsID === data.names[i]) {
              buildPlots(i);
              return
            }
          }
        }
      
      });