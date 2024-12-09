//
const startButton = document.querySelector("#startGame");

//Collection of user collectable static nodes
let staticObjectNodes = document.querySelectorAll(".staticObject");

//User movable object properties
let userObject = document.querySelector("#userObject");
let userObjectRect;
let userObjectWidth;
let userObjectHeight;

//size of user movable object
let posX = 100;
let posY = 100;

//Define and calculate linear and diagonal move speeds
const linearMoveSpeed = 10;
const diagonalMoveSpeed = linearMoveSpeed / Math.sqrt(2);
let moveSpeed = linearMoveSpeed;




startButton.addEventListener('click', (event) => {
    let newUserObject = document.createElement("div");
    newUserObject.setAttribute('id','userObject');
    document.body.appendChild(newUserObject);

    userObject = document.querySelector("#userObject");
    userObjectRect = userObject.getBoundingClientRect();
    userObjectWidth = userObjectRect.width;
    userObjectHeight = userObjectRect.height;
    console.log('test');
});

function generateStaticObjects(objectsCount){
    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;

    //size of static objects
    const objectWidth = 50;
    const objectHeight = 50;

    for (let i = 0; i < objectsCount; i++){
        const staticObject = document.createElement("div");
        staticObject.classList.add("staticObject");
    
        const randomX = Math.random() * (screenWidth - objectWidth);
        const randomY = Math.random() * (screenHeight - objectHeight);

        staticObject.style.left = `${randomX}px`;
        staticObject.style.top = `${randomY}px`;

        // Append the object to the container
        document.body.appendChild(staticObject);
    }

// Update the staticObjects NodeList
    staticObjectNodes = document.querySelectorAll(".staticObject");
}
generateStaticObjects(15);

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

//Update user object position depending on which key is pressed, adjust the "move speed"
//and check if a collision with any other node occurs
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
    //After a collision is detected, remove the object that the user collided with and replace it with a new one
    staticObjectNodes.forEach((staticObject, index) => {
        const staticRect = staticObject.getBoundingClientRect();
        if(detectCollision(userRect, staticRect)){
            console.log("kolizja");
            staticObject.remove();
            staticObjectNodes = document.querySelectorAll(".staticObject");
            generateStaticObjects(1);
            
        }
    });
    requestAnimationFrame(updatePosition);
}

//Listen for keys being pressed
//If the movement is diagonal, set the moveSpeed to diagonal
document.addEventListener('keydown', (event) => {
    if (event.key in keysPressed) {
        keysPressed[event.key] = true;
        if (Object.values(keysPressed).filter(val => val).length >= 2){
            moveSpeed = diagonalMoveSpeed;
        };
    }
    
});
requestAnimationFrame(updatePosition);


//Listen for keys being released
//If the movement was diagonal, reset the moveSpeed to linear
document.addEventListener('keyup', (event) => {
    if (event.key in keysPressed) {
        keysPressed[event.key] = false;
        moveSpeed = linearMoveSpeed;
    }
});


