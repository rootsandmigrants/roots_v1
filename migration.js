mapboxgl.accessToken =
  "pk.eyJ1Ijoibndhamlha3UiLCJhIjoiY2x3amphbXZ2MG02YTJscDRmcXE3MDllZCJ9.RwnwQjJ1U0Y95kTvA-4i7g"; // Replace with your Mapbox access token

// Initialize the map if not already defined
if (typeof migrationMap === "undefined" || migrationMap === null) {
  var migrationMap = new mapboxgl.Map({
    container: "mapMig",
    style: {
      version: 8,
      sources: {
        esriWorldPhysical: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution:
            "Esri, HERE, Garmin, FAO, NOAA, USGS, Intermap, METI, © OpenStreetMap contributors, and the GIS User Community",
        },
      },
      glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
      layers: [
        {
          id: "esriWorldPhysical-layer",
          type: "raster",
          source: "esriWorldPhysical",
          minzoom: 0,
          maxzoom: 22,
          paint: {
            "raster-opacity": 0.3, // Increase this value to make the basemap less transparent
          },
        },
      ],
    },
    center: [-98.35, 39.5],
    zoom: 4,
  });
  console.log("Migration map initialized.");
} else {
  console.log("Migration map already initialized.");
}

(function () {
  const shapefiles = {
    1800: "states/states1800.json",
    1810: "states/states1810.json",
    1820: "states/states1820.json",
    1830: "states/states1830.json",
    1840: "states/states1840.json",
    1850: "states/states1850.json",
    1860: "states/states1860.json",
    1870: "states/states1870.json",
    1880: "states/states1880.json",
    1890: "states/states1890.json",
    1900: "states/state1900.geojson",
    1910: "states/states1920.geojson",
  };

  const csvFiles = {
    1800: "assets/flow/result_netflow_ratio18001809.csv",
    1810: "assets/flow/result_netflow_ratio18101819.csv",
    1820: "assets/flow/result_netflow_ratio18201829.csv",
    1830: "assets/flow/result_netflow_ratio18301839.csv",
    1840: "assets/flow/result_netflow_ratio18401849.csv",
    1850: "assets/flow/result_netflow_ratio18501859.csv",
    1860: "assets/flow/result_netflow_ratio18601869.csv",
    1870: "assets/flow/result_netflow_ratio18701879.csv",
    1880: "assets/flow/result_netflow_ratio18801889.csv",
    1890: "assets/flow/result_netflow_ratio18901899.csv",
    1900: "assets/flow/result_netflow_ratio19001909.csv",
    1910: "assets/flow/result_netflow_ratio19201929.csv",
  };

  const textContent = {
    1800: "<p>When King James I succeeded Queen Elizabeth I in 1603(17th Century), he focused on establishing new colonies to supply raw goods. In 1606, he authorized the creation of the Virginia Company of London. Soon after, in 1607, 104 English men and boys arrived in Virginia, sailed up a river they named the James River, and built a settlement called Jamestown on its banks. Over time, indentured servants from England, who agreed to work for 4-7 years in exchange for transport across the Atlantic, were used to cultivate tobacco. However, this reliance on indentured servants began to change as people of African descent were brought to Virginia as slaves, marking the beginning of a significant shift in labor practices. Later on, many people moved away in search for fertile lands.</p>",
    1810: "<p>The early 19th century continued to witness westward expansion. The Louisiana Purchase in 1803 doubled the size of the United States, providing vast new territories for settlement and spurring migration to areas like Missouri, Arkansas, and the Dakota Territory. However, by 1812 popularly known as the war of 1812, broke between United Sates and United Kingdom causing displacement and migration, particularly in the Great Lakes region and the South, as conflicts and shifting borders disrupted communities.</p>",
    1820: "<p>One of the key events during this period was facilitated by the completion of the Erie Canal in 1825. This water route connected the Atlantic Ocean to the Great Lakes, making it easier for settlers to move to the Midwest and for goods to be transported. New York City emerged as a major port and trade center, and the Midwest saw increased settlement in states like Michigan and Wisconsin.</p>",
    1830: "<p>The Indian Removal Act of 1830 was introduced which resulted in relocating Native American tribes from their ancestral lands in the southeastern United States to territories west of the Mississippi River, in present-day Oklahoma. This led to the infamous Trail of Tears, during which thousands of Native Americans such as the Cherokees who were forcibly moved west died from exposure, disease, and starvation during the arduous journey. </p>",
    1840: "<p>The concept of Manifest Destiny, which emerged in the mid-19th century, drove the expansion of the United States across the continent. Coined by newspaper editor John O'Sullivan in 1845, the phrase represented the belief that the United States was destined to expand westward. This ideology justified the acquisition of territories and motivated settlers to move to Oregon Country, Texas, and the lands acquired from Mexico following the Mexican - American War</p>",
    1850: "<p>The Texas Revolution and its subsequent annexation by the United States in 1845 further encouraged migration into Texas. Settlers were drawn by the promise of land and the opportunity to build new lives in the expansive territory. The treat of Guadalupe-Hidalgo eventually ended the war. Both the two parties involved in the treaty knew of the presence of golf because the war was about borders and territories.  Few years later, there was a discovery of gold in California in 1848 set off a huge wave of migration in American history. People from across the United States and around the globe moved into California in hopes of making ends meet. The Gold Rush not only populated California but also spurred the development of infrastructure and commerce in the West. This trend reduced by 1858 when silver was discovered in Nevada. The Mormon trail migration which began in Illinois through Iowa and Nebraska was one of the remarkable events in the history of the westward migration after the assassination of Joseph Smith in 1844 who was the founder of Mormonism. Unlike the migration to California in search of better life, the Mormon pioneers moved involuntarily because of expulsion from Illinois and Missouri by hostile neighbors eventually settling in todays, Salt Lake Valley, Utah</p>",
    1860: "<p>The Oregon Trail, widely used in the 1840s-1860s, facilitated mass migration to the Pacific Northwest, particularly to Oregon, Washington, and California. Settlers sought new opportunities and fertile land, enduring arduous journeys across the continent. The construction of the Transcontinental Railroad, completed in 1869, further increased migration. This project connected the eastern U.S. rail network with the Pacific coast, drastically reducing travel time and making it easier for people to move west. The railroad passed through several states, including California, Nevada, Utah, Wyoming, Colorado, Kansas and Nebraska, opening the interior of the country to settlement.Immigrants, particularly from China and Ireland, were instrumental in building the railroads and subsequently settled in various parts of the country. The railroads facilitated state-to-state migration by making travel faster, and more affordable. This led to increased movement between states, as people sought new opportunities in the growing towns and cities along the railroad lines. The railroads also made it easier to transport agricultural products from the Great Plains to markets in the East, encouraging farmers to settle in states like Iowa, Nebraska, and Kansas.</p>",
    1870: "<p>The Civil War, which began in 1861, and its aftermath brought significant changes to migration patterns. President Abraham Lincoln signed the Homestead Act on May 20, 1862, during the Civil War. The act provided that any adult citizen, or future citizen, who had never borne arms against the U.S. government could claim 160 acres of surveyed government land.In reality, few laborers and farmers could afford to build a farm or acquire the necessary tools, seed, and livestock. Most of those who purchased land under the act came from areas quite close to their new homesteads (Iowans moved to Nebraska, Minnesotans to South Dakota, and so on). Unfortunately, the act was framed so ambiguously that it seemed to invite fraud, and early modifications by Congress only compounded the problem. Most of the land went to speculators, cattlemen, miners, lumbermen, and railroads. Of some 500 million acres dispersed by the General Land Office between 1862 and 1904, only 80 million acres went to homesteaders. Indeed, small farmers acquired more land under the Homestead Act in the 20th century than in the 19th. The Post-Civil War Reconstruction era (1865-1877) saw efforts to rebuild the South and integrate formerly enslaved African Americans into society. This period led to significant internal migration and displacement, particularly of African Americans moving to Southern cities in search of economic opportunities and safety from rural areas.</p>",
    1880: "<p>The Industrial Revolution often referred to as the Age of mass migration (1850-1920) ,  in the late 19th and early 20th centuries led to the rapid industrialization of cities across the North and Midwest, including Pittsburgh, Detroit, and Cleveland. These cities attracted millions of people from rural areas and abroad to work in factories and industries. The promise of jobs and economic opportunities drew people to urban centers, transforming the demographic landscape of the country.</p>",
    1890: "<p>This period saw a major moverment of Spanish-American War troops in 1898 Troops move from Southern states like Georgia, Alabama, and Texas, as well as Eastern states like New York, Pennsylvania, and Massachusetts, were deployed to conflict zones. Major embarkation points included Tampa, Florida, and San Francisco, California. After the war, territories such as Puerto Rico, Guam, and the Philippines saw an influx of U.S. military personnel and settlers, while many returning soldiers moved to new areas within the United States.</p>",
    1900: "<p>Following the Chinese Exclusion Act, the Immigration ACT in 1917 barred immigration from the Asia-Pacific.</p>",
    1910: "<p>The Great Depression of the 1930s caused widespread economic hardship and significant internal migration. The collapse of the agricultural market led to mass foreclosures on farms, especially in the Midwest. Many displaced farmers and their families, often referred to as Okies because many came from Oklahoma, migrated to California in search of work. The agricultural valleys of California, including the Central Valley, saw an influx of these migrants who hoped to find jobs on farms and orchards. Cities like Los Angeles and San Francisco also saw increased migration as people sought employment in urban centers.Also, internally, The Dust Bowl of the 1930s exacerbated the hardships of the Great Depression, causing severe dust storms that devastated the Great Plains. Thousands of farming families were displaced from states like Kansas, Colorado, Oklahoma, Texas, and New Mexico. These Dust Bowl refugees migrated to California, seeking work and better living conditions. Most of these people move towards other counties within their states which were not affected.World War II (1939-1945) significantly impacted migration within the United States. The war effort led to increased movement to industrial centers, shipyards, and military bases, particularly on the West Coast. States like California and Washington saw substantial population growth due to the demand for military production and support industries. The GI Bill, passed in 1944, provided returning World War II veterans with benefits, including low-cost mortgages and tuition for education, facilitating the post-war suburban boom and further internal migration.</p>",
  };

  let previousGeojsonData = null;
  let previousLabelData = null;

  function getNameField(data) {
    const possibleFields = ["STATENAM", "STATE_ABBR", "LABEL"];
    const properties = data.features[0].properties;
    for (let field of possibleFields) {
      if (properties.hasOwnProperty(field)) {
        return field;
      }
    }
    return "name"; // Fallback if no match is found
  }

  function getCentroid(geometry) {
    if (geometry.type === "Polygon") {
      return turf.centroid(geometry).geometry.coordinates;
    } else if (geometry.type === "MultiPolygon") {
      let largestPolygon = geometry.coordinates.reduce((a, b) => {
        return turf.area(turf.polygon(a)) > turf.area(turf.polygon(b)) ? a : b;
      });
      return turf.centroid(turf.polygon(largestPolygon)).geometry.coordinates;
    }
  }

  function prepareLabelData(data, nameField) {
    const labelFeatures = data.features.map((feature) => {
      const centroid = getCentroid(feature.geometry);
      return {
        type: "Feature",
        properties: {
          name: feature.properties[nameField],
        },
        geometry: {
          type: "Point",
          coordinates: centroid,
        },
      };
    });
    return {
      type: "FeatureCollection",
      features: labelFeatures,
    };
  }

  function calculateBoundarySimilarity(geojson1, geojson2) {
    const area1 = turf.area(geojson1);
    const area2 = turf.area(geojson2);
    let intersection;
    try {
      intersection = turf.intersect(geojson1, geojson2);
    } catch (e) {
      console.error("Error calculating intersection:", e);
      return 0; // Return 0 similarity if intersection fails
    }
    const intersectionArea = intersection ? turf.area(intersection) : 0;
    return intersectionArea / Math.min(area1, area2);
  }

  function loadCSVData(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load CSV file: ${url}`);
        }
        return response.text();
      })
      .then((csvText) => {
        console.log("CSV Text:", csvText); // Log CSV text for debugging
        const parsedData = d3.csvParse(csvText, (d) => {
          d.rootsid = +d.rootsid; // Convert rootsid to number
          d.Netflow_Ratio = +d.Netflow_Ratio; // Convert Netflow_Ratio to number
          return d;
        });
        console.log("Parsed CSV Data:", parsedData); // Log parsed CSV data for debugging
        return parsedData;
      })
      .catch((error) => console.error("Error loading CSV file:", error));
  }

  function mergeData(geojson, csvData) {
    const csvMap = new Map(csvData.map((row) => [row.rootsid, row]));

    geojson.features.forEach((feature) => {
      const csvRow = csvMap.get(feature.properties.rootsid);
      console.log("GeoJSON Feature:", feature);
      console.log("CSV Row:", csvRow); // Log csvRow variable
      if (csvRow) {
        feature.properties = { ...feature.properties, ...csvRow };
      }
    });

    return geojson;
  }

  function createColorScale(values) {
    const breaks = [-0.15, 0, 0.15, 0.3, 0.45, 0.7];
    const colors = ["#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"];

    const scale = d3.scaleThreshold().domain(breaks).range(colors);

    return scale;
  }

  function loadShapefile(year) {
    const shapefileUrl = shapefiles[year];
    const csvUrl = csvFiles[year];

    console.log(`Loading shapefile from ${shapefileUrl}`);
    console.log(`Loading CSV data from ${csvUrl}`);

    Promise.all([
      fetch(shapefileUrl).then((response) => response.json()),
      loadCSVData(csvUrl),
    ])
      .then(([geojsonData, csvData]) => {
        console.log("GeoJSON Data:", geojsonData);
        console.log("CSV Data:", csvData);

        const mergedData = mergeData(geojsonData, csvData);
        const nameField = getNameField(mergedData);
        const values = mergedData.features
          .map((feature) => feature.properties.Netflow_Ratio)
          .filter((v) => v !== null && !isNaN(v));
        const colorScale = createColorScale(values);

        mergedData.features.forEach((feature) => {
          if (
            feature.properties.Netflow_Ratio !== null &&
            !isNaN(feature.properties.Netflow_Ratio)
          ) {
            feature.properties.color = colorScale(
              feature.properties.Netflow_Ratio
            );
          } else {
            feature.properties.color = "lightgrey"; // Set color for null or NaN values
          }
        });

        let labelData;
        if (
          previousGeojsonData &&
          calculateBoundarySimilarity(previousGeojsonData, mergedData) > 0.95
        ) {
          labelData = previousLabelData;
          console.log(`Reusing labels from previous year for ${year}`);
        } else {
          labelData = prepareLabelData(mergedData, nameField);
          previousLabelData = labelData;
          previousGeojsonData = mergedData;
          console.log(`Generated new labels for year ${year}`);
        }

        if (migrationMap.getSource("us-boundaries")) {
          migrationMap.getSource("us-boundaries").setData(mergedData);
          migrationMap.getSource("us-boundaries-labels").setData(labelData);
        } else {
          migrationMap.addSource("us-boundaries", {
            type: "geojson",
            data: mergedData,
          });
          migrationMap.addLayer({
            id: "us-boundaries-layer",
            type: "fill",
            source: "us-boundaries",
            layout: {},
            paint: {
              "fill-color": ["get", "color"],
              "fill-outline-color": "rgba(200, 200, 200, 0.5)", // Increase outline opacity
            },
          });
          migrationMap.addLayer({
            id: "us-boundaries-outline-layer",
            type: "line",
            source: "us-boundaries",
            layout: {},
            paint: {
              "line-color": "black", // Outline color
              "line-width": 0.2, // Increase outline width
            },
          });
          migrationMap.addSource("us-boundaries-labels", {
            type: "geojson",
            data: labelData,
          });
          migrationMap.addLayer({
            id: "us-boundaries-labels-layer",
            type: "symbol",
            source: "us-boundaries-labels",
            layout: {
              "text-field": ["get", "name"],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 10, // Increased font size
              "text-transform": "none", //
              "text-letter-spacing": 0.05, // Added letter spacing
              "text-offset": [0, 0.6],
              "text-anchor": "top",
              "text-keep-upright": true,
              "text-variable-anchor": ["center"],
            },
            paint: {
              "text-color": "black",
              "text-halo-color": "white", // Added halo color
              "text-halo-width": 1, // Added halo width
            },
          });
        }

        document.getElementById(
          "year-label-migration"
        ).textContent = `Year: ${year}`;
        document.getElementById("migration-text-section").innerHTML =
          textContent[year];
        document.getElementById("legends-year").textContent = year;
      })
      .catch((error) =>
        console.error("Error loading shapefile or CSV data:", error)
      );
  }

  // Function to toggle the visibility of the legend
  function toggleLegendVisibility(visible) {
    const legend = document.getElementById("maps-legends");
    if (legend) {
      legend.style.display = visible ? "block" : "none";
    }
  }

  // Function to update the north arrow
  function updateNorthArrow(map) {
    const bearing = map.getBearing();
    const northArrow = document.getElementById("north-arrows");
    if (northArrow) {
      northArrow.style.transform = `rotate(${-bearing}deg)`;
      console.log(`North arrow rotated to ${-bearing} degrees`);
    } else {
      console.error("North arrow element not found in updateNorthArrow");
    }
  }

  migrationMap.on("load", () => {
    console.log("Migration map loaded.");
    loadShapefile(1800);

    document
      .getElementById("slider-migration")

      .addEventListener("input", function () {
        const year = this.value;

        console.log(`Slider value changed to ${year}`);
        loadShapefile(year);
      });

    migrationMap.on("rotate", () => updateNorthArrow(migrationMap));

    // Example usage to show the legend
    toggleLegendVisibility(true);
  });
})();
