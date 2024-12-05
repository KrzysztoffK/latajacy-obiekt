const userObject = document.querySelector("#userObject");
const userObjectRect = userObject.getBoundingClientRect();
const userObjectWidth = userObjectRect.width;
const userObjectHeight = userObjectRect.height;

let posX = 100;
let posY = 100;


const linearMoveSpeed = 10;
const diagonalMoveSpeed = 
let moveSpeed = linearMoveSpeed;

const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

function updatePosition(){
    if (keysPressed.ArrowUp) {
        if(!((posY - moveSpeed)<0)){posY -= moveSpeed;}
    }
    if (keysPressed.ArrowDown) {
        if(!(posY + userObjectHeight + moveSpeed > document.documentElement.clientHeight)){posY += moveSpeed};
    }
    if (keysPressed.ArrowLeft) {
        if(!((posX - moveSpeed)<0)){posX -= moveSpeed;} 
    }
    if (keysPressed.ArrowRight) {
        if(!(posX + userObjectWidth + moveSpeed > document.documentElement.clientWidth)){posX += moveSpeed};
    }
    
    userObject.style.top = posY + 'px';
    userObject.style.left = posX + 'px';
    requestAnimationFrame(updatePosition);
}

document.addEventListener('keydown', (event) => {
    if (event.key in keysPressed) {
        keysPressed[event.key] = true;
        if (Object.values(keysPressed).filter(val => val).length === 2){
            moveSpeed = 
        };
    }
    
});
requestAnimationFrame(updatePosition);


document.addEventListener('keyup', (event) => {
    if (event.key in keysPressed) {
        keysPressed[event.key] = false;
    }
});