import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Load project data
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

// Initial render of all projects
renderProjects(projects, projectsContainer, 'h2');
titleElement.textContent = `${projects.length} Projects`;

// Arc and color settings
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Globals
let selectedIndex = -1;
let query = '';
let data = []; // Stores pie chart data globally

// Function to render pie chart
function renderPieChart(projectsGiven) {
  d3.select('svg').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  const rolledData = d3.rollups(projectsGiven, v => v.length, d => d.year);
  data = rolledData.map(([year, count]) => ({ value: count, label: year }));

  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);
  const arcs = arcData.map(d => arcGenerator(d));

  let svg = d3.select('svg');
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', selectedIndex === i ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        // Update path and legend styles
        svg.selectAll('path')
          .attr('class', (_, idx) => selectedIndex === idx ? 'selected' : '');

        d3.select('.legend').selectAll('li')
          .attr('class', (_, idx) => selectedIndex === idx ? 'selected' : '');

        // Filter projects and re-render only the list (not the chart)
        const filteredProjects = projects.filter(project => {
          const matchesSearch = Object.values(project).join('\n').toLowerCase().includes(query);
          const matchesYear = selectedIndex === -1 || project.year === data[selectedIndex].label;
          return matchesSearch && matchesYear;
        });

        projectsContainer.innerHTML = '';
        titleElement.textContent = `${filteredProjects.length} Projects`;
        renderProjects(filteredProjects, projectsContainer, 'h2');
      });
  });

  // Render legend
  const legend = d3.select('.legend');
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', selectedIndex === idx ? 'selected' : '')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Initial pie chart render
renderPieChart(projects);

// Search functionality
searchInput.addEventListener('change', (event) => {
  query = event.target.value.toLowerCase();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = Object.values(project).join('\n').toLowerCase().includes(query);
    const matchesYear = selectedIndex === -1 || project.year === data[selectedIndex].label;
    return matchesSearch && matchesYear;
  });

  titleElement.textContent = `${filteredProjects.length} Projects`;
  projectsContainer.innerHTML = '';
  renderProjects(filteredProjects, projectsContainer, 'h2');
});
