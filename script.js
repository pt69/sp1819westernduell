//Spielbeschreibung

//Ziel ist es, seinen Gegner (Buford "Mad Dog" Tannen) als Marty Mcfly in
//einem Westernduell zu töten.
//Man muss dabei genau um 10 Uhr abdrücken.
//In der oberen linken Ecke stehen die eigenen Punkte und die Munitionsanzahl, in der
//oberen rechten Ecke steht die Punktzahl des Gegners.
//Man hat nur einen Schuss frei. Wenn man zu früh schießt, hat man verloren.
//Dasselbe gilt für einen zu späten Schuss.
//Um kurz nach 10 wird man, sofern man den Gegner nicht bereits erschossen
//hat, von diesem getötet. Man kann mit Punktelimit (also einer benötigten Punktezahl
//zum Sieg) oder im Endlosmodus spielen. Der Modus kann am Anfang eines Spiels
//ausgewählt werden.
//Die Anzahl der benötigten Punkte lässt sich im Spiel einstellen
//(dazu muss die Punktelimit-Funktion aktiviert sein). Ebenso lässt sich die Schwierigkeit
//(also die Zeigergeschwindigkeit) einstellen.

//Steuerung:

//Escape, um den Spielstand zurückzusetzen.
//Control (Steuerung), um eine Runde zu starten.
//Enter (Eingabe), um zu schießen.
//Pfeiltaste nach oben, um Punktelimit zu aktivieren.
//Pfeiltaste nach unten, um Endlosmodus zu aktivieren.
//Pfeiltasten links/rechts, um das Punktelimit zu verringern/erhöhen (am besten gedrückt halten).
//Shift zum Erhöhen bzw. Backspace (rückgängig) zum Verringern der Schwierigkeit (am besten gedrückt halten).

var x_Marty = 150;
var y_Figuren = 425;
var x_Buford = 650;
var Uhr_Tr = 100;
var x_uhr = 400;
var y_uhr = 450;
var x_zeiger = 0;
var y_zeiger = 75;
var zeiger = 0;

var a = 0;
var zeiger_geschw = 0;
var b = 0; //Zeichnet den Sieg/Niederlagenbildschirm
var Punkte_M = 0;
var Punkte_B = 0;
var P_B = 0;
var x_feuer = -500;
var y_feuer = 300;
var m_feuer = 0;
var b_feuer = 0;
var Munition = 1;
var deadname = "Marty McFly";
var x_grabstein = -276;
var y_grabstein = 200;
var grabstein_position = 0;

var Ende = "Endlos";
var textfarbe = 0;
var Schluss2 = "Sieg";
var x_text = -500;
var benötigte_Punkte = 5;
var x_Punktestand = 100;
var x_Anzeige = 400;
var modus = 0;
var Limit = 1;
var Schwierigkeit = 0;
var Ausgangsgeschw = 7;
var schw = 0;

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  frameRate(60);
}

function draw() {
  background("skyblue");

  Hintergrund();
  Rathaus();
  Uhr_Rathaus();
  Marty();
  Buford();
  Schuss();
  Spielstart();
  Mündungsfeuer();

  if (b == 2) {
    fill(50, 200);
    rect(0, 0, 800, 600);
    P_B = P_B + 1;
  }

  Grabstein();
  Schluss();
  Punktestand();

  //test
  fill(0);
  textSize(30);
  textAlign(CENTER);
  text("Modus: " + Ende, x_Anzeige, 35);

  fill(0);
  textSize(30);
  textAlign(CENTER);
  text("Limit: " + benötigte_Punkte, x_Anzeige, 60);

  fill(0);
  textSize(30);
  textAlign(CENTER);
  text("Schwierigkeit: " + (Ausgangsgeschw + Schwierigkeit), x_Anzeige, 590);

  if (P_B == 1) {
    Punkte_B = Punkte_B + 1;
  }

  //Modus
  if (keyIsPressed == true && keyCode === UP_ARROW && modus == 0) {
    Ende = "Punktelimit";
  }

  if (keyIsPressed == true && keyCode === DOWN_ARROW && modus == 0) {
    Ende = "Endlos";
  }

  //Punktelimit
  if (
    keyIsPressed == true &&
    keyCode === LEFT_ARROW &&
    Ende == "Punktelimit" &&
    frameCount % 20 == 0
  ) {
    benötigte_Punkte = benötigte_Punkte - Limit;
  }

  if (
    keyIsPressed == true &&
    keyCode === RIGHT_ARROW &&
    Ende == "Punktelimit" &&
    frameCount % 20 == 0
  ) {
    benötigte_Punkte = benötigte_Punkte + Limit;
  }

  if (benötigte_Punkte < 1) {
    benötigte_Punkte = 1;
  }

  //Schwierigkeit
  if (
    keyIsPressed == true &&
    keyCode === SHIFT &&
    frameCount % 20 == 0 &&
    schw < 1
  ) {
    Schwierigkeit = Schwierigkeit + 1;
  }

  if (
    keyIsPressed == true &&
    keyCode === BACKSPACE &&
    frameCount % 20 == 0 &&
    schw < 1
  ) {
    Schwierigkeit = Schwierigkeit - 1;
  }

  if (Ausgangsgeschw + Schwierigkeit < 1) {
    Schwierigkeit = -6;
  }

  Uhr();
}

