import {FishType1, FishType2, FishType3, FishType4, Score, FishingRod, GameTick, WaterTile, FisherMan, WaterSplatch} from './class.js'

//#region Variables
const canvas = document.querySelector("canvas").getContext("2d")
const canvasGame = document.querySelector("canvas")
const scoreEl = document.querySelector("#Score")
const timerEl = document.querySelector("#Timer")
const mainMenuEl = document.querySelector("#MainMenu")
const pageLoadEl = document.querySelector("#PageLoad")
const gameOverEl = document.querySelector("#GameOver")
const strengthBarEl = document.querySelector("#Strength")
const globalStrengthEl = document.querySelector("#GlobalStrength")
const backgroundEl = document.querySelector("#Background")

const music = new Audio("./src/fx/music.mp3");
music.loop = true
const audioEl = document.querySelector("#Audio")

let fishList = []
const gametick = new GameTick()
let gameTickInterval
const spawnLimit = 30
const fishingRod = new FishingRod()
let fishingStrengthInterval
const score = new Score()
let timer = {
    interval : null,
    time : 0
}
let GameoverAnimInterval

const background = new Image()
background.src = "./src/img/background.png"

const sun = new Image()
sun.src = "./src/img/sun.png"

const waterTile = new WaterTile()
const fisherMan = new FisherMan()
const waterSplatch = new WaterSplatch()

//#endregion 

function start(){ // Demarre le jeu
    clearInterval(GameoverAnimInterval)
    canvasGame.style.filter = "grayscale(0%)"
    backgroundEl.style.filter = "grayscale(0%)"
    scoreEl.style.filter = "grayscale(0%)"
    timerEl.style.filter = "grayscale(0%)"
    globalStrengthEl.style.filter = "grayscale(0%)"
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
    sun.onload = ()=>{
        canvas.drawImage(sun,1100,75)
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
            gameoverAlpha = 0
            GameoverAnimInterval = setInterval(gameOverAnim,100)
        }
    },1000)
}

function fishSpawn(){ // Fait spawner les poissons
    let randomFish = Math.floor(Math.random() * 4)
    let fish = null
    
    switch(randomFish){
        case 0:
            fish = new FishType1()
        break
        case 1:
            fish = new FishType2()
        break
        case 2:
            fish = new FishType3()
        break
        case 3:
            fish = new FishType4()
        break
    }
    
    let spawnResult = fish.spawn()
    let position = {
        x: spawnResult[0],
        y: spawnResult[1]
    }
    if (spawnLimit > fishList.length){ // S'il n'a pas atteint son objectif de limite de spawn
        if (fishList.length === 0){
             // Fait apparaitre le 1er poisson, essentiel sinon ne fonctionne pas pour la suite            
            fish.img.onload = ()=>{
                // 180 & 400 pos min -- 1175 & 695 pos max
                canvas.drawImage(fish.img, position.x,position.y)
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
                        // img.src = fish.img
                        fish.img.onload = ()=>{
                            // Zone bac - x180 & y400 pos min -- x1175 & y695 pos max
                            canvas.drawImage(fish.img, position.x,position.y)
                            //canvas.strokeRect(position.x - 50, position.y, fish.width + (2 * 50), fish.height); // Zone de deplacement max
                            //canvas.strokeRect(position.x, position.y, fish.width, fish.height);  // Hitbox
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
                    fishAnimation(ramdomIndex, "left", fishList[ramdomIndex].uid)
                })
                fishList[ramdomIndex].isMoving = true
            // } 
        } else if (direction === "right"){
            // Dirige le poisson vers la droite
            requestAnimationFrame(() =>{
                fishAnimation(ramdomIndex, "right", fishList[ramdomIndex].uid)
            })
            fishList[ramdomIndex].isMoving = true
        }
    } 
}

