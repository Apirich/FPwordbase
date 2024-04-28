const library = ["cat", "bird", "dog", "smile", "dance", "song", "music", "love", "laugh"];
const masterLibrary = ["humble", "gorgeous", "kindness", "friendly", "chance"];
const positions = [0, 1, 2, 3, 4];

const numWords = 5;
const levels = 10;
const gameEachLevels = 3;

let words = [];
let wXpos = [];
let wYpos = [];

let wordsData = [];
let masterData = [];

const randomPick = (itemList, loopTime, libName) => {
  while(itemList.length < loopTime){
    chosenItem = libName[Math.floor(Math.random() * libName.length)]
    if(itemList.indexOf(chosenItem) === -1){
      itemList.push(chosenItem);
    }
  }

  return itemList;
}

for(let level = 0; level < levels; ++ level){
  wordsData.push([]);
  masterData.push([]);

  for(let game = 0; game < gameEachLevels; ++game){
    words = randomPick(words, numWords, library);
    wXpos = randomPick(wXpos, numWords, positions);
    wYpos = randomPick(wYpos, numWords, positions);

    wordsData[level].push([]);

    for(let i = 0; i < numWords; ++i){
      wordsData[level][game].push({
        "direction": Math.random() < 0.5 ? "A" : "D",
        "word": words[i],
        "xPos": wXpos[i],
        "yPos": wYpos[i],
      })
    }

    masterData[level].push(masterLibrary[Math.floor(Math.random() * masterLibrary.length)].toUpperCase());
  }
}


// console.log(wordsData);

export const wordsList = wordsData;
export const masterList = masterData;
console.log(masterList);
