import './style.css';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls'; 
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import { GUI } from 'dat.gui';
import GUI from 'lil-gui';

// 1. Utworzenie sceny.
const scene=new THREE.Scene();

// 2. Utworzenie kamery.
const FOV=75; // Pole widzenia;
const AR=window.innerWidth/window.innerHeight; // Współczynnik widzenia.
const viewClose=0.01; // Min. zasięg widzenia.
const viewFar=10000; // Max. zasięg widzenia.
const camera = new THREE.PerspectiveCamera(FOV, AR, viewClose, viewFar); // Kamera.

// 3. Utworzenie rysownika - renderer'a.
const renderer=new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg'),
  antialias:true,
});

// 3.1 Ustawienie atrybutów rysownika.
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.9);
//renderer.shadowMap.enabled=true;
renderer.gamaOutput=true;

// 3.2 Ustawienie pozycji kamery.
camera.position.setZ(30);

// UTWORZENIE TORUSA:
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshPhongMaterial({ color: 0xff6347, wireframe:false});
const torus = new THREE.Mesh(geometry, material);
torus.position.set(-6, 0, -20);
torus.castShadow = true; //default is false
torus.position.y+=10;
//scene.add(torus);

// UTWORZENIE PODSTAWY:
const geometry_ = new THREE.PlaneGeometry( 200, 200 );
const texture_=new THREE.TextureLoader().load('plane.jpg');
const material_ = new THREE.MeshBasicMaterial( {map:texture_, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry_, material_ );
plane.rotation.x +=1.5708;
plane.rotation.z +=1.5708*2;
plane.receiveShadow=true;
plane.position.y-=5;
plane.userData.ground=true;
scene.add( plane );


// DODANIE BOX'A:
const texture=new THREE.TextureLoader().load('http://static.texturer.com/thumbnails/texs/brick/9a3f5cac81/brick_white_111ff3a5bd_thumb.jpg');
const cube=new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshPhongMaterial({map: texture})
);
cube.position.y+=4;
cube.castShadow = true; //default is false
//scene.add(cube);

// UTWORZENIE SWIATLA:

// a) Punktowego:
const pointLight=new THREE.PointLight(0xffffff);
pointLight.castShadow=true;
pointLight.position.set(5, 0, 5);
pointLight.shadow.mapSize.width=2048;
pointLight.shadow.mapSize.height=2048;
scene.add(pointLight);

// ---- Dodanie pomocnika do wskazywania polozenia swiatla.
const pointLightHelper=new THREE.PointLightHelper(pointLight);
//scene.add(pointLightHelper);

// b) Otoczeniowego:
const ambientLight=new THREE.AmbientLight(0xffffff, 2.3);
ambientLight.castShadow=true;
//ambientLight.shadow.mapSize.width=64;
//ambientLight.shadow.mapSize.weight=64;
scene.add(ambientLight);

// DODANIE SIATKI:
const gridHelper=new THREE.GridHelper(200, 50, 0x0000FF, 0x0000FF);
//scene.add(gridHelper);

// DODANIE KONTROLERA:
const controls=new OrbitControls(camera, renderer.domElement);

// DODANIE TLA:
scene.background = new THREE.CubeTextureLoader()
	.setPath( './' )
	.load( [
		'posx.jpg',
		'negx.jpg',
		'posy.jpg',
		'negy.jpg',
		'posz.jpg',
		'negz.jpg'
	] );

/*
function LoadModel(path, posX, posY, posZ, scaleX, scaleY, scaleZ)
{
  var loader=new GLTFLoader();
  var result;
  loader.load(path, function(gltf){
    gltf.scene.position.x=posX;
    gltf.scene.position.y=posY;
    gltf.scene.position.z=posZ;
    gltf.scene.scale.x*=scaleX;
    gltf.scene.scale.y*=scaleY;
    gltf.scene.scale.z*=scaleZ;
    gltf.scene.name='model';
    result=gltf.scene;
    scene.add(gltf.scene);
  });
  objects.push(result);
  return result;
}
*/


//var cat=LoadModel('/cat/scene.gltf', 5, 5, 5, 1, 1, 1);
//var batman=LoadModel('/batman/scene.gltf', 15, 5, 5, 8, 8, 8);
//var shrek=LoadModel('/shrek/scene.gltf', 10, 5, 5, 5, 0.5, 0.5 ,0.5);

