//Get dimensions of the screen
const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

//Set dimensions of objects
const userObjectHeight = 60;
const userObjectWidth = 60;
const staticObjectHeight = 30;
const staticObjectWidth = 30;
const movableObstacleHeight = 50;
const movableObstacleWidth = 50;

//Get elements from the document
const startButton = document.querySelector("#startGame");
const startDiv = document.querySelector("#start");
const pointsDiv = document.querySelector("#points");
const pointsCounterDiv = document.querySelector("#pointsCounter");
const restartButton = document.querySelector("#restartGame");

const menuButtons = document.querySelectorAll(".mainMenu");

const gameOver = document.querySelector("#gameOver");
const beginGameButtons = document.querySelectorAll(".beginGame");
const instructionsButton = document.querySelector("#showInstructions");
const instructionsDiv = document.querySelector("#instructions");

let staticObjects;
let userObject;
let movableObstacles;
let obstacleGenerator = true;

//Define counter for the stats
let pointsCounter = 0;
let giftsCounter = 0;
let ultraGiftsCounter = 0;
let demonsCounter = 0;
let followersCounter = 0;

//Class definitions
class StaticObject{
    constructor(x, y, width, height){
        this.width = width;
        this.height = height;

        this.element = document.createElement("div");
        this.element.classList.add("staticObject");
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.setPosition(x, y);
        document.body.appendChild(this.element);
    }

    //Sets position of the static element on the screen
    setPosition(x, y){
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    getRect(){
        return this.element.getBoundingClientRect();
    }

    remove(){
        this.element.remove();
    }
}

class MovableObstacle{
    constructor(x, y, width, height, speedX, speedY){
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;

        this.element = document.createElement("div");
        this.element.classList.add("movableObstacle");
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.setPosition(x, y);
        document.body.appendChild(this.element);
    }

    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.posX = x;
        this.posY = y;
    }

    move() {
        this.posX += this.speedX;
        this.posY += this.speedY;
        this.setPosition(this.posX, this.posY);
        // Remove the obstacle if it moves off-screen
        if (
            this.posX + this.width < 0 ||
            this.posX + this.width > screenWidth ||
            this.posY + this.height < 0 ||
            this.posY + this.height > screenHeight
        ) {
            this.remove();
            if(obstacleGenerator){
                const newObstacle = spawnMovableObstacle(movableObstacleWidth, movableObstacleHeight, Math.random()*5);
                movableObstacles.push(newObstacle);
                const index = movableObstacles.indexOf(this);
                if (index > -1) {
                movableObstacles.splice(index, 1);
                }
            }
            
            
        }
    }

    remove() {
        this.element.remove();
    }

    getRect() {
        return this.element.getBoundingClientRect();
    }
}

class UserObject{
    constructor(x, y, width, height, moveSpeed = 10) {
        this.element = document.createElement("div");
        this.element.id = "userObject";
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.setPosition(x, y);
        document.body.appendChild(this.element);

        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;

        //Set move speed
        this.linearMoveSpeed = moveSpeed;
        this.diagonalMoveSpeed = this.linearMoveSpeed / Math.sqrt(2);
        this.moveSpeed = this.linearMoveSpeed

        this.keysPressed = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };

