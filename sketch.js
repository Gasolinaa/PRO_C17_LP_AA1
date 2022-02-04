var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage, balaoImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstacle7;

var score;
var gameOverImg, restartImg
var jumpSound, checkPointSound, dieSound

function preload() {
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadAnimation("trex4.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");
  balaoImage = loadImage("balao.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  obstacle7 = loadImage("bolo.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "Esta é uma mensagem";
  console.log(message)

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);


  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);


  gameOver.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //criar Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();


  trex.setCollider("rectangle", 0, 0, trex.width, trex.height);
  trex.debug = false;

  score = 0;

}

function draw() {

  background("white");
  //exibir pontuação
  text("Pontuação: " + score, 500, 50);


  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100)
    //pontuação
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //pular quando barra de espaço é pressionada
    if ((keyDown("space") ||keyDown(UP_ARROW)) && trex.y >= 100) {
      trex.velocityY = -12;
      jumpSound.play();
    }

    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8

    //gerar as nuvens
    spawnClouds();

    //gerar obstáculos no chão
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()

    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //mudar a animação de trex
    trex.changeAnimation("collided", trex_collided);



    ground.velocityX = 0;
    trex.velocityY = 0


    //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }


  //impedir que trex caia
  trex.collide(invisibleGround);

  if (mousePressedOver(restart)) {
    reset();
  }


  drawSprites();
}

function reset() {
  gameState = PLAY;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_running);

}


function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 7));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      case 7: obstacle.addImage(obstacle7);
        break;
      default: break;
    }

    //atribuir dimensão e tempo de vida ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //acrescentar cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //escrever código aqui para gerar nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);

    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: cloud.addImage(cloudImage);
      break;
      case 2: cloud.addImage(balaoImage);
      break;
      default: break;
    }
    cloud.y = Math.round(random(80, 120));
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //atribuir tempo de vida à variável
    cloud.lifetime = 250;

    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //acrescentar cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}

