export class Fish{
    constructor(){
        this.width = 54
        this.height = 21
        this.positionX = null
        this.positionY = null
        this.img = "https://res.cloudinary.com/shalltear/image/upload/v1653561601/fish_yotri0.png"
        this.isMoving = false
        this.moveDirection = this.movementDirection()
        this.points = 50
        this.moveLimit = 
        {
            xMin : 0,
            xMax : 0
        }
    }

    spawn(){
        let randomX = (Math.floor(Math.random() * 950) + 180)
        this.positionX = randomX

        let randomY = (Math.floor(Math.random() * 265) + 400)
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

export class Score{
    constructor(){
        this.score = 0
    }

    getScore(){
        if (this.score < 10){
            return `Score : 000${this.score}`
        }else if(this.score < 100){
            return `Score : 00${this.score}`
        }else if(this.score < 1000){
            return `Score : 0${this.score}`
        }
    }

    addScore(points){
        this.score += points
    }

    reset(){
        this.score = 0
    }
}

export class FishingRod{
    constructor(){
        this.strength = 0
        this.isUsing = false
        this.lock = false
        this.positionX = null
        this.positionY = null
        this.positionYMax = null
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

export class GameTick{
    constructor(){
        this.time =  this.random()
    }

    random(){
        let random = ((16 * 60 ) * 3) + Math.floor(Math.random() * ((16 * 60) * 10))
        return random
    }
}