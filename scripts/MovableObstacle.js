import { movableObstacleHeight, movableObstacles, movableObstacleWidth, obstacleGenerator, screenHeight, screenWidth } from "./script.js";

export class MovableObstacle{
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

let x, y, speedX, speedY;

export function setMovableObstaclesMovement(edge, movementType, totalSpeed){
    //let speedX, speedY;
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

export function setMovableObstaclesCoordinates(edge, movementType, totalSpeed, width, height){
    //let x, y, speedX, speedY;
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

export function generateMovableObstacles(count, width, height, totalSpeed){
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

export function spawnMovableObstacle(width, height, totalSpeed){
    let x, y, speedX, speedY;
    const edge = Math.floor(Math.random() * 4);
    const movementType = Math.floor(Math.random() * 3);
    ({ x, y, speedX, speedY} = setMovableObstaclesCoordinates(edge, movementType, totalSpeed, width, height));
    return new MovableObstacle(x, y, width, height, speedX, speedY);
}