function fishAnimation(index, direction, uid){ // Gère l'animation du poisson
    try{
        if (fishList[index].uid = uid){
            if (direction === "left" && !fishList[index].checkLimitMovement()){ // Si la direction est à gauche et que fishList[i].isMoving est actif
                            //          X                             Y                       width                  height
                canvas.clearRect(fishList[index].positionX , fishList[index].positionY, fishList[index].width, fishList[index].height)
                canvas.drawImage(fishList[index].img, fishList[index].positionX - 1,fishList[index].positionY) // Deplace le poisson dans la page HTML
                fishList[index].updateAnimation("left") // Met à jour la position du poisson dans le tableau
            // }
            }else if (direction === "right" && !fishList[index].checkLimitMovement()){// Si la direction est à droite et que fishList[i].isMoving est actif
                            //          X                             Y                       width                  height
                canvas.clearRect(fishList[index].positionX, fishList[index].positionY, fishList[index].width, fishList[index].height)
                canvas.drawImage(fishList[index].img, fishList[index].positionX + 1,fishList[index].positionY) // Deplace le poisson dans la page HTML
                fishList[index].updateAnimation("right") //Met à jour la position du poisson dans le tableau
            }
    
            if (!fishList[index].checkLimitMovement()){ // Si le poisson n'est pas dans sa limite
                requestAnimationFrame(() =>{
                    fishAnimation(index, direction, uid) // Rejoue l'animation
                })
            } else { // Si le poisson est dans sa limite
                fishList[index].isMoving = false // Rend de nouveau disponible le choix de direction du poisson
            }
        }
    } catch(err){
    }
}

const alpha = 35 //35
let v0 = 110 //110 max
function y(x) { // Formule de trajectoire projectile
    return -1 *( -.5 * 9.81 * x**2 / (Math.cos(alpha)**2 * v0**2) + Math.tan(alpha) * x) + 269
}

function hookLaunch(strength){ // Debut de procedure pour le lancé de canne a peche
    // Debut du lancé x120 y285    xMax 1110
    v0 = strength / 10.6818
    if (v0 < 10){ v0 = 10}
    fishingRod.soundFx.launch.play()
    fisherMan.isMoving = true
    fisherManMovingAnimation(0)
}

function fisherManMovingAnimation(i, strength){
    canvas.clearRect(83,265,46,47)
    canvas.drawImage(fisherMan.moving[i],93,266)
    if (i < fisherMan.moving.length - 1){
        setTimeout(()=>{
            i++
            requestAnimationFrame(()=>{
                fisherManMovingAnimation(i, strength)
            })
        },25)
    }else{
        requestAnimationFrame(()=>{
            hookLaunchAnimation(0)
        })
    }
}

//#region Preload - Promise
// function preload(src) {
//     return new Promise(function (resolve, reject) {
//         const img = document.createElement('img') // <img>
//         img.onload = () => {
//           // oui
//           resolve(5)
//         }
//         img.onerror = function () {
//           reject()
//         }
//         img.src = src // telechargement
//     })
// }

// const p1 = preload('dog.png')
// const p2 = preload('cat.png')

// Promise.all([p1, p2])
//     .then(function (values) {
//         // values: [5, 5]
//         console.log('ouiiiiiii cat and dog ar here !!!!')
//     })
//     .catch(function (err) {
//         console.log('oh noessssss')
//     })
//#endregion


function fisherManIdleAnimation(i){
    if (!fisherMan.isMoving){
        if (i === fisherMan.idle.length){ i = 0 } // rewind among images array
            canvas.clearRect(86,280,29,34)
            canvas.drawImage(fisherMan.idle[i],86,280)
        i++
        setTimeout(()=>{
            fisherManIdleAnimation(i)
        }, 150)
    }
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
        fishingRod.positionX = x + 107

        fishingRod.lock = false
        fishingRod.isUsing = true
        fishingRod.soundFx.ploof.play()
        waterSplatchAnimation(fishingRod.positionX, fishingRod.positionYMax, 0,"begin")
        hookGravity()
    }
    canvas.fillStyle = "black";
    canvas.fillRect(x + 107, y(x), 2,1)
}