function Uhr() {
  //stillstehende Teile
  stroke(0, Uhr_Tr);
  strokeWeight(5);
  fill(255, Uhr_Tr);
  ellipse(x_uhr, y_uhr, 200, 200);

  stroke(0, Uhr_Tr);
  strokeWeight(3);

  line(x_uhr, y_uhr - 100, x_uhr, y_uhr - 75);
  line(x_uhr, y_uhr + 100, x_uhr, y_uhr + 75);
  line(x_uhr - 100, y_uhr, x_uhr - 75, y_uhr);
  line(x_uhr + 100, y_uhr, x_uhr + 75, y_uhr);

  line(x_uhr, y_uhr, x_uhr - 60, y_uhr - 33);

  //bewegender Zeige
  translate(x_uhr, y_uhr);
  rotate(zeiger);

  stroke(0, Uhr_Tr);
  strokeWeight(5);
  line(0, 0, x_zeiger, y_zeiger);

  zeiger = zeiger + zeiger_geschw;

  if (zeiger >= 205) {
    zeiger = 205;

    b = 2;

    x_uhr = -500;

    deadname = "Marty McFly";

    x_grabstein = 276;
  }

  if (zeiger >= 195) {
    b_feuer = b_feuer + 8;
  }

  if (b_feuer >= 1 && b_feuer <= 10) {
    x_feuer = x_Buford - 65;
    y_feuer = y_Figuren + 35;
  }

  if (b_feuer > 10) {
    x_feuer = -500;
  }
}

function Marty() {
  stroke(0);
  strokeWeight(2);

  //Schuhe
  fill(168, 139, 103);
  quad(
    x_Marty - 8,
    y_Figuren + 100,
    x_Marty + 20,
    y_Figuren + 115,
    x_Marty + 20,
    y_Figuren + 120,
    x_Marty - 8,
    y_Figuren + 120
  );

  //Hose
  fill(72, 52, 43);
  rect(x_Marty - 8, y_Figuren + 60, 16, 50);

  //Poncho
  fill(54, 40, 42);
  rect(x_Marty - 10, y_Figuren + 10, 20, 50);

  //Kopf
  fill(255, 217, 179);
  ellipse(x_Marty, y_Figuren, 30, 30);

  fill(0);
  ellipse(x_Marty + 10, y_Figuren, 5);

  //Hut
  fill(85, 59, 37);
  rect(x_Marty - 15, y_Figuren - 20, 30, 15);

  stroke(0);
  strokeWeight(5);
  line(x_Marty - 25, y_Figuren - 8, x_Marty + 25, y_Figuren - 8);

  //Arm
  stroke(0);
  strokeWeight(14);
  line(x_Marty, y_Figuren + 25, x_Marty, y_Figuren + 45);

  line(x_Marty, y_Figuren + 45, x_Marty + 20, y_Figuren + 45);

  stroke(161, 182, 215);
  strokeWeight(10);
  line(x_Marty, y_Figuren + 25, x_Marty, y_Figuren + 45);

  line(x_Marty, y_Figuren + 45, x_Marty + 20, y_Figuren + 45);

  stroke(0);
  strokeWeight(2);
  //Pistole
  fill("grey");
  rect(x_Marty + 18, y_Figuren + 32, 30, 5);
  //Hand
  fill(255, 217, 179);
  ellipse(x_Marty + 23, y_Figuren + 45, 15, 15);
}

