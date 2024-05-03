import readFile from "./readFile";

const processLibrary = async () => {
  try{
      // const fileData = await readFile();
      // const fileArray = fileData.split("\n");

      const fileArray = await readFile();

      const lib34 = [];
      const lib45 = [];
      const lib6 = [];
      const lib8 = [];

      for(const i of fileArray){
          i.length > 2 && i.length < 5 ? lib34.push(i) : null;
          i.length > 3 && i.length < 6 ? lib45.push(i) : null;
          i.length == 6 ? lib6.push(i) : null;
          i.length == 8 ? lib8.push(i) : null;
      }

      const lib = Array.from(new Set([...lib34, ...lib45, ...lib6, ...lib8]));

      const libraryTest = lib34;
      const masterLibraryTest = lib6;

      // console.log(libraryTest);

      // const libraryTest = ["cat", "bird", "dog", "smile", "dance", "song", "music", "love", "laugh"];
      // const masterLibraryTest = ["humble", "gorgeous", "kindness", "friendly", "chance"];

      const positions = [0, 1, 2, 3, 4];

      const numWords = 5;
      const levels = 3;
      const gameEachLevels = 2;

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
              words = randomPick(words, numWords, libraryTest);
              wXpos = randomPick(wXpos, numWords, positions);
              wYpos = randomPick(wYpos, numWords, positions);

              // console.log(game, words);
              wordsData[level].push([]);

              for(let i = 0; i < numWords; ++i){
                  wordsData[level][game].push({
                      "direction": Math.random() < 0.5 ? "A" : "D",
                      "word": words[i],
                      "xPos": wXpos[i],
                      "yPos": wYpos[i],
                  })
              }

              masterData[level].push(masterLibraryTest[Math.floor(Math.random() * masterLibraryTest.length)].toUpperCase());
          }
      }

      const wordsList = wordsData;
      const masterList = masterData;

      return{ wordsList, masterList };
  }catch(error){
    console.error("words.js ERROR: ", error);
  }
};

export { processLibrary };


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
// console.log(masterList);
