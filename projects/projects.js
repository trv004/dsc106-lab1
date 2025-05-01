import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

//load project data
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

//initial render of all projects
renderProjects(projects, projectsContainer, 'h2');
titleElement.textContent = `${projects.length} Projects`;

//arc and color settings
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

//function to render pie chart
function renderPieChart(projectsGiven) {
  d3.select('svg').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  const rolledData = d3.rollups(projectsGiven, v => v.length, d => d.year);
  const data = rolledData.map(([year, count]) => ({ value: count, label: year }));

  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);
  const arcs = arcData.map(d => arcGenerator(d));

  let svg = d3.select('svg');
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        //update wedge styles
        svg.selectAll('path')
          .attr('class', (_, idx) => selectedIndex === idx ? 'selected' : '');

        //update legend styles
        d3.select('.legend').selectAll('li')
          .attr('class', (_, idx) => selectedIndex === idx ? 'selected' : '');

        //filter projects by both search and selected year
        const filteredProjects = projects.filter(project => {
          const matchesSearch = Object.values(project).join('\n').toLowerCase().includes(query);
          const matchesYear = selectedIndex === -1 || project.year === data[selectedIndex].label;
          return matchesSearch && matchesYear;
        });

        //render filtered projects
        renderProjects(filteredProjects, projectsContainer, 'h2');
        renderPieChart(filteredProjects); //rerender pie chart
      });
  });

  const legend = d3.select('.legend');
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

//initial pie chart render
renderPieChart(projects);

let query = ''; //store search query GLOBALLY

searchInput.addEventListener('change', (event) => {
  query = event.target.value.toLowerCase(); //update query

  //filter projects based on BOTH search query and selected year
  let filteredProjects = projects.filter(project => {
    const matchesSearch = Object.values(project).join('\n').toLowerCase().includes(query);
    const matchesYear = selectedIndex === -1 || project.year === data[selectedIndex].label;
    return matchesSearch && matchesYear;
  });

  titleElement.textContent = `${filteredProjects.length} Projects`;
  projectsContainer.innerHTML = '';
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

let selectedIndex = -1;
