console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");

let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

if (currentLink) {
  currentLink.classList.add('current');
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'cv/', title: 'CV/Resume' },
  { url: 'meta/', title: 'Meta' },
  { url: 'https://github.com/trv004', title: 'Profile' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";       // GitHub Pages repo name

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  nav.append(a);
}

// Color scheme handling
const select = document.querySelector('.color-scheme select');

if (localStorage.colorScheme) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});

// Fetch JSON helper
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Projects Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// Call fetchJSON (optional usage)
fetchJSON('lib/projects.json')
  .then(data => {
    // Data is logged already — you can use it elsewhere as needed
  })
  .catch(error => {
    console.error('Error loading projects data:', error);
  });

// Render projects with optional clickable links
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  console.log('Rendering projects with heading level:', headingLevel);
  containerElement.innerHTML = '';

  projects.forEach(project => {
    const article = document.createElement('article');
    let wrapper = article;

    // If project has a link, wrap everything in an <a>
    if (project.link) {
      const link = document.createElement('a');
      link.href = project.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.textDecoration = 'none';
      link.style.color = 'inherit';
      article.appendChild(link);
      wrapper = link;
    }

    // Title
    const heading = document.createElement(headingLevel);
    heading.textContent = project.title;
    wrapper.appendChild(heading);

    // Image
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;
    wrapper.appendChild(img);

    // Description + year
    const descWrapper = document.createElement('div');

    const description = document.createElement('p');
    description.textContent = project.description;
    descWrapper.appendChild(description);

    const year = document.createElement('p');
    year.textContent = 'c. ' + (project.year || 'Year N/A');
    year.style.color = 'gray';
    year.style.fontFamily = 'Baskerville, serif';
    year.style.fontVariantNumeric = 'oldstyle-nums';
    descWrapper.appendChild(year);

    wrapper.appendChild(descWrapper);
    containerElement.appendChild(article);
  });
}

// GitHub user data helper
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
