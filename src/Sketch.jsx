import p5 from "p5";
import React from "react";
import starImage from "./asterisk-01.png";
// class ScreenProperties {
//     constructor(height, width, scale) {
//         this.height = height;
//         this.width = width;
//         this.scale = scale;
//         this.origin = {
//             x: width / 2,
//             y: height / 2,
//         };
//     }
// }

const Sketch = () => {
    const sketchRef = React.createRef();
    const sketch = (p) => {
        p.view = {
            width: sketchRef.current.clientWidth,
            height: sketchRef.current.clientHeight,
            scale: 1,
            origin: {
                x: sketchRef.current.clientWidth / 2,
                y: sketchRef.current.clientHeight / 2,
            },
        };
        p.x = p.view.origin.x;
        p.y = p.view.origin.y;

        p.preload = () => {
            p.img = p.loadImage(starImage);
        };
        p.setup = () => {
            p.ellipseMode(p.CENTER);
            p.rectMode(p.CENTER);
            p.createCanvas(p.view.width, p.view.height);
        };
        p.mousePrev = {
            x: 0,
            y: 0,
        };
        p.draw = () => {
            p.background(0);
            p.push();
            p.translate(p.view.origin.x, p.view.origin.y);
            p.scale(p.view.scale);
            // p.translate(
            //     p.view.desired.x - p.view.origin.x,
            //     p.view.desired.y - p.view.origin.y
            // );
            // p.view.origin = p.view.desired;
            p.fill(
                p.color(
                    p.random(0, 255),
                    p.random(0, 255),
                    p.random(0, 255)
                    // p.random(0, 255 / 2)
                )
            );
            p.noStroke();
            p.circle(0, 0, 25);
            p.image(p.img, 0, 0);
            // p.image(p.img, 20, 20, 20);
            // p.x += p.random(-10, 10);
            // p.y += p.random(-10, 10);
            p.pop();
            if (p.mouseIsPressed) {
                p.handleMouseMove();
            }
            p.mousePrev.x = p.mouseX;
            p.mousePrev.y = p.mouseY;
        };

        p.handleMouseMove = () => {
            console.log("mouse clicked!");
            console.log(p.mouseX, p.mouseY);
            const x = p.mouseX - p.mousePrev.x;
            const y = p.mouseY - p.mousePrev.y;
            p.view.origin.x += x;
            p.view.origin.y += y;
            console.log(x, y);
        };

        p.mouseWheel = (e) => {
            let sf;
            if (e.delta > 0) {
                sf = 1.05;
            } else {
                sf = 0.95;
            }
            p.view.scale *= sf;
        };
    };
    React.useEffect(() => {
        const myp5 = new p5(sketch, sketchRef.current);

        const handleZoom = (e) => {
            if (e.deltaY < 0) {
                console.log("zoom in");
                myp5.view.scale *= 1.05;
            } else {
                console.log("zoom out");
                myp5.view.scale *= 0.95;
            }
        };
        // window.addEventListener("wheel", handleZoom);
        return () => {
            // window.removeEventListener("wheel", handleZoom);
            myp5.remove();
        };
    }, []);
    return (
        <div
            style={{
                widht: "100%",
                height: "100%",
            }}
            ref={sketchRef}
        />
    );
};
export default Sketch;
