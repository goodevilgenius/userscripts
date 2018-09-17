// https://thecomicshq.com/comics/weekly-packs/weekly-comic-checklist-9-12-18/

document.querySelectorAll('.listing-item a').forEach(function (link) {
  fetch(link.attributes.href.value)
    .then(res => res.text())
    .then(function (text) {
      link.parentElement.appendChild(document.createElement('br'));

      let dom = (new DOMParser()).parseFromString(text, "text/html");
      let links = dom.querySelectorAll('.td-post-content a.su-button')
      let importLinks = [...links].map(node => document.importNode(node, true));
      importLinks.forEach(node => link.parentElement.appendChild(node));
    });
});

