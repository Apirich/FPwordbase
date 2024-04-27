const library = ["cat", "bird", "dog", "smile", "dance", "song", "music", "love", "laugh"];
const masterLibrary = ["humble", "gorgeous", "kindness", "friendly", "chance"];
const positions = [0, 1, 2, 3, 4];

let words = [];
let wXpos = [];
let wYpos = [];

let wordsData = [];

const numWords = 5;

while(words.length < numWords){
  w = library[Math.floor(Math.random() * library.length)]
  if(words.indexOf(w) === -1){
    words.push(w);
  }
}

while(wXpos.length < numWords){
  xP = positions[Math.floor(Math.random() * positions.length)]
  if(wXpos.indexOf(xP) === -1){
    wXpos.push(xP);
  }
}

while(wYpos.length < numWords){
  yP = positions[Math.floor(Math.random() * positions.length)]
  if(wYpos.indexOf(yP) === -1){
    wYpos.push(yP);
  }
}

for(let i = 0; i < numWords; ++i){
  wordsData.push({
    "direction": Math.random() < 0.5 ? "A" : "D",
    "word": words[i],
    "xPos": wXpos[i],
    "yPos": wYpos[i],
  })
}

// console.log(wordsData);


export const wordsList = wordsData;
export const masterWord = masterLibrary[Math.floor(Math.random() * masterLibrary.length)].toUpperCase();
console.log(masterWord);
