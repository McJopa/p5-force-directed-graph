import p5 from "p5";

export class World {
    constructor(width, height, originOffset, scale, p5instance) {
        this.width = width;
        this.height = height;
        this.offset =
            originOffset === p5instance.CENTER
                ? p5instance.createVector(width / 2, height / 2)
                : originOffset;
        this.desiredOffset = this.offset;
        this.scale = scale;
        this.relativeMouse = p5instance.createVector(0, 0);
        this.p = p5instance;
        this.panSpeed = 2;
    }

    update() {
        this.offset = p5.Vector.lerp(
            this.offset,
            this.desiredOffset,
            this.panSpeed / 15
        );
        this.relativeMouse = this.p
            .createVector(this.p.mouseX, this.p.mouseY)
            .sub(this.offset)
            .div(this.scale);
    }

    handleZoom(direction) {
        const s = 1 - direction / 1000;
        this.scale *= s;

        const mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
        this.offset.sub(mouse).mult(s).add(mouse);
        this.desiredOffset = this.offset;
        console.log(this.offset);
    }
}
