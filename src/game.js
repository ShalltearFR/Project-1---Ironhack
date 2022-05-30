import {Fish, Score, FishingRod, GameTick } from './class.js'

const canvas = document.querySelector("canvas").getContext("2d")
const scoreEl = document.querySelector("#Score")
let fishList = []
const gametick = new GameTick()
let gameTickInterval
const spawnLimit = 20
const fishingRod = new FishingRod()
let fishingStrengthInterval
const score = new Score()

const background = new Image()
background.src = "https://res.cloudinary.com/shalltear/image/upload/v1653559679/background_dxb3v0.png"

const strengthBar = document.querySelector("#Strength")

function start(){ // Demarre le jeu
    backgroundLoading()
    fishSpawn()
    gameTickInterval = setInterval(gameTick, Math.floor((Math.random() * 800) + 20))      
}

function backgroundLoading(){ // Chargement de l'arrière plan du jeu
      background.onload = ()=>{
        canvas.drawImage(background, 0, 0, 1280, 720);
        }
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
                    console.log("Espace deja occupé - Respawn d'un poisson")
                    fishSpawn()
                    break
                }
            }
        }
    } else if (spawnLimit === fishList.length){
        console.log("Liste des poissons = ",fishList)
    }
}

function gameTick(){ // Deplace un poisson aléatoire
     setTimeout(movefish, gametick.random()) 
}

function movefish(){
    console.log("GAME TICK")
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
}

const alpha = 35 //35
let v0 = 110 //110 max
function y(x) { // Formule de trajectoire projectile
    return -1 *( -.5 * 9.81 * x**2 / (Math.cos(alpha)**2 * v0**2) + Math.tan(alpha) * x) + 285
}

function hookLaunch(strength){
    // Debut du lancé x120 y285    xMax 1110

    v0 = strength / 10.6818
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
        fishingRod.positionX = x + 120
        //console.log("fishing rod X =",fishingRod.positionX)

        fishingRod.lock = false
        fishingRod.isUsing = true
        hookGravity()
    }

    canvas.fillRect(x + 120, y(x), 2,1)
    //arc a tester
}

function hookGravity(){ // Gravité du hameçon une fois plongé dans l'eau
    if (fishingRod.isUsing){
        canvas.fillRect(fishingRod.positionX, fishingRod.positionY, 0.5,1)
        //console.log(fishingRod.positionY)
        if (fishingRod.positionY <= 700){ //695
            for (let i = 0; i < fishList.length; i++)
            {
                if (fishingRod.isTouch(fishList[i])){
                    //console.log("féré", fishingRod.positionY, fishList[i].positionY)
                    score.addScore(fishList[i].points)
                    scoreEl.innerHTML = score.getScore()
                    fishList.splice(i,1)
                    clearHook()
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
    //console.log("clic appuyé")
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
});

document.querySelector("canvas").addEventListener('mouseup', e => {
    //console.log("clic laché")

    if (!fishingRod.isUsing && !fishingRod.lock){
        fishingRod.lock = true
        clearInterval(fishingStrengthInterval)
        // Zone bac - x180 & y400 pos min -- x1175 & y695 pos max
        fishingRod.strength += 180
    
        if (fishingRod.strength > 1175){ fishingRod.strength = 1175 }
        console.log("strength = ", fishingRod.strength)  
    
        hookLaunch(fishingRod.strength)
        strengthBarEndAnimation(fishingRod.strength)
        fishingRod.strength = 0
        strengthBar.style.width = "0px"
    } else if (!fishingRod.lock && fishingRod.isUsing){
        clearHook()
    }
});

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


start()