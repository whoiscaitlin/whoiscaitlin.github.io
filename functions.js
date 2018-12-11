function create_first_barchart(parent, width, height, metric, data){
    const margins = {top:10, bottom:25, left:75, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height;

    const chart = parent.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const x_scale = d3.scaleLinear()
        .range([0, chart_width])
        .domain([0, d3.max(data, (d)=>+d[metric])]);

    console.log(x_scale.domain())

    const y_scale = d3.scaleBand()
        .range([chart_height, 0])
        .domain(data.map((d)=>d.country));

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
    .data(data)
    .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d=>y_scale(d.country))
      .attr("width", (d)=>x_scale(d[metric]))
      .attr("height", y_scale.bandwidth())
      .style("fill", "#A9C2C1")
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



function create_iris_plot(parent, width, height, data){
    const margins = {top:10, bottom:0, left:50, right:10};
    const chart_width = width - margins.left - margins.right;
    const chart_height = height - margins.top - margins.bottom;
    const PER_ROW = 48;
    const PER_COL = 15;
    const type = {auschwitz:[100,'#543005'], treblinka:[93,'#8c510a'], belzec:[35,'#bf812d'], sobibor:[17,'#dfc27d'], chelmno:[18,'#f6e8c3'], ghettos:[80,'#f5f5f5'], western:[20,'#c7eae5'],  concentration:[15, '#80cdc1'], russian:[130,'#35978f'], german:[6,'#01665e'], other:[50,'#003c30'],};
    let opacity = 0;
    let color = "dodgerblue";
    let size = height;
    let name = null;
    let camps = [];
    let count = 0;
    let distance = 0;

    const chart = parent.append("g")
    .attr("id", "dot-plot")
    .attr("transform", `translate(20, ${margins.top})`);

    const x_scale = d3.scaleLinear()
        .range([0, chart_width])
        .domain([0, chart_width/12])

    const y_scale = d3.scaleLinear()
        .range([chart_height, 0])
        .domain([0, chart_height/15])

    const color_scale = d3.scaleOrdinal()
        .range(['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#f5f5f5','#c7eae5','#80cdc1','#35978f','#01665e','#003c30'])
        .domain(type);

    chart.append("text")
        .attr("id", "x_label_top")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2}, 15)`)
        .text("Jewish Population in 1933 Revisualized");

    parent.append("text")
        .attr("id", "x_label_bottom")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2+15}, ${chart_height+50})`)
        .text("Each Circle Represents 10,000 People");


    const circles = chart.selectAll(".dot")
        .data(data)
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
          total = type[name][0];
          //if the list of camps includes the name that means we're removing it
          if (camps.includes(name)){
            //console.log("moving up");
            chart.selectAll(".dot").classed("inactive", function(d){
              if (d.key < count && d.key >= (count-total)) {return true}
            })

            chart.selectAll(".inactive").transition()
              .style("fill","blue")
              .duration(1000)
              .attr("transform", `translate(0, -0)`)

            count = count - total;
            camps = camps.filter((d)=> d != name);

          } else{

            camps.push(name);
            //console.log("moving down");
            count = count + total;
            console.log(count, total);
            chart.selectAll(".dot").classed("active", function(d){
              if (d.key < count) {
                d.value = name;
                return true}
            })

            chart.selectAll(".active").transition()
              .style("fill", (d)=> type[d.value][1])
              .duration(1000)
              .attr("transform", `translate(0, 200)`)
          }
        }

      const move_text = function(){

        parent.selectAll("#x_label_bottom").transition()
          .duration(1000)
          .attr("transform", `translate(${width/2+15}, ${chart_height+distance})`)
      }

      const reset_circles = function(){
        console.log("resetting circles")
        chart.selectAll(".active").transition()
          .duration(1000)
          .attr("transform", `translate(0, -0)`)

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


//veronica's map goes here
