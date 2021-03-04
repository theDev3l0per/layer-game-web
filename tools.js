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
  setInterval(loop,20) // 50 ticks per second
  setInterval(save,10000)
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