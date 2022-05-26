import {Fish, Score, FishingRod, GameTick } from './class.js'

let canvas = document.querySelector("canvas").getContext("2d")
let fishList = []
let int = 0
const gametick = new GameTick()
let gameTickInterval

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
    gameTickInterval = setInterval(Gametick(), 16)
}

function firstSpawn(){

    for (let i = 0; i < 1; i++){
        let fish = new Fish()
        let img = new Image()
        img.src = fish.img
        img.onload = ()=>{
            // 180 & 400 pos min -- 1175 & 695 pos max
            let spawnResult = fish.spawn()
            let position = {
            x: spawnResult[0],
            y: spawnResult[1]
            }
    
            canvas.drawImage(img, position.x,position.y)
    
            canvas.strokeRect(position.x - 50, position.y, fish.width + (2 * 50), fish.height);
            canvas.strokeRect(position.x, position.y, 54, 21);   
            fishList.push(fish)
        }
    }
    console.log(fishList)
}
function Gametick(){
     setTimeout(movefish, gametick.random()) // Deplace un poisson aléatoire entre 5 et 10 secs
}

start()

function movefish(){
    int++
    console.log("TICK",int)
    let ramdomIndex = Math.floor(Math.random() * fishList.length)

    if (!fishList[ramdomIndex].isMoving){ // Si le poisson n'est pas en mouvement
        if (fishList[ramdomIndex].MovementDirection() === "left"){ 
            // Dirige le poisson vers la gauche
            if (!fishList[ramdomIndex].isMoving){ // Si le poisson n'est pas en mouvement
                requestAnimationFrame(() =>{
                    fishAnimation(ramdomIndex, "left")
                })
            } 
            
        } else{
            // Dirige le poisson vers la droite
            // Si le poisson n'est pas en mouvement
                requestAnimationFrame(() =>{
                    fishAnimation(ramdomIndex, "right")
                })
            

        }
    } 
}

function fishAnimation(index, direction){



    
    requestAnimationFrame(() =>{
        fishAnimation(index, direction)
    })
}



export {canvas} 