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
  "/mets4_racks.glb",
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
  const filteredIntersects = intersects.filter((intersect) => {
    // Example: Check if the intersected object has a name
    console.log("LOG: " + intersects.map((intersect) => intersect.object.name));
    console.log("Intersects: ", intersects);
    /*console.log("LOG Group Object"  + intersects.map(intersect => intersect.object.name));*/

    return intersect.object.name;
  });
  //   console.log(intersects.map((intersect) => intersect.object.parent[0]));
  if (filteredIntersects.length > 0) {
    console.log("Filtered: ", filteredIntersects[0].object.name);
    const object = filteredIntersects[0].object;
    if (
      object.name === "Box1" ||
      object.name === "Box2" ||
      object.name === "Box3" ||
      object.name === "Box4" ||
      object.name === "Box5" ||
      object.name === "Box6"
    ) {
      object.material.color.set("green");
      //   console.log("color: ", object.material.color);

      const colorHex = object.material.color.getHexString();
      const squareId = object.name.replace("Box", "");
      $(`.square_p${squareId}`).css("background-color", `#${colorHex}`);
      // Apply this color to corresponding CSS square

      if (object.name === "Box1" || object.name === "Box2") {
        $(".square_p1,.square_p2").show(); // Show Square 1

        $(`.square_p${squareId}`).css("background-color", `#${colorHex}`);
        $(".square_p3,.square_p4,.square_p5,.square_p6").hide(); // Hide Square 2
      } else if (object.name === "Box3" || object.name === "Box4") {
        $(".square_p1,.square_p2,.square_p5,.square_p6").hide();

        $(`.square_p${squareId}`).css("background-color", `#${colorHex}`);
        $(".square_p3,.square_p4").show();
      } else if (object.name === "Box5" || object.name === "Box6") {
        $(".square_p1,.square_p2,.square_p3,.square_p4").hide();

        $(`.square_p${squareId}`).css("background-color", `#${colorHex}`);
        $(".square_p5,.square_p6").show();
      }

      showModal(object.name);
    }
    //const objectParent = filteredIntersects[0].object.parent;
    //console.log("Parent: ", filteredIntersects[0].object.parent);
    //if (objectParent.name = "pallet_racks2_4") {
    //	objectParent.object.parent.color.set("red");
    //	showModal(objectParent.name);
    //}
  }
}

//	function showModal(name) {
//		console.log("Selected Name: ", name);

//		alert('Modal should be shown now, name: '+ name);
//}

function createLights() {
  const ambientLight = new AmbientLight("white", 1);

  const mainLight = new DirectionalLight("white", 1);
  mainLight.position.set(12, 18, 19);

  return { ambientLight, mainLight };
}
const { ambientLight, mainLight } = createLights();

function showModal(name) {
  $("#modalText").text("Modal should be shown now, name: " + name);

  // Show the modal
  $("#infoModal").css("display", "block");

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

function animation() {
  scene.add(ambientLight, mainLight);

  controls.update();

  renderer.render(scene, camera);
}
