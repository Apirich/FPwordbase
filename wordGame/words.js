const libraries = ["cat", "bird", "dog", "smile", "dance", "song", "music", "love", "laugh"];
const positions = [0, 1, 2, 3, 4];

let words = [];
let wXpos = [];
let wYpos = [];

let wordsData = [];

while(words.length < 5){
  w = libraries[Math.floor(Math.random() * libraries.length)]
  if(words.indexOf(w) === -1){
    words.push(w);
  }
}

while(wXpos.length < 5){
  xP = positions[Math.floor(Math.random() * positions.length)]
  if(wXpos.indexOf(xP) === -1){
    wXpos.push(xP);
  }
}

while(wYpos.length < 5){
  yP = positions[Math.floor(Math.random() * positions.length)]
  if(wYpos.indexOf(yP) === -1){
    wYpos.push(yP);
  }
}

for(let i = 0; i < words.length; ++i){
  wordsData.push({
    "direction": Math.random() < 0.5 ? "A" : "D",
    "word": words[i],
    "xPos": wXpos[i],
    "yPos": wYpos[i],
  })
}

console.log(wordsData);

export const wordsList = wordsData;
