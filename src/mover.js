import p5 from "p5";

export class Mover {
    constructor(xPos, yPos, radius, color, mass, p5instance) {
        this.position = p5instance.createVector(xPos, yPos);
        this.r = radius;
        this.c = color;
        this.mass = radius * 2;
        this.velocity = p5instance.createVector(0, 0);
        this.acceleration = p5instance.createVector(0, 0);
        this.p = p5instance;
        this.airFriction = 0.9;
        this.maxSpeed = 10;
    }
}

// display ball object
Mover.prototype.display = function () {
    this.p.stroke(100, 100);
    this.p.fill(this.c);
    this.p.circle(this.position.x, this.position.y, this.r * 2);
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
    this.velocity.limit(this.maxSpeed);
    // velocity changes position over time
    this.position.add(this.velocity);

    // clear acceleration each frame
    this.acceleration.mult(0);
};

Mover.prototype.setRadius = function (r) {
    this.r = r;
};

Mover.prototype.handleClick = function () {
    let d = this.p.dist(
        // this.p.mouseX - this.p.view.origin.x,
        // this.p.mouseY - this.p.view.origin.y,
        this.p.view.origin.x - this.p.mousePrev.x,
        this.p.view.origin.y - this.p.mousePrev.y,
        this.position.x,
        this.position.y
    );
    // console.log(
    //     d,
    //     this.r,
    //     this.position.x,
    //     this.position.y,
    //     this.p.mouseX - this.p.view.origin.x,
    //     this.p.mouseY - this.p.view.origin.y
    // );
    if (d < this.r) {
        console.log("clicked!");
    }
};

Mover.prototype.getPosition = function () {
    return this.position;
};
