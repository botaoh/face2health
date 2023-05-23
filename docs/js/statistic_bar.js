'use strict';
import * as d3 from "https://cdn.skypack.dev/d3@7";
const statistic_bar = d3.select("#statistic_bar");


const width = 2260;
const height = 1000;
function bumps(m) {
    const values = [];

    // Initialize with uniform random values in [0.1, 0.2).
    for (let i = 0; i < m; ++i) {
        values[i] = 0.1 + 0.1 * Math.random();
    }

    // Add five random bumps.
    for (let j = 0; j < 5; ++j) {
        const x = 1 / (0.1 + Math.random());
        const y = 2 * Math.random() - 0.5;
        const z = 10 / (0.1 + Math.random());
        for (let i = 0; i < m; i++) {
            const w = (i / m - y) * z;
            values[i] += x * Math.exp(-w * w);
        }
    }

    // Ensure all values are positive.
    for (let i = 0; i < m; ++i) {
        values[i] = Math.max(0, values[i]);
    }

    return values;
}

var margin = ({ top: 0, right: 0, bottom: 10, left: 0 })

const m = 100

const n = 5

const xAxis = svg => svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(() => ""))

const z = d3.scaleSequential(d3.interpolateBlues)
    .domain([-0.5 * n, 1.5 * n])


const xz = d3.range(m)
const x = d3.scaleBand()
    .domain(xz)
    .rangeRound([margin.left, width - margin.right])
    .padding(0.08)


const yz = d3.range(n).map(() => bumps(m))

const yMax = d3.max(yz, y => d3.max(y))

var y01z = d3.stack()
    .keys(d3.range(n))
    (d3.transpose(yz)) // stacked yz
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]))

const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]))

const y = d3.scaleLinear()
    .domain([0, y1Max])
    .range([height - margin.bottom, margin.top])



function StatisticBar() {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    const rect = svg.selectAll("g")
        .data(y01z)
        .join("g")
        .attr("fill", (d, i) => z(i))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", height - margin.bottom)
        .attr("width", x.bandwidth())
        .attr("height", 0);

    svg.append("g")
        .call(xAxis);

    function transitionGrouped() {
        y.domain([0, yMax]);

        rect.transition()
            .duration(500)
            .delay((d, i) => i * 20)
            .attr("x", (d, i) => x(i) + x.bandwidth() / n * d[2])
            .attr("width", x.bandwidth() / n)
            .transition()
            .attr("y", d => y(d[1] - d[0]))
            .attr("height", d => y(0) - y(d[1] - d[0]));
    }

    function transitionStacked() {
        y.domain([0, y1Max]);

        rect.transition()
            .duration(500)
            .delay((d, i) => i * 20)
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .transition()
            .attr("x", (d, i) => x(i))
            .attr("width", x.bandwidth());
    }

    function update(layout) {
        if (layout === "stacked") {
            transitionStacked();
        }
        else {
            transitionGrouped();
        }
    }

    // return Object.assign(svg.node(), { update });
    return Object.assign(svg.node(), { update });
}
var layout = "stacked"


var chart = StatisticBar();
statistic_bar.node().append(chart);
chart.update(layout);
const form = document.querySelector("#statistic_bar_form");

// 每隔0.5秒更新一次
const interval = setInterval(function () {
    layout = layout === "stacked" ? "grouped" : "stacked";
    chart.update(layout);
}, 5000);
// onclick form
// form.addEventListener("click", function () {
//     console.log(this.value)
// });

form.addEventListener("change", function () {
    console.log(this.radio.value);
    layout = this.radio.value;
    chart.update(layout);
    clearInterval(interval);
});