const gui=new GUI({container: document.getElementById( 'custom' )});

var mesh={
  Name:'Obj',
  Type:'Box',
  Material:'MeshPhongMaterial',
  Color:'#FF0000',
  Width_X:1,
  Height_Y:1,
  Depth_Z:1,
  Pos_X:1,
  Pos_Y:1,
  Pos_Z:1,
  Create:function(){addObjectToScene()}
};

const f=gui.addFolder('Adding objects:');
f.add(mesh, 'Name');
//f.add(mesh, 'Type', ['Box']);
f.addColor(mesh, 'Color');
f.add(mesh, 'Width_X', 0, 10).name('Width_X');
f.add(mesh, 'Height_Y', 0, 10).name('Height_Y');
f.add(mesh, 'Depth_Z', 0, 10).name('Depth_Z');
f.add(mesh, 'Pos_X', -10, 10).name('Pos_X');
f.add(mesh, 'Pos_Y', -10, 10).name('Pos_Y');
f.add(mesh, 'Pos_Z', -10, 10).name('Pos_Z');
f.add(mesh,'Create');

const objs=gui.addFolder('Manipulating objects:');

var times=0;

function addObjectToScene()
{   
  times++;
  var tmp=new THREE.Mesh(
    new THREE.BoxGeometry(mesh.Width_X, mesh.Height_Y, mesh.Depth_Z),
    new THREE.MeshPhongMaterial({color:mesh.Color}));

    //const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    //const material = new THREE.MeshPhongMaterial({color:mesh.Color});
    //const torus = new THREE.Mesh(geometry, material);

  tmp.position.x=mesh.Pos_X;
  tmp.position.y=mesh.Pos_Y;
  tmp.position.z=mesh.Pos_Z;
  tmp.castShadow=false;
  tmp.receiveShadow=true;
  tmp.userData.draggable=true;
  tmp.userData.name=mesh.Name;
  const f=objs.addFolder(mesh.Name);
  f.addColor(tmp.material,'color').name('Color');
  f.add(tmp.scale,'x', 0, 50).name('Width_X');
  f.add(tmp.scale,'y', 0, 50).name('Height_Y');
  f.add(tmp.scale,'z', 0, 50).name('Depth_Z');
  f.add(tmp.position, 'x', -50, 50).name( 'Pos_X' );
  f.add(tmp.position, 'y', -50, 50).name('Pos_Y');
  f.add(tmp.position, 'z', -50, 50).name('Pos_Z');
  scene.add(tmp);
}

const raycaster = new THREE.Raycaster();
const clickMouse=new THREE.Vector2();
const moveMouse = new THREE.Vector2();
var draggable;

window.addEventListener('click', event=>{
  if(draggable)
  {
    draggable=null;
    return;
  }
  
  clickMouse.x=(event.clientX/window.innerWidth)*2 -1;
  clickMouse.y=-(event.clientY/window.innerHeight)*2+1;

  raycaster.setFromCamera(clickMouse, camera);
  const found=raycaster.intersectObjects(scene.children);

  if((found.length>0 && found[0].object.userData.draggable)|| typeof found[0].object === THREE.Group)
  {
    draggable=found[0].object;
    console.log('found draggable ${draggable.userData.name}');
  }
});

window.addEventListener('mousemove', event=>{
  moveMouse.x=(event.clientX / window.innerWidth) * 2 - 1;
  moveMouse.y=-(event.clientY / window.innerHeight) * 2 + 1;
});

function dragObject()
{
  if(draggable != null)
  {
    raycaster.setFromCamera(moveMouse, camera);
    const found = raycaster.intersectObjects(scene.children);
    if(found.length>0)
    {
      for(let o of found)
      {
        if(!o.object.userData.ground)
        {
          continue;
        }
        else
        {
          draggable.position.x = o.point.x;
          draggable.position.z = o.point.z;
        }
      }
    }
  }
}

// ANIMACJA SCENY:
function animate()
{
  plane.rotation.z +=0.0025;

  dragObject();

  requestAnimationFrame(animate);

  controls.update();
  
  renderer.render(scene, camera);
}

animate();
