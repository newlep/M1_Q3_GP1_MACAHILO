// Game Configuration (Combined and Improved Readability)
const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

// Initialize the Game
const game = new Phaser.Game(config);

// Game Variables
let player, cash, plane, cursors, textScore;
let score = 0; // Initialize score outside function
let hasCash = false; // Flag to track cash collection
let lastCashAlertTime = 0; // Timestamp for last cash alert

// Load Game Assets
function preload() {
  this.load
    .image("player", "./assets/characters/pingu.png")
    .image("cash", "./assets/objects/money.png") 
    .image("background", "./assets/backgrounds/mainbg.jpg")
    .image("plane", "./assets/objects/plane.png") 
    .audio("cashSound", "./assets/audio/cash.mp3") 
    .audio("victory", "./assets/audio/victory.mp3");
}

// Create Game Objects and Settings
function create() {
  // Add Background Image
  this.add.image(0, 0, "background").setOrigin(0, 0);

  // Create Sprites with Physics 
  player = this.physics.add.sprite(0, 340, "player").setBounce(0).setCollideWorldBounds(true).setScale(0.2);
  cash = this.physics.add.sprite(500, 450, "cash").setScale(0.2);
  plane = this.physics.add.sprite(1000, 150, "plane").setScale(1);

  // Create Score Text
  const style = { font: "50px Courier New", fill: "#FFFB03" };
  textScore = this.add.text(50, 30, "Money Stolen: " + score, style);

  // Get Cursor Keys
  cursors = this.input.keyboard.createCursorKeys();

  // Create Sound Objects
  cashSound = this.sound.add("cashSound");
  victorySound = this.sound.add("victory");
}
 
function update() {

  player.setVelocityX(0); 
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.flipX = true; 
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.flipX = false; 
  }
  // Player Movement
  player.setVelocityX(cursors.left.isDown ? -160 : cursors.right.isDown ? 160 : 0);
  player.setVelocityY(cursors.up.isDown ? -160 : cursors.down.isDown ? 160 : 0);

  // Overlap Checks
  this.physics.add.overlap(player, cash, () => {
    hasCash = true; // Set flag upon cash collection
    cash.disableBody(true, true);
    cashSound.play();
    alert("Money secured! Time to bring it to the plane!");
  });
  this.physics.add.overlap(player, plane, () => {
    if (hasCash) { // Check if cash is collected before triggering victory
      score += 900;
      textScore.setText("Money Stolen: " + score);
      player.disableBody(true, true);
      victorySound.play();
      alert("GOOD JOB!\nYou have committed a crime! (You are a criminal penguin now)");
      hasCash = false; // Reset flag after victory
    } else {
      const now = Math.floor(Date.now() / 1000); // Get current time in seconds
      if (now - lastCashAlertTime >= 5) { // Check if 5 seconds have passed
        alert("YOU NEED THE CASH FIRST!\nGo get it and bring it back to the plane.");
        lastCashAlertTime = now; // Update last alert time
      }
    }
  });
}
