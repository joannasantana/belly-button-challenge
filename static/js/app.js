// Set the URL to a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create empty arrays to populate with JSON values
let data = {};
let selDataset = d3.select("#selDataset");

// Fetch the JSON data
d3.json(url).then(
    function(response) {
        data = response;
        updateDashboard(data.names[0]);
        populateDropdown();
    }
);

// Create the function that will populate the dropdown window
function populateDropdown() {
    data.names.forEach(
        function(val) {
            selDataset.append("option").attr("value", val).text(val);
        }
    );
        selDataset.on("change", function() {
        let newSelection = this.value;
        updateDashboard(newSelection);
        }
    );
}

// Create the function that will update the demographic info
function updateDemographicInfo(metadata) {
    let demographicInfoDiv = d3.select("#sample-metadata");
    demographicInfoDiv.html(
        `id: ${metadata.id}<br>
        ethnicity: ${metadata.ethnicity}<br>
        gender: ${metadata.gender}<br>
        age: ${metadata.age}<br>
        location: ${metadata.location}<br>
        bbtype: ${metadata.bbtype}<br>
        wfreq: ${metadata.wfreq}<br>
        `
    );
}

// Create the function that will update the barchart
function updateBarChart(otu_ids, sample_values, otu_labels) {
    let barLabels = [];
    for (let i = 0; i < otu_ids.length; i++) {
        barLabels.push(`OTU ${otu_ids[i]}`);
      }
    let trace1 = {
        x: sample_values.slice(0,10),
        y: barLabels.slice(0,10),
        text: otu_labels.slice(0,10),
        type: "bar",
        orientation: "h"
    }
    Plotly.newPlot("bar", [trace1]);
}

// Create the function that will update the bubble chart
function updateBubbleChart(otu_ids, sample_values, otu_labels) {
    let trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    };
    let layout = {
        xaxis: {
          title: {
            text: 'OTU ID',
          },
        },
    };
    Plotly.newPlot('bubble', [trace2], layout);
}

// Create the function that will update the Dashboard
function updateDashboard(selectedItem) {
    let samples = data.samples;
    let arrayIndex = data.names.findIndex(id => id == selectedItem);
    let activeSelection = samples[arrayIndex];
    let sample_values = activeSelection.sample_values;
    let otu_ids = activeSelection.otu_ids;
    let otu_labels = activeSelection.otu_labels;
    let metadata = data.metadata[arrayIndex];
    // Update the demographic info
    updateDemographicInfo(metadata);
    // Update the barchart
    updateBarChart(otu_ids, sample_values, otu_labels);
    // Update the bubble chart
    updateBubbleChart(otu_ids, sample_values, otu_labels);
}