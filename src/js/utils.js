// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

export function renderWithTemplate(template, parentElement, data, callback) {
    let clone = template.content.cloneNode(true);
    if (callback) {
      clone = callback(clone, data);
    }
    console.log(clone)
    parentElement.appendChild(clone);
  }

export async function loadTemplate(path) {
    const html = await fetch(path)
        .then((response) => {
        if (!response.ok) {
            throw new Error("Error!");
        }
        return response;
        })
        .then((response) => response.text());
    
    const template = document.createElement("template");
    template.innerHTML = html;
    return template;
}

export async function loadHeader() {
    // Loads header into main.js
    const headerHTML = await loadTemplate("./partials/header.html");
  
    const header = qs("#main-header");
  
    await renderWithTemplate(headerHTML, header);
}

