import { generateMovableObstacles } from "./MovableObstacle.js";
import { generateStaticObjects } from "./StaticObject.js";
import { UserObject } from "./UserObject.js";

//Get dimensions of the screen
export const screenWidth = document.documentElement.clientWidth;
export const screenHeight = document.documentElement.clientHeight;

//Set dimensions of objects
export const userObjectHeight = 60;
export const userObjectWidth = 60;
export const staticObjectHeight = 30;
export const staticObjectWidth = 30;
export const movableObstacleHeight = 50;
export const movableObstacleWidth = 50;

//Get elements from the document
export const startButton = document.querySelector("#startGame");
export const startDiv = document.querySelector("#start");
export const pointsDiv = document.querySelector("#points");
export const pointsCounterDiv = document.querySelector("#pointsCounter");
export const restartButton = document.querySelector("#restartGame");

export const menuButtons = document.querySelectorAll(".mainMenu");

export const gameOver = document.querySelector("#gameOver");
export const beginGameButtons = document.querySelectorAll(".beginGame");
export const instructionsButton = document.querySelector("#showInstructions");
export const instructionsDiv = document.querySelector("#instructions");

export let staticObjects;
export let userObject;
export let movableObstacles;
export let obstacleGenerator = true;

//Define counter for the stats
//export let pointsCounter = 0;
let giftsCounter = 0;
let ultraGiftsCounter = 0;
let demonsCounter = 0;
let followersCounter = 0;

//A function looping the game is required for the requestAnimationFrame method to work
//properly - a recursive call
export function gameLoop() {
    userObject.update(staticObjects, movableObstacles);
    movableObstacles.forEach((obstacle) => obstacle.move());
    requestAnimationFrame(gameLoop);
}

export function startGame() {
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