function hookGravity(){ // Gravité du hameçon une fois plongé dans l'eau
    if (fishingRod.isUsing){
        canvas.fillRect(fishingRod.positionX, fishingRod.positionYMax, 0.5,fishingRod.positionY - fishingRod.positionYMax)
        canvas.fillStyle = "#f00000"
        canvas.fillRect(fishingRod.positionX, fishingRod.positionY - 2, 0.5,2)
        canvas.fillStyle = "black"

        if (fishingRod.positionY <= 700){
            for (let i = 0; i < fishList.length; i++)
            {
                if (fishingRod.isTouch(fishList[i])){ // Fait gagner des points si le poisson est touché
                    const points = fishList[i].points
                    score.addScore(points)
                    scoreEl.innerHTML = score.getScore()
                    score.sound.play()
                    fishList.splice(i,1)
                    clearHook()
                    animPoints(points,255,0)
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
    strengthBarEl.style.width = `${(strength / 2)}px`

    if (strength > 0){
        strength -= 12
        requestAnimationFrame(()=>{
            strengthBarEndAnimation(strength)
        })
    } else{
        strengthBarEl.style.width = `0px`
    }
}

function updateStrengthUI(){
    strengthBarEl.style.width = `${(fishingRod.strength / 2)}px`
}

document.querySelector("canvas").addEventListener('mousedown', e => { 
    clickDown()
});                                                                    // Concentre la force
document.querySelector("canvas").addEventListener('touchstart', e => {
    clickDown()
});

function clickDown(){
    if (!fishingRod.isUsing && !fishingRod.lock){ // Verouille l'etat pour ne pas reproduire la meme function plusieurs fois si spam clic
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
});                                                                 // Lance le hameçon après avoir laché le clic
document.querySelector("canvas").addEventListener('touchend', e => {
    clickUp()
});

function firstLoad(){ // 1ere initialisation
    music.play()
    audioEl.style.display = "flex"
    start()
    fisherManIdleAnimation(0)
    sunAnimation(75,"down")
    mainMenuEl.style.display = "none"
    pageLoadEl.style.display = "none"
    setInterval(waterAnim, 1000)
}
document.querySelector("#MainMenu #PageLoad button").addEventListener('click', e => {
    firstLoad() 
});                                                     // Bouton Start Game en debut de jeu
document.querySelector("#MainMenu #PageLoad button").addEventListener('touchend', e => {
    firstLoad()
});

function resetGame(){
    clearInterval(gameTickInterval) // Annule le gameTickInterval pour eviter de faire un random 2x plus rapide
    start()
    mainMenuEl.style.display = "none"
    pageLoadEl.style.display = "none"
}
document.querySelector("#MainMenu #GameOver button").addEventListener('click', e => {
    resetGame()
});                                                     // Bouton Retry dans le menu Game Over
document.querySelector("#MainMenu #GameOver button").addEventListener('touchend', e => {
    resetGame()
});

function changeMusic(){
    const imgEl = audioEl.querySelector("img")
    if (music.muted){ // Va debuter le son
        music.muted = false
        fishingRod.soundFx.launch.muted = false
        fishingRod.soundFx.ploof.muted = false
        score.sound.muted = false
        imgEl.src = "./src/img/soundPlay.png"
    }else{ // Va muter le son
        music.muted = true
        fishingRod.soundFx.launch.muted = true
        fishingRod.soundFx.ploof.muted = true
        score.sound.muted = true
        imgEl.src = "./src/img/soundMute.png"
    }
}
audioEl.addEventListener('click', e => {
    changeMusic()
});                                     // Switch entre le mute et demute de son
audioEl.addEventListener('touchend', e => {
    changeMusic()
});

function clickUp(){ // Lance la canne a peche
    if (!fishingRod.isUsing && !fishingRod.lock){
        fishingRod.lock = true
        clearInterval(fishingStrengthInterval)
        // Zone bac - x180 & y400 pos min -- x1175 & y695 pos max
        if (fishingRod.strength > 1175){ fishingRod.strength = 1175 }  
        hookLaunch(fishingRod.strength)
        strengthBarEndAnimation(fishingRod.strength)
        fishingRod.strength = 0
        strengthBarEl.style.width = "0px"
    } else if (!fishingRod.lock && fishingRod.isUsing){
        clearHook()
    }
}

function clearHook(){  // Efface tout et remet l'image de background (après avoir peché un poisson ou après avoir annulé l'action de laisser couler le hameçon)
    fishingRod.isUsing = false
    fisherMan.isMoving = false
    canvas.drawImage(background, 0, 0, 1280, 720);
    fisherManIdleAnimation(0)
    fishList.forEach((el)=>{
        canvas.drawImage(el.img, el.positionX,el.positionY) // Ré-affiche les poissons
    })
}

function waterAnim(){ // Anime la surface de l'eau
    // Repeter 36 fois
    let x = 128
    canvas.clearRect(128,375,1152,32)
    for (let i = 0; i < 36; i++){
        let random = Math.floor(Math.random() * waterTile.img.length)
        canvas.drawImage(waterTile.img[random], x,376,32,31)
        x+= 32
    }
}

function animPoints(points, y, alpha){ // Effectue une petite animation indiquant les points gagnés au dessus du pecheur
    if (alpha <= 1){
        canvas.font = "38px VT323"
        canvas.textAlign = "center"
        canvas.clearRect(50, 200, 75, 55)
        canvas.fillStyle = "rgba(255, 100, 0, " + alpha + ")";
        canvas.fillText(`+${points}`, 100, y,50)
        alpha += 0.03
        y -= 0.3
        setTimeout(()=>{
            animPoints(points, y, alpha)
        },10)
    } else{
        setTimeout(()=>{
            canvas.clearRect(50, 200, 100, 55)
        },1500)
    }
}

function sunAnimation(y, direction){ // Deplace le soleil de haut en bas en boucle
    if (y < 80 && direction === "down"){ y += 0.35 }
    if (y > 75 && direction === "up")  { y -= 0.35 }

    if (y >= 80){direction = "up"}
    if (y <= 75){direction = "down"}

    canvas.clearRect(1100,75,100,200)
    canvas.drawImage(sun,1100,y)

    setTimeout(()=>{
        sunAnimation(y, direction)
    },65)
}

let gameoverAlpha = 0
function gameOverAnim(){ // Obscurci l'arrière plan en noir et blanc
    if (gameoverAlpha < 100){
        gameoverAlpha += 5
        canvasGame.style.filter = `grayscale(${gameoverAlpha}%)`
        backgroundEl.style.filter = `grayscale(${gameoverAlpha}%)`
        scoreEl.style.filter = `grayscale(${gameoverAlpha}%)`
        timerEl.style.filter = `grayscale(${gameoverAlpha}%)`
        globalStrengthEl.style.filter = `grayscale(${gameoverAlpha}%)`
    } else {clearInterval(GameoverAnimInterval)}
}

function waterSplatchAnimation(x, yMax, i, state){ // Joue l'animation de l'eau qui eclabousse quand le hameçon tombe
    canvas.clearRect(x - 25, yMax - 32, waterSplatch.width, waterSplatch.height)
    if(state === "begin"){ i++ } // Fais un tour de l'index 0 -> 4
    if (i === 4 && state === "begin"){ state = "medium"} // Une fois que l'index est à 4 -> defini le statut à medium

    if (state === "medium") { i--} // Fais un tour de l'index 4 -> 0
    if (i === 0 && state === "medium"){ state = "end"} // Une fois qu'il a fais son tour index 0 -> 4 et 4 -> 0, defini un etat de fin
    if (state === "begin" || state === "medium"){canvas.drawImage(waterSplatch.img[i], x - 25, yMax - 32)}

    if(state !== "end"){ // Reboucle
        setTimeout(()=>{
            requestAnimationFrame(()=>{
                waterSplatchAnimation(x, yMax, i, state)
            })
        },50)
    }else{ // Dessine les derniers tracés de la canne a peche à l'exterieur (sinon donne un effet de "fil cassé")
        for (let i = 0; i < 27; i+= 2.25){
            canvas.fillStyle = "black"
            canvas.fillRect((x - i), y(x - 107 - i), 2,1)
        }
    }

}
backgroundLoading()