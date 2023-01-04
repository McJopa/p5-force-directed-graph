import p5 from "p5";

export class Mover {
    constructor(xPos, yPos, radius, color, mass, p5instance) {
        this.position = p5instance.createVector(xPos, yPos);
        this.r = radius;
        this.c = color;
        this.mass = mass;
        this.velocity = p5instance.createVector(0, 0);
        this.acceleration = p5instance.createVector(0, 0);
        this.p = p5instance;
        this.airFriction = 0.97;
    }
}

// display ball object
Mover.prototype.display = function () {
    this.p.noStroke();
    this.p.fill(this.c);
    this.p.circle(this.position.x, this.position.y, this.r);
};

// apply force to ball
Mover.prototype.applyForce = function (force) {
    // acceleration = Force/mass
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
};

Mover.prototype.update = function () {
    // acceleration changes velocity over time
    this.velocity.add(this.acceleration);
    this.velocity.mult(this.airFriction);
    // velocity changes position over time
    this.position.add(this.velocity);

    // clear acceleration each frame
    this.acceleration.mult(0);
};
