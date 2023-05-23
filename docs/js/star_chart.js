'use strict';
import * as d3 from "https://cdn.skypack.dev/d3@7";
const star_chart = d3.select("#star_chart");

const width = 420;
const height = 420;


var star_data = [
    {
        label: "心脏活力", value: 12,
        describe: "心脏活力指数是指心脏在一分钟内的收缩次数，\n一般成人的心脏活力指数在60次/分钟以上，心脏活力指数越高，心脏的功能越好，心脏病的风险越低。"
    },
    {
        label: "运动", value: 15,
        describe: "运动指数是指每周运动的次数，\n一般成人每周运动3-5次，运动指数越高，运动的好处越多。"
    },
    {
        label: "规律作息", value: 14,
        describe: "规律作息指数是指每天的睡眠时间，\n一般成人每天睡眠时间在7-8小时，规律作息指数越高，睡眠时间越长，睡眠质量越好。"
    },
    {
        label: "关注度", value: 8,
        describe: "关注度指数是指对自身心脏健康的关注度，\n与心脏的心率测试频率有关，关注度指数越高，说明对自身健康的关注度越高。"
    },
    {
        label: "健康程度", value: 10,
        describe: "健康程度指数是指心脏健康的程度，\n与心脏的心率测试频率有关，健康程度指数越高，说明心脏健康的程度越高。"
    }
];


function StarChart(data, {
    label = ([x]) => x,
    value = ([, y]) => y,
    describe = ([, , z]) => z,
    title,
    data_max = 20,
    width,
    height,
    innerRadius = 0,
    outerRadius = Math.min(width, height) / 2,
    labelRadius = (innerRadius * 0.2 + outerRadius * 0.8),
    netColor,
    dataColor,
    colors,
    names,
    netNumber = 10,
} = {}) {
    // main svg
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const Lables = d3.map(data, label);
    const Values = d3.map(data, value);
    const nValues = Values.map(v => v / data_max);
    const Describe = d3.map(data, describe);


    if (names === undefined) names = Lables;
    names = new d3.InternSet(names);
    if (colors === undefined) colors = d3.schemeSpectral[names.size];
    if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

    // Construct scales.
    const color = d3.scaleOrdinal(names, colors);

    // center of the chart
    const cx = width / 2;
    const cy = height / 2;
    // edge length of the chart
    const edgeLength = Math.min(width, height) / 2 - 20.0;
    // 5 line from center to the edge, 五个角度
    const angles = d3.range(0, 2 * Math.PI, 2 * Math.PI / 5);



    // Draw the Edge line from center to the edge
    for (let i = 0; i < netNumber; i++) {
        const line = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius(edgeLength * (i + 1) / netNumber)
            .angle((d, i) => angles[i]);
        svg.append("path")
            .attr("d", line(angles.map(() => 1)))
            .attr("fill", "none")
            .attr("stroke", (i + 1) == netNumber ? "black" : netColor)
            .attr("stroke-width", (i + 1) == netNumber ? 2 : 1);
    }

    // Draw the 5 star lines from center to edge
    for (let i = 0; i < 5; i++) {
        function drawLine(sx, sy, ex, ey) {
            return "M" + sx + " " + sy + " L" + ex + " " + ey;
        }
        const line = drawLine(0, 0, -edgeLength * Math.sin(angles[i]), -edgeLength * Math.cos(angles[i]));
        svg.append("path")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 2)
            .on("mouseover", function (d) {
                d3.select(this).append("title")
                    .attr("class", "tooltip")
                    .text(nValues[i] + ":\n " + Describe[i]);
            });
        svg.append("text")
            .attr("x", -(labelRadius + 30.0) * Math.sin(angles[i]))
            .attr("y", -(labelRadius + 30.0) * Math.cos(angles[i]))
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(Lables[i])
            .on("mouseover", function (d) {
                d3.select(this).append("title")
                    .attr("class", "tooltip")
                    .text(Describe[i]);
            });


    }


    // Draw data lines and fillin
    const line2 = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(d => d * edgeLength)
        .angle((d, i) => angles[(5 - i) % 5]);
    svg.append("path")
        .attr("d", line2(nValues))
        .attr("fill", "#615ac4")//#615ac4
        .attr("stroke", "#3126c8")
        .attr("stroke-width", 3)
        .attr("opacity", 0.5)
        .append("text")
        .attr("class", "tooltip")
        .text(d => d);


    // Draw the Data Scores
    for (let i = 0; i < 5; i++) {
        svg.append("text")
            .attr("x", -(labelRadius + 15.0) * Math.sin(angles[i]) * nValues[i])
            .attr("y", -(labelRadius + 15.0) * Math.cos(angles[i]) * nValues[i])
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(nValues[i]).attr("opacity", 0.0)
            .on("mouseover", function (d) {
                d3.select(this)
                    .attr("opacity", 1.0)
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("opacity", 0.0)
            });
    }
    return Object.assign(svg.node(), { scales: {} });


}

var starChart = StarChart(star_data, {
    label: d => d.label,
    value: d => d.value,
    describe: d => d.describe,
    netColor: "gray",
    dataColor: "black",
    width: width,
    height: height
});

star_chart.node().append(starChart);