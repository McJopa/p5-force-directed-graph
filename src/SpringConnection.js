import { Mover } from "./mover";
import p5 from "p5";

export class Connection {
    constructor(moverA, moverB, springStrength, springLength, p5instance) {
        this.moverA = moverA;
        this.moverB = moverB;
        this.springStrength = springStrength;
        this.springLength = springLength;
        this.p = p5instance;
        this.minCompression = springLength / 2;
        this.airFriction = 0.5;
    }
}

Connection.prototype.applyForce = function () {
    const dist = this.p.dist(
        this.moverA.position.x,
        this.moverA.position.y,
        this.moverB.position.x,
        this.moverB.position.y
    );
    let kx = (this.springLength - dist) * this.springStrength * -1;
    kx /= this.airFriction;
    const moverADirection = p5.Vector.sub(
        this.moverB.position,
        this.moverA.position
    );
    moverADirection.normalize();

    let force = p5.Vector.mult(moverADirection, kx);
    this.moverA.applyForce(force);
    this.moverB.applyForce(p5.Vector.mult(force, -1));
    console.log(dist, this.springLength);
};

Connection.prototype.display = function (visible) {
    this.p.stroke(255, 255, 255, visible ? 100 : 0);
    this.p.line(
        this.moverA.position.x,
        this.moverA.position.y,
        this.moverB.position.x,
        this.moverB.position.y
    );
};
