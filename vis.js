const svg = document.getElementById("vizCanvas");
const NS = "http://www.w3.org/2000/svg";

const data = [
    { tool: "Maya", value: 85 },
    { tool: "Unity", value: 70 },
    { tool: "After Effects", value: 55 }
];

const barWidth = 120;
const chartHeight = 200;
const startX = 100;
const startY = 350;

data.forEach((d, i) => {
    // Bar
    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", startX + i * (barWidth + 40));
    rect.setAttribute("y", startY - d.value * 2);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", d.value * 2);
    rect.setAttribute("rx", 15);
    rect.setAttribute("fill", "#9C6B30");

    svg.appendChild(rect);

    // Label
    const text = document.createElementNS(NS, "text");
    text.setAttribute("x", startX + i * (barWidth + 40) + barWidth / 2);
    text.setAttribute("y", startY + 30);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#4A3B2A");
    text.textContent = d.tool;

    svg.appendChild(text);
});


// Bulb group
const bulbGroup = document.createElementNS(NS, "g");
   
// Bulb glass
const bulb = document.createElementNS(NS, "ellipse");
bulb.setAttribute("cx", 350);
bulb.setAttribute("cy", 500);
bulb.setAttribute("rx", 50);
bulb.setAttribute("ry", 65);
bulb.setAttribute("fill", "#F2F2F2");
bulb.setAttribute("stroke", "#999");
bulb.setAttribute("stroke-width", "2");
   
// Bulb base
const base = document.createElementNS(NS, "rect");
base.setAttribute("x", 320);
base.setAttribute("y", 565);
base.setAttribute("width", 60);
base.setAttribute("height", 30);
base.setAttribute("rx", 6);
base.setAttribute("fill", "#666");
   
// Glow (hidden by default)
const glow = document.createElementNS(NS, "circle");
glow.setAttribute("cx", 350);
glow.setAttribute("cy", 500);
glow.setAttribute("r", 75);
glow.setAttribute("fill", "rgba(255, 220, 120, 0)");
glow.style.transition = "fill 0.3s ease";
   
// Append
bulbGroup.appendChild(glow);
bulbGroup.appendChild(bulb);
bulbGroup.appendChild(base);
svg.appendChild(bulbGroup);
   
bulbGroup.addEventListener("mouseenter", () => {
    bulb.setAttribute("fill", "#FFF2B0");
    glow.setAttribute("fill", "rgba(255, 220, 120, 0.6)");
});
   
bulbGroup.addEventListener("mouseleave", () => {
    bulb.setAttribute("fill", "#F2F2F2");
    glow.setAttribute("fill", "rgba(255, 220, 120, 0)");
});