import p5 from "p5";
import React from "react";

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

const Sketch = ({ color }) => {
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
        p.setup = () => {
            p.createCanvas(p.view.width, p.view.height);
            p.background(0);
        };

        p.draw = () => {
            if (p.mouseIsPressed) {
                p.handleMouseMove();
            }
            p.scale(p.view.scale);
            p.fill(
                p.color(
                    p.random(0, 255),
                    p.random(0, 255),
                    p.random(0, 255),
                    p.random(0, 255 / 2)
                )
            );
            p.noStroke();
            p.circle(p.x, p.y, 50);
            p.x += p.random(-10, 10);
            p.y += p.random(-10, 10);
        };

        p.handleMouseMove = () => {
            console.log("mouse clicked!");
            console.log(p.mouseX, p.mouseY);
        };

        p.mouseWheel = (e) => {
            if (e.delta > 0) {
                p.view.scale *= 1.05;
            } else {
                p.view.scale *= 0.95;
            }
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
