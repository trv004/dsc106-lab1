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
    { url: 'cv/', title: 'CV/Resume'},
    { url: 'meta/', title: 'Meta' },
    { url: 'https://github.com/trv004', title: 'Profile' }
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }

    // create link and add it to nav
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
      }

    nav.append(a);
}

// Get a reference to the <select> element
const select = document.querySelector('.color-scheme select');

// Check if there's a saved color scheme in localStorage
if (localStorage.colorScheme) {
  // If there's a saved preference, set the color-scheme property
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);

  // Set the select dropdown to reflect the saved value
  select.value = localStorage.colorScheme;
}

// Add an event listener to detect when the user changes the theme
  select.addEventListener('input', function(event) {
  // Log the change to the console (for debugging)
  console.log('color scheme changed to', event.target.value);

  // Change the color-scheme property on the <html> element
  document.documentElement.style.setProperty('color-scheme', event.target.value);

  // Save the user's preference to localStorage
  localStorage.colorScheme = event.target.value;
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Log the parsed data
    console.log('Projects Data:', data);

    // Return the data so it can be used elsewhere
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// Call the fetchJSON function
fetchJSON('lib/projects.json')
  .then(data => {
    // Handle the loaded data here if needed
    // No need to log data again since it's already logged inside fetchJSON
  })
  .catch(error => {
    console.error('Error loading projects data:', error);
  });


  
  export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    console.log('Rendering projects with heading level:', headingLevel);
    containerElement.innerHTML = '';
  
    projects.forEach(project => {
      const article = document.createElement('article');
  
      // Create title
      const heading = document.createElement(headingLevel);
      heading.textContent = project.title;
      article.appendChild(heading);
  
      // Create image
      const img = document.createElement('img');
      img.src = project.image;
      img.alt = project.title;
      article.appendChild(img);
  
      // Wrap description and year in a single container
      const descWrapper = document.createElement('div');
  
      const description = document.createElement('p');
      description.textContent = project.description;
      descWrapper.appendChild(description);
  
      const year = document.createElement('p');
      year.textContent = 'c. ' + project.year || 'Year N/A';
      year.style.color = 'gray';
      year.style.fontFamily = 'Baskerville, serif';
      year.style.fontVariantNumeric = 'oldstyle-nums';
      descWrapper.appendChild(year);
  
      article.appendChild(descWrapper);
      containerElement.appendChild(article);
    });
  }


  export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
  }