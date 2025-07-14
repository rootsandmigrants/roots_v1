mapboxgl.accessToken =
  "pk.eyJ1Ijoibndhamlha3UiLCJhIjoiY2x3amphbXZ2MG02YTJscDRmcXE3MDllZCJ9.RwnwQjJ1U0Y95kTvA-4i7g";
const beforeMap = new mapboxgl.Map({
  container: "before",
  style: "mapbox://styles/mapbox/navigation-day-v1",
  center: [-98.35, 39.5], // Center on the United States
  zoom: 4, // Set a zoom level appropriate for viewing the United States
});
const afterMap = new mapboxgl.Map({
  container: "after",
  style: "mapbox://styles/mapbox/navigation-night-v1",
  center: [-98.35, 39.5], // Center on the United States
  zoom: 4, // Set a zoom level appropriate for viewing the United States
});

const container = "#comparison-container";
const maps = new mapboxgl.Compare(beforeMap, afterMap, container, {
  // Set this to enable comparing two maps by mouse movement:
  // mousemove: true
});

const chapters = {
  general: document.getElementById("chapter-general"),
  asians: document.getElementById("chapter-asians"),
  "native-americans": document.getElementById("chapter-native-americans"),
  africans: document.getElementById("chapter-africans"),
  europeans: document.getElementById("chapter-europeans"),
};

function showChapter(chapter) {
  for (const key in chapters) {
    chapters[key].style.display = "none";
  }
  chapters[chapter].style.display = "block";
}

document.querySelectorAll('input[name="subset"]').forEach((radio) => {
  radio.addEventListener("change", (event) => {
    showChapter(event.target.value);
  });
});

// Set the initial chapter to general
showChapter("general");