function Buford() {
  stroke(0);
  strokeWeight(2);

  //Schuhe
  fill(168, 139, 103);
  quad(
    x_Buford + 8,
    y_Figuren + 100,
    x_Buford - 20,
    y_Figuren + 115,
    x_Buford - 20,
    y_Figuren + 120,
    x_Buford + 8,
    y_Figuren + 120
  );

  //Hose
  fill(42, 38, 61);
  rect(x_Buford - 8, y_Figuren + 60, 16, 50);

  //Poncho
  fill(42, 38, 74);
  rect(x_Buford - 10, y_Figuren + 10, 20, 50);

  //Kopf
  fill(255, 217, 179);
  ellipse(x_Buford, y_Figuren, 30, 30);

  fill(0);
  ellipse(x_Buford - 10, y_Figuren, 5);

  stroke(71, 50, 25);
  strokeWeight(3);
  line(x_Buford - 7, y_Figuren - 3, x_Buford - 12, y_Figuren - 2);

  stroke(71, 50, 25);
  strokeWeight(5);
  line(x_Buford - 13, y_Figuren + 7, x_Buford - 5, y_Figuren + 7);
  line(x_Buford - 5, y_Figuren + 7, x_Buford - 5, y_Figuren + 10);

  //Hut
  stroke(0);
  strokeWeight(2);
  fill(42, 38, 74);
  quad(
    x_Buford - 15,
    y_Figuren - 25,
    x_Buford + 15,
    y_Figuren - 20,
    x_Buford + 15,
    y_Figuren - 5,
    x_Buford - 15,
    y_Figuren - 5
  );

  stroke(0);
  strokeWeight(5);
  line(x_Buford - 25, y_Figuren - 8, x_Buford + 23, y_Figuren - 8);

  //Arm
  stroke(0);
  strokeWeight(14);
  line(x_Buford, y_Figuren + 25, x_Buford, y_Figuren + 45);

  line(x_Buford, y_Figuren + 45, x_Buford - 20, y_Figuren + 45);

  stroke(42, 38, 74);
  strokeWeight(10);
  line(x_Buford, y_Figuren + 25, x_Buford, y_Figuren + 45);

  line(x_Buford, y_Figuren + 45, x_Buford - 20, y_Figuren + 45);

  stroke(0);
  strokeWeight(2);
  //Pistole
  fill("grey");
  rect(x_Buford - 48, y_Figuren + 32, 30, 5);
  //Hand
  fill(255, 217, 179);
  ellipse(x_Buford - 23, y_Figuren + 45, 15, 15);
}

function Hintergrund() {
  stroke("Goldenrod");
  strokeWeight(3);
  fill(191, 174, 117);
  rect(-10, 380, 810, 220);

  noStroke();
  fill(30, 144, 255);
  rect(0, 0, 800, 379);

  noStroke();
  fill(255, 255, 0, 50);
  ellipse(800, 0, 400, 400);

  noStroke();
  fill(255, 255, 0, 60);
  ellipse(800, 0, 350, 350);

  noStroke();
  fill(255, 255, 0, 70);
  ellipse(800, 0, 300, 300);

  noStroke();
  fill(255, 255, 0, 80);
  ellipse(800, 0, 250, 250);

  noStroke();
  fill(255, 255, 0, 90);
  ellipse(800, 0, 200, 200);

  noStroke();
  fill(255, 255, 0, 100);
  ellipse(800, 0, 150, 150);

  noStroke();
  fill(255, 255, 255);
  ellipse(100, 0, 100, 100);

  noStroke();
  fill(255, 255, 255);
  ellipse(250, 0, 100, 100);

  noStroke();
  fill(255, 255, 255);
  ellipse(180, 15, 100, 100);

  noStroke();
  fill(255, 255, 255);
  ellipse(470, -10, 80, 80);

  noStroke();
  fill(255, 255, 255);
  ellipse(530, 10, 80, 80);

  noStroke();
  fill(255, 255, 255);
  ellipse(595, 10, 80, 80);

  noStroke();
  fill(255, 255, 255);
  ellipse(660, -10, 80, 80);

  noStroke();
  fill(255, 255, 255, 150);
  ellipse(130, 200, 100, 60);

  noStroke();
  fill(255, 255, 255, 150);
  ellipse(670, 300, 100, 60);
}

