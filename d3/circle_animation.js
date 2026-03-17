import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let svg;
const width = 800;
const height = 600;
const duration = 800;
const maxCircles = 10;

let circles = [];

async function prepareVis() {

svg = d3
.select("body")
.append("svg")
.attr("width", width)
.attr("height", height)
.style("border","1px solid black")

// canvas 클릭 이벤트
.on("click", function(event){

if(circles.length >= maxCircles) return;

let [x,y] = d3.pointer(event);

// circle 생성
let circle = svg
.append("circle")
.attr("cx", x)
.attr("cy", y)
.attr("r", 0)
.attr("fill", d3.schemeCategory10[Math.floor(Math.random()*10)]);

// 등장 애니메이션
circle
.transition()
.duration(duration)
.attr("r", Math.random()*25 + 10);

circles.push(circle);

});
}

async function runApp() {

await prepareVis();

}

runApp();