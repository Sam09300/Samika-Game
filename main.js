import { Bodies, Body, Events, Engine, Render, Runner, World, Collision} from "matter-js";
import { FRUITS } from "./fruits"

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

// 벽 세우기-----------------------------------------------------

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle:"#E6B143"}
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle:"#E6B143"}
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle:"#E6B143"}
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle:"#E6B143"}
})

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

// 전역변수 -----------------------------------------------------


let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;
let num_samika =0;


// 과일 추가 -----------------------------------------------------


function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];
  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.2,
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}

// 키 이벤트 -----------------------------------------------------


onkeydown = (event) => {
  if (disableAction) {
    return;
  }
  switch(event.code) {
    case "KeyA":
      if (interval)
        return;


      interval = setInterval(() =>{
        if (currentBody.position.x - currentFruit.radius > 30)
        Body.setPosition(currentBody, {
          x: currentBody.position.x - 2,
          y: currentBody.position.y,
      });
      }, 5);
      
      break;

    case "KeyD":
      if (interval)
        return;


      interval = setInterval(() =>{
        if (currentBody.position.x + currentFruit.radius < 590)
        Body.setPosition(currentBody, {
          x: currentBody.position.x + 2,
          y: currentBody.position.y,
      });
      }, 5);
      break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 1000);
      break;
  }
}

onkeyup = (event) => {
  switch (event.code) {
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null}
}

// 충돌 작업 -----------------------------------------------------


Events.on(engine, "collisionStart", (event)  => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      if (index === FRUITS.length - 1) {
        return;
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: { 
            sprite: { texture: `${newFruit.name}.png` }
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);

  // 승리 설정 (수박 2개 나오면)--------------------------------------
    
    if (newFruit === FRUITS[10]) {
        num_samika++;
      }

      if (num_samika === 2) {
        setTimeout(() => {
        alert("Win");
      }, 1000);

    }

    // if (
    //   // disableAction이 아닐때만 밑에 것들 실행.
    //   disableAction = false,
    //   (currentBody.position.x + currentFruit.radius > 310, 150)){
    //   // (collision.bodyA.name === topLine || collision.bodyB.name === topLine)) {
    //  setTimeout(() => {
    //   alert("Game Over");
    //  }, 5000);
      
    // }

}});
});

addFruit();


