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
import Plane from './Objects/plane.js'
import PointLight from './Objects/Light/pointlight.js'
import Color from './Vectors/color.js';
var scene = new Scene(
    [
        new Plane(
            new Vector(0, 1, 0),
            new Vector(255, 255, 255),
            'diffuse',
            1
        ),
        new Sphere(
            new Vector(0, 1, -0.25),
            1.0,
            new Vector(147, 58, 22),
            'diffuse',
            0.4
        )
    ],
    [
        new PointLight(
            new Vector(3, 5, 8),
            6,
            new Color(255, 255, 255)
        )
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