        this.initEventListeners();
    }

    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    move() {

        if (this.keysPressed.ArrowUp && this.posY - this.moveSpeed >= 0) {
            this.posY -= this.moveSpeed;
        }
        if (this.keysPressed.ArrowDown && this.posY + this.height + this.moveSpeed <= screenHeight) {
            this.posY += this.moveSpeed;
        }
        if (this.keysPressed.ArrowLeft && this.posX - this.moveSpeed >= 0) {
            this.posX -= this.moveSpeed;
        }
        if (this.keysPressed.ArrowRight && this.posX + this.width + this.moveSpeed <= screenWidth) {
            this.posX += this.moveSpeed;
        }

        this.setPosition(this.posX, this.posY);
    }

    detectCollision(staticObjects) {
        const userRect = this.element.getBoundingClientRect();
        staticObjects.forEach((staticObject, index) => {
            const staticRect = staticObject.getRect();
            if (
                userRect.left < staticRect.right &&
                userRect.right > staticRect.left &&
                userRect.top < staticRect.bottom &&
                userRect.bottom > staticRect.top
            ) {
                console.log(`Collision detected with object ${index + 1}!`);
                staticObject.remove();
                staticObjects.splice(index, 1);
                pointsCounter++;
                pointsCounterDiv.innerHTML = pointsCounter;

                const x = Math.random() * (screenWidth - staticObjectWidth);
                const y = Math.random() * (screenHeight - staticObjectHeight);
    
                staticObjects.push(new StaticObject(x, y, staticObjectWidth, staticObjectHeight));
            }
        });
    }

    detectCollisionWObstacles(movableObstacles){
        const userRect = this.element.getBoundingClientRect();
        movableObstacles.forEach((movableObstacle) => {
            const obstacleRect = movableObstacle.getRect();
            if (
                userRect.left < obstacleRect.right &&
                userRect.right > obstacleRect.left &&
                userRect.top < obstacleRect.bottom &&
                userRect.bottom > obstacleRect.top
            ) {
                movableObstacles.forEach((movableObstacle) => {
                    movableObstacle.remove();
                });
                staticObjects.forEach((staticObject) => {
                    staticObject.remove();
                });
                gameOver.style.display = "block";
                pointsDiv.style.display = "none";
                userObject.remove();
                obstacleGenerator = false;
                //alert("Game Over!");
                //window.location.reload(); // Reload the game
            }
        });
    }

    initEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (event.key in this.keysPressed) {
                this.keysPressed[event.key] = true;
                if (Object.values(this.keysPressed).filter(val => val).length >= 2){
                    this.moveSpeed = this.diagonalMoveSpeed;
                };
            }
        });

        document.addEventListener("keyup", (event) => {
            if (event.key in this.keysPressed) {
                this.keysPressed[event.key] = false;
                this.moveSpeed = this.linearMoveSpeed;
            }
        });
    }

    update(staticObjects) {
        this.move();
        this.detectCollision(staticObjects);
        this.detectCollisionWObstacles(movableObstacles);
    }

    remove(){
        this.element.remove();
    }
}

//Function generating initial staticObjects on the screen
function generateStaticObjects(count, width, height) {
    const staticObjects = [];
    for (let i = 0; i < count; i++) {
        const screenWidth = document.documentElement.clientWidth;
        const screenHeight = document.documentElement.clientHeight;

        const x = Math.random() * (screenWidth - width);
        const y = Math.random() * (screenHeight - height);

        staticObjects.push(new StaticObject(x, y, width, height));
    }
    return staticObjects;
}

function setMovableObstaclesMovement(edge, movementType, totalSpeed){
    let speedX, speedY;
    //Handles movements from the top (0) or bottom (1) edge
    if ((edge === 0) || (edge === 1)){
        //Handles horizontal movement
        if (movementType === 0){
            speedX = Math.random() > 0.5 ? totalSpeed : -totalSpeed;
            speedY = 0;
        //Handles vertical movement
        } else if (movementType === 1){
            speedX = 0;
            switch (edge) {
                //top edge
                case 0:
                    speedY = totalSpeed;
                    break;
                //bottom edge
                case 1:
                    speedY = -totalSpeed;
                    break;
            }
        //Handles diagonal movement
        } else {
            speedX = (Math.random() > 0.5 ? 1 : -1) * totalSpeed / Math.sqrt(2);
            switch (edge) {
                //top edge
                case 0:
                    speedY = totalSpeed / Math.sqrt(2);
                    break;
                //bottom edge
                case 1:
                    speedY = -totalSpeed / Math.sqrt(2);
                    break;
            }
        }
    //Handles movements from the left (2) or right (3) edge
    } else {
        //Handles horizontal movement
        if (movementType === 0){
            speedY = 0;
            switch (edge) {
                case 2:
                    speedX = totalSpeed;
                    break;
                case 3:
                    speedX = -totalSpeed;
                    break;
            }
        //Handles vertical movement
        } else if (movementType === 1){
            speedX = 0;
            speedY = Math.random() > 0.5 ? totalSpeed : -totalSpeed;
        //Handles diagonal movement
        } else {
            speedY = (Math.random() > 0.5 ? 1 : -1) * totalSpeed / Math.sqrt(2);
            switch (edge) {
                case 2:
                    speedX = totalSpeed / Math.sqrt(2);
                    break;
                case 3:
                    speedX = -totalSpeed / Math.sqrt(2);
                    break;
            }
        }
    }
    return {
        speedX: speedX,
        speedY: speedY
    }
}

