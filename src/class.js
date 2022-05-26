export class Fish{
    constructor(){
        this.width = 54
        this.height = 21
        this.positionX = null
        this.positionY = null
        this.img = "https://res.cloudinary.com/shalltear/image/upload/v1653561601/fish_yotri0.png"
        this.isMoving = false
        this.moveDirection = null
        this.moveLimit = 
        {
            xMin : 0,
            xMax : 0
        }
    }

    spawn(){
        let randomX = (Math.floor(Math.random() * 1045) + 180)
        this.positionX = randomX

        let randomY = (Math.floor(Math.random() * 295) + 380)
        this.positionY = randomY

        this.moveLimit.xMin = this.positionX - 50
        this.moveLimit.xMax = this.positionX + this.width + 50
        return [randomX, randomY]
    }

    delete(){

    }

    MovementDirection(){
        let random = Math.floor(Math.random() * 10)

        if (random >= 5){
            this.MovementDirection = "left"
            return "left"
        } else{
            this.MovementDirection = "right"
            return "right"
        }
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
        let random = ((16 * 60 ) * 5) + Math.floor(Math.random() * ((16 * 60) * 5))
        return random
    }
}