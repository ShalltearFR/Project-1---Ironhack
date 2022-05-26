export class Fish{
    constructor(){
        this.width = 54
        this.height = 21
        this.positionX = null
        this.positionY = null
        this.img = "https://res.cloudinary.com/shalltear/image/upload/v1653561601/fish_yotri0.png"
        this.isMoving = false
        this.moveDirection = this.movementDirection()
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
        
        console.log("initial Direction =", this.moveDirection)
        return [randomX, randomY]
    }

    movementDirection(){
        let random = Math.round(Math.random() * 1)
        //console.log("random =",random)
        if (random === 1){
            this.moveDirection = "left"
            console.log("moooooooooove left")
            return "left"
        } else {
            this.moveDirection = "right"
            console.log("moooooooooove right")
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
                // this.moveDirection = "right"
                return true
            }
        }

        if (this.positionX >= (this.moveLimit.xMax - this.width)){
            if (this.moveDirection === "right"){
                // this.moveDirection = "left"
                return true
            }
        }

        return false
    }

}

export class Score{
    constructor(){
        this.score = 0
    }

    getScore(){
        return this.score
    }

    addScore(){
        this.score++
    }
}

export class FishingRod{

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