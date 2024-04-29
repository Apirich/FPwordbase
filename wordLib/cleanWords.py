import csv
import string

filePath = "./wordList.txt"

alphaLow = alpha = string.ascii_lowercase
alphaUp = string.ascii_uppercase

charNum3 = set()
charNum4 = set()
charNum5 = set()
charNum6 = set()
charNum8 = set()


with open(filePath, newline = "") as csvfile:
        # Create a CSV reader object
        csv_reader = csv.DictReader(csvfile)

        # Iterate over each row in the CSV file
        for row in csv_reader:
            # Each row is a dictionary with keys as column name "a"
            if len(row["a"]) == 3:
                charNum3.add(row["a"])

            if len(row["a"]) == 4:
                charNum4.add(row["a"])

            if len(row["a"]) == 5:
                charNum5.add(row["a"])

            if len(row["a"]) == 6:
                charNum6.add(row["a"])

            if len(row["a"]) == 8:
                charNum8.add(row["a"])


outFile = "wordLib68.txt"

# Write the set to the TXT file
with open(outFile, 'w') as file:
    for word in charNum6 | charNum8:
        file.write(str(word) + "\n")
