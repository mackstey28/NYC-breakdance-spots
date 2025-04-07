function navigateTo(e) {
    window.location.href = e;
    history.pushState({}, "", e);

    fetch(path)
    .then(res => res.text())
    .then(html => {
      // Extract just the inner content from the loaded HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.querySelector('#content');
      document.querySelector('#content').innerHTML = newContent.innerHTML;
    });
}

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  const path = location.pathname;
  navigateTo(path)
});

