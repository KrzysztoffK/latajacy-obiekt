import { screenHeight, screenWidth, staticObjectWidth, staticObjectHeight, staticObjects, userObject, obstacleGenerator, movableObstacles, pointsCounterDiv, gameOver, pointsDiv } from "./script.js";
import { StaticObject } from "./StaticObject.js";


export class UserObject{
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

        this.pointsCounter = pointsCounter;

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
                console.log(pointsCounter);
                //pointsCounterDiv.innerHTML = this.pointsCounter;

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