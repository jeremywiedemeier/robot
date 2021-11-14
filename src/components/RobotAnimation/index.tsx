import React, { useEffect } from "react";
import * as PIXI from "pixi.js";
import robot from "../../assets/robot.png";
import purp from "../../assets/purp.png";

import "./RobotAnimation.css";

const app = new PIXI.Application({
  width: 1280,
  height: 720,
  backgroundColor: 0xf6f6ef,
  resolution: window.devicePixelRatio || 1,
});

const RobotAnimation: React.FC = () => {
  useEffect(() => {
    document.getElementById("main-canvas")?.appendChild(app.view);
    const sprite = PIXI.Sprite.from(robot);

    let points = [];
    for (let i = 0; i < 20; i += 1) {
      points.push(new PIXI.Point(i * 20, i * 20 * Math.random()));
    }
    const rope = new PIXI.SimpleRope(PIXI.Texture.from(purp), points);

    app.stage.addChild(rope);
    app.stage.addChild(sprite);

    let elapsed = 0;
    app.ticker.add((delta) => {
      elapsed += delta;
      sprite.x = 100 + Math.cos(elapsed / 50) * 100;
    });

    const clickHandler = () => {
      points = [];
      for (let i = 0; i < 20; i += 1) {
        points.push(new PIXI.Point(i * 20, i * 20 * Math.random()));
      }
      const ropeGeom = rope.geometry as any;
      ropeGeom.update();
      console.log(points.length);
    };

    document
      .getElementById("main-canvas")
      ?.addEventListener("click", clickHandler);

    // cleanup
    return () => {
      // app.stage.destroy();

      document
        .getElementById("main-canvas")
        ?.removeEventListener("click", clickHandler);

      const canvas = document.getElementById("main-canvas");
      if (canvas)
        while (canvas.firstChild) {
          canvas.removeChild(canvas.firstChild);
        }
    };
  }, []);
  return <div id="main-canvas" />;
};

export default RobotAnimation;
