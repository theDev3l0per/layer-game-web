const sKey = "default" // put the name of your game here, it will be used as a save key

const D = ExpantaNum // allows D(x) and D.function(inputs)
let game = {}

function tick(diff) {
  // your tick things here
  game.points = game.points.add(getPointGen().mul(diff/1000)) // makes points go up bvy 1/s
}

function getPointGen(data = game) {
  let gain = D(1).div(data.points.add(1).pow(hasUpgrade(0, 2, data) ? (hasUpgrade(0,5,data) ? 1.25 : 1.5) : 2))
  if (hasUpgrade(0,0, data)) gain = gain.mul(2)
  if (hasUpgrade(0,1, data) && gain.gte(1)) gain = gain.pow(hasUpgrade(0, 4) ? 3 : 2)
  if (hasUpgrade(0,1, data) && gain.lte(1)) gain = gain.pow(hasUpgrade(0, 4) ? 0.3 : 0.5)
  if (hasUpgrade(0,3, data)) gain = gain.mul(data.points.add(1).logBase(data.points.add(1).sqrt().add(1)).add(1))
  return gain
}
// hi

const app = Vue.createApp({
  data() {
    return {
      lastTick: Date.now(), // add your vars to this object, access them with game.yourVariable
      tab: 0,
      points: D(0),
      layer: 0,
      upgrades: [false, false, false, false, false, false]
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