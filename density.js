document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired for density.js");

  const loader = document.getElementById("loader");
  const tooltip = d3.select("#tooltip");

  const densityNamespace = {
    mapboxToken:
      "pk.eyJ1Ijoibndhamlha3UiLCJhIjoiY2x3amphbXZ2MG02YTJscDRmcXE3MDllZCJ9.RwnwQjJ1U0Y95kTvA-4i7g",
    shapefiles: {
      1800: "geojson/harvard-nhgis-pop1800-geojson.json",
      1810: "geojson/harvard-nhgis-pop1810-geojson.json",
      1820: "geojson/harvard-nhgis-pop1820-geojson.json",
      1830: "geojson/harvard-nhgis-pop1830-geojson.json",
      1840: "geojson/harvard-nhgis-pop1840-geojson.json",
      1850: "geojson/harvard-nhgis-pop1850-geojson.json",
      1860: "geojson/harvard-nhgis-pop1860-geojson.json",
      1870: "geojson/harvard-nhgis-pop1870-geojson.json",
      1880: "geojson/harvard-nhgis-pop1880-geojson.json",
      1890: "geojson/harvard-nhgis-pop1890-geojson.json",
      1900: "geojson/harvard-nhgis-pop1900-geojson.json",
      1910: "geojson/harvard-nhgis-pop1910-geojson.json",
      1920: "geojson/harvard-nhgis-pop1920-geojson.json",
      1930: "geojson/harvard-nhgis-pop1930-geojson.json",
      1940: "geojson/harvard-nhgis-pop1940-geojson.json",
      1950: "geojson/harvard-nhgis-pop1950-geojson.json",
    },
    previousLabelData: null,
    previousGeojsonData: null,
    similarityThreshold: 0.95, // Adjust this threshold as needed
    init: function () {
      console.log("Initializing densityNamespace");

      mapboxgl.accessToken = this.mapboxToken;

      this.map = new mapboxgl.Map({
        container: "mapDen",
        style: {
          version: 8,
          sources: {
            esriWorldPhysical: {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
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
                "raster-opacity": 0.3,
              },
            },
          ],
        },
        center: [-98.35, 39.5],
        zoom: 4,
      });
      // Add this:
      this.map.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 150,      
          unit: "metric"     
        }),
        "bottom-left"          
      );

      this.map.on("load", () => {
        console.log("Map loaded, loading initial data for 1800");
        this.loadMapData(1800);
      });

      this.map.on("rotate", () => this.updateNorthArrow());

      const slider = document.getElementById("slider-density");
      const yearLabel = document.getElementById("year-label-density");
      const legendYear = document.getElementById("legend-year");

      slider.addEventListener("input", (e) => {
        const year = e.target.value;
        yearLabel.textContent = `Year: ${year}`;
        legendYear.textContent = year;

        console.log(`Slider input changed, loading data for year: ${year}`);
        this.loadMapData(year);
      });
    },
    updateNorthArrow: function () {
      const bearing = this.map.getBearing();
      const northArrow = document.getElementById("norths-arrow");
      if (northArrow) {
        northArrow.style.transform = `rotate(${-bearing}deg)`;
      } else {
        console.error("North arrow element not found");
      }
    },
    getNameFields: function (data) {
      const stateNameField = "STATENAM";
      const countyNameField = "NHGISNAM";
      const properties = data.features[0].properties;

      if (
        !properties.hasOwnProperty(stateNameField) ||
        !properties.hasOwnProperty(countyNameField)
      ) {
        console.error("Required fields not found in the data.");
        return null;
      }

      return { stateNameField, countyNameField };
    },
    getCentroid: function (geometry) {
      if (geometry.type === "Polygon") {
        return turf.centroid(geometry).geometry.coordinates;
      } else if (geometry.type === "MultiPolygon") {
        let largestPolygon = geometry.coordinates.reduce((a, b) => {
          return turf.area(turf.polygon(a)) > turf.area(turf.polygon(b))
            ? a
            : b;
        });
        return turf.centroid(turf.polygon(largestPolygon)).geometry.coordinates;
      }
    },
    prepareLabelData: function (data, fields) {
      const stateGroups = data.features.reduce((acc, feature) => {
        const stateName = feature.properties[fields.stateNameField];
        const countyName = feature.properties[fields.countyNameField];
        const centroid = this.getCentroid(feature.geometry);
        if (!acc[stateName]) {
          acc[stateName] = [];
        }
        acc[stateName].push({
          type: "Feature",
          properties: {
            name: stateName,
            county: countyName,
          },
          geometry: {
            type: "Point",
            coordinates: centroid,
          },
        });
        return acc;
      }, {});

      const labelFeatures = Object.values(stateGroups).map((features) => {
        const sortedFeatures = features.sort((a, b) => {
          return (
            a.geometry.coordinates[0] - b.geometry.coordinates[0] ||
            a.geometry.coordinates[1] - b.geometry.coordinates[1]
          );
        });
        const middleIndex = Math.floor(sortedFeatures.length / 2);
        return sortedFeatures[middleIndex];
      });

      return {
        type: "FeatureCollection",
        features: labelFeatures,
      };
    },
    calculatePopulationDensity: function (data) {
      data.features.forEach((feature) => {
        const popTotal = feature.properties.POP_TOTAL;
        const areaSqm = feature.properties.AREA_SQM;

        const areaSqkm = areaSqm / 1000000;

        console.log(
          `Feature: ${feature.properties.STATENAM}, POP_TOTAL: ${popTotal}, AREA_SQKM: ${areaSqkm}`
        );

        if (popTotal && areaSqkm && areaSqkm > 0) {
          feature.properties.popDensity = popTotal / areaSqkm;
        } else {
          feature.properties.popDensity = 0;
          console.log(`Invalid data for ${feature.properties.STATENAM}`);
        }
      });
    },
    getColorScale: function (densities, numClasses) {
      const scale = d3
        .scaleQuantile()
        .domain(densities)
        .range(colorbrewer.Oranges[numClasses]);
      const thresholds = scale.quantiles();

      // Create intervals with colors
      const intervals = [];
      for (let i = 0; i <= thresholds.length; i++) {
        const intervalStart = i === 0 ? d3.min(densities) : thresholds[i - 1];
        const intervalEnd =
          i === thresholds.length ? d3.max(densities) : thresholds[i];
        const color = scale(intervalStart);
        intervals.push({ intervalStart, intervalEnd, color });
      }

      console.log("Intervals:", intervals);

      return {
        scale: (value) => scale(value),
        intervals: intervals,
      };
    },
    calculateBoundarySimilarity: function (geojson1, geojson2) {
      function isValidGeoJSON(geojson) {
        return (
          geojson &&
          geojson.type === "FeatureCollection" &&
          geojson.features &&
          geojson.features.length > 0
        );
      }

      if (!isValidGeoJSON(geojson1) || !isValidGeoJSON(geojson2)) {
        console.error("Invalid GeoJSON data:", geojson1, geojson2);
        return 0; // Return 0 similarity if data is invalid
      }

      const area1 = turf.area(geojson1);
      const area2 = turf.area(geojson2);
      let intersectionArea = 0;

      try {
        const intersection = turf.intersect(geojson1, geojson2);
        intersectionArea = intersection ? turf.area(intersection) : 0;
      } catch (e) {
        console.error("Error calculating intersection:", e);
        console.log("geojson1:", geojson1);
        console.log("geojson2:", geojson2);
      }

      return intersectionArea / Math.min(area1, area2);
    },
    loadMapData: function (year) {
      const url = this.shapefiles[year];
      console.log(`Fetching data for year: ${year} from ${url}`);

      d3.json(url)
        .then((data) => {
          console.log(`Data fetched for year: ${year}`, data);

          const fields = this.getNameFields(data);
          if (!fields) {
            console.error("Required name fields not found in the data.");
            return;
          }

          this.calculatePopulationDensity(data);

          const densities = data.features.map(
            (feature) => feature.properties.popDensity
          );

          const colorInfo = this.getColorScale(densities, 5);

          data.features.forEach((feature) => {
            feature.properties.color = colorInfo.scale(
              feature.properties.popDensity
            );
          });

          let labelData;
          if (
            this.previousGeojsonData &&
            this.calculateBoundarySimilarity(this.previousGeojsonData, data) >
              this.similarityThreshold
          ) {
            labelData = this.previousLabelData;
            console.log(`Reusing labels from previous year for ${year}`);
          } else {
            labelData = this.prepareLabelData(data, fields);
            this.previousLabelData = labelData;
            this.previousGeojsonData = data;
            console.log(`Generated new labels for year ${year}`);
          }

          if (this.map.getSource("polygons")) {
            this.map.getSource("polygons").setData(data);
          } else {
            this.map.addSource("polygons", {
              type: "geojson",
              data: data,
            });
            this.map.addLayer({
              id: "polygon-layer",
              type: "fill",
              source: "polygons",
              paint: {
                "fill-color": ["get", "color"],
                "fill-opacity": 0.9,
                "fill-outline-color": "rgba(200, 200, 200, 0.2)", // Adjusted to a lighter grey with more transparency
              },
            });

            this.map.on("mousemove", "polygon-layer", (e) => {
              if (e.features.length > 0) {
                const feature = e.features[0];
                const popDensity = feature.properties.popDensity.toFixed(2);
                const name = feature.properties.NHGISNAM;

                console.log(
                  `Feature: ${name}, Population Density: ${popDensity}`
                );
                tooltip
                  .style("opacity", 1)
                  .html(
                    `${name} has a population density of ${popDensity} per sqkm`
                  )
                  .style("left", `${e.originalEvent.pageX + 10}px`)
                  .style("top", `${e.originalEvent.pageY + 10}px`);
              }
            });

            this.map.on("mouseleave", "polygon-layer", () => {
              tooltip.style("opacity", 0);
            });
          }

          if (this.map.getSource("labels")) {
            this.map.getSource("labels").setData(labelData);
          } else {
            this.map.addSource("labels", {
              type: "geojson",
              data: labelData,
            });
            this.map.addLayer({
              id: "us-boundaries-labels-layer",
              type: "symbol",
              source: "labels",
              layout: {
                "text-field": ["get", "name"],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 10,
                "text-transform": "none",
                "text-letter-spacing": 0.05,
                "text-offset": [0, 0.6],
                "text-anchor": "top",
                "text-keep-upright": true,
                "text-variable-anchor": ["center"],
              },
              paint: {
                "text-color": "black",
                "text-halo-color": "white",
                "text-halo-width": 1,
              },
            });
          }

          loader.style.display = "none";
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
  };

  densityNamespace.init();
});
