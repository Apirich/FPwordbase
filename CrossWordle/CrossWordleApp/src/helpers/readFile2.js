import * as FileSystem from "expo-file-system";

const readFile = async () => {
    return new Promise((resolve, reject) => {
        try{
            // File path
            const filePath = FileSystem.documentDirectory + "wordLib.txt";

            // File info
            FileSystem.getInfoAsync(filePath)
            .then(fileInfo => {
                // Download if file not exist / open file
                if(!fileInfo.exists){   // Not exist
                    const downLink = "https://www.mit.edu/~ecprice/wordlist.10000";
                    const downloadResumable = FileSystem.createDownloadResumable(
                        downLink,
                        filePath
                    );

                    downloadResumable.downloadAsync()
                    .then(fileUri => {  // Try to download
                        FileSystem.readAsStringAsync(fileUri)
                        .then(fileContent => {  // Try to open
                            const fileArray = fileContent.split("\n");
                            resolve(fileArray);
                        })
                        .catch(error => reject("readFile.js: File not exists, opening error:", error));
                    })
                    .catch(error => reject("readFile.js: File not exists, download error:", error));
                }else{  // Exist
                    FileSystem.readAsStringAsync(filePath)
                    .then(fileContent => {
                        const fileArray = fileContent.split("\n");
                        resolve(fileArray);
                    })
                    .catch(error => reject("readFile.js: File exists, opening error:", error));
                }
            })
            .catch(error => reject("readFile.js - fileInfo ERROR:", error));
        }catch(error){
            reject("readFile.js - readFile() ERROR:", error)
        }
    });
};

export default readFile;



