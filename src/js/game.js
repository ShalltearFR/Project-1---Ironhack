import {Fish, Score, FishingRod, GameTick, WaterTile } from './class.js'

const canvas = document.querySelector("canvas").getContext("2d")
const scoreEl = document.querySelector("#Score")
const timerEl = document.querySelector("#Timer")
const mainMenuEl = document.querySelector("#MainMenu")
const pageLoadEl = document.querySelector("#PageLoad")
const gameOverEl = document.querySelector("#GameOver")

const music = new Audio("./src/fx/music.mp3");
music.loop = true
const audioEl = document.querySelector("#Audio")

let fishList = []
const gametick = new GameTick()
let gameTickInterval
const spawnLimit = 20
const fishingRod = new FishingRod()
let fishingStrengthInterval
const score = new Score()
let timer = {
    interval : null,
    time : 0
}

const background = new Image()
background.src = "./src/img/background.png"

const waterTile = [new WaterTile(),new WaterTile(),new WaterTile()]
waterTile[0].init(0)
waterTile[1].init(1)
waterTile[2].init(2)

const strengthBar = document.querySelector("#Strength")

function start(){ // Demarre le jeu
    backgroundLoading()
    startTimer()
    fishSpawn()
    gameTickInterval = setInterval(gameTick, Math.floor((Math.random() * 800) + 20))  
    score.reset()
    scoreEl.innerHTML = "Score : 0000"
}

function backgroundLoading(){ // Chargement de l'arrière plan du jeu
      background.onload = ()=>{
        canvas.drawImage(background, 0, 0, 1280, 720);
        }
}

function startTimer(){
    timer.time = 60
    timer.interval = setInterval(()=>{
        timer.time--
        if(timer.time > 0){
            if (timer.time > 9){
                timerEl.innerHTML = `Timer : ${timer.time}s`
            } else{
                timerEl.innerHTML = `Timer : 0${timer.time}s`
            }
        } else{
            timerEl.innerHTML = `Timer : 00s`
            clearInterval(timer.interval)
            // Afficher la balise game Over
            mainMenuEl.style.display = "flex"
            gameOverEl.style.display = "block"
        }
    },1000)
}

 function fishSpawn(){ // Fait spawner les poissons
    let fish = new Fish()
    let img = new Image()
    
    let spawnResult = fish.spawn()
    let position = {
        x: spawnResult[0],
        y: spawnResult[1]
    }
    if (spawnLimit > fishList.length){ // S'il n'a pas atteint son objectif de limite de spawn
        if (fishList.length === 0){ // Fait apparaitre le 1er poisson, essentiel sinon ne fonctionne pas pour la suite
            img.src = fish.img
            img.onload = ()=>{
                // 180 & 400 pos min -- 1175 & 695 pos max
                canvas.drawImage(img, position.x,position.y)
                //canvas.strokeRect(position.x - 50, position.y, fish.width + (2 * 50), fish.height); // Zone de deplacement max
                //canvas.strokeRect(position.x, position.y, 54, 21);  // Hitbox
                fishList.push(fish)
                fishSpawn()
            } 
        } else {
            let j = 0 // Permet de verifier si le spawn du poisson est possible après avoir verifié chaque emplacement des poissons deja placés
            for (let i = 0; i < fishList.length; i++){ // Dans chaque elements dans la liste de poisson
                if (fishList[i].checkSpawnPossibility(fish)){ // Verifie si le poisson peut spawner dans chaque elements
                    j++
                    if (j === fishList.length){ // Si toutes les conditions de spawn sont possible, fait spawner le poisson
                        img.src = fish.img
                        img.onload = ()=>{
                            // Zone bac - x180 & y400 pos min -- x1175 & y695 pos max
                            canvas.drawImage(img, position.x,position.y)
                            //canvas.strokeRect(position.x - 50, position.y, fish.width + (2 * 50), fish.height); // Zone de deplacement max
                            //canvas.strokeRect(position.x, position.y, 54, 21);  // Hitbox
                            fishList.push(fish)
                            fishSpawn()
                        }
                    } 
                } else{
                    fishSpawn()
                    break
                }
            }
        }
    }
}

function gameTick(){ // Deplace un poisson aléatoire
     setTimeout(movefish, gametick.random()) 
}

