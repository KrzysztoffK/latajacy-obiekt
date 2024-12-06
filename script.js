//Collection of user collectable static nodes
let staticObjectNodes = document.querySelectorAll(".present");

//User movable object
const userObject = document.querySelector("#userObject");
const userObjectRect = userObject.getBoundingClientRect();
const userObjectWidth = userObjectRect.width;
const userObjectHeight = userObjectRect.height;

let posX = 100;
let posY = 100;

//Define and calculate linear and diagonal move speeds
const linearMoveSpeed = 10;
const diagonalMoveSpeed = linearMoveSpeed / Math.sqrt(2);
let moveSpeed = linearMoveSpeed;

//Register and hold state of pressed keys to determine which way to move the userObject
const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

//Detect collision between objects by using getBoundingClientRect() method 
//to get the object boundaries and check if they overlap
function detectCollision(rect1, rect2){
    return (
        rect1.left < rect2.right && 
        rect2.left < rect1.right &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function updatePosition(){
    if (keysPressed.ArrowUp) {
        if(!((posY - moveSpeed)<0)){posY -= moveSpeed;};
    }
    if (keysPressed.ArrowDown) {
        if(!(posY + userObjectHeight + moveSpeed > document.documentElement.clientHeight)){posY += moveSpeed};
    }
    if (keysPressed.ArrowLeft) {
        if(!((posX - moveSpeed)<0)){posX -= moveSpeed;} ;
    }
    if (keysPressed.ArrowRight) {
        if(!(posX + userObjectWidth + moveSpeed > document.documentElement.clientWidth)){posX += moveSpeed};
    }
    
    userObject.style.top = posY + 'px';
    userObject.style.left = posX + 'px';

    //After every movement update the user movable object rectangle
    const userRect = userObject.getBoundingClientRect();

    //Loop through a list of all the user collectible nodes and check for a collision
    staticObjectNodes.forEach((staticObject, index) => {
        const staticRect = staticObject.getBoundingClientRect();
        if(detectCollision(userRect, staticRect)){
            console.log("kolizja");
            staticObject.remove();
            staticObjectNodes = document.querySelectorAll(".present");
            
        }
    });
    requestAnimationFrame(updatePosition);
}

document.addEventListener('keydown', (event) => {
    if (event.key in keysPressed) {
        keysPressed[event.key] = true;
        if (Object.values(keysPressed).filter(val => val).length === 2){
            moveSpeed = diagonalMoveSpeed;
        };
    }
    
});
requestAnimationFrame(updatePosition);

document.addEventListener('keyup', (event) => {
    if (event.key in keysPressed) {
        keysPressed[event.key] = false;
        moveSpeed = linearMoveSpeed;
    }
});