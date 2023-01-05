import { Mover } from "./mover";
import p5 from "p5";

export class Connection {
    constructor(
        moverA,
        moverB,
        springStrength,
        springLength,
        visible,
        p5instance
    ) {
        this.moverA = moverA;
        this.moverB = moverB;
        this.springStrength = springStrength;
        this.springLength = springLength;
        this.p = p5instance;
        this.minCompression = springLength / 2;
        this.visible = visible;
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

    // let kx = (this.springLength - dist) * this.springStrength * -1;
    const moverADirection = p5.Vector.sub(
        this.moverB.position,
        this.moverA.position
    );
    moverADirection.normalize();
    const f = this.springStrength * Math.log(dist / this.springLength);

    let force = p5.Vector.mult(moverADirection, f < -1000 ? -1000 : f);
    this.moverA.applyForce(force);
    this.moverB.applyForce(p5.Vector.mult(force, -1));
};

Connection.prototype.display = function () {
    this.p.stroke(
        this.visible ? 255 : 0,
        255,
        this.visible ? 255 : 0,
        this.visible ? 20 : 0
    );
    this.p.line(
        this.moverA.position.x,
        this.moverA.position.y,
        this.moverB.position.x,
        this.moverB.position.y
    );
};
