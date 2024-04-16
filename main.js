import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import { AmbientLight, DirectionalLight, HemisphereLight } from "three";
const width = window.innerWidth,
  height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera(10, width / height, 0.01, 1000);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animation);
// document.body.appendChild(renderer.domElement);
document.getElementById("webgl-container").appendChild(renderer.domElement);
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);
scene.background = new THREE.Color("#dfedf0");
animation;
loader.load(
  // resource URL
  "/bmetrack.glb",
  // called when the resource is loaded
  function (gltf) {
    // const root = gltf.scene;
    // const shelf = root.getObjectByName('Shelf_Supports_12');
    // scene.add(shelf)
    scene.add(gltf.scene);
    console.log(gltf.scene);

    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Group
    // gltf.scenes; // Array<THREE.Group>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object

    // parseXml(xml);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log(error);
  }
);

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = 3;
// camera.rotation.y = -4;
const controls = new OrbitControls(camera, renderer.domElement);

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 100, 100);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener("click", onClick);

function onClick(event) {
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  const validBoxPrefix = "Box";
  const filteredIntersects = intersects.filter((intersect) =>
    intersect.object.name.startsWith(validBoxPrefix)
  );

  console.log("LOG: " + intersects.map((intersect) => intersect.object.name));
  console.log("Intersects: ", intersects);
  if (filteredIntersects.length > 0) {
    const object = filteredIntersects[0].object;
    // object.material.opacity = 0.5;
    showModal(object.name);
  }
}
const { ambientLight, mainLight } = createLights();
function createLights() {
  const ambientLight = new AmbientLight("white", 1);

  const mainLight = new DirectionalLight("white", 1);
  mainLight.position.set(12, 18, 19);

  return { ambientLight, mainLight };
}

function showModal(name) {
  // $("#modalText").text("Modal should be shown now, name: " + name);
  updateHTMLSquaresForBox(name);

  $("#infoModal").css("display", "block");
  // $("#infoModal").css("display", "flex");

  $(document).on("click", ".close", function () {
    $("#infoModal").css("display", "none");
  });
}

// function updateHTMLSquaresForBox(boxName) {
//   btn1.onclick = function () {
//     displayBoxInfo(boxesToHandle[0]);
//   };
//   btn2.onclick = function () {
//     displayBoxInfo(boxesToHandle[1]);
//   };
//   btn3.onclick = function () {
//     displayBoxInfo(boxesToHandle[2]);
//   };

//   var baseNameParts = boxName.split("_");
//   var baseBoxName = baseNameParts[0];
//   console.log("Parts", baseNameParts);
//   var boxesToHandle = [baseBoxName, `${baseBoxName}_1`, `${baseBoxName}_2`];
//   console.log("Boxes to handle", boxesToHandle);
//   console.log(
//     "Boxes Names",
//     baseBoxName,
//     `${baseBoxName}_1`,
//     `${baseBoxName}_2`
//   );
//   let colorHexes = boxesToHandle.map((name) => getColorHexString(name));
//   $("#modalText").text("Modal should be shown now, name: " + boxesToHandle);

//   // $(".pallet1").text(boxesToHandle[0]);
//   // $(".pallet2").text(boxesToHandle[1]);
//   // $(".pallet3").text(boxesToHandle[2]);
//   console.log("Colors: ", colorHexes.join(", "));

//   colorHexes.forEach((colorHex, index) => {
//     $(`.square_p${index + 1}`).css("background-color", `#${colorHex}`);
//   });
// }

// function getColorHexString(boxName) {
//   const object = scene.getObjectByName(boxName);
//   console.log("BoxName: ", object);

