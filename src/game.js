import {Fish, Score, FishingRod, GameTick } from './class.js'

let canvas = document.querySelector("canvas").getContext("2d")
let fishList = []
const gametick = new GameTick()
let gameTickInterval
const spawnLimit = 20
let spawnCount = 0

function backgroundLoading(){
    let background = new Image()
    background.src = "https://res.cloudinary.com/shalltear/image/upload/v1653559679/background_dxb3v0.png"
    
    background.onload = ()=>{
        canvas.drawImage(background, 0, 0, 1280, 720);
        }
}

function start(){
    backgroundLoading()
    firstSpawn()
    gameTickInterval = setInterval(gameTick, Math.floor((Math.random() * 800) + 800))
}

function firstSpawn(){
    let fish = new Fish()
    let img = new Image()
    let spawnResult = fish.spawn()
    let position = {
        x: spawnResult[0],
        y: spawnResult[1]
    }
    console.log("longueur =",fishList.length)
    if (spawnLimit > spawnCount){
        

        if (fishList.length === 0){
            console.log("1er poisson")
            img.src = fish.img
            img.onload = ()=>{
                // 180 & 400 pos min -- 1175 & 695 pos max
                canvas.drawImage(img, position.x,position.y)
        
                canvas.strokeRect(position.x - 50, position.y, fish.width + (2 * 50), fish.height);
                canvas.strokeRect(position.x, position.y, 54, 21);   
                fishList.push(fish)
                firstSpawn()
                spawnCount++
                // setTimeout(()=>{
                //     firstSpawn()
                // }, 1200)

            }
        } else {
            for (let i = 0; i < fishList.length; i++){
                if (spawnCount <= 20){
                    console.log("fish.positionX =",fish.positionX, "fishList[i].moveLimit.xMin =", fishList[i].moveLimit.xMin)
                    console.log(fishList)
                    if (fish.moveLimit.xMax < fishList[i].moveLimit.xMin){
                        console.log("1er test check")
                        if (fish.moveLimit.xMin > fishList[i].moveLimit.xMax){




















                            
                            console.log("oui")
                            img.src = fish.img
                            img.onload = ()=>{
                                // 180 & 400 pos min -- 1175 & 695 pos max
                                canvas.drawImage(img, position.x,position.y)
                        
                                canvas.strokeRect(position.x - 50, position.y, fish.width + (2 * 50), fish.height);
                                canvas.strokeRect(position.x, position.y, 54, 21);   
                                fishList.push(fish)
                                // setTimeout(()=>{
                                    spawnCount++
                                    firstSpawn()
                                // }, 60)
                                
                
                            }    
                        }
                    } else{
                        console.log("non")
                        //firstSpawn()
                    }

                }else{
                    break;
                }
                // console.log("autres poisson")
            // fishList.forEach((el) =>{
            }
        }
    }
}






    // for (let i = 0; i < 20; i++){

        
    // }
    // console.log(fishList)

function gameTick(){
     setTimeout(movefish, gametick.random()) // Deplace un poisson aléatoire entre 5 et 10 secs
}

start()

function movefish(){
    console.log("TICK")
    let ramdomIndex = Math.floor(Math.random() * fishList.length)

    // console.log(fishList[ramdomIndex])

    if (!fishList[ramdomIndex].isMoving){ // Si le poisson n'est pas en mouvement
        // console.log("not moving")
        let direction = fishList[ramdomIndex].movementDirection()
        // console.log("direction variable =", direction)
        
        if (direction === "left"){ 
            // console.log("left")
            // Dirige le poisson vers la gauche
            // if (!fishList[ramdomIndex].isMoving){ // Si le poisson n'est pas en mouvement
                requestAnimationFrame(() =>{
                    fishAnimation(ramdomIndex, "left")
                })
                fishList[ramdomIndex].isMoving = true
            // } 
        } else if (direction === "right"){
            // console.log("right")
            // Dirige le poisson vers la droite
            // if (!fishList[ramdomIndex].isMoving){ // Si le poisson n'est pas en mouvement
                requestAnimationFrame(() =>{
                    fishAnimation(ramdomIndex, "right")
                })
                fishList[ramdomIndex].isMoving = true
            // }
        }
    } 
}

function fishAnimation(index, direction){
    let img = new Image()
    img.src = fishList[index].img
    // console.log("direction fishlist[" + index + "] = ",direction)
    //console.log(fishList)
    if (direction === "left" && !fishList[index].checkLimitMovement()){
        // console.log("left") 
        img.onload = ()=>{//         X                             Y                       width                  height
            canvas.clearRect(fishList[index].positionX , fishList[index].positionY, fishList[index].width, fishList[index].height)
            //console.log("update left")
            canvas.drawImage(img, fishList[index].positionX - 1,fishList[index].positionY)
            fishList[index].updateAnimation("left")
        }
    }else if (direction === "right" && !fishList[index].checkLimitMovement()){
        //console.log("right")
        img.onload = ()=>{//         X                             Y                       width                  height
            canvas.clearRect(fishList[index].positionX, fishList[index].positionY, fishList[index].width, fishList[index].height)
            //console.log("update left")
            canvas.drawImage(img, fishList[index].positionX + 1,fishList[index].positionY)
            fishList[index].updateAnimation("right")
        }
    }


    // if (direction === "left" && fishList[index].moveLimit.xMin > fishList[index].positionX)

    // requestAnimationFrame(() =>{
    //     fishAnimation(index, direction)
    // })

    // if (direction === "right" && fishList[index].moveLimit.xMax < fishList[index].positionX)
    // requestAnimationFrame(() =>{
    //     fishAnimation(index, direction)
    // })

    if (!fishList[index].checkLimitMovement()){
        setTimeout(()=>{
            requestAnimationFrame(() =>{
                fishAnimation(index, direction)
            })
        }, gameTick.time * 1200)
    }
    if (fishList[index].checkLimitMovement()){

        setTimeout(()=>{
            fishList[index].isMoving = false
        }, gameTick.time * Math.floor(Math.random() * 1200) * 1200 + 5000)
    }

}



export {canvas}