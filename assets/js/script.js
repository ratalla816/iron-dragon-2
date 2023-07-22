const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7 /* speed that players fall */
class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
          position: {
            x: this.position.x,
            y: this.position.y
          },
          offset,
          width: 100,
          height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        // Character is drawn
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
        // attack box 
        if (this.isAttacking) {
        c.fillStyle = 'green'
        c.fillRect(
          this.attackBox.position.x, 
          this.attackBox.position.y, 
          this.attackBox.width, 
          this.attackBox.height
          )
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x /* references the keydown left to right movement */
        this.position.y += this.velocity.y
        // over time position.y will have 10 pixels added to it for each from we loop over - allows player to fall

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else
        this.velocity.y += gravity /* keeps players from dropping below the canvas */
    }

    attack() {
      this.isAttacking = true
      setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
}

const player = new Sprite({
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



const enemy = new Sprite({
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
  
  /* Last key pressed will only be equal to the value of the last key pressed */

function rectangularCollision ({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner ({player, enemy, timerId}) {
  clearTimeout (timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
      // Player with least damage at timeout wins 
    document.querySelector('#displayText').innerHTML = 'Player One Wins'
    } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player Two Wins'
  }
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
  timerId =  setTimeout (decreaseTimer, 1000)  
  timer --
  document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
   
    determineWinner ({player, enemy, timerId})
 }
}

decreaseTimer ()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height) /* doesn't draw anything when we call this method (prevents sprite from looking like smeared paint) */
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