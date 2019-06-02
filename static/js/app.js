function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(response) {

   // Use d3 to select the panel with id of `#sample-metadata`
   var metadata = d3.select("#sample-metadata");

   // Use `.html("") to clear any existing metadata
   metadata.html("");

   // Use `Object.entries` to add each key and value pair to the panel
   var arr = Object.entries(response)

   // table to append metadata
   var table = metadata.append("tb")

   for (i = 0; i < arr.length; i++) {
     table.append("tr").text(arr[i][0]+": "+arr[i][1])
     .style("font-size", "12px")
     .style("font-weight", "bold");
   }

   // BONUS: Build the Gauge Chart
   // buildGauge(data.WFREQ);
 });
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json(url).then(function(response) {
 
      var data = [];
 
      //for loop to create array of dictionary items
      for (i = 0; i < response.otu_ids.length; i++) {
 
        var dict = {
          otu_i: response.otu_ids[i],
          otu_label: response.otu_labels[i],
          sample_value: response.sample_values[i]
        };
 
        data.push(dict);
      }
 
    //Sorts descending based on sample_values
    data.sort(function compareFunction(first_obj, second_obj) {
      firstNum = first_obj.sample_value;
      secondNum = second_obj.sample_value;
    return secondNum - firstNum;
    });
 
  //slice data to get top 10
    top_ten = data.slice(0,10)
    console.log (top_ten)
  
    // @TODO: Build a Pie Chart
    pie_sample_values = top_ten.map(function(val){
      return val.sample_value
    });
    pie_sample_ids = top_ten.map(function(ids){
      return ids.otu_i
    });

      pie_sample_labels = top_ten.map(function(label){
        return label.otu_label
    });

  var trace1 = {
         labels: pie_sample_ids,
         values: pie_sample_values,
         text: pie_sample_labels,
         hoverinfo : 'text',
         textinfo: 'percent',
         type: 'pie',
      };

       data_pie = [trace1];
       
       var layout = {
          title: `${sample}'s Belly Button Bacteria Chart`,
          height: 600,
          width: 700,
          
         };
        

       Plotly.newPlot("pie", data_pie,layout)
    // };
     // @TODO: Build a Bubble Chart using the sample data
    
     
     bubble_trace ={
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
      color: response.otu_ids,
      opacity: [1, 0.8, 0.6, 0.4],
      size: response.sample_values}
};
  var data_bubble = [bubble_trace];
  var layout_bubble = {
    title: `${sample}'s Bacteria Breakdown`,
    xaxis: {title:"Otu Ids "},
    showlegend: false,
    height: 700,
    width: 1000,
    
    
    
    
  };

  
  Plotly.newPlot("bubble", data_bubble,layout_bubble )


   // // HINT: You will need to use slice() to grab the top 10 sample_values,
     // otu_ids, and labels (10 each).
    });
 }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
