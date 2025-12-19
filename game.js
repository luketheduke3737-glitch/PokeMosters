const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};
let inBattle = false;

const player = {
  x: 240,
  y: 240,
  size: 32,
  monster: {
    name: "Flameling",
    hp: 100,
    maxHP: 100,
    attacks: [
      { name: "Fire Bite", dmg: 20 },
      { name: "Ember", dmg: 30 }
    ]
  }
};

let enemy = null;

// Input
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Draw player
function drawPlayer() {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Move player
function movePlayer() {
  if (keys["w"]) player.y -= 2;
  if (keys["s"]) player.y += 2;
  if (keys["a"]) player.x -= 2;
  if (keys["d"]) player.x += 2;

  // Random encounters
  if (Math.random() < 0.01) startBattle();
}

// Battle
function startBattle() {
  inBattle = true;
  enemy = {
    name: "Leafbeast",
    hp: 80,
    maxHP: 80,
    attacks: [
      { name: "Vine Whip", dmg: 15 },
      { name: "Leaf Slam", dmg: 25 }
    ]
  };

  document.getElementById("battleUI").hidden = false;
  updateBattleUI();
  createButtons();
  log("A wild Leafbeast appeared!");
}

function attackEnemy(attack) {
  enemy.hp -= attack.dmg;
  log(`You used ${attack.name}!`);

  if (enemy.hp <= 0) {
    log("Enemy defeated!");
    endBattle();
    return;
  }

  setTimeout(enemyTurn, 600);
}

function enemyTurn() {
  const atk = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];
  player.monster.hp -= atk.dmg;
  log(`Enemy used ${atk.name}!`);

  if (player.monster.hp <= 0) {
    log("You fainted!");
    endBattle();
  }
  updateBattleUI();
}

function endBattle() {
  inBattle = false;
  document.getElementById("battleUI").hidden = true;
  player.monster.hp = player.monster.maxHP;
}

function updateBattleUI() {
  document.getElementById("playerName").innerText = player.monster.name;
  document.getElementById("enemyName").innerText = enemy.name;
  document.getElementById("playerHP").innerText =
    `HP: ${player.monster.hp}/${player.monster.maxHP}`;
  document.getElementById("enemyHP").innerText =
    `HP: ${enemy.hp}/${enemy.maxHP}`;
}

function createButtons() {
  const actions = document.getElementById("actions");
  actions.innerHTML = "";

  player.monster.attacks.forEach(atk => {
    const btn = document.createElement("button");
    btn.innerText = atk.name;
    btn.onclick = () => attackEnemy(atk);
    actions.appendChild(btn);
  });
}

function log(text) {
  document.getElementById("log").innerText = text;
}

// Game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!inBattle) {
    drawPlayer();
    movePlayer();
  }

  requestAnimationFrame(loop);
}

loop();
