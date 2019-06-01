var WIDTH = 640;
var HEIGHT = 400;
var c = document.getElementById("ctx")
c.width = WIDTH
c.height = HEIGHT
var canvas = c.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
import RayTracer from './raytracer.js'
import Scene from './scene.js'
import Camera from './camera.js'
import Vector from './vector.js'
import Sphere from './sphere.js'
import Plane from './plane.js';
var scene = new Scene(
    [
        new Plane(
            new Vector(0, 1, 0),
            new Vector(255, 255, 255)
        ),
        new Sphere(
            new Vector(0, 1, -0.25),
            1.0,
            new Vector(255, 0, 0)
        ),
        new Sphere(
            new Vector(0.5, 1, 2),
            0.5,
            new Vector(0, 255, 0)
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
