// Classe de base pour n'importe quel poisson
export class Fish{
    constructor(){
        this.positionX = null
        this.positionY = null
        this.isMoving = false
        this.img = this.initImage()
        this.moveDirection = this.movementDirection()
        this.moveLimit = 
        {
            xMin : 0,
            xMax : 0
        }
        this.uid = Math.random() * 10
    }

    spawn(){
        let randomX = (Math.floor(Math.random() * 950) + 180)
        this.positionX = randomX

        let randomY = (Math.floor(Math.random() * 235) + 430)
        this.positionY = randomY

        this.moveLimit.xMin = this.positionX - 50
        this.moveLimit.xMax = this.positionX + this.width + 50
        
        return [randomX, randomY]
    }

    movementDirection(){
        let random = Math.round(Math.random() * 1)
        if (random === 1){
            this.moveDirection = "left"
            return "left"
        } else {
            this.moveDirection = "right"
            return "right"
        }
    }

    updateAnimation(direction){
        if (direction === "left"){
            this.positionX--
        }else if(direction === "right"){
            this.positionX++
        }
    }

    checkLimitMovement(){
        if (this.positionX <= this.moveLimit.xMin){
            if (this.moveDirection === "left"){
                return true
            }
        }

        if (this.positionX >= (this.moveLimit.xMax - this.width)){
            if (this.moveDirection === "right"){
                return true
            }
        }
        return false
    }

    checkSpawnPossibility(fish){
        return !(
            (this.positionY + this.height) > fish.positionY &&
            this.positionY < (fish.positionY + fish.height) &&
            this.moveLimit.xMax > fish.moveLimit.xMin &&
            this.moveLimit.xMin < fish.moveLimit.xMax
          );

        //   this.bottom() > obstacle.top() &&
        //   this.top() < obstacle.bottom() &&
        //   this.right() > obstacle.left() &&
        //   this.left() < obstacle.right()
    
    }
}

// Varie les poissons qui se basent sur la classe Fish
export class FishType1 extends Fish{
    constructor(){
        super()
        this.width = 54
        this.height = 21
        this.points = 50
    }

    initImage(){
        const image = new Image()
        image.src = "./src/img/fish/01/1.png"
        return image
    }
}

export class FishType2 extends Fish{
    constructor(){
        super()
        this.width = 26
        this.height = 12
        this.points = 150
    }

    initImage(){
        const image = new Image()
        image.src = "./src/img/fish/02/1.png"
        return image
        }
}

export class FishType3 extends Fish{
    constructor(){
        super()
        this.width = 30
        this.height = 12
        this.points = 125
    }

    initImage(){
        const image = new Image()
        image.src = "./src/img/fish/03/1.png"
        return image
    }
}

export class FishType4 extends Fish{
    constructor(){
        super()
        this.width = 20
        this.height = 12
        this.points = 175
    }

    initImage(){
        const image = new Image()
        image.src = "./src/img/fish/04/1.png"
        return image
    }
}

// Tout ce qui touche au score est stocké ici
export class Score{
    constructor(){
        this.score = 0
        this.sound = new Audio("./src/fx/score.mp3");
    }

    getScore(){
        if (this.score < 10){
            return `Score : 000${this.score}`
        }else if(this.score < 100){
            return `Score : 00${this.score}`
        }else if(this.score < 1000){
            return `Score : 0${this.score}`
        } else{
            return `Score : ${this.score}`
        }
    }

    addScore(points){
        this.score += points
    }

    reset(){
        this.score = 0
    }
}

// Interraction avec la canne à peche et permet de faire des detections avec la hitbox des poisson
export class FishingRod{ 
    constructor(){
        this.strength = 0
        this.isUsing = false
        this.lock = false
        this.positionX = null
        this.positionY = null
        this.positionYMax = null
        this.soundFx = {
            launch : new Audio("./src/fx/hookLaunch.mp3"),
            ploof : new Audio("./src/fx/hookPloof.mp3")
        }
    }

    isTouch(fish){
        return (
            this.positionY > fish.positionY &&
            this.positionY < (fish.positionY + fish.height)&&
            this.positionX > fish.positionX &&
            this.positionX < (fish.positionX + fish.width)
          );
    }
 }

// Permet de generer un random qui deplacera un poisson aleatoirement
export class GameTick{ 
    constructor(){
        this.time =  this.random()
    }

    random(){
        let random = ((16 * 60 ) * 3) + Math.floor(Math.random() * ((16 * 60) * 10))
        return random
    }
}

// Regroupe les images des vagues d'eau
export class WaterTile{
    constructor(){
        this.width = 32
        this.height = 31
        this.img = [
            this.init(1),
            this.init(2),
            this.init(3),
        ]
    }

    init(i){
        const image = new Image()
        image.src = `./src/img/waterTile/${i}.png`
        return image
    }
}

// Regroupe les images du pecheur en etat "lancement du hameçon" ou en mode "repos"
export class FisherMan{
    constructor(){
        this.isMoving = false
        this.moving = [
            this.init("moving", 1),
            this.init("moving", 2),
            this.init("moving", 3),
            this.init("moving", 4),
            this.init("moving", 5),
            this.init("moving", 6)
        ]
        this.idle = [
            this.init("idle", 1),
            this.init("idle", 2),
            this.init("idle", 3),
            this.init("idle", 4)
        ]
    }

    init(state, i){
        const image = new Image()
        image.src = `./src/img/fisherMan/${state}/${i}.png`
        return image
        
    }
}

// Regroupe les images de l'eau qui eclabousse - Sert pour animer le hameçon qui tombe dans l'eau
export class WaterSplatch{
    constructor(){
        this.width = 50
        this.height = 30
        this.img = [
            this.init(1),
            this.init(2),
            this.init(3),
            this.init(4)
        ]
    }

    init(i){
        const image = new Image()
        image.src = `./src/img/waterSplatch/${i}.png`
        return image
    }
}