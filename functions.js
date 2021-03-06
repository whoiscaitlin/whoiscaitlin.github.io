//creates the bar chart object
function create_first_barchart(parent, width, height, metric, overview_data){
    const margins = {top:20, bottom:25, left:85, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height;
    let text = "Jewish Population in 1938";
    let color = "#A9C2C1";

    const chart = parent.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const x_scale = d3.scaleLinear()
        .range([0, chart_width])
        .domain([0, d3.max(overview_data, (d)=>+d[metric])]);

    console.log(x_scale.domain())

    const y_scale = d3.scaleBand()
        .range([chart_height, 0])
        .domain(overview_data.map((d)=>d.country));

    const y_axis = chart.append("g")
        .call(d3.axisLeft(y_scale));

    const x_axis = chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x_scale))
        .selectAll("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(330)");

    chart.append("text")
        .attr("id", "x_label")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${chart_width/2}, ${chart_height+ 2.25*margins.bottom})`)
        .text(text);

    const bars = chart.selectAll(".bar")
    .data(overview_data)
    .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d=>y_scale(d.country))
      .attr("width", (d)=>x_scale(d[metric]))
      .attr("height", y_scale.bandwidth())
      .style("fill", "#A9C2C1")
      .style("stroke", "black")

      const update_chart = function(){
          console.log("bar chart opacity", opacity);
          chart.transition()
          .duration(800)
          .style("opacity", opacity);
        }

      const update_text = function(){
        chart.selectAll("#x_label").transition()
          .text(text);
      }

      const update_color = function(){
        chart.selectAll(".bar").transition()
          .style("fill", color)
      }

      update_chart.color = (new_color)=>{
        if (color){
            color = new_color;
            return update_color(color);
        }else{
            return color;
        }
      }

      update_chart.opacity = (new_opacity)=>{
          if (new_opacity !==undefined){
              opacity = new_opacity;
              return update_chart;
          }else{
              return opacity;
          }
      }

      update_chart.text = (new_text)=>{
        if (new_text){
            text = new_text;
            return update_text(text);
        }else{
            return text;
        }
      }
      return update_chart;
}


//creates the dot-plot object
function create_iris_plot(parent, width, height, data){
    const margins = {top:10, bottom:0, left:50, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height - margins.top - margins.bottom;
    const PER_ROW = 48;
    const PER_COL = 15;
    const type =
    {Auschwitz:[100,'#a6cee3'],        Treblinka:[93,'#1f78b4'],
    Belzec:[35,'#b2df8a'],
    Sobibor:[17,'#33a02c'],
    Chelmno:[18,'#fb9a99'],
    Ghettos:[80,'#ff7f00'],
    western:[20,'#cab2d6'],
    concentration:[15, '#6a3d9a'], russian:[130,'#ffff99'],
    german:[6,'#e31a1c'],
    other:[100,'#fdbf6f'],};

    let opacity = 0;
    let color = "darkgrey";
    let size = height;
    let name = null;
    let camps = [];
    let count = 0;
    let distance = 0;
    let dots_data = data;
    let deaths = 0;

    const chart = parent.append("g")
    .attr("id", "dot-plot")
    .attr("transform", `translate(20, ${margins.top})`);

    const x_scale = d3.scaleLinear()
        .range([0, chart_width])
        .domain([0, chart_width/12])

    const y_scale = d3.scaleLinear()
        .range([chart_height, 0])
        .domain([0, chart_height/15])

    /*
    const color_scale = d3.scaleOrdinal()
        .range(['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#f5f5f5','#c7eae5','#80cdc1','#35978f','#01665e','#003c30'])
        .domain(type);
    */

    chart.append("text")
        .attr("id", "x_label_top")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2}, 15)`)
        .text("Pre-Holocaust Jewish Population in 1938 Revisualized");

    parent.append("text")
        .attr("id", "x_label_bottom")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2+15}, ${chart_height+50})`)
        .text("Each Circle Represents 10,000 People");

    const circles = chart.selectAll(".dot")
        .data(dots_data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .classed("children", (d)=>d.key < 150)
        .classed("women", (d)=>d.key >= 150 && d.key < 350)
        .classed("elderly", (d)=> d.key >= 350 && d.key < 450)
        .classed("survived", (d)=> d.key >= 660 && d.key < 960)
        .attr("cx", (d)=> x_scale(d.key % PER_ROW))
        .attr("cy", (d)=> y_scale(Math.floor(d.key / PER_ROW)))
        .attr("r", 6)
        .style("stroke", "black")
        .style("fill", color);

        const update_chart = function(){
            chart.transition()
            .duration(200)
            .style("opacity", opacity)
        }

        const update_color = function(selection){
          console.log(selection);

          chart.selectAll(".dot").transition()
            .style("fill", "darkgrey")

          if (selection == "women")
            chart.selectAll("."+selection).transition()
              .duration(300)
              .style("fill", "pink")

          if (selection == "children")
            chart.selectAll("."+selection).transition()
              .duration(300)
              .style("fill", "yellow")

          if (selection == "elderly")
            chart.selectAll("."+selection).transition()
              .duration(300)
              .style("fill", "orange")

        }

        const update_size = function(){
          //console.log("chart size is"+size)
          parent.selectAll("#dot-plot").transition()
          .duration(800)
          .attr("height", size)
        }

        //moves circles up and down depending on selection
        const add_circles = function(){

          let total = 0;
          total = type[name][0];
          //if the list of camps includes the name that means we're removing it
          if (name == "reset") {
            return reset_circles;
          }

          if (camps.includes(name)){
            //console.log("moving up");
            chart.selectAll(".dot").classed("inactive", function(d){
              if (d.key < count && d.key >= (count-total)) {
                 d.value = null;
                  return true}
            })

            chart.selectAll(".inactive").transition()
              .duration(1000)
              .attr("transform", `translate(0, -0)`)
              .style("fill", "darkgrey")

            count = count - total;
            camps = camps.filter((d)=> d != name);

            deaths = deaths - (total * 10000)
            change_deaths(name, total * 10000);

          } else{

            camps.push(name);

            for (let i=0; i<total; i++){
              if (count == 0){
                dots_data[i].value = name }
              else {
                dots_data[i+count].value = name}
            }

            count = count + total;
            chart.selectAll(".dot").classed("active", function(d){
              if (d.key < count) {return true}
            });

            chart.selectAll(".active").transition()
              .style("fill", (d)=> type[d.value][1])
              .duration(1000)
              .attr("transform", `translate(0, 150)`)

            deaths = deaths + (total * 10000)
            change_deaths(name, total * 10000);

          }
        }

      //moves the label up and down depending on size of chart
      const move_text = function(){
        console.log("moving text")
        parent.selectAll("#x_label_bottom").transition()
          .duration(1000)
          .style("font-weight", "bold")
          .attr("transform", `translate(${width/2+15}, ${chart_height+distance})`)
      }


      const reset_circles = function(){
        console.log("resetting circles")
        chart.selectAll(".active").transition()
          .duration(1000)
          .style("fill", "darkgrey")
          .attr("transform", `translate(0, -0)`)

        chart.selectAll(".dot").classed("active", false);
        count = 0;
        deaths = 0;
        change_deaths();
        camps = [];

      }

      //updates the label based on the number of deaths
      const change_deaths = function(name, current){

        //current = (current).toLocaleString('en');
        d = (deaths).toLocaleString('en');

        if (deaths == 0){
          parent.selectAll("#x_label_bottom").transition()
            .text("Each Circle Represents 10,000 People");

        } else {
          c = (current).toLocaleString('en');
          if (name != "western" && name != "russian" && name != "german" && name != "other" && name != "concentration" ){
            parent.selectAll("#x_label_bottom").transition()
              .text("~ "+c+" Jews died in "+name+" || Total Number of Deaths = "+d);
          } else {
            parent.selectAll("#x_label_bottom").transition()
              .text("~ "+c+" Jews died || Total Number of Deaths = "+d);
          }
        }
      }

      update_chart.opacity = (new_opacity)=>{
            if (new_opacity !==undefined){
                opacity = new_opacity;
                return update_chart;
            }else{
                return opacity;
            }
        }

        update_chart.color = (new_color)=>{
            if (new_color){
                color = new_color;
                return update_color(color);
            }else{
                return color;
            }
        }

        update_chart.size = (new_size)=>{
          if (new_size){
              size = new_size;
              return update_size(size);
          }else{
              return size;
          }
        }

        update_chart.add_count = (new_name)=>{
          //if we are adding circles to the page
          console.log("moving circles")
          if (new_name){
            if(new_name == "reset"){
              return reset_circles()
            } else {
              name = new_name;
              return add_circles(new_name);
           }
            }else{
              return camps;
          }
        }

        update_chart.distance = (new_distance)=>{
          //if we are adding circles to the page
          if (new_distance){
              distance = new_distance
            return move_text(new_distance);
          }else{
              return distance;
          }
        }

      return update_chart;

}

//creates the map object
function europe_map(parent, width, height, map_data, camps_data, extermination_data){

    console.log("you are here")
    const margins = {top:10, bottom:0, left:50, right:10};
    let opacity = 0;

    const map_layer = parent.append("g")
        .attr("id", "map-layer")
        .style("opacity", opacity)

    const point_layer = parent.append("g")
        .attr("id", "point-layer")
        .classed("hidden", true)
        .style("opacity", opacity)

    const contour_layer = parent.append("g")
        .attr("id", "contour-layer")
        .classed("hidden", true)
        .style("opacity", opacity)

    const projection = d3.geoAlbers()
			.center([15, 52])
			.rotate([4.0,0])
			.scale(1500)
			.translate([width/2, height/2])

		// create a path tool that will translate GeoJSON into SVG path data
		const path = d3.geoPath().projection(projection);
    const europe_countries = topojson.feature(map_data, map_data.objects.europe).features;

  		let layer = map_layer.selectAll("path")
  			 .data(europe_countries)
  			 .enter()
  			 .append("path")
  			 .attr("d", path)
  			 .style("stroke", "black")
  			 .style("fill", "#a9c2c1");
			 //darkkhaki

  		 let points = point_layer.selectAll("cirles")
  				 .data(camps_data)
  				 .enter()
  				 .append("circle")
  				 .attr("cx", (d) => projection([+d.longitude, +d.latitude])[0])
  				 .attr("cy", (d) => projection([+d.longitude, +d.latitude])[1])
  				 .attr("r", 3.5)
  				 .style("fill", "navy")



         // points.on("mouseover", function(d){
         // d3.select(this).classed("highligthted", true);
         // d3.select("#camp").text(d.camp);
         // const coordinates = [d3.event.pageX, d3.event.pageY];
         // d3.select("#tooltip").style("left", (coordinates[0]+15) + "px");
         // d3.select("#tooltip").style("top", (coordinates[1]+10) + "px");
         // d3.select("#tooltip").classed("hidden", false);
         // })
         // points.on("mouseout", function(d){
         // d3.select(this).classed("highligthted", false);
         // d3.select("#tooltip").classed("hidden", true);
         // })

       let contour = contour_layer.selectAll("path")
     			.data(extermination_data)
     			.enter()
     			.append("circle")
     			.attr("cx", (d) => projection([+d.longitude, +d.latitude])[0])
     			.attr("cy", (d) => projection([+d.longitude, +d.latitude])[1])
     			.attr("r", 6)
     			.style("fill", "red")



        // contour.on("mouseover", function(d){
        // d3.select(this).classed("highligthted", true);
        // d3.select("#camp").text(d.camp);
        // const coordinates = [d3.event.pageX, d3.event.pageY];
        // d3.select("#tooltip").style("left", (coordinates[0]+15) + "px");
        // d3.select("#tooltip").style("top", (coordinates[1]+10) + "px");
        // d3.select("#tooltip").classed("hidden", false);
        // })
        // contour.on("mouseout", function(d){
        // d3.select(this).classed("highligthted", false);
        // d3.select("#tooltip").classed("hidden", true);
        // })

        d3.selectAll("#controls input").on("change", function(){
            const option = d3.select(this);

            if (option.attr("value") == "point-layer"){
                  point_layer.classed("hidden", !option.property("checked"))
                }
                else if (option.attr("value") == "contour-layer"){
                  contour_layer.classed("hidden", !option.property("checked"))
                }
                console.log(option.attr("value"), option.property("checked"));
            });

        const update_chart = function(){
            console.log("map opacity", opacity);
            map_layer.transition()
            .duration(800)
            .style("opacity", opacity)
            point_layer.transition()
            .duration(800)
            .style("opacity", opacity)
            contour_layer.transition()
            .duration(800)
            .style("opacity", opacity)
        }

        update_chart.opacity = (new_opacity)=>{
              if (new_opacity){
                  opacity = new_opacity;
                  return update_chart;
              }else{
                  return opacity;
              }

          }

      return update_chart;
}

//crates the key object
function create_key(parent, width, height){
  const margins = {top:3, bottom:3, left:50, right:10};
  const chart_width = width - margins.left - margins.right;
  const chart_height = height - margins.top - margins.bottom;
  const first_half = [{"name": "Auchwitz", "color":"#a6cee3"},
              {"name": "Treblinka", "color":"#1f78b4"},
              {"name": "Belzec", "color":"#b2df8a"},
              {"name": "Sobibor", "color":"#33a02c"},
              {"name": "Chelmno", "color":"#fb9a99"},
              {"name": "Ghettos", "color":"#ff7f00"},]

    const second_half =
    [{"name": "Western Poland", "color":"#cab2d6"},
     {"name": "Concentration Camps", "color":"#6a3d9a"},
     {"name": "Other Methods", "color":"#fdbf6f"},
     {"name": "Russians Shot in Soviet Union", "color":"#ffff99"},
     {"name": "Other Nationalities Killed in Soviet Union", "color":"#e31a1c"},]

  let opacity_1 = 0;
  let opacity_2 = 1;


  const chart = parent.append("g")
    .attr("id", "key")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

  const x_scale = d3.scaleLinear()
    .range([0, chart_width-150])
    .domain([0, 2])

  const circles_1 = chart.selectAll(".circle.key_1")
      .data(first_half).enter()
      .append("circle")
        .attr("class", "key_1")
        .attr("cx", function(d,i){
          if (i < 3) {return x_scale(i)}
          else {return x_scale(i-3)}
        })
        .attr("cy", function(d,i){
          if (i < 3) {return 15}
          else {return 35}
        })
        .attr("r", 7)
        .style("stroke", "black")
        .style("opacity", opacity_1)
        .style("fill", (d,i)=>first_half[i].color)

  const labels_1 = chart.selectAll(".text.key_1")
      .data(first_half).enter()
      .append("text")
        .attr("class", "key_1")
        .attr("text-anchor", "left")
        .attr("x", function(d,i){
          if (i < 3) {return (i*195)+10}
          else {return ((i-3)*195)+10}
        })
        .attr("y", function(d,i){
          if (i < 3) {return 22}
          else {return 42}
        })
        .style("opacity", opacity_1)
        .text((d,i)=>first_half[i].name);

  const circles_2 = chart.selectAll(".circle.key_2")
      .data(second_half).enter()
      .append("circle")
        .attr("class", "key_2")
        .attr("cx", function(d,i){
          if (i < 3) {return x_scale(i)}
          if (i == 3) {return x_scale(i-3)}
          if (i == 4) {return x_scale(i-2.75)}
        })
        .attr("cy", function(d,i){
          if (i < 3) {return 15}
          else {return 35}
        })
        .attr("r", 7)
        .style("stroke", "black")
        .style("opacity", opacity_2)
        .style("fill", (d,i)=>second_half[i].color);

  const labels_2 = chart.selectAll(".text.key_2")
      .data(second_half).enter()
      .append("text")
        .attr("class", "key_2")
        .attr("text-anchor", "left")
        .attr("x", function(d,i){
          if (i < 3) {return x_scale(i)+10}
          if (i == 3) {return x_scale(i-3)+10}
          if (i == 4) {return x_scale(i-2.75)+10}
        })
        .attr("y", function(d,i){
          if (i < 3) {return 22}
          else {return 42}
        })
        .style("opacity", opacity_2)
        .text((d,i)=>second_half[i].name);

    const update_chart = function(){
        chart.selectAll(".key_1").transition()
        .duration(200)
        .style("opacity", opacity_1)

        chart.selectAll(".key_2").transition()
        .duration(200)
        .style("opacity", opacity_2)
    }

    update_chart.opacity = (number)=>{
          if (number == 1){
            opacity_1 = 1;
            opacity_2 = 0;
          } if (number == 0){
            opacity_1 = 0;
            opacity_2 = 0;
          } if (number == 2) {
            opacity_1 = 0;
            opacity_2 = 1;
          }
          return update_chart;
      }
      return update_chart;
}
