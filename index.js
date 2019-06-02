var WIDTH = 640;
var HEIGHT = 400;
var c = document.getElementById("ctx")
c.width = WIDTH
c.height = HEIGHT
var canvas = c.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
import RayTracer from './RayTracer/raytracer.js'
import Scene from './Scene/scene.js'
import Camera from './Scene/camera.js'
import Vector from './Vectors/vector.js'
import Sphere from './Objects/sphere.js'
import Plane from './Objects/plane.js';
var scene = new Scene(
    [
        new Plane(
            new Vector(0, 1, 0),
            new Vector(255, 255, 255)
        ),
        new Sphere(
            new Vector(0, 1, -0.25),
            1.2,
            new Vector(255, 0, 0)
        ),
        new Sphere(
            new Vector(0, 2.8, 0.25),
            0.5,
            new Vector(255, 255, 0)
        ),
		new Sphere(
            new Vector(0.5, 1.8, 2),
            0.25,
            new Vector(0, 0, 255)
        ),
		new Sphere(
            new Vector(0.5, 2.2, 2),
            0.1,
            new Vector(0, 255, 255)
        ),
        new Sphere(
            new Vector(0.5, 1, 2),
            0.5,
            new Vector(0, 255, 0)
        )
    ],
    [
		new PointLight(new Vector(0,12,0))
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
