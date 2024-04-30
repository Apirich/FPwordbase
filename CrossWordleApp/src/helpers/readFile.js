import * as FileSystem from 'expo-file-system';

const readFile = async () => {
    try{
        // File path
        const filePath = FileSystem.documentDirectory + "wordLib.txt";
        // File info
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        // Download if file not exist / open file
        if(!fileInfo.exists){ // Not exist
            try{ // Try to download
                const downLink = "https://www.mit.edu/~ecprice/wordlist.10000";

                const downloadResumable = FileSystem.createDownloadResumable(
                    downLink,
                    filePath
                );
                const { fileUri } = await downloadResumable.downloadAsync();

                return fileUri;
            }catch(error){
                console.error("readFile.js: File not exists, download error:", error);
            }

            try{ // Try to open
                const fileContent = await FileSystem.readAsStringAsync(fileUri);
                return fileContent;
            }catch(error){
                console.error("readFile.js: File not exists, opening error:", error);
            }
        }else{ // Exist
            try{
                const fileContent = await FileSystem.readAsStringAsync(filePath);
                return fileContent;
            }catch(error){
                console.error("readFile.js: File exists, opening error:", error);
            }
        }
    }catch(error){
        console.error("readFile.js - readFile() ERROR:", error);
    }


    // DELETE FILE
    // try {
    //     const localFilePath = FileSystem.documentDirectory + 'example.txt';

    //     // Check if the file exists before attempting to delete it
    //     const fileInfo = await FileSystem.getInfoAsync(localFilePath);

    //     if (fileInfo.exists) {
    //       // File exists, delete it
    //       await FileSystem.deleteAsync(localFilePath);
    //       console.log('File deleted successfully:', localFilePath);
    //     } else {
    //       console.log('File does not exist:', localFilePath);
    //     }
    //   } catch (error) {
    //     console.error('Error deleting file:', error);
    //   }
};

export default readFile;



