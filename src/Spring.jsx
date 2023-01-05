import p5 from "p5";
import React from "react";
import starImage from "./asterisk-01.png";
import * as Mover from "./mover";
import { Connection } from "./SpringConnection";
// P5 Canvas Instance
const Spring = () => {
    // dom obj ref
    const sketchRef = React.createRef();

    // create instance
    const sketch = (p) => {
        // viewport properties
        p.view = {
            width: sketchRef.current.clientWidth,
            height: sketchRef.current.clientHeight,
            scale: 1,
            origin: {
                x: sketchRef.current.clientWidth / 2,
                y: sketchRef.current.clientHeight / 2,
            },
        };
        p.dragging = false;
        p.dragRef = "";
        // Prev mouse obj for tracking
        p.mousePrev = {
            x: 0,
            y: 0,
        };
        let ballA;
        let ballB;
        let connection;
        p.balls = [];
        p.connections = [];
        //---SETUP---//
        p.setup = () => {
            // p.ellipseMode(p.CENTER);
            // p.rectMode(p.CENTER);
            p.createCanvas(p.view.width, p.view.height);
            const c = p.color(
                // p.random(0, 255),
                // p.random(0, 255),
                // p.random(0, 255)
                // p.random(0, 255 / 2)
                100
            );
            const root = new Mover.Mover(
                0,
                0,
                50,
                p.color(0, 255, 255),
                500,
                p
            );
            p.balls.push(root);
            for (let i = 0; i < 20; i++) {
                const size = p.random(10, 30);
                const secondary = new Mover.Mover(
                    p.random(-200, 200),
                    p.random(-200, 200),
                    size,
                    p.color(255, 0, 255),
                    size,
                    p
                );
                p.balls.push(secondary);
                const connection = new Connection(
                    root,
                    secondary,
                    20 * size,
                    9000 / size,
                    true,
                    p
                );
                p.connections.push(connection);
            }
            const randomConnection = new Connection(
                p.balls[1],
                p.balls[2],
                100,
                100,
                true,
                p
            );
            p.connections.splice(1, 1);
            p.connections.push(randomConnection);

            const [, ...secondaryList] = p.balls;
            secondaryList.forEach((secondary) => {
                for (let i = 0; i < 10; i++) {
                    const child = new Mover.Mover(
                        p.random(-200, 200),
                        p.random(-200, 200),
                        10,
                        p.color(255, 255, 0),
                        10,
                        p
                    );
                    p.balls.push(child);
                    const connection = new Connection(
                        secondary,
                        child,
                        20,
                        40,
                        true,
                        p
                    );
                    p.connections.push(connection);
                }
            });
        };

        //---RENDER---//
        p.draw = () => {
            p.curMouse = {
                x: p.mouseX / p.view.scale - p.view.origin.x / p.view.scale,
                y: p.mouseY / p.view.scale - p.view.origin.y / p.view.scale,
            };
            p.background(0);

            // set origin to middle of screen
            p.translate(p.view.origin.x, p.view.origin.y);
            // set view scale
            p.scale(p.view.scale);

            // push current viewport properties
            // p.push();
            p.balls[0].display();
            const [, ...rest] = p.balls;
            p.connections.forEach((connection) => {
                connection.applyForce();
                connection.display();
            });
            for (let i = 0; i < rest.length; i++) {
                for (let j = 0; j < rest.length; j++) {
                    if (i != j) {
                        const dir = p5.Vector.sub(
                            rest[j].position,
                            rest[i].position
                        );
                        const dirMag = dir.mag();
                        dir.normalize();
                        const repulsionForce = p5.Vector.mult(
                            dir,
                            9000 / (dirMag * dirMag)
                        );
                        rest[j].applyForce(repulsionForce);
                    }
                }
            }

            // handle viewport move
            if (p.mouseIsPressed) {
                p.handleMouseMove();
            }
            rest.forEach((ball) => {
                ball.update();
                ball.display();
            });

            // set new mouse coords
            p.mousePrev.x = p.curMouse.x;
            p.mousePrev.y = p.curMouse.y;

            p.text(
                `x: ${Math.floor(p.curMouse.x)} y: ${Math.floor(p.curMouse.y)}`,
                p.curMouse.x,
                p.curMouse.y
            );
            p.balls.forEach((ball) => {
                p.push();
                p.fill(255);
                p.text(
                    `x:${Math.floor(ball.position.x)} y:${Math.floor(
                        ball.position.y
                    )}`,
                    ball.position.x,
                    ball.position.y
                );
                const d = p.dist(
                    ball.position.x,
                    ball.position.y,
                    p.curMouse.x,
                    p.curMouse.y
                );

                if (d < ball.r) {
                    console.log("intersecting");
                    p.stroke(255, 0, 0);
                    p.line(
                        ball.position.x,
                        ball.position.y,
                        p.curMouse.x,
                        p.curMouse.y
                    );
                }
                p.pop();
            });
            // p.pop();
        };

        // calc distance to translate viewport
        p.mousePressed = function () {
            console.log(p.mouseX - p.view.origin.x, p.mouseY - p.view.origin.y);
            p.balls.forEach((ball) => {
                ball.handleClick();
            });
        };

        p.handleMouseMove = () => {
            const x = p.mouseX - p.mousePrev.x;
            const y = p.mouseY - p.mousePrev.y;
            p.view.origin.x += x;
            p.view.origin.y += y;
        };

        // calc amount to scale viewport
        p.mouseWheel = (e) => {
            let sf;
            if (e.delta > 0) {
                sf = 0.95;
            } else {
                sf = 1.05;
            }
            p.view.scale *= sf;
        };
    };

    // component did mount
    React.useEffect(() => {
        // create p5 instance
        const myp5 = new p5(sketch, sketchRef.current);

        return () => {
            // cleanup p5 instance
            myp5.remove();
        };
    }, []);

    // p5 canvas obj
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
export default Spring;
