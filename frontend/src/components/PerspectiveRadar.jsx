// frontend/src/components/PerspectiveRadar.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PerspectiveRadar = ({ dimensions }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!dimensions) return;

    const width = 600;
    const height = 600;
    const margin = 80;
    const radius = Math.min(width, height) / 2 - margin;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);

    // Get dimensions and values
    const dims = Object.keys(dimensions);
    const values = dims.map(d => dimensions[d]);

    // Scales
    const angleSlice = (Math.PI * 2) / dims.length;
    const rScale = d3.scaleLinear()
      .domain([0, Math.max(...values, 0.1)])
      .range([0, radius]);

    // Draw grid circles
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const r = (radius / levels) * i;
      svg.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "#374151")
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", i === levels ? "none" : "4,4");
      
      // Add value labels
      if (i === levels) {
        svg.append("text")
          .attr("x", 5)
          .attr("y", -r + 15)
          .attr("fill", "#6B7280")
          .attr("font-size", "9px")
          .text(`${(Math.max(...values) * i/levels).toFixed(2)}`);
      }
    }

    // Draw axes
    const axisGrid = svg.append("g").attr("class", "axisWrapper");
    
    dims.forEach((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      // Axis line
      axisGrid.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#374151")
        .attr("stroke-width", 1);

      // Label
      const labelX = (radius + 30) * Math.cos(angle);
      const labelY = (radius + 30) * Math.sin(angle);
      
      const words = dim.split(' ');
      const formatted = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      axisGrid.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#9CA3AF")
        .attr("font-weight", "500")
        .text(formatted);
    });

    // Draw data polygon
    const points = dims.map((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const value = dimensions[dim];
      const r = rScale(value);
      return [r * Math.cos(angle), r * Math.sin(angle)];
    });

    const lineGenerator = d3.line();
    
    // Gradient fill
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
      
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#8B5CF6")
      .attr("stop-opacity", 0.4);
      
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6366F1")
      .attr("stop-opacity", 0.1);
    
    svg.append("path")
      .datum(points)
      .attr("d", lineGenerator)
      .attr("fill", "url(#areaGradient)")
      .attr("stroke", "#8B5CF6")
      .attr("stroke-width", 2);

    // Draw data points with glow
    svg.selectAll(".data-point")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", d => d[0])
      .attr("cy", d => d[1])
      .attr("r", 5)
      .attr("fill", "#A78BFA")
      .attr("stroke", "#C4B5FD")
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)");
      
    // Add glow filter
    const filter = svg.append("defs")
      .append("filter")
      .attr("id", "glow");
      
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
      
    filter.append("feMerge")
      .append("feMergeNode")
      .attr("in", "coloredBlur");
      
    filter.append("feMerge")
      .append("feMergeNode")
      .attr("in", "SourceGraphic");

  }, [dimensions]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} className="w-full max-w-2xl h-auto" viewBox="0 0 600 600" />
    </div>
  );
};

export default PerspectiveRadar;