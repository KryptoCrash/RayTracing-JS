var WIDTH = 400;
var HEIGHT = 300;
var canvas = document.getElementById('ctx');
var RayTracer = require('./raytracer.js')
var Scene = require('./scene.js')
var Camera = require('./camera.js')
var Vector = require('./vector.js')
canvas.width = WIDTH;
canvas.height = HEIGHT;
var scene = new Scene(
    [
        new Sphere(
            new Vector(10, 10, 0),
            2
        )
    ],
    [

    ],
    new Camera(
        new Vector(0,0,0),
        new Vector(1, 1, 0),
        60,
        WIDTH / HEIGHT
    )
)

let rayTracer = new RayTracer(scene, canvas)

rayTracer.render()
