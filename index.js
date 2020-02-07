(function() {
    const colors = {
        "Bug": "#4E79A7",
        "Dark": "#A0CBE8",
        "Electric": "#F28E2B",
        "Fairy": "#FFBE7D",
        "Fighting": "#59A14F",
        "Fire": "#8CD17D",
        "Ghost": "#B6992D",
        "Grass": "#499894",
        "Ground": "#86BCB6",
        "Ice": "#FABFD2",
        "Normal": "#E15759",
        "Poison": "#FF9D9A",
        "Psychic": "#79706E",
        "Steel": "#BAB0AC",
        "Water": "#D37295"
    }
    let pokeData = '';
    let svgContainer = '';
    let selectedGen = 'All';
    let selectedLegend = "All";

    window.onload = () => {
        svgContainer = d3.select('body')
            .append('svg')
            .attr('width', 1400)
            .attr('height', 800)
        d3.csv('./data/pokemon.csv')
            .then((res) => {
                pokeData = res;
                scatterPlot('all');
            })
    }
    function scatterPlot(generation) {
        let genSelected = pokeData;
        if(generation !== 'all') {
            genSelected = genSelected.filter((each) => {each["Generation"] === generation})
        }

        let numeric_spDef = genSelected.map((each) => parseFloat(each["Sp. Def"]))
        let numeric_Total = genSelected.map((each) => parseFloat(each["Total"]))

        let xy_limits = {
                x_min: d3.min(numeric_spDef),
                x_max: d3.max(numeric_spDef),
                y_min: d3.min(numeric_Total),
                y_max: d3.max(numeric_Total)
        }
        helpers = getAxis(xy_limits, "Sp. Def", "Total");

        let lenDrop = d3.select("body")
                .attr('x', 1000)
                .attr('y', 100)
                .append("select")
                .attr("class", "len-drop")
        lenDrop
            .selectAll("myOptions")
            .data(["All", "True", "False"])
            .enter()
            .append("option")
            .text((d) => {return d;})
            .attr("value", (d) => {return d;})
        lenDrop.on("change", function () {
            selectedLegend = d3.select(this).property("value");
            let show = '';
            let showOthers = '';
            if(this.checked) {
                show = "none";
                showOthers = "inline";
            } else {
                show = "inline";
                showOthers = "none";
            }
            if (selectedLegend === "All" && selectedGen === "All") {
                svgContainer.selectAll("circle")
                    .attr("display", show);
            } else if (selectedLegend !== "All" && selectedGen === "All") {
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedLegend !== d.Legendary; })
                    .attr("display", showOthers);
        
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedLegend === d.Legendary; })
                    .attr("display", show);
            } else if (selectedLegend === "All" && selectedGen !== "All") {
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedGen !== d.Generation; })
                    .attr("display", showOthers);
        
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedGen === d.Generation; })
                    .attr("display", show);
            } else if (selectedLegend !== "All" && selectedGen !== "All") {
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedGen !== d.Generation || selectedLegend !== d.Legendary; })
                    .attr("display", showOthers);
        
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedGen === d.Generation && selectedLegend === d.Legendary; })
                    .attr("display", show);
            }
        });

        let generationDrop = d3.select("body").append("select").attr("class", "gen-drop");
        generationDrop.append('option')
            .data(genSelected)
            .text('All')
            .attr('value', 'All')
            .enter()
        generationDrop.selectAll("option.state")
            .data(d3.map(genSelected, (d) => {return d.Generation}).keys())
            .enter()
            .append("option")
            .text((d) => { return d});
        generationDrop.on("change", function () {
            selectedGen = d3.select(this).property("value");
            let showOthers = '';
            let show = '';
            if(this.checked) {
                show = "none";
                showOthers = "inline";
            } else {
                show = "inline";
                showOthers = "none"
            }
            if (selectedLegend === "All" && selectedGen === "All") {
                svgContainer.selectAll("circle")
                    .attr("display", show);
            } else if (selectedLegend !== "All" && selectedGen === "All") {
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedLegend !== d.Legendary; })
                    .attr("display", showOthers);
        
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedLegend === d.Legendary; })
                    .attr("display", show);
            } else if (selectedLegend === "All" && selectedGen !== "All") {
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedGen !== d.Generation; })
                    .attr("display", showOthers);
        
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedGen === d.Generation; })
                    .attr("display", show);
            } else if (selectedLegend !== "All" && selectedGen !== "All") {
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedGen !== d.Generation || selectedLegend !== d.Legendary; })
                    .attr("display", showOthers);
        
                svgContainer.selectAll("circle")
                    .filter(function (d) { return selectedGen === d.Generation && selectedLegend === d.Legendary; })
                    .attr("display", show);
            }
        });
                              
        
        let div = d3.select("body").append('div')
                    .attr('class', 'tooltip')
                    .style("opacity", 0);
        svgContainer.selectAll('.dot')
            .data(genSelected)
            .enter()
            .append('circle')
            .attr('cx', helpers.x)
            .attr('cy', helpers.y)
            .attr('r', 5)
            .attr('fill', (d) => {return colors[d["Type 1"]]})
            .on('mouseover', (d) => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.Name + "<br/>" + d["Type 1"] + "<br/>" + d["Type 2"])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
        
        svgContainer.append('text')
                    .attr('x', 150)
                    .attr('y', 50)
                    .style('font-size', '20pt')
                    .text("Pokemon Visualization - Special Defense v.s. Total Stats");
        svgContainer.append('text')
                    .attr('x', 612.5)
                    .attr('y', 775)
                    .style('font-size', '15pt')
                    .text('Special Defense');
        svgContainer.append('text')
                    .attr('transform', 'translate(30, 125)rotate(-90)')
                    .style('font-size', '15pt')
                    .text('Total');
        legendHelper(genSelected);
    }
    
    function getAxis(xy_limits, x_axis, y_axis) {
        let x_value = (d) => {return +d[x_axis]};
        let y_value = (d) => {return +d[y_axis]};

        let x_scale = d3.scaleLinear()
                        .range([75, 1025])
                        .domain([xy_limits.x_min - 10, xy_limits.x_max + 10]);
        let y_scale = d3.scaleLinear()
                        .range([75, 725])
                        .domain([xy_limits.y_max + 50, xy_limits.y_min - 50]);

        let x_map = (d) => {return x_scale(x_value(d))}
        let y_map = (d) => {return y_scale(y_value(d))}


        let x_plot = d3.axisBottom().scale(x_scale);
        svgContainer.append("g")
            .attr('transform', 'translate(0, 725)')
            .call(x_plot)
        
        let y_plot = d3.axisLeft().scale(y_scale);
        svgContainer.append('g')
            .attr('transform', 'translate(75, 0)')
            .call(y_plot)
        
        return {
            x: x_map,
            y: y_map,
            x_scale: x_scale,
            y_scale: y_scale,
        }
    }
    function legendHelper(genSelected) {
        var size = 20;
        svgContainer.selectAll('dots')
            .data(d3.map(genSelected, (d) => {return d["Type 1"]}).keys())
            .enter()
            .append('rect')
            .attr("x", 100)
            .attr("y", (d, i) => {return 100 + i * (size + 5)})
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", (d) => {return colors[d]})
            .attr("transform", "translate(1120,130)")
        
        svgContainer.selectAll("mylabels")
            .data(d3.map(genSelected, (d) => {return d["Type 1"]}).keys())
            .enter()
            .append("text")
            .attr("x", 100 + size * 1.2)
            .attr("y", (d, i) => {return 100 + i * (size + 5) + (size / 2)})
            .style("fille", (d) => {return d})
            .text((d) => {return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr("transform", "translate(1120,130)")
    }
})();
