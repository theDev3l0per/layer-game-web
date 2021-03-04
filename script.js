const sKey = "default" // put the name of your game here, it will be used as a save key

const D = ExpantaNum // allows D(x) and D.function(inputs)
let game = {}

function tick(diff) {
  // your tick things here
  game.points = game.points.add(getPointGen().mul(diff/1000)) // makes points go up bvy 1/s
}

function getPointGen(data = game) {
  return D(1).div(data.points.add(1).pow(2))
}

const app = Vue.createApp({
  data() {
    return {
      lastTick: Date.now(), // add your vars to this object, access them with game.yourVariable
      points: D(0),
      layer: 0,
      upgrades: [false]
    }
  },
  methods: {
    getPointGen() {
      return getPointGen(this)
    }
  }
})