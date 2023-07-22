const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

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
  }
//   velocity: { x: 0, y: 0 } means player will not move by default 
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
    }
  //   velocity: { x: 0, y: 0 } means enemy will not move by default 
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
    player.update()
    enemy.update()
    // console.log('go');

    player.velocity.x = 0 /* Holds the player in one spot after the movement key is released */
    enemy.velocity.x = 0 /* Holds the enemy in one spot after the movement key is released */

    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = -5  /* pixels per frame */
    } else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = 5  /* pixels per frame */
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = -5 /* pixels per frame */
     } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
       enemy.velocity.x = 5  /* pixels per frame */
    }
    // Detect for collision
    if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: enemy
        }) && player.isAttacking
        ) {   
        player.isAttacking = false    
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
       }

if (
  rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
  }) && enemy.isAttacking
  ) {   
  enemy.isAttacking = false    
  console.log('enemy attack successful')
  player.health -= 20
  document.querySelector('#playerHealth').style.width = player.health + '%'
}
  // game over if health is zero
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner ({player, enemy, timerId})
  }
}

animate()

// Moves the player left or right when a or d key is pressed.
window.addEventListener('keydown', (event) => {
  // console.log(event.key);
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
      enemy.isAttacking = true
      break
    }
    // console.log(event.key)
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