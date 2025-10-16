class Raster {
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(ander) {
    return this.x === ander.x && this.y === ander.y;
  }

  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Bom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(12, 18);
  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;
  for (var b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600, 400);
  bob.stapGrootte = 1 * eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  cindy = new Vijand(300, 100);
  cindy.stapGrootte = 1 * eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bom1 = new Bom(200, 200);
  bom1.sprite = loadImage("images/sprites/bom.png");

  bom2 = new Bom(500, 100);
  bom2.sprite = loadImage("images/sprites/bom.png");
}

function draw() {
  push();
  background(brug);
  stroke(0, 0, 255);
  strokeWeight(5);
  noFill();
  rect(5, 5, canvas.width - 10, canvas.height - 10);
  pop();

  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();

  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();

  bom1.toon();
  bom2.toon();

  if (
    eve.wordtGeraakt(alice) ||
    eve.wordtGeraakt(bob) ||
    eve.wordtGeraakt(cindy) ||
    eve.wordtGeraakt(bom1) ||
    eve.wordtGeraakt(bom2)
  ) {
    noLoop();
  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!", 30, 300);
    noLoop();
  }
}
