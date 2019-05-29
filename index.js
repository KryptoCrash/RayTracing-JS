var WIDTH = 256;
var HEIGHT = 256;
var canvas = document.getElementById("ctx").getContext('2d');
canvas.width = 256;
canvas.height = 256;
import RayTracer from './raytracer.js'
import Scene from './scene.js'
import Camera from './camera.js'
import Vector from './vector.js'
import Sphere from './sphere.js'
var scene = new Scene(
    [
        new Sphere(
            new Vector(0, 1, -0.25),
            1.0
        )
    ],
    [

    ],
    new Camera(
        new Vector(3, 2, 4),
        new Vector(-1, 0.5, 0),
        60,
        WIDTH / HEIGHT
    )
)

let rayTracer = new RayTracer(scene, canvas)

rayTracer.render()
