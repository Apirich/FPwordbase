import * as FileSystem from 'expo-file-system';



const readFile = async () => {
    try {
        // Define the URL of the text file you want to download
        const fileUrl = 'https://www.mit.edu/~ecprice/wordlist.10000';

        // Download the file
        const downloadResumable = FileSystem.createDownloadResumable(
          fileUrl,
          FileSystem.documentDirectory + 'example.txt'
        );

        const { uri } = await downloadResumable.downloadAsync();

        console.log(uri)

        // Once downloaded, read the file
        const fileContent = await FileSystem.readAsStringAsync(uri);

        // Log or process the file content
        // console.log('File content:', fileContent);
      } catch (error) {
        console.error('Error downloading or reading file:', error);
      }
};

export default readFile;



