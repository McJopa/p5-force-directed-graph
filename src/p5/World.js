import p5 from "p5";

export class World {
    constructor(width, height, originOffset, scale, p5instance) {
        this.width = width;
        this.height = height;
        this.offset =
            originOffset == p5instance.CENTER
                ? p5instance.createVector(width / 2, height / 2)
                : originOffset;
        this.scale = scale;
        this.relativeMouse = p5instance.createVector(0, 0);
        this.p = p5instance;
    }

    update() {
        this.relativeMouse = this.p
            .createVector(this.p.mouseX, this.p.mouseY)
            .sub(this.offset)
            .div(this.scale);
    }

    handleZoom(direction) {
        const s = 1 - direction / 1000;
        this.scale *= s;

        const mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
        this.offset.sub(mouse).div(s).add(mouse);
    }
}
