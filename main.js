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
  $("#modalText").text("Modal should be shown now, name: " + name);
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

// function updateHTMLSquares() {
//   scene.traverse(function (child) {
//     if (child instanceof THREE.Mesh && child.name.startsWith("Box")) {
//       const colorHex = child.material.color.getHexString();
//       const squareId = child.name.replace("Box", "");
//       if (squareId >= 1 && squareId <= 6) {
//         $(`.square_p${squareId}`).css("background-color", `#${colorHex}`);
//       }
//     }
//   });
// }

function updateHTMLSquaresForBox(boxName) {
  const square1Id = "square_p1";
  const square2Id = "square_p2";
  const square3Id = "square_p3";

  var colorHex1 = "";
  let colorHex2 = "";
  let colorHex3 = "";

  switch (boxName) {
    case "Box1":
    case "Box1_1":
    case "Box1_2":
      colorHex1 = getColorHexString("Box1");
      colorHex2 = getColorHexString("Box1_1");
      colorHex3 = getColorHexString("Box1_2");
      console.log("Color: ", colorHex1);
      console.log("Color: ", colorHex2);

      break;
    case "Box2":
    case "Box2_1":
    case "Box2_2":
      colorHex1 = getColorHexString("Box2");
      colorHex2 = getColorHexString("Box2_1");
      colorHex3 = getColorHexString("Box2_2");

      break;
    case "Box3":
    case "Box3_1":
    case "Box3_2":
      colorHex1 = getColorHexString("Box3");
      colorHex2 = getColorHexString("Box3_1");
      colorHex3 = getColorHexString("Box3_2");

      break;
    case "Box4":
    case "Box4_1":
    case "Box4_2":
      colorHex1 = getColorHexString("Box4");
      colorHex2 = getColorHexString("Box4_1");
      colorHex3 = getColorHexString("Box4_2");

      break;
    case "Box5":
    case "Box5_1":
    case "Box5_2":
      colorHex1 = getColorHexString("Box5");
      colorHex2 = getColorHexString("Box5_1");
      colorHex3 = getColorHexString("Box5_2");

      break;
    case "Box6":
    case "Box6_1":
    case "Box6_2":
      colorHex1 = getColorHexString("Box6");
      colorHex2 = getColorHexString("Box6_1");
      colorHex3 = getColorHexString("Box6_2");

      break;
    // Add cases for other boxes if needed
    default:
      // Handle other cases or do nothing
      break;
  }

  // Update the background colors of the HTML div squares
  $(`.${square1Id}`).css("background-color", `#${colorHex1}`);
  $(`.${square2Id}`).css("background-color", `#${colorHex2}`);
  $(`.${square3Id}`).css("background-color", `#${colorHex3}`);
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
