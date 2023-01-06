import p5 from "p5";
import React from "react";
import * as Mover from "./p5/Mover";
import { Connection } from "./p5/SpringConnection";
import { World } from "./p5/World";

// P5 Canvas Instance
const Spring = () => {
    // dom obj ref
    const sketchRef = React.createRef();

    // create instance
    const sketch = (p) => {
        // viewport properties

        p.World = new World(
            sketchRef.current.clientWidth,
            sketchRef.current.clientHeight,
            p.CENTER,
            1,
            p
        );
        p.balls = [];
        p.connections = [];

        //---SETUP---//
        p.setup = () => {
            // p.ellipseMode(p.CENTER);
            // p.rectMode(p.CENTER);
            p.createCanvas(p.World.width, p.World.height);
            const root = new Mover.Mover(
                0,
                0,
                50,
                p.color(0, 255, 255),
                500,
                p
            );

            p.balls.push(root);
            for (let i = 0; i < 10; i++) {
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
                for (let i = 0; i < 5; i++) {
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
            p.World.update();
            p.background(0);
            p.translate(p.World.offset.x, p.World.offset.y);
            p.scale(p.World.scale);

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

            // p.text(
            //     `x: ${Math.floor(p.World.x)} y: ${Math.floor(p.curMouse.y)}`,
            //     p.curMouse.x,
            //     p.curMouse.y
            // );
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
                let d = p.dist(
                    p.World.relativeMouse.x,
                    p.World.relativeMouse.y,
                    ball.position.x,
                    ball.position.y
                );
                if (d < ball.r) {
                    p.push();
                    p.stroke(255, 0, 0);
                    p.line(
                        p.World.relativeMouse.x,
                        p.World.relativeMouse.y,
                        ball.position.x,
                        ball.position.y
                    );
                    p.pop();
                }
                p.pop();
            });
        };

        // calc distance to translate viewport
        p.mousePressed = function () {
            p.balls.forEach((ball) => {
                ball.handleClick();
            });
        };

        p.handleMouseMove = () => {
            const x = p.mouseX - p.pmouseX;
            const y = p.mouseY - p.pmouseY;
            p.World.desiredOffset.x += x * p.World.panSpeed;
            p.World.desiredOffset.y += y * p.World.panSpeed;
        };

        // calc amount to scale viewport
        p.mouseWheel = (e) => {
            p.World.handleZoom(e.deltaY);
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
