var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

var FPS = 60;
var cursor = {};
var isBuilding = false;
var tower = {};
var enemy = {
    x:96,
    y:480-32,
    speedX:0,
    speedY:-64,
    pathDes: 0,
    move: function(){
        if( isCollided(enemyPath[this.pathDes].x, enemyPath[this.pathDes].y, this.x, this.y, 64/FPS, 64/FPS) ){

            // 首先，修正位置到目標路徑點
            this.x = enemyPath[this.pathDes].x;
            this.y = enemyPath[this.pathDes].y;

            // 指定下一個路徑點為目標路徑點
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

        } else {
            this.x = this.x + this.speedX/FPS;
            this.y = this.y + this.speedY/FPS;
        }
    }
};

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
// ==================== //

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
    } else if (isBuilding) {
        tower.x = cursor.x - cursor.x%32;
        tower.y = cursor.y - cursor.y%32;
    }
});

function draw(){

    enemy.move();

    ctx.drawImage(bgImg,0,0);
    ctx.drawImage(buttonImg, 640-64, 480-64, 64, 64);
    ctx.drawImage(towerImg, tower.x, tower.y);
    ctx.drawImage(slimeImg, enemy.x, enemy.y);
    if(isBuilding){
        ctx.drawImage(towerImg, cursor.x, cursor.y);
    }
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