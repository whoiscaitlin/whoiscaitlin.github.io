function create_first_barchart(parent, width, height, metric, overview_data){
    const margins = {top:10, bottom:25, left:75, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height;

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
        .attr("transform", `translate(${chart_width/2}, ${chart_height+ 2*margins.bottom})`)
        .text("Jewish Population in 1933");

    const bars = chart.selectAll(".bar")
    .data(overview_data)
    .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d=>y_scale(d.country))
      .attr("width", (d)=>x_scale(d[metric]))
      .attr("height", y_scale.bandwidth())
      .style("fill", "lightblue")
      .style("stroke", "black");

      const update_chart = function(){
          console.log("bar chart opacity", opacity);
          chart.transition()
          .duration(800)
          .style("opacity", opacity);
      }

      update_chart.opacity = (new_opacity)=>{
          if (new_opacity !==undefined){
              opacity = new_opacity;
              return update_chart;
          }else{
              return opacity;
          }

      }
      return update_chart;

}



function create_iris_plot(parent, width, height, overview_data){
    const margins = {top:10, bottom:0, left:50, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height - margins.top - margins.bottom;
    const PER_ROW = 48;
    const PER_COL = 15;
    let opacity = 0;
    let color = "dodgerblue";
    let size = height;
    let name = null;
    let camps = [];
    let count = 0;

    const chart = parent.append("g")
    .attr("id", "dot-plot")
    .attr("transform", `translate(20, ${margins.top})`);

    const x_scale = d3.scaleLinear()
        .range([0, chart_width])
        .domain([0, chart_width/12])

    const y_scale = d3.scaleLinear()
        .range([chart_height, 0])
        .domain([0, chart_height/15])

    chart.append("text")
        .attr("id", "x_label_bottom")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2}, 15)`)
        .text("Jewish Population in 1933 Revisualized");

    chart.append("text")
        .attr("id", "x_label_top")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2}, ${chart_height+40})`)
        .text("Each Circle Represents 10,000 People");


    const circles = chart.selectAll(".dot")
        .data(overview_data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .classed("children", (d)=>d < 150)
        .classed("women", (d)=>d >= 150 && d < 350)
        .classed("elderly", (d)=> d >= 350 && d < 450)
        .classed("survived", (d)=> d >= 660 && d < 960)
        .attr("cx", (d)=> x_scale(d % PER_ROW))
        .attr("cy", (d)=> y_scale(Math.floor(d / PER_ROW)))
        .attr("r", 6)
        .style("stroke", "black")
        .style("fill", color);

        const update_chart = function(){
            console.log("bar chart opacity", opacity);
            chart.transition()
            .duration(800)
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

          if (selection == "survived")
            chart.selectAll("."+selection).transition()
              .duration(300)
              .style("fill", "dodgerblue")

        }

        const update_size = function(){
          console.log("chart size is"+size)
          parent.selectAll("#dot-plot").transition()
          .duration(800)
          .attr("height", size)
        }

        const add_circles = function(){

          let total = 0;
          console.log(name);
          console.log(camps);
          if (name=="auschwitz"){ total = 1000; }
          if (name=="treblinka"){ total = 93; }
          if (name=="belzec"){ total = 35; }
          if (name=="sobibor"){ total = 17; }
          if (name=="chelmno"){ total = 18; }
          if (name=="ghettos"){ total = 80; }
          if (name=="western"){ total = 200; }
          if (name=="central"){ total = 20; }
          if (name=="concentration"){ total = 15; }
          if (name=="russian"){ total = 17; }
          if (name=="german"){ total = 18; }
          if (name=="sebria"){ total = 80; }
          if (name=="other"){ total = 80; }

          //if the list of camps includes the name that means we're removing it
          if (camps.includes(name)){

            //console.log("moving up");
            chart.selectAll(".dot").classed("inactive", function(d){
              if (d < count && d >= (count-total)) {return true}
            })

            chart.selectAll(".inactive").transition()
              .duration(1000)
              .attr("transform", `translate(0, -0)`)

            count = count - total;
            camps = camps.filter((d)=> d != name);

          } else{

            camps.push(name);
            //console.log("moving down");
            count = count + total;
            //console.log(count);
            chart.selectAll(".dot").classed("active", function(d){
              if (d < count) {return true}
            })
            chart.selectAll(".active").transition()
              .duration(1000)
              .attr("transform", `translate(0, 200)`)
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

        update_chart.add_count = (new_name, direction)=>{
          //if we are adding circles to the page
          if (new_name){
            name = new_name;
            return add_circles(new_name);
          }else{
              return camps;
          }
      }

      return update_chart;

}

function europe_map(parent, width, height, map_data, camps_data, extermination_data){
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
