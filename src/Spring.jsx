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
            p.ellipseMode(p.CENTER);
            p.rectMode(p.CENTER);
            p.createCanvas(p.view.width, p.view.height);
            p.scale(0.1);
            const c = p.color(
                p.random(0, 255),
                p.random(0, 255),
                p.random(0, 255)
                // p.random(0, 255 / 2)
            );

            for (let i = 0; i < 1000; i++) {
                const ballA = new Mover.Mover(
                    p.random(-100, 100),
                    p.random(-100, 100),
                    5,
                    p.color(
                        p.random(0, 255),
                        p.random(0, 255),
                        p.random(0, 255)
                        // p.random(0, 255)
                    ),
                    50,
                    p
                );
                p.balls.push(ballA);
            }

            for (let index = 1; index < p.balls.length; index++) {
                const ballA = p.balls[index];
                // for (let j = 0; j < p.balls.length; j++) {
                //     if (j != index) {
                //         const ballB = p.balls[j];
                //         const connection = new Connection(
                //             ballA,
                //             ballB,
                //             10,
                //             10,
                //             p
                //         );
                //         p.connections.push(connection);
                //     }
                // }
                const ballB = p.balls[0];
                const connection = new Connection(
                    ballA,
                    p.balls[Math.floor(p.random(0, p.balls.length))],
                    p.random(0.0000001, 0.1),
                    p.random(100, 300),
                    p
                );
                const connection2 = new Connection(
                    ballA,
                    p.balls[Math.floor(p.random(0, p.balls.length))],
                    p.random(0.0000001, 0.1),
                    p.random(100, 300),
                    p
                );
                p.connections.push(connection, connection2);
            }
            ballA = new Mover.Mover(
                -100,
                0,
                25,
                p.color(
                    p.random(0, 255),
                    p.random(0, 255),
                    p.random(0, 255),
                    p.random(0, 100)
                ),
                10,
                p
            );
            ballB = new Mover.Mover(
                100,
                0,
                25,
                p.color(
                    p.random(0, 255),
                    p.random(0, 255),
                    p.random(0, 255)
                    // p.random(0, 255)
                ),
                10,
                p
            );
            connection = new Connection(ballA, ballB, 0.01, 1000, p);

            const force = p.random(0, 50);
            ballA.applyForce(
                p.createVector(
                    p.random(-1 * force, force),
                    p.random(-1 * force, force)
                )
            );
            ballB.applyForce(
                p.createVector(
                    p.random(-1 * force, force),
                    p.random(-1 * force, force)
                )
            );
        };

        //---RENDER---//
        p.draw = () => {
            p.background(0);

            // set origin to middle of screen
            p.translate(p.view.origin.x, p.view.origin.y);
            // set view scale
            p.scale(p.view.scale);

            // push current viewport properties
            p.push();

            // connection.display(true);
            connection.applyForce();
            ballA.update();
            ballB.update();
            // ballA.display();
            // ballB.display();
            p.balls[0].display();
            const [, ...rest] = p.balls;
            p.connections.forEach((connection) => {
                connection.applyForce();
                connection.display(true);
            });
            rest.forEach((ball) => {
                // const force = p.random(0, 10);
                // ball.applyForce(
                //     p.createVector(
                //         p.random(-1 * force, force),
                //         p.random(-1 * force, force)
                //     )
                // );
                ball.update();
                ball.display();
            });
            p.pop();

            // handle viewport move
            if (p.mouseIsPressed) {
                p.handleMouseMove();
            }

            // set new mouse coords
            p.mousePrev.x = p.mouseX;
            p.mousePrev.y = p.mouseY;
        };

        // calc distance to translate viewport
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
