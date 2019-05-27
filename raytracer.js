var Vector = require('./vector.js')
var Ray = require('./ray.js')
var Color = require('./color.js')
module.exports = class RayTracer {
    constructor(scene, canvas) {
        this.scene = scene;
        this.camera = scene.camera;
        this.canvas = canvas;
    }
    render() {
        for(let y = 0; y < this.canvas.height; y++) {
            for(let x = 0; x < this.canvas.width; x++) {
                let pxColor = this.shootRay(
                    new Ray(this.camera.pos, this.getDir(x, y, this.camera)),
                    scene,
                    0
                )
                this.canvas.fillStyle = `rgb(${pxColor.red}, ${pxColor.green}, ${pxColor.blue})`
                this.canvas.fillRect(x, y, x + 1, y + 1)
            }
        }
    }
    getDir(x, y, camera) {
        return Vector.norm(
            Vector.add(
                camera.forward,
                Vector.add(
                    Vector.multiply(x * camera.w, camera.right),
                    Vector.multiply(y * camera.h, camera.up)
                )
            )
        )
    }
    shootRay(ray, scene, iter) {
        let inter = this.checkForIntersect(ray, scene)
        return inter ? new Color(255, 0, 0) : new Color(0, 0, 0)
    }
    checkForIntersect(ray, scene) {
        let closestInter = undefined;
        let closestDist = Infinity;
        scene.objects.forEach(obj => {
            let inter = obj.intersect(ray)
            if(inter && inter.dist < closestDist) {
                closestInter = inter
                closestDist = inter.dist
            }
        });
        return closestInter
    }
}