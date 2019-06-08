export default class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    neg() {
        return new Vector(
            -this.x,
            -this.y,
            -this.z
        )
    }
    fromRGB() {
        return new Vector(
            this.x / 255,
            this.y / 255,
            this.z / 255
        )
    }
    static add(v1, v2) {
        return new Vector(
            v1.x+v2.x,
            v1.y+v2.y,
            v1.z+v2.z,
        )
    }
    static subtract(v1, v2) {
        return new Vector(
            v1.x-v2.x,
            v1.y-v2.y,
            v1.z-v2.z,
        )
    }
    static multiply(s, v1) {
        return new Vector(
            v1.x*s,
            v1.y*s,
            v1.z*s,
        )
    }
    static mag(v1) {
        return Math.hypot(v1.x, v1.y, v1.z)
    }
    static norm(v1) {
        let mag = Vector.mag(v1)
        let div = (mag === 0) ? Infinity : 1.0 / mag
        return Vector.multiply(div, v1)
    }
    static dot(v1, v2) {
        return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
    }
    static multiplyVectors(v1, v2) {
        return new Vector(
            v1.x*v2.x,
            v1.y*v2.y,
            v1.z*v2.z
        )
    }
    static cross(v1, v2) {
        return new Vector(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        )
    }
}