//   if (object) {
//     return object.material.color.getHexString();
//   }
//   return "";
// }
function animation() {
  scene.add(ambientLight, mainLight);

  controls.update();

  renderer.render(scene, camera);
}
function updateHTMLSquaresForBox(boxName) {
  // Extract the base box name
  var baseBoxName = boxName.split("_")[0];
  // Initialize the boxesToHandle array
  var boxesToHandle = [];

  // Dynamically generate boxesToHandle with the base box and two numbered boxes
  for (let i = 0; i < 3; i++) {
    boxesToHandle.push(i === 0 ? baseBoxName : `${baseBoxName}_${i}`);
  }
  // Update modal text using jQuery
  $("#modalText").text(
    "Modal should be shown now, name: " + boxesToHandle.join(", ")
  );

  // Dynamically set colors based on box status
  boxesToHandle.forEach((name, index) => {
    let status = boxDataFromXML[name]; // Assuming you have a way to get the box's status
    let color = statusToColor(status); // Convert status to color
    console.log("Status Color: " + color);
    $(`#myBtn${index + 1}`).off("mouseenter mouseleave click");
    $(`#myBtn${index + 1}`)
      .on("mouseenter", (event) => {
        const box = scene.getObjectByName(name);
        // displayBoxInfo(name);
        box.material.color.set(color);
        scene.traverse((obj) => {
          if (obj.name.startsWith("Box") && obj.name !== name) {
            console.log("Test: ", obj.name);
            obj.material.transparent = true;
            obj.material.opacity = 0.2;
            obj.material.needsUpdate = true;
            // obj.material.opacity = 0.1;
            // obj.material.opacity = 0.2;
          }

          // console.log(obj.name, name);
        });
      })
      .on("click", (event) => {
        displayBoxInfo(name);
        const box = scene.getObjectByName(name);
        // displayBoxInfo(name);
        box.material.color.set(color);
      })
      .on("mouseleave", (event) => {
        const box = scene.getObjectByName(name);
        box.material.color.set("black");
        scene.traverse((obj) => {
          if (obj.name.startsWith("Box")) {
            obj.material.transparent = false;
            obj.material.opacity = 1;
            obj.material.needsUpdate = true;
            // obj.material.opacity = 0.1;
            // obj.material.opacity = 0.2;
          }
        });
      });
    // Assign onclick and onmouseover for each button using jQuery
    // $(".test")
    //   .off("click mouseover mouseout") // Remove previous event handlers to prevent duplication
    //   .on("click", function () {
    //     displayBoxInfo(name);
    //   })
    //   .on("mouseover", function () {
    //     const box = scene.getObjectByName(name);
    //     console.log(box);

    //     console.log(name);

    //     scene.traverse((obj) => {
    //       if (obj.name === name) {
    //         console.log(obj);
    //         // obj.material.opacity = 0.2;
    //       }
    //     });

    //     console.log("Object: " + name, "Color: " + color);
    //     box.material.color.set(color);
    //   })
    //   .on("mouseout", function () {
    //     const box = scene.getObjectByName(name);
    //     box.material.color.set("black");
    //   });

    console.log(
      "Status: " + status,
      "Color:" + color,
      "boxDatafromXML:" + boxDataFromXML[name]
    );

    // Update square color using jQuery
    $(`.square_p${index + 1}`).css("background-color", color);
  });
}
// Example implementation of statusToColor, adjust as per your requirements
function statusToColor(status) {
  switch (status) {
    case "Full":
      return "green";
    case "Overload":
      return "red";
    case "Empty":
      return "white";
    // Add more cases as necessary
    default:
      return "gray"; // A default case for unexpected statuses
  }
}

var modal = document.getElementById("infoModal");
var span = document.getElementsByClassName("close-second")[0];

function displayBoxInfo(classname) {
  var boxContent = document.querySelector(`.${classname}`);
  if (boxContent) {
    // Hide all box contents
    var allBoxContents = document.querySelectorAll(".pallet_content > div");
    allBoxContents.forEach(function (box) {
      box.style.display = "none";
    });

    // Show the selected box content
    boxContent.style.display = "block";

    // Display the modal
    modal.style.display = "block";
  }
}
span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
$(function () {
  fetch("data.xml")
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      parseXml(xml);
    })
    .catch((error) => console.error("Error fetching the XML:", error));
});

let boxDataFromXML = {};
function parseXml(xml) {
  $(".pallet_content").empty();
  console.log(xml);
  $(xml)
    .find("box")
    .each(function () {
      var classname = $(this).attr("class");
      var warehouse = $(this).find("warehouse").text();
      var storageType = $(this).find("storageType").text();
      var palletContent = $(this).find("palletContent").text();
      var palletStatus = $(this).find("palletStatus").text();
      boxDataFromXML[classname] = palletStatus;
      $(".pallet_content").append(`
          <div class="${classname}" style="display: none;">
              <p>Warehouse: ${warehouse}</p>
              <p>Storage Type: ${storageType}</p>
              <p>Pallet Content: ${palletContent}</p>
              <p>Pallet Status: ${palletStatus}</p>
          </div>
      `);

      // updateBoxColorInThreeJS(classname, palletStatus);
    });
}

// function updateBoxColorInThreeJS(classname, palletStatus) {
//   const boxObject = scene.getObjectByName(classname);

//   if (boxObject) {
//     switch (palletStatus) {
//       case "Empty":
//         boxObject.material.color.set("white");
//         boxObject.material.opacity = 0.5;
//         break;

//       case "Partial":
//         boxObject.material.color.set("blue");
//         break;

//       case "Full":
//         boxObject.material.color.set("green");
//         break;

//       case "Overload":
//         boxObject.material.color.set("red");
//         break;

//       default:
//         break;
//     }
//   }
// }

// SINGLE HOVER
// let hoveredObj = null;
// let originalColor = new THREE.Color();
// function onMouseMove(event) {
//   mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//   mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(scene.children, true);
//   const validBoxPrefix = "Box";
//   const filteredIntersects = intersects.filter((intersect) =>
//     intersect.object.name.startsWith(validBoxPrefix)
//   );

