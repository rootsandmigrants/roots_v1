document.addEventListener("DOMContentLoaded", function () {
  const animationTab = document.getElementById("animation-tab");
  const visualizationTab = document.getElementById("visualization-tab");
  const populationTab = document.getElementById("population-tab");
  const migrationTab = document.getElementById("migration-tab");
  const animationContent = document.getElementById("animation-content");
  const visualizationContent = document.getElementById("visualization-content");
  const populationContent = document.getElementById("population-content");
  const mapDenContainer = document.getElementById("mapDen");
  const mapContainer = document.getElementById("map");
  const mapContainers = document.getElementById("maps");

  // Initialize your Mapbox maps
  mapboxgl.accessToken = "your-mapbox-access-token";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-74.5, 40], // Set the initial center coordinates
    zoom: 9, // Set the initial zoom level
  });

  const mapDen = new mapboxgl.Map({
    container: "mapDen",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-74.5, 40], // Set the initial center coordinates
    zoom: 9, // Set the initial zoom level
  });
  const maps = new mapboxgl.Map({
    container: "maps",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-74.5, 40], // Set the initial center coordinates
    zoom: 9, // Set the initial zoom level
  });
  // Show animation content and hide other contents by default
  animationContent.style.display = "block";
  visualizationContent.style.display = "none";
  populationContent.style.display = "none";

  // Event listeners for tab clicks
  animationTab.addEventListener("click", function () {
    showTabContent(animationContent);
    map.resize(); // Resize the map to fit the new container size
    window.dispatchEvent(new Event("resize")); // Manually trigger window resize event
    loadExternalScript("assets/anim.js.js");
  });

  visualizationTab.addEventListener("click", function () {
    showTabContent(visualizationContent);
    maps.resize();
    window.dispatchEvent(new Event("resize")); // Manually trigger window resize event
    loadExternalScript("js/viz.js");
  });

  populationTab.addEventListener("click", function () {
    showTabContent(populationContent);
    mapDen.resize(); // Resize the map to fit the new container size
    window.dispatchEvent(new Event("resize")); // Manually trigger window resize event
    loadExternalScript("density.js");
  });

  migrationTab.addEventListener("click", function () {
    showTabContent(null);
    window.dispatchEvent(new Event("resize")); // Manually trigger window resize event
    loadExternalScript("path/to/migration-script.js");
  });

  // Function to show the selected tab content
  function showTabContent(content) {
    animationContent.style.display = "none";
    visualizationContent.style.display = "none";
    populationContent.style.display = "none";

    if (content) {
      content.style.display = "block";
      // Trigger resize event to ensure map boundaries are updated
      window.dispatchEvent(new Event("resize"));
    }
  }

  // Function to dynamically load external scripts
  function loadExternalScript(src) {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
  }

  // Make the map containers resizable
  makeElementResizable(mapContainer, map);
  makeElementResizable(mapDenContainer, mapDen);
  makeElementResizable(mapContainers, maps);
});

// Function to make elements draggable
function makeElementDraggable(element) {
  let isDragging = false;
  let mouseX, mouseY, offsetX, offsetY;

  function handleMouseDown(event) {
    isDragging = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    offsetX = element.offsetLeft;
    offsetY = element.offsetTop;
    element.style.cursor = "grabbing";
  }

  function handleMouseMove(event) {
    if (isDragging) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      element.style.left = offsetX + deltaX + "px";
      element.style.top = offsetY + deltaY + "px";
    }
  }

  function handleMouseUp() {
    isDragging = false;
    element.style.cursor = "grab";
  }

  element.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}

const subset = document.querySelector(".checkbox-section");
makeElementDraggable(subset);

const legend2 = document.querySelector(".map-legends");
makeElementDraggable(legend2);

// Function to make an element resizable
function makeElementResizable(element, map) {
  const resizer = document.createElement("div");
  resizer.style.width = "10px";
  resizer.style.height = "10px";
  resizer.style.background = "#ccc";
  resizer.style.position = "absolute";
  resizer.style.right = "0";
  resizer.style.bottom = "0";
  resizer.style.cursor = "se-resize";
  element.appendChild(resizer);

  let originalWidth, originalHeight, originalMouseX, originalMouseY;

  resizer.addEventListener("mousedown", function (e) {
    e.preventDefault();
    originalWidth = element.offsetWidth;
    originalHeight = element.offsetHeight;
    originalMouseX = e.clientX;
    originalMouseY = e.clientY;

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  });

  function resize(e) {
    const width = originalWidth + (e.clientX - originalMouseX);
    const height = originalHeight + (e.clientY - originalMouseY);
    element.style.width = width + "px";
    element.style.height = height + "px";
    map.resize(); // Resize the map to fit the new container size
    window.dispatchEvent(new Event("resize")); // Manually trigger window resize event
  }

  function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  }
}
