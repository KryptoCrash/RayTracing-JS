var WIDTH = 1300;
var HEIGHT = 600;
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
import Material from './Materials/material.js'
import PointLight from './Objects/Light/pointlight.js'
import DirLight from './Objects/Light/directionallight.js'
var scene = new Scene(
    [
        new Plane(
            new Vector(0, 1, 0),
            new Vector(255, 255, 255),
            'diffuse',
            0.18
        ),
        new Sphere(
            new Vector(0, 1, -0.25),
            1.0,
            new Vector(147, 58, 22),
            'specular',
            0.6
        ),
        new Sphere(
            new Vector(0.5, 1.5, 2),
            0.5,
            new Vector(0, 255, 0),
            'diffuse',
            0.6
        ),
        new Sphere(
            new Vector(0, 3, -0.25),
            0.5,
            new Vector(200, 122, 244),
            'diffuse',
            0.6
        ),
        new Sphere(
            new Vector(2, 1, -2.5),
            0.5,
            new Vector(0, 122, 244),
            'diffuse',
            0.6
        )
    ],
    [
        new PointLight(
            new Vector(3, 6, 8),
            6,
            new Vector(255, 234, 170)
        ),
        new PointLight(
            new Vector(0, 6, -8),
            6,
            new Vector(230, 230, 255)
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