function Rathaus() {
  noStroke();
  fill(153, 0, 0);
  rect(150, 150, 500, 200);

  noStroke();
  fill(217, 217, 217);
  rect(150, 350, 500, 10);

  noStroke();
  fill(51, 51, 51);
  rect(150, 360, 500, 10);

  noStroke();
  fill(217, 217, 217);
  rect(150, 370, 500, 40);

  noStroke();
  fill(217, 217, 217);
  rect(145, 145, 510, 5);

  noStroke();
  fill(51, 51, 51);
  rect(140, 140, 520, 5);

  noStroke();
  fill(217, 217, 217);
  rect(145, 135, 510, 5);

  noStroke();
  fill(51, 51, 51);
  rect(140, 130, 520, 5);

  noStroke();
  fill(217, 217, 217);
  rect(135, 125, 530, 5);

  noStroke();
  fill(51, 51, 51);
  rect(130, 120, 540, 5);

  noStroke();
  fill(102, 102, 102);
  rect(310, 136, 180, 5);

  noStroke();
  fill(26, 26, 26);
  rect(305, 131, 190, 5);

  noStroke();
  fill(102, 102, 102);
  rect(310, 126, 180, 5);

  noStroke();
  fill(26, 26, 26);
  rect(305, 121, 190, 5);

  noStroke();
  fill(102, 102, 102);
  rect(300, 116, 200, 5);

  noStroke();
  fill(26, 26, 26);
  rect(295, 111, 210, 5);

  noStroke();
  fill(153, 0, 0);
  triangle(400, 70, 505, 111, 295, 111);

  noStroke();
  fill(102, 102, 102);
  quad(400, 65, 400, 70, 295, 111, 294, 108);

  noStroke();
  fill(102, 102, 102);
  quad(400, 65, 400, 70, 505, 111, 506, 108);

  stroke(0);
  strokeWeight(2);
  fill(255, 255, 255);
  ellipse(400, 92, 35, 35);

  noStroke();
  fill(217, 217, 217);
  rect(310, 150, 20, 200);

  noStroke();
  fill(217, 217, 217);
  rect(470, 150, 20, 200);

  noStroke();
  fill(217, 217, 217);
  rect(310, 150, 20, 200);

  noStroke();
  fill(217, 217, 217);
  rect(363.3, 150, 20, 200);

  noStroke();
  fill(217, 217, 217);
  rect(416.6, 150, 20, 200);

  noStroke();
  fill(0);
  rect(390, 300, 20, 50);

  stroke(26, 26, 26);
  strokeWeight(2);
  fill(102, 102, 102);
  rect(390, 294, 20, 5);

  stroke(26, 26, 26);
  strokeWeight(2);
  fill(102, 102, 102);
  triangle(400, 284, 390, 294, 410, 294);

  stroke(102, 102, 102);
  strokeWeight(3);
  fill(128, 179, 255);
  rect(175, 280, 40, 60);

  stroke(102, 102, 102);
  strokeWeight(3);
  fill(128, 179, 255);
  rect(175, 180, 40, 60);

  stroke(102, 102, 102);
  strokeWeight(3);
  fill(128, 179, 255);
  rect(250, 280, 40, 60);

  stroke(102, 102, 102);
  strokeWeight(3);
  fill(128, 179, 255);
  rect(250, 180, 40, 60);

  stroke(102, 102, 102);
  strokeWeight(3);
  fill(128, 179, 255);
  rect(510, 280, 40, 60);

  stroke(102, 102, 102);
  strokeWeight(3);
  fill(128, 179, 255);
  rect(510, 180, 40, 60);

  stroke(102, 102, 102);
  strokeWeight(3);
  fill(128, 179, 255);
  rect(585, 280, 40, 60);

  stroke(102, 102, 102);
  strokeWeight(3);
  fill(128, 179, 255);
  rect(585, 180, 40, 60);
}

function Uhr_Rathaus() {
  noStroke();
  fill(0);
  ellipse(400, 79, 3, 3);

  noStroke();
  fill(0);
  ellipse(400, 105, 3, 3);

  noStroke();
  fill(0);
  ellipse(413, 92, 3, 3);

  noStroke();
  fill(0);
  ellipse(387, 92, 3, 3);

  noStroke();
  fill(0);
  ellipse(393.5, 81, 3, 3);

  noStroke();
  fill(0);
  ellipse(406.5, 81, 3, 3);

  noStroke();
  fill(0);
  ellipse(389, 85.5, 3, 3);

  noStroke();
  fill(0);
  ellipse(411, 85.5, 3, 3);

  noStroke();
  fill(0);
  ellipse(411, 98.5, 3, 3);

  noStroke();
  fill(0);
  ellipse(389, 98.5, 3, 3);

  noStroke();
  fill(0);
  ellipse(393.5, 103, 3, 3);

  noStroke();
  fill(0);
  ellipse(406.5, 103, 3, 3);

  noStroke();
  fill(0);
  ellipse(400, 92, 2, 2);
}