function movefish(){
    console.log("RANDOM TICK")
    let ramdomIndex = Math.floor(Math.random() * fishList.length) // Selectionne un poisson aleatoire

    if (!fishList[ramdomIndex].isMoving){ // Si le poisson n'est pas en mouvement
        let direction = fishList[ramdomIndex].movementDirection()
        
        if (direction === "left"){ 
            // Dirige le poisson vers la gauche
                requestAnimationFrame(() =>{
                    fishAnimation(ramdomIndex, "left")
                })
                fishList[ramdomIndex].isMoving = true
            // } 
        } else if (direction === "right"){
            // Dirige le poisson vers la droite
            requestAnimationFrame(() =>{
                fishAnimation(ramdomIndex, "right")
            })
            fishList[ramdomIndex].isMoving = true
        }
    } 
}

function fishAnimation(index, direction){ // Gère l'animation du poisson
    try{
        let img = new Image()
        img.src = fishList[index].img
    
        if (direction === "left" && !fishList[index].checkLimitMovement()){ // Si la direction est à gauche et que fishList[i].isMoving est actif
            img.onload = ()=>{//         X                             Y                       width                  height
                canvas.clearRect(fishList[index].positionX , fishList[index].positionY, fishList[index].width, fishList[index].height)
                canvas.drawImage(img, fishList[index].positionX - 1,fishList[index].positionY) // Deplace le poisson dans la page HTML
                fishList[index].updateAnimation("left") // Met à jour la position du poisson dans le tableau
            }
        }else if (direction === "right" && !fishList[index].checkLimitMovement()){// Si la direction est à droite et que fishList[i].isMoving est actif
            img.onload = ()=>{//         X                             Y                       width                  height
                canvas.clearRect(fishList[index].positionX, fishList[index].positionY, fishList[index].width, fishList[index].height)
                canvas.drawImage(img, fishList[index].positionX + 1,fishList[index].positionY) // Deplace le poisson dans la page HTML
                fishList[index].updateAnimation("right") //Met à jour la position du poisson dans le tableau
            }
        }
    
        if (!fishList[index].checkLimitMovement()){ // Si le poisson n'est pas dans sa limite
            requestAnimationFrame(() =>{
                fishAnimation(index, direction) // Rejoue l'animation
            })
        }
        if (fishList[index].checkLimitMovement()){ // Si le poisson est dans sa limite
            fishList[index].isMoving = false // Rend de nouveau disponible le choix de direction du poisson
        }
    } catch(err){
    }
}

const alpha = 35 //35
let v0 = 110 //110 max
function y(x) { // Formule de trajectoire projectile
    return -1 *( -.5 * 9.81 * x**2 / (Math.cos(alpha)**2 * v0**2) + Math.tan(alpha) * x) + 285
}

function hookLaunch(strength){
    // Debut du lancé x120 y285    xMax 1110

    v0 = strength / 10.6818
    fishingRod.soundFx.launch.play()
    requestAnimationFrame(()=>{
        hookLaunchAnimation(0)
    })
}

function hookLaunchAnimation(x){ // Animation du lancé de hameçon
    if (y(x) <= 380){
        x += 2.25
        requestAnimationFrame(()=>{
            hookLaunchAnimation(x)
        })
    } else{
        fishingRod.positionY = y(x)
        fishingRod.positionYMax = y(x) - 1
        fishingRod.positionX = x + 120

        fishingRod.lock = false
        fishingRod.isUsing = true
        fishingRod.soundFx.ploof.play()
        hookGravity()
    }

    canvas.fillRect(x + 120, y(x), 2,1)
    //arc a tester
}

function hookGravity(){ // Gravité du hameçon une fois plongé dans l'eau
    if (fishingRod.isUsing){
        canvas.fillRect(fishingRod.positionX, fishingRod.positionYMax, 0.5,fishingRod.positionY - fishingRod.positionYMax)
        canvas.fillStyle = "#f00000"
        canvas.fillRect(fishingRod.positionX, fishingRod.positionY - 2, 0.5,2)
        canvas.fillStyle = "black"

        if (fishingRod.positionY <= 700){ //695
            for (let i = 0; i < fishList.length; i++)
            {
                if (fishingRod.isTouch(fishList[i])){
                    score.addScore(fishList[i].points)
                    scoreEl.innerHTML = score.getScore()
                    fishList.splice(i,1)
                    clearHook()
                    score.sound.play()
                }
            }
            fishingRod.positionY += 0.5
            requestAnimationFrame(hookGravity)
        } else{
            clearHook()
        }
    }
}

