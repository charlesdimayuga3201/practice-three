import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

animation;
loader.load(
  // resource URL
  "/met4racks.glb",
  // called when the resource is loaded
  function (gltf) {
    // const root = gltf.scene;
    // const shelf = root.getObjectByName('Shelf_Supports_12');
    // scene.add(shelf)
    scene.add(gltf.scene);
    console.log(gltf.scene);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
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
    object.material.opacity = 0.5;
    showModal(object.name);
  }
}

function createLights() {
  const ambientLight = new AmbientLight("white", 1);

  const mainLight = new DirectionalLight("white", 1);
  mainLight.position.set(12, 18, 19);

  return { ambientLight, mainLight };
}
const { ambientLight, mainLight } = createLights();

function showModal(name) {
  // $("#modalText").text("Modal should be shown now, name: " + name);
  updateHTMLSquaresForBox(name);
  // Show the modal
  $("#infoModal").css("display", "block");
  //   $("#infoModal").css("display", "flex");

  // When the user clicks on (x), close the modal
  $(".close").click(function () {
    $("#infoModal").css("display", "none");
  });
}

// Optional: Close the modal if the user clicks outside of it
window.onclick = function (event) {
  if ($(event.target).is("#infoModal")) {
    $("#infoModal").css("display", "none");
  }
};

function updateHTMLSquaresForBox(boxName) {
  btn1.onclick = function () {
    displayBoxInfo(boxesToHandle[0]);
  };
  btn2.onclick = function () {
    displayBoxInfo(boxesToHandle[1]);
  };
  btn3.onclick = function () {
    displayBoxInfo(boxesToHandle[2]);
  };

  var baseNameParts = boxName.split("_");
  var baseBoxName = baseNameParts[0];
  console.log("Parts", baseNameParts);
  var boxesToHandle = [baseBoxName, `${baseBoxName}_1`, `${baseBoxName}_2`];
  console.log("Boxes to handle", boxesToHandle);
  console.log(
    "Boxes Names",
    baseBoxName,
    `${baseBoxName}_1`,
    `${baseBoxName}_2`
  );
  let colorHexes = boxesToHandle.map((name) => getColorHexString(name));
  $("#modalText").text("Modal should be shown now, name: " + boxesToHandle);
  console.log("Colors: ", colorHexes.join(", "));

  colorHexes.forEach((colorHex, index) => {
    $(`.square_p${index + 1}`).css("background-color", `#${colorHex}`);
  });
}

function getColorHexString(boxName) {
  const object = scene.getObjectByName(boxName);
  console.log("BoxName: ", object);

  if (object) {
    return object.material.color.getHexString();
  }
  return "";
}

function animation() {
  scene.add(ambientLight, mainLight);

  controls.update();

  renderer.render(scene, camera);
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal

var btn1 = document.getElementById("myBtn1");
var btn2 = document.getElementById("myBtn2");
var btn3 = document.getElementById("myBtn3");

var boxes = document.querySelectorAll(".pallet_content > div");

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
$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "data.xml",
    dataType: "xml",
    success: function (xml) {
      parseXml(xml);
    },
  });
});

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

      $(".pallet_content").append(`
          <div class="${classname}" style="display: none;">
            <p>Warehouse: ${warehouse}</p>
            <p>Storage Type: ${storageType}</p>
            <p>Pallet Content: ${palletContent}</p>
            <p>Pallet Status: ${palletStatus}</p>
          </div>
        `);
    });
}
