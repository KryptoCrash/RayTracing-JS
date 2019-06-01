import Vector from '../Vectors/vector.js'
export default class Camera {
    constructor(pos, facing, fov, aspectRatio) {
        this.pos = pos;
        this.facing = facing;
        this.angle = Math.tan(Math.PI * 0.5 * fov / 180)
        this.aspectRatio = aspectRatio
        this.upg = new Vector(0, -1, 0)
        this.forward = Vector.norm(Vector.subtract(facing, pos))
        this.right = Vector.norm(Vector.cross(this.forward, this.upg))
        this.up = Vector.cross(this.forward, this.right)
    }
}