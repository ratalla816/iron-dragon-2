const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


// canvas.width = 1024
// canvas.height = 576

Main.width = 1024
Main.height = 576

// Main.style.position = ""

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7 /* speed that players fall */

// render background image
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/images/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 127
  },
  imageSrc: './assets/images/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {  
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
   },
   imageSrc: './assets/images/samuraiMack/Idle.png',
   framesMax: 8, 
   scale: 2.5, 
   offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './assets/images/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './assets/images/samuraiMack/Run.png',
      framesMax: 8
    }, 
    jump: {
      imageSrc: './assets/images/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './assets/images/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './assets/images/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './assets/images/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './assets/images/samuraiMack/Death.png',
      framesMax: 6
    }    
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 150,
    height: 50
  }
})



const enemy = new Fighter({
    position: {  
      x: 400,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    color: 'blue',
    offset: {
      x: -50,
      y: 0
    },
   imageSrc: './assets/images/kenji/Idle.png',
   framesMax: 4, 
   scale: 2.5, 
   offset: {
    x: 215,
    y: 168
  },
  sprites: {
    idle: {
      imageSrc: './assets/images/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './assets/images/kenji/Run.png',
      framesMax: 8
    }, 
    jump: {
      imageSrc: './assets/images/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './assets/images/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './assets/images/kenji/Attack1.png',
      framesMax: 4
    },
     takeHit: {
      imageSrc: './assets/images/kenji/Take hit.png',
      framesMax: 3
     },
     death: {
      imageSrc: './assets/images/kenji/Death.png',
      framesMax: 7
    }     
  },
  attackBox: {
    offset: {
      x: -125,
      y: 50
    },
    width: 175,
    height: 50
  }
})
  




// console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
   },
  
  ArrowRight: {
    pressed: false
   },
  ArrowLeft: {
    pressed: false
   }
  }
  

decreaseTimer ()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height) /* doesn't draw anything when we call this method (prevents sprite from looking like smeared paint) */
    background.update()
    shop.update()
    // contrast between players and background
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    // console.log('go');

    player.velocity.x = 0 /* Holds the player in one spot after the movement key is released */
    enemy.velocity.x = 0 /* Holds the enemy in one spot after the movement key is released */

    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = -5  /* pixels per frame */
      player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = 5  /* pixels per frame */
      player.switchSprite('run')
    } else {
      player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
      player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall')
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = -5 /* pixels per frame */
      enemy.switchSprite('run')
     } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
       enemy.velocity.x = 5  /* pixels per frame */
       enemy.switchSprite('run')
      } else {
        enemy.switchSprite('idle')
      }

      if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
      } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
      }

    // Detect for collision and enemy gets hit
    if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: enemy
        }) && 
        player.isAttacking && 
        player.framesCurrent === 4
        ) {   
        enemy.takeHit()  
        player.isAttacking = false    
        
        // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        gsap.to('#enemyHealth', {
          width: enemy.health + '%'
        })
       }

         // if (
      //   rectangularCollision({
      //     rectangle1: player,
      //     rectangle2: enemy
      //   }) && player.isAttacking && player.framesCurrent === 2
      //   ) {   
      //   player.isAttacking = false    
      //   enemy.health -= 20
      //   document.querySelector('#enemyHealth').style.width = enemy.health + '%'
      //  }

      //  if player misses 
      if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
      }

  // this is where player gets hit        
if (
  rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
  }) && enemy.isAttacking && enemy.framesCurrent === 2
  ) {   
  player.takeHit()  
  enemy.isAttacking = false    
  console.log('enemy attack successful')
  // document.querySelector('#playerHealth').style.width = player.health + '%'
  gsap.to('#playerHealth', {
    width: player.health + '%'
  })
  }

// IF enemy misses
if (enemy.isAttacking && enemy.framesCurrent === 2) {
  enemy.isAttacking = false
}

  // game over if health is zero
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner ({player, enemy, timerId})
  }
}

animate()

// Moves the player left or right when a or d key is pressed.
window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd' /* Last key pressed will only be equal to the value of the last key pressed */
       break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a' /* Last key pressed will only be equal to the value of the last key pressed */
      break
    case 'w':
      player.velocity.y = -20  /* pixels per frame */
      break
    case ' ': 
    player.attack()  
      break
      }
    }
    

    if ( !enemy.dead) {
    switch(event.key) {
      case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowUp':
      enemy.velocity.y = -20  /* pixels per frame */
      break
    case 'ArrowDown':
      enemy.attack()
      break
    }
  }
  })

    

// stops the player from moving left or right when a or d is released.
window.addEventListener('keyup', (event) => {
    switch (event.key) {
    case 'd':
        keys.d.pressed = false
       break
    case 'a':
      keys.a.pressed = false
      break   
    case 'w':
      keys.w.pressed = false
      break   
    }

    // Enemy keys
    switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
   case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break  
   case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break
  }
})