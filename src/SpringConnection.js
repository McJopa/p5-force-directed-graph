import { Mover } from "./mover";
import p5 from "p5";

export class Connection {
    constructor(moverA, moverB, springStrength, springLength, p5instance) {
        this.moverA = moverA;
        this.moverB = moverB;
        this.springStrength = springStrength;
        this.springLength = springLength;
        this.p = p5instance;
    }
}

Connection.prototype.applyForce = function () {
    console.log("applying force");
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
