if (localStorage.getItem("words_data") === null) {
    readWordsIntoLocalStorage();
}

// Find coordinates in roominfo.csv
function readWordsIntoLocalStorage() {
    // Get and read csv file
    var GetFileBlobUsingURL = function (url, convertBlob) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function () {
            convertBlob(xhr.response);
        });
        xhr.send();
    };

    var blobToFile = function (blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
    };

    var GetFileObjectFromURL = function (filePathOrUrl, convertBlob) {
        GetFileBlobUsingURL(filePathOrUrl, function (blob) {
            convertBlob(blobToFile(blob, 'dictionary.csv'));
        });
    };

    var FileURL = "dictionary.csv"
    GetFileObjectFromURL(FileURL, function (fileObject) {
        // Read the fileObject
        reader.readAsText(fileObject);
    });

    // Set up csv file reader
    const reader = new FileReader();
    reader.onload = function (e) {
        const csvText = e.target.result;

        // Set all room data in localstorage
        localStorage.setItem("words_data", csvToJSONString(csvText));
    };
}

function csvToJSONString(csvString) {
    const lines = csvString.split('\n');
    const headers = lines[0].split(',');
    const data = lines.splice(1);

    csvObject = {};
    for (let i = 0; i < data.length; i++) {
        attributes = {};
        const line = data[i].split(',');
        for (let j = 1; j < headers.length; ++j) {
            attributes[headers[j]] = line[j];
        }
        csvObject[line[0]] = attributes;
    }

    return JSON.stringify(csvObject);
}

const node = document.getElementById("search-bar");
node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        console.log(node)
        searchDict(node.value)
    }
});

function searchDict(query) {
    // Get room data (error check whether the room exists)
    const words_data_all = JSON.parse(localStorage.getItem('words_data'));
    console.log(words_data_all)
    if (!words_data_all.hasOwnProperty(query)) {
        document.getElementById("result-text").innerHTML = "no results";
    }
    const word_translation = words_data_all[query]['translation'];

    document.getElementById("result-text").innerHTML = word_translation;
}
