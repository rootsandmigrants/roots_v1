document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  // Add event listeners to both sliders
  var sliderAnimation = document.getElementById("slider-animation");
  var sliderDensity = document.getElementById("slider-density");

  if (sliderAnimation) {
    console.log("Slider Animation found");
    sliderAnimation.addEventListener("input", function (event) {
      handleSliderChange(event, "year-label-animation");
    });
  } else {
    console.error("Slider Animation not found");
  }

  if (sliderDensity) {
    console.log("Slider Density found");
    sliderDensity.addEventListener("input", function (event) {
      handleSliderChange(event, "year-label-density");
    });
  } else {
    console.error("Slider Density not found");
  }

  // Function to handle slider change event
  function handleSliderChange(event, labelId) {
    // Get the new slider value
    var year = event.target.value;

    // Log the year and labelId for debugging
    console.log("Slider changed:", labelId, "Year:", year);

    // Update the year label
    var labelElement = document.getElementById(labelId);
    if (labelElement) {
      labelElement.innerText = "Year: " + year;
    } else {
      console.error("Label element not found:", labelId);
    }

    // Update the content of the text section based on the selected year
    updateTextContent(year);
  }

  // Function to update the text content based on the selected year
  function updateTextContent(year) {
    var textSection = document.getElementById("text-section");

    if (!textSection) {
      console.error("Text section element not found");
      return;
    }

    console.log("Updating text content for year:", year);

    switch (year) {
      case "1800":
        textSection.innerHTML = "<p>Content for 1800</p>";
        break;
      case "1810":
        textSection.innerHTML = "<p>Content for 1810</p>";
        break;
      case "1820":
        textSection.innerHTML = "<p>Content for 1820</p>";
        break;
      case "1830":
        textSection.innerHTML = "<p>Content for 1830</p>";
        break;
      case "1840":
        textSection.innerHTML = "<p>Content for 1840</p>";
        break;
      case "1850":
        textSection.innerHTML = "<p>Content for 1850</p>";
        break;
      case "1860":
        textSection.innerHTML = "<p>Content for 1860</p>";
        break;
      case "1870":
        textSection.innerHTML = "<p>Content for 1870</p>";
        break;
      case "1880":
        textSection.innerHTML = "<p>Content for 1880</p>";
        break;
      case "1890":
        textSection.innerHTML = "<p>Content for 1890</p>";
        break;
      case "1900":
        textSection.innerHTML = "<p>Content for 1900</p>";
        break;
      case "1910":
        textSection.innerHTML = "<p>Content for 1910</p>";
        break;
      // Add cases for other years as needed
      default:
        textSection.innerHTML = " ";
    }
  }
});
