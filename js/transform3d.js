
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 300);
renderer.setClearColor(0xffffff);
document.getElementById("canvas3D").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-5, -5, 5); // oposto à luz principal
scene.add(fillLight);

const geometry = new THREE.SphereGeometry(1, 32, 32);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("https://i.imgur.com/rxBX6AD.jpeg");

const material = new THREE.MeshPhysicalMaterial({
    map: texture,
    roughness: 0.4,
    metalness: 0.3,
    clearcoat: 0.2,
    reflectivity: 0.3
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let shearXZ = 0;

function update3D() {
    const tx = parseFloat(document.getElementById("tx").value);
    const ty = parseFloat(document.getElementById("ty").value);
    const rot = parseFloat(document.getElementById("rot").value);
    const scale = parseFloat(document.getElementById("scale").value);

    const shearXZ = parseFloat(document.getElementById("shearXZ").value);
    const shearYZ = parseFloat(document.getElementById("shearYZ").value);
    const shearZX = parseFloat(document.getElementById("shearZX").value);

    // Cisalhamento completo: X em função de Z, Y em função de Z, Z em função de X
    const shearMatrix = new THREE.Matrix4().set(
        1,        0, shearXZ, 0,
        0,        1, shearYZ, 0,
        shearZX,  0, 1,       0,
        0,        0, 0,       1
    );

    cube.matrixAutoUpdate = false;
    cube.matrix.identity();

    // recria geometria para corrigir iluminação
    cube.geometry.dispose();
    cube.geometry = new THREE.BoxGeometry();

    cube.applyMatrix4(shearMatrix);
    cube.applyMatrix4(new THREE.Matrix4().makeScale(scale, scale, scale));
    cube.applyMatrix4(new THREE.Matrix4().makeRotationY(rot * Math.PI / 180));
    cube.applyMatrix4(new THREE.Matrix4().makeTranslation(tx, ty, 0));

    // recalcula normais com a nova geometria deformada
    cube.geometry.computeVertexNormals();

    document.getElementById("formulas").innerHTML = `
        <strong>Transformações 3D:</strong><br>
        <pre>
Translação:
x' = x + ${tx}
y' = y + ${ty}

Rotação Y:
θ = ${rot}°

Escala:
x' = ${scale} * x
y' = ${scale} * y
z' = ${scale} * z

Cisalhamento:
[x'] = x + (${shearXZ}) * z
[y'] = y + (${shearYZ}) * z
[z'] = z + (${shearZX}) * x
        </pre>
    `;
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", update3D);
});

update3D();

function renderLoop() {
    requestAnimationFrame(renderLoop);
    renderer.render(scene, camera);
}
renderLoop();

document.getElementById("resetButton").addEventListener("click", () => {
    document.getElementById("tx").value = 0;
    document.getElementById("ty").value = 0;
    document.getElementById("rot").value = 0;
    document.getElementById("scale").value = 1;
    document.getElementById("shearXZ").value = 0;
    document.getElementById("shearYZ").value = 0;
    document.getElementById("shearZX").value = 0;
    update3D(); // Reaplica com valores padrão
});
