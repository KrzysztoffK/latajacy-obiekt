export class StaticObject{
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

//Function generating initial staticObjects on the screen
export function generateStaticObjects(count, width, height) {
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