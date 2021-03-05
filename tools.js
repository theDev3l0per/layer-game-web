// saving and other tools

function hardReset(){
  let x = window.confirm("Are you sure you want to reset your game?")
  if(x){
    localStorage.removeItem(sKey);
    game = {};
    location.reload();
  }else window.confirm("You have not reset your game.")
}

function isEncodedExpantaNum(thing) {
  return thing.hasOwnProperty("sign") && thing.hasOwnProperty("array") && thing.hasOwnProperty("layer")
}

function expantaIze(thing) {
  let expanta = D(0)
  expanta.layer= thing.layer
  expanta.sign = thing.sign
  expanta.array = thing.array
  return expanta
}

function loop() {
  tick(Math.max(0,Date.now() - game.lastTick)) // the max is for if save gets screwed up the save doesnt actually get screwed up
  game.lastTick = Date.now() 
}

function decodeObject(thing) {
  let clone = {...thing}
  for(let i in clone) {
    if(isEncodedExpantaNum(thing[i])) clone[i] = expantaIze(thing[i])
    else if(typeof thing[i]=="object" && thing[i].constructor.name != "Array") clone[i] = decodeObject(thing[i])
  }
  return clone
}

function save() {
  localStorage[sKey] = JSON.stringify(game.$data)
}

function load() {
  game = app.mount("#app")
  if(localStorage[sKey]) game = mergeDeep(game,decodeObject(JSON.parse(localStorage[sKey])))
} 

window.onload = () => {
  load()
  setInterval(loop,20) // 50 ticks per second, 20ms delay
  setInterval(save,10000) // 0.1 tick per second, 10000ms/10s delay
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function buyUpgrade(layer,id){
  let upgrades = {
    0: {
      0() {
        if (game.points.gte(3) && !hasUpgrade(0,0)) {
          game.points = game.points.sub(3)
          game.upgrades[0] = true
        }
      },
      1() {
        if (game.points.gte(5) && !hasUpgrade(0,1)) {
          game.points = game.points.sub(5)
          game.upgrades[1] = true
        }
      },
      2(){
        if (game.points.gte(12) && !hasUpgrade(0,2)) {
          game.points = game.points.sub(12)
          game.upgrades[2] = true
        }
      },
      3() {
        if (game.points.gte(20) && !hasUpgrade(0,3)) {
          game.points = game.points.sub(20)
          game.upgrades[3] = true
        }
      },
      4() {
        if (game.points.gte(33) && !hasUpgrade(0,4)) {
          game.points = game.points.sub(33)
          game.upgrades[4] = true
        }
      },
      5() {
        if (game.points.gte(100) && !hasUpgrade(0,5)) {
          game.points = game.points.sub(100)
          game.upgrades[5] = true
        }
      }
    }
  }
  if(!upgrades[layer][id])throw Error(`"${id}" is not an id for an upgrade in the ${layer} layer.`)
  upgrades[layer][id]()
}
// forgot to make this vue friendly
function hasUpgrade(layer,id, data = game) {
  if (layer === 0) {
    return data.upgrades[id]
  } else {
    return data[layer].upgrades[id]
  }
}