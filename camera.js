var Vector = require('./vector.js')
module.exports = class Camera {
    constructor(pos, angle, fov, aspectRatio) {
        this.pos = pos;
        this.angle = angle;
        this.h = Math.tan(fov)
        this.w = this.h * aspectRatio
        this.upg = new Vector(0, -1, 0)
        this.forward = Vector.norm(Vector.subtract(angle, pos))
        this.right = Vector.norm(Vector.cross(this.forward, upg))
        this.up = Vector.cross(this.forward, this.right)
    }
}