//   if (
//     hoveredObj &&
//     (!filteredIntersects.length || hoveredObj !== filteredIntersects[0].object)
//   ) {
//     // Restore original color if not hovering over the same object
//     hoveredObj.material.color.copy(originalColor);
//     hoveredObj = null;
//   }

//   if (filteredIntersects.length > 0) {
//     const intersected = filteredIntersects[0].object;

//     if (hoveredObj !== intersected) {
//       hoveredObj = intersected;
//       originalColor.copy(intersected.material.color);
//       // showModal(intersected.name);
//       // Change color based on pallet status

//       // Assuming you have a function to map status to color
//       const palletStatus = boxDataFromXML[hoveredObj.name];
//       const color = statusToColor(palletStatus); // Assuming statusToColor function is defined
//       hoveredObj.material.color.set(color);
//     }
//   }
// }

// renderer.domElement.addEventListener("mousemove", onMouseMove);

// MULTIPLE HOVER

// function onMouseMove(event) {
//   mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//   mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(scene.children, true);
//   const validBoxPrefix = "Box";
//   const filteredIntersects = intersects.filter((intersect) =>
//     intersect.object.name.startsWith(validBoxPrefix)
//   );

//   if (hoveredObj) {
//     // Check if we're still hovering over the same object or any of its related boxes
//     if (
//       !filteredIntersects.length ||
//       !boxesInRow.includes(filteredIntersects[0].object)
//     ) {
//       // Restore original colors to all related boxes and clear the list
//       boxesInRow.forEach((box) => {
//         if (box.originalColor) box.material.color.copy(box.originalColor);
//       });
//       boxesInRow = [];
//       hoveredObj = null; // Clear the hovered object since we're no longer hovering over it
//     }
//   }

//   if (
//     filteredIntersects.length > 0 &&
//     (!hoveredObj || !boxesInRow.includes(filteredIntersects[0].object))
//   ) {
//     const intersected = filteredIntersects[0].object;

//     // Clear previous boxesInRow if moving to a new row
//     if (hoveredObj !== intersected) {
//       boxesInRow.forEach((box) => {
//         if (box.originalColor) box.material.color.copy(box.originalColor);
//       });
//       boxesInRow = [];
//     }

//     hoveredObj = intersected;
//     var intersectedRow = intersected.name.split("_")[0];
//     var boxesHandle = [
//       intersectedRow,
//       `${intersectedRow}_1`,
//       `${intersectedRow}_2`,
//     ];
//     boxesHandle.forEach((boxName) => {
//       let box = scene.getObjectByName(boxName);
//       if (box) {
//         boxesInRow.push(box);
//         // Store original color if it hasn't been stored yet
//         if (!box.originalColor) {
//           box.originalColor = box.material.color.clone();
//         }
//         // Optionally change the color, e.g., to indicate hover
//         // showModal(intersected.name);
//         const palletStatus = boxDataFromXML[box.name];
//         const color = statusToColor(palletStatus); // Assumes statusToColor function is defined
//         box.material.color.set(color);
//       }
//     });
//   }
// }

// For Looop
let hoveredObj = null;
let boxesInRow = [];
const originalColors = {};
function onMouseMove(event) {
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  const validBoxPrefix = "Box";
  const filteredIntersects = intersects.filter((intersect) =>
    intersect.object.name.startsWith(validBoxPrefix)
  );

  // Check if previously hovered object is not in the current hover
  if (
    hoveredObj &&
    (!filteredIntersects.length || filteredIntersects[0].object !== hoveredObj)
  ) {
    // Reset all boxes in the row to their original color
    scene.traverse((obj) => {
      if (obj.name.startsWith("Box") && obj.name.startsWith("Box")) {
        obj.material.color.set(originalColors[obj.name]);
        obj.material.transparent = false;
        obj.material.opacity = 1;
        obj.material.needsUpdate = true;
      }
    });
    hoveredObj = null;
    boxesInRow = [];
  }

  if (filteredIntersects.length > 0) {
    const intersected = filteredIntersects[0].object;

    // Detect if the hovered object has changed
    if (hoveredObj !== intersected) {
      hoveredObj = intersected;

      boxesInRow = [];
      var intersectedRow = intersected.name.split("_")[0];

      // Apply new hover effects
      scene.traverse((obj) => {
        if (obj.name.startsWith(intersectedRow)) {
          if (!originalColors[obj.name]) {
            originalColors[obj.name] = obj.material.color.clone();
          }

          obj.material.color.set(statusToColor(boxDataFromXML[obj.name]));
          boxesInRow.push(obj);
        } else if (obj.name.startsWith("Box")) {
          obj.material.transparent = true;
          obj.material.opacity = 0.2;
          obj.material.needsUpdate = true;
        }
      });
    }
  }
}

renderer.domElement.addEventListener("mousemove", onMouseMove);