function setMovableObstaclesCoordinates(edge, movementType, totalSpeed, width, height){
    switch (edge) {
        //Top edge
        case 0:
            //set initial corrdinates
            x = Math.random() * screenWidth;
            y = 0;
            ({ speedX, speedY } = setMovableObstaclesMovement(edge, movementType, totalSpeed));
            break;
        //Bottom edge
        case 1:
            //set initial corrdinates
            x = Math.random() * screenWidth;
            y = screenHeight - height;
            ({ speedX, speedY } = setMovableObstaclesMovement(edge, movementType, totalSpeed));
            break;
        //Left edge
        case 2:
            //set initial corrdinates
            x = 0;
            y = Math.random() * screenHeight;
            ({ speedX, speedY } = setMovableObstaclesMovement(edge, movementType, totalSpeed));
            break;
        //Right edge
        case 3:
            //set initial corrdinates
            x = screenWidth - width;
            y = Math.random() * screenHeight;
            ({ speedX, speedY } = setMovableObstaclesMovement(edge, movementType, totalSpeed));
            break;
    }
    return {
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY
    }
}

function generateMovableObstacles(count, width, height, totalSpeed){
    const movableObstacles = [];
    for (let i = 0; i < count; i++) {
        let x, y, speedX, speedY;
        //Randomize edge that the enemy spawns on: 0 - top, 1 - bottom, 2 - left, 3 - right
        const edge = Math.floor(Math.random() * 4);
        //Randomize movement type: 0 - horizontal, 1 - vertical, 2 - diagonal
        const movementType = Math.floor(Math.random() * 3);
        ({ x, y, speedX, speedY} = setMovableObstaclesCoordinates(edge, movementType, totalSpeed, width, height));
        movableObstacles.push(new MovableObstacle(x, y, width, height, speedX, speedY));
    }
    return movableObstacles;
}

function spawnMovableObstacle(width, height, totalSpeed){
    let x, y, speedX, speedY;
    const edge = Math.floor(Math.random() * 4);
    const movementType = Math.floor(Math.random() * 3);
    ({ x, y, speedX, speedY} = setMovableObstaclesCoordinates(edge, movementType, totalSpeed, width, height));
    return new MovableObstacle(x, y, width, height, speedX, speedY);
}

//A function looping the game is required for the requestAnimationFrame method to work
//properly - a recursive call
function gameLoop() {
    userObject.update(staticObjects, movableObstacles);
    movableObstacles.forEach((obstacle) => obstacle.move());
    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameOver.style.display = "none";
    startDiv.style.display = "none";
    pointsDiv.style.display = "block";
    userObject = new UserObject(screenWidth / 2, screenHeight / 2, userObjectWidth, userObjectHeight);
    staticObjects = generateStaticObjects(10, staticObjectWidth, staticObjectHeight);
    movableObstacles = generateMovableObstacles(6, movableObstacleWidth, movableObstacleHeight, Math.random()*5);
    gameLoop();
}


startButton.addEventListener('click', () => {
    startGame();
});

restartButton.addEventListener('click', () => {
    startGame();
});

menuButtons.forEach((menuButton) => {
    menuButton.addEventListener('click', () => {
        window.location.reload();
    })
});

instructionsButton.addEventListener('click', () => {
    startDiv.style.display = "none";
    instructionsDiv.style.display = "block";
});