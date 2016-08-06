var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

var FPS = 60;
var clock = 0;
var cursor = {};
var isBuilding = false;
var towers = [];
var enemies = [];
var hp = 100;
var score = 0;
var money = 25;

function Tower(x, y) {
    this.x = x;
    this.y = y;
    this.range = 96;
    this.fireRate = 1;
    this.readyToShootTime = 1;
    this.searchEnemy = function(){
        for(var i=0; i<enemies.length; i++){
            var distance = Math.sqrt( Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2) );
            if (distance<=this.range) {
                this.aimingEnemyId = i;
                if(this.readyToShootTime<=0){
                    this.shoot();
                    this.readyToShootTime = this.fireRate;
                } else {
                    this.readyToShootTime -= 1/FPS
                }
                return;
            }
        }
        // 如果都沒找到，會進到這行，清除鎖定的目標
        this.aimingEnemyId = null;
    };
    this.shoot = function(){
        ctx.beginPath();
        ctx.moveTo(this.x+16,this.y);
        ctx.lineTo(enemies[this.aimingEnemyId].x+16,enemies[this.aimingEnemyId].y+16);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
        enemies[this.aimingEnemyId].hp -= 5;
    };
};

function Enemy() {
    this.x = 96;
    this.y = 480-32;
    this.hp = 10;
    this.speedX = 0;
    this.speedY = -64;
    this.pathDes = 0;
    this.move = function(){
        if( isCollided(enemyPath[this.pathDes].x, enemyPath[this.pathDes].y, this.x, this.y, 64/FPS, 64/FPS) ){

            if (this.pathDes === enemyPath.length-1) {
                this.hp=0;
                hp -= 10;
            } else {
                // 首先，移動到下一個路徑點
                this.x = enemyPath[this.pathDes].x;
                this.y = enemyPath[this.pathDes].y;

                // 指定下一個路徑點
                this.pathDes++;

                // 重新設定設定前往目標路徑點的所需的水平/垂直速度
                if (enemyPath[this.pathDes].x>this.x) {
                  this.speedX = 64;
                  this.speedY = 0;
                } else if (enemyPath[this.pathDes].x<this.x) {
                  this.speedX = -64;
                  this.speedY = 0;
                } else if (enemyPath[this.pathDes].y>this.y) {
                  this.speedX = 0;
                  this.speedY = 64;
                } else if (enemyPath[this.pathDes].y<this.y) {
                  this.speedX = 0;
                  this.speedY = -64;
                }
            }

        } else {
            this.x = this.x + this.speedX/FPS;
            this.y = this.y + this.speedY/FPS;
        }
    };
}

var enemyPath = [
    {x:96, y:64},
    {x:384, y:64},
    {x:384, y:192},
    {x:224, y:192},
    {x:224, y:320},
    {x:544, y:320},
    {x:544, y:96}
];

// ====== 引入圖檔 ====== //
var bgImg = document.createElement("img");
bgImg.src = "images/map.png";
var buttonImg = document.createElement("img");
buttonImg.src = "images/tower-btn.png";
var towerImg = document.createElement("img");
towerImg.src = "images/tower.png";
var slimeImg = document.createElement("img");
slimeImg.src = "images/slime.gif";
var crosshairImg = document.createElement("img");
crosshairImg.src = "images/crosshair.png";
// ==================== //

ctx.font = "24px Arial";
ctx.fillStyle = "white";

$("#game-canvas").on("mousemove", function(event) {
    cursor = {
        x: event.offsetX,
        y: event.offsetY
    };
});

$("#game-canvas").on("click", function(){
    if( isCollided(cursor.x, cursor.y, 640-64, 480-64, 64, 64) ){
        if (isBuilding) {
            isBuilding = false;
        } else {
            isBuilding = true;
        }
    } else if (isBuilding && money>=25) {
        money = money - 25;
        towers.push( new Tower(cursor.x - cursor.x%32, cursor.y - cursor.y%32) );
    }
});

function draw(){

    if(clock%80==0){
        enemies.push(new Enemy());
    }

    ctx.drawImage(bgImg,0,0);
    ctx.drawImage(buttonImg, 640-64, 480-64, 64, 64);

    for(var i=0; i<enemies.length; i++){
        if (enemies[i].hp<=0) {
            enemies.splice(i,1);
            score += 10;
            money += 8;
        } else {
            enemies[i].move();
            ctx.drawImage( slimeImg, enemies[i].x, enemies[i].y);
        }
    }

    for(var i=0; i<towers.length; i++){
        towers[i].searchEnemy();
        ctx.drawImage(towerImg, towers[i].x, towers[i].y);
        if ( towers[i].aimingEnemyId!=null ) {
            var id = towers[i].aimingEnemyId;
            ctx.drawImage( crosshairImg, enemies[id].x, enemies[id].y );
        }
    }

    if(isBuilding){
        ctx.drawImage(towerImg, cursor.x, cursor.y);
    }

    ctx.fillText("HP:"+hp, 16, 32);
    ctx.fillText("Score:"+score, 16, 64);
    ctx.fillText("Money:"+money, 16, 96);

    clock++;
}

setInterval(draw, 1000/FPS);



// ====== 其他函式 ====== //

function isCollided(pointX, pointY, targetX, targetY, targetWidth, targetHeight) {
    if(     pointX >= targetX
        &&  pointX <= targetX + targetWidth
        &&  pointY >= targetY
        &&  pointY <= targetY + targetHeight
    ){
        return true;
    } else {
        return false;
    }
}