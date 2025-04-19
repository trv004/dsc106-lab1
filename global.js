console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname,
  );

if (currentLink) {
// or if (currentLink !== undefined)
    currentLink.classList.add('current');
  }

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'cv/', title: 'CV/Resume'},
    { url: 'https://github.com/trv004', title: 'Profile' }
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/dsc106-lab1/";         // GitHub Pages repo name

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }

    // Create link and add it to nav
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