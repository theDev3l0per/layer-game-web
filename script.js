const sKey = "default" // put the name of your game here, it will be used as a save key

const D = ExpantaNum // allows D(x) and D.function(inputs)
let game = {}

function tick(diff) {
  // your tick things here
  game.points = game.points.add(getPointGen().mul(diff/1000)) // makes points go up bvy 1/s
}

function getPointGen(data = game) {
  let gain = D(1).div(data.points.add(1).pow(hasUpgrade(0, 2, data) ? 1.5 : 2))
  if (hasUpgrade(0,0, data)) gain = gain.mul(2)
  if (hasUpgrade(0,1, data) && gain.gte(1)) gain = gain.pow(2)
  if (hasUpgrade(0,1, data) && gain.lte(1)) gain = gain.pow(0.5)
  return gain
}
//

const app = Vue.createApp({
  data() {
    return {
      lastTick: Date.now(), // add your vars to this object, access them with game.yourVariable
      points: D(0),
      layer: 0,
      upgrades: [false, false, false]
    }
  },
  methods: {
    getPointGen() {
      return getPointGen(this)
    },
    hasUpgrade(x, y) {
      return hasUpgrade(x, y, this)
    }
  }
})