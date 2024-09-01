import readFile from "./readFile2";

const processBag = async () => {
    try{
        const fileArray = await readFile();

        // Bag of 6 to 8 letters words
        const bag68 = [];
        // Bag of 3 to 5 letters words
        const bag35 = [];

        // Bag of words for master word
        const masterBag = [];
        // Bag of words for crossword
        const crossBag = [];

        // Select 6 to 8 and 3 to 5 letters words from fileArray
        for(const i of fileArray){
            i.length > 5 && i.length < 9 ? bag68.push(i.toUpperCase()) : null;
            i.length > 2 && i.length < 6 ? bag35.push(i.toUpperCase()) : null;
        }

        // Select random numbers in the range of 0 and max
        const randomPos = max =>{
            return Math.floor(Math.random() * (max - 0 + 1));
        };

        // Random positions to select words from bag68
        const randomMasPos = Array.from({length: 30}, () => randomPos(bag68.length));
        // Random positions to select words from bag35
        const randomCrossPos = Array.from({length: 150}, () => randomPos(bag35.length));

        // Select words from bag68
        for(const i of randomMasPos){
            masterBag.push(bag68[i]);
        }
        // Select words from bag35
        for(const i of randomCrossPos){
            crossBag.push(bag35[i]);
        }

        return{ masterBag, crossBag };
    }catch(error){
        console.error("words.js ERROR: ", error);
    }
};

export { processBag };


