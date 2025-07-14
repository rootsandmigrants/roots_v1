document.addEventListener("DOMContentLoaded", function () {
  const animationTab = document.getElementById("animation-tab");
  const visualizationTab = document.getElementById("visualization-tab");
  const populationTab = document.getElementById("population-tab");
  const migrationTab = document.getElementById("migration-tab");

  const animationContent = document.getElementById("animation-content");
  const visualizationContent = document.getElementById("visualization-content");
  const populationContent = document.getElementById("population-content");
  const migrationContent = document.getElementById("migration-content");

  // Show animation content and hide other contents by default
  if (
    animationContent &&
    visualizationContent &&
    populationContent &&
    migrationContent
  ) {
    animationContent.style.display = "block";
    visualizationContent.style.display = "none";
    populationContent.style.display = "none";
    migrationContent.style.display = "none";
  }

  // Event listeners for tab clicks
  if (animationTab && visualizationTab && populationTab && migrationTab) {
    animationTab.addEventListener("click", function () {
      showTabContent(animationContent);
      loadExternalScript("assets/anim.js");
    });

    visualizationTab.addEventListener("click", function () {
      showTabContent(null);
      loadExternalScript("js/viz.js");
    });

    populationTab.addEventListener("click", function () {
      showTabContent(populationContent);
      loadExternalScript("density.js");
    });

    migrationTab.addEventListener("click", function () {
      showTabContent(migrationContent);
      loadExternalScript("migration.js");
    });
  }

  // Function to show the selected tab content
  function showTabContent(content) {
    if (
      animationContent &&
      visualizationContent &&
      populationContent &&
      migrationContent
    ) {
      animationContent.style.display = "none";
      visualizationContent.style.display = "none";
      populationContent.style.display = "none";
      migrationContent.style.display = "none";

      if (content) {
        content.style.display = "block";
        // Trigger resize event to ensure map boundaries are updated
        window.dispatchEvent(new Event("resize"));
      }
    }
  }

  // Function to dynamically load external scripts
  function loadExternalScript(src) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = function () {
      console.log(`${src} loaded successfully`);
    };
    script.onerror = function () {
      console.error(`Failed to load script: ${src}`);
    };
    document.head.appendChild(script);
  }

  // Make the legend draggable
  makeElementDraggable("density-legend");
  makeElementDraggable("maps-legends");

  // Function to make an element draggable
  function makeElementDraggable(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let offsetX = 0,
      offsetY = 0,
      initialMouseX = 0,
      initialMouseY = 0;

    element.addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(e) {
      e.preventDefault();
      initialMouseX = e.clientX;
      initialMouseY = e.clientY;
      element.classList.add("dragging"); // Add dragging class
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
    }

    function elementDrag(e) {
      e.preventDefault();
      offsetX = initialMouseX - e.clientX;
      offsetY = initialMouseY - e.clientY;
      initialMouseX = e.clientX;
      initialMouseY = e.clientY;

      element.style.top = element.offsetTop - offsetY + "px";
      element.style.left = element.offsetLeft - offsetX + "px";
    }

    function closeDragElement() {
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
      element.classList.remove("dragging"); // Remove dragging class
    }
  }
});