function Schuss() {
  if (keyIsPressed == true && keyCode === ENTER) {
    a = a + 0.99;
    m_feuer = m_feuer + 8;
    Munition = 0;
  }

  if (
    keyIsPressed == true &&
    keyCode === ENTER &&
    zeiger >= 180 &&
    zeiger <= 190 &&
    a < 1
  ) {
    zeiger_geschw = 0;
    b = 1;
    Punkte_M = Punkte_M + 1;

    x_uhr = -500;
    x_grabstein = 276;
    deadname = "Buford Tannen";
  }

  if (b == 1) {
    fill(190, 147, 37, 200);
    rect(0, 0, 800, 600);
  }

  if (m_feuer >= 1 && m_feuer <= 10) {
    x_feuer = x_Marty + 65;
    y_feuer = y_Figuren + 35;
  }

  if (m_feuer >= 11) {
    x_feuer = -500;
  }
}

function Spielstart() {
  if (keyIsPressed == true && keyCode === CONTROL) {
    x_zeiger = 0;
    y_zeiger = 75;
    zeiger = 0;

    a = 0;
    zeiger_geschw = Ausgangsgeschw + Schwierigkeit;
    b = 0;
    P_B = 0;
    m_feuer = 0;
    b_feuer = 0;
    Munition = 1;
    x_uhr = 400;
    x_grabstein = -276;

    x_Punktestand = 100;
    textfarbe = 0;
    x_Anzeige = 400;
    modus = modus + 1;
    Limit = 0;
    schw = schw + 1;
  }

  if (keyIsPressed == true && keyCode === ESCAPE) {
    x_zeiger = 0;
    y_zeiger = 75;
    zeiger = 0;

    a = 0;
    zeiger_geschw = 0;
    b = 0;
    P_B = 0;

    Punkte_M = 0;
    Punkte_B = 0;
    m_feuer = 0;
    b_feuer = 0;
    Munition = 1;

    x_uhr = 400;
    x_grabstein = -276;

    x_Punktestand = 100;

    textfarbe = 0;
    x_Anzeige = 400;
    modus = 0;
    Limit = 1;
    schw = 0;
  }
}

function Punktestand() {
  textSize(30);
  textAlign(CENTER);
  fill(textfarbe);
  text("Marty", 150, 570);
  text("Buford", 650, 570);

  textSize(50);
  fill(textfarbe);
  textAlign(CENTER);
  text(Punkte_M, 50, 50);
  text(Punkte_B, 750, 50);

  //Munitionsangabe
  textSize(30);
  fill(0);
  textAlign(CENTER);
  text("Munition: " + Munition, x_Punktestand, 85);
}

function Mündungsfeuer() {
  stroke(252, 139, 43);
  strokeWeight(3);
  fill(241, 226, 154);
  ellipse(x_feuer, y_feuer, 30, 15);
}

function Grabstein() {
  //Grabstein 276 200

  stroke(0);
  strokeWeight(3);
  fill(125);
  rect(x_grabstein, y_grabstein, 230, 300);

  stroke(0);
  strokeWeight(3);
  fill(125);
  ellipse(x_grabstein + 115.5, y_grabstein, 229, 229);

  stroke(0);
  strokeWeight(10);
  line(x_grabstein + 94, y_grabstein - 70, x_grabstein + 135, y_grabstein - 70);
  line(
    x_grabstein + 115,
    y_grabstein - 90,
    x_grabstein + 115,
    y_grabstein - 30
  );

  noStroke();
  fill(125);
  rect(x_grabstein + 2, y_grabstein, 227, 280);

  fill(0);
  textSize(50);
  textFont("Georgia");
  textAlign(CENTER);
  text("RIP", x_grabstein + 115, y_grabstein + 40);

  fill(0);
  textSize(30);
  textAlign(CENTER);
  text(deadname, x_grabstein + 115, y_grabstein + 100);
}

function Schluss() {
  if (Ende == "Punktelimit" && Punkte_B >= benötigte_Punkte) {
    Schluss2 = "Niederlage";
    x_text = 400;

    zeiger_geschw = 0;

    fill(0);
    rect(0, 0, 800, 600);

    x_uhr = -500;

    textfarbe = 255;

    fill(255);
    textSize(150);
    textAlign(CENTER);
    text(Schluss2, x_text, 300);

    x_Punktestand = -500;
    x_Anzeige = -500;
    b = 0;
  }

  if (Ende == "Punktelimit" && Punkte_M >= benötigte_Punkte) {
    x_grabstein = -500;

    Schluss2 = "Sieg";
    x_text = 400;

    zeiger_geschw = 0;

    fill(190, 147, 37);
    rect(0, 0, 800, 600);

    x_uhr = -500;

    textfarbe = 0;

    fill(0);
    textSize(150);
    textAlign(CENTER);
    text(Schluss2, x_text, 300);

    x_Punktestand = -500;
    x_Anzeige = -500;
    b = 0;
  }
}