function strengthBarEndAnimation(strength){ // Animation qui fait disparaitre progressivement la force après avoir lancé la canne à peche
    strengthBar.style.width = `${(strength / 2)}px`

    if (strength > 0){
        strength -= 12
        requestAnimationFrame(()=>{
            strengthBarEndAnimation(strength)
        })
    } else{
        strengthBar.style.width = `0px`
    }
}

function updateStrengthUI(){
    strengthBar.style.width = `${(fishingRod.strength / 2)}px`
}

document.querySelector("canvas").addEventListener('mousedown', e => {
    clickDown()
});

document.querySelector("canvas").addEventListener('touchstart', e => {
    clickDown()
});

function clickDown(){
    if (!fishingRod.isUsing && !fishingRod.lock){
        fishingStrengthInterval = setInterval(()=>{
            fishingRod.strength += 12
            if (fishingRod.strength > 1175){ 
                fishingRod.strength = 1175
                clearInterval(fishingStrengthInterval)
            }
            updateStrengthUI()
        }, 16)
    }
}

document.querySelector("canvas").addEventListener('mouseup', e => {
    clickUp()
});

document.querySelector("canvas").addEventListener('touchend', e => {
    clickUp()
});


function firstLoad(){
    music.play()
    audioEl.style.display = "flex"
    start()
    mainMenuEl.style.display = "none"
    pageLoadEl.style.display = "none"
    setInterval(waterAnim, 1000)
}
document.querySelector("#MainMenu #PageLoad button").addEventListener('click', e => {
    firstLoad()
});

document.querySelector("#MainMenu #PageLoad button").addEventListener('touchend', e => {
    firstLoad()
});

function resetGame(){
    start()
    mainMenuEl.style.display = "none"
    pageLoadEl.style.display = "none"
}
document.querySelector("#MainMenu #GameOver button").addEventListener('click', e => {
    clearInterval(gameTickInterval)
    resetGame()
});

document.querySelector("#MainMenu #GameOver button").addEventListener('touchend', e => {
    clearInterval(gameTickInterval)
    resetGame()
});

function changeMusic(){
    const imgEl = audioEl.querySelector("img")
    if (music.muted){
        music.muted = false
        fishingRod.soundFx.launch.muted = false
        fishingRod.soundFx.ploof.muted = false
        score.sound.muted = false
        imgEl.src = "./src/img/soundPlay.png"
    }else{
        music.muted = true
        fishingRod.soundFx.launch.muted = true
        fishingRod.soundFx.ploof.muted = true
        score.sound.muted = true
        imgEl.src = "./src/img/soundMute.png"
    }
}
audioEl.addEventListener('click', e => {
    changeMusic()
});

audioEl.addEventListener('touchend', e => {
    changeMusic()
});

function clickUp(){
    if (!fishingRod.isUsing && !fishingRod.lock){
        fishingRod.lock = true
        clearInterval(fishingStrengthInterval)
        // Zone bac - x180 & y400 pos min -- x1175 & y695 pos max

        if (fishingRod.strength > 1175){ fishingRod.strength = 1175 }  
        hookLaunch(fishingRod.strength)
        strengthBarEndAnimation(fishingRod.strength)
        fishingRod.strength = 0
        strengthBar.style.width = "0px"
    } else if (!fishingRod.lock && fishingRod.isUsing){
        clearHook()
    }
}

function clearHook(){
    fishingRod.isUsing = false
    canvas.drawImage(background, 0, 0, 1280, 720); // Efface tout et remet l'image de background

    fishList.forEach((el)=>{
        let img = new Image()
        img.src = el.img
        img.onload = ()=>{
            canvas.drawImage(img, el.positionX,el.positionY) // Ré-affiche les poissons
        }
    })
}

function waterAnim(){
    // Repeter 36 fois
    let x = 128
    canvas.clearRect(128,375,1152,32)
    for (let i = 0; i < 36; i++){
        let random = Math.floor(Math.random() * waterTile.length)
        canvas.drawImage(waterTile[random].img, x,376,32,31)
        x+= 32

    }
}

backgroundLoading()