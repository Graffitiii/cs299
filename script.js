import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });

    //set up camera angle.
    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-15, 160, 580);
    camera.lookAt(0, 100, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1445);

    //set up Hemisphere light.
    {
        const skyColor = 0xFFFFFF;
        const groundColor = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);

    }


    //set up Directional light.
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light1 = new THREE.DirectionalLight(color, 0.6);
        light1.position.set(-70, 150, 45);
        scene.add(light1);

    }


    var bcat, scat, paperpipe, crashp, howtop, endtext, posttext;
    var zcrash, yendtext;

    // Bring the object to the screen.
    {
        //room.
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('room.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(0, 115, 0);
            scene.add(root); console.log(root);
            crashp = root.getObjectByName('crash');
            howtop = root.getObjectByName('wasd');
            zcrash = crashp.position.z;
            endtext = root.getObjectByName('text');
            posttext = root.getObjectByName('Posttext');
            yendtext = endtext.position.y;
        });
        //sleep cat on the sofa.
        gltfLoader.load('sleepcat.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(28, 30, 40);
            scene.add(root);
            scat = root.getObjectByName('Mesh_0');
        });
        //vacuum machine.
        gltfLoader.load('bcat1.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(-40, 0, 250);
            scene.add(root);
            bcat = root.getObjectByName('Cylinder');

        });
        //rubbish.
        gltfLoader.load('rubbish.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(-40, 0, 250);
            scene.add(root);
            paperpipe = root.getObjectByName('Sphere');
        });
    }


    //position x and y of rubbish to random.
    var paperPositionX = [
        -180, 255, 0, -160, 255, 230, 160, 42, 17, -25, -80, -88, -195, -110
    ];

    var paperPositionZ = [
        10, 10, 0, 30, -400, -300, -100, -250, -200, -160, -160, -255, -105, -350
    ];


    //random int paper to set position of rubbsih.
    var paper = Math.floor(Math.random() * 14);
    if (paperpipe) {
        paperpipe.position.set(paperPositionX[paper], 0, paperPositionZ[paper]);
        console.log(paperpipe.position.x);
    }

    //Adjust the screen size to make the image clear as appropriate.
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }


    // audio
    var whileplay = document.getElementById("Whileplay");
    var got = document.getElementById("Got");
    var lose = document.getElementById("Lose");
    whileplay.loop = true;
    whileplay.volume = 0.5;
    got.volume = 0.5;
    lose.volume = 0.5;

    var speed = 1;  //speed of vacuum.
    var keyCode = -1;   //start Keycode.
    var time = -1;  //start time.
    var score = 0;  //start score.
    var end = false;  //end game check.
    var losesound = false;//sound 'lose' check.

    // this function work with press spacebar when the game is over.
    function endgame() {
        time = -1;
        score = 0;
        keyCode = -1;
        document.getElementById('Result').innerHTML = "";
        document.getElementById('Time').innerHTML = "Time : 10";
        document.getElementById('Scores').innerHTML = "Score : 0";
        document.getElementById('Showscore').innerHTML = "";
        document.getElementById('Spacebar').innerHTML = "";
        bcat.position.set(0, 4, 0);
        endtext.position.set(endtext.position.x, yendtext, endtext.position.z);
        end = false;
        whileplay.volume = 0.5;
        lose.volume = 0.5;
        losesound = false;
    }

    document.addEventListener("keydown", onDocumentKeyDown, false);

    function onDocumentKeyDown(event) {
        keyCode = event.which;
        posttext.position.set(0, 250, 0);
        document.getElementById('Post').innerHTML = "";
        document.getElementById('Press').innerHTML = "";
        if (time == -1) {
            whileplay.play();
            time = 10;
        }
    };



    function render() {

        if (time != -1) {
            time -= 0.005;
            document.getElementById('Time').innerHTML = "Time : " + parseInt(time);
            document.getElementById('Scores').innerHTML = "Score : " + parseInt(score);
        }
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        //Position that vacuum can go.
        if (bcat) {
            //right sofa area
            if (bcat.position.x - 12 < 125 && bcat.position.z - 12 > -315 && bcat.position.z + 12 < -82 && keyCode == 65 && bcat.position.x > 125) {
                keyCode = 0;
            }
            else if (bcat.position.x - 12 > 25 && bcat.position.x + 12 < 145 && bcat.position.z - 12 < -103 && keyCode == 87 && bcat.position.z > -103) {
                keyCode = 0;
            }
            else if (bcat.position.x + 12 > 47 && bcat.position.z - 12 > -315 && bcat.position.z + 12 < -85 && keyCode == 68 && bcat.position.x < 47) {
                keyCode = 0;
            }
            else if (bcat.position.x - 12 > 25 && bcat.position.x + 12 < 145 && bcat.position.z + 12 > -291 && keyCode == 83 && bcat.position.z < -291) {
                keyCode = 0;
            }

            // left sofa area
            else if (bcat.position.x - 12 < -106 && bcat.position.z - 12 > -315 && bcat.position.z + 12 < -82 && keyCode == 65 && bcat.position.x > -106) {
                keyCode = 0;
            }
            else if (bcat.position.x - 12 > -204 && bcat.position.x + 12 < -84 && bcat.position.z - 12 < -103 && keyCode == 87 && bcat.position.z > -103) {
                keyCode = 0;
            }
            else if (bcat.position.x + 12 > -183 && bcat.position.z - 12 > -315 && bcat.position.z + 12 < -85 && keyCode == 68 && bcat.position.x < -188) {
                keyCode = 0;
            }
            else if (bcat.position.x - 12 > -204 && bcat.position.x + 12 < -84 && bcat.position.z + 12 > -291 && keyCode == 83 && bcat.position.z < -291) {
                keyCode = 0;
            }

            // room area (from conor)

            else if (bcat.position.x >= 269 && keyCode == 68) {
                keyCode = 0;
            }
            else if (bcat.position.z >= 18 && keyCode == 83) {
                keyCode = 0;
            }
            else if (bcat.position.x <= -199 && keyCode == 65) {
                keyCode = 0;
            }
            else if (bcat.position.z <= -418 && keyCode == 87) {
                keyCode = 0;
            }

        }

        //when vacuum crash something.
        if (crashp) {
            if (keyCode == 0) {
                crashp.position.set(crashp.position.x, crashp.position.y, zcrash + 50);
                time -= 0.005;
            }
            else {
                crashp.position.set(crashp.position.x, crashp.position.y, zcrash);
            }
        }

        //Keydown W A S D 
        if (keyCode == 83 && !end) {
            bcat.position.z += speed;
            console.log("down");
        } else if (keyCode == 87 && !end) {
            bcat.position.z -= speed;
            console.log("up");
        } else if (keyCode == 68 && !end) {
            bcat.position.x += speed;
            console.log("right");
        } else if (keyCode == 65 && !end) {
            bcat.position.x -= speed;
            console.log("left");
        } else if (keyCode == 32) {
            endgame();
            console.log("space");
        }


        // distance between points.
        if (bcat && paperpipe) {
            var d = Math.sqrt(Math.pow(bcat.position.x - paperpipe.position.x, 2) + Math.pow(bcat.position.z - paperpipe.position.z, 2));
            console.log(d);
            // When the vacuum cleaner collects rubbish.  
            if (d <= 15) {
                var lastpaper = paper;
                if (time != -1) {
                    time += 2;
                    score += 500;
                    got.play();
                }
                do {
                    paper = Math.floor(Math.random() * 14);
                } while (paper == lastpaper);
                paperpipe.position.set(paperPositionX[paper], 0, paperPositionZ[paper]);
            }

        }

        //as soon as the time runs out.
        if (parseInt(time) == 0) {
            time = 0.05
            end = true;
            document.getElementById('Result').innerHTML = "Time Out!";
            document.getElementById('Showscore').innerHTML = "Your scores : " + score;
            document.getElementById('Spacebar').innerHTML = "Press 'space bar' to try again";
            endtext.position.set(endtext.position.x, yendtext - 250, endtext.position.z);
            whileplay.volume = 0.1;
            if (!losesound) {
                lose.play();
                losesound = true;
            }
        }

        renderer.render(scene, camera);


        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();