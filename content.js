console.log("content script running");

//overall container
// a4cQT dUWivc
//person div: TBMuR bj4p3b
//text container: Mz6pEf wY1pdd
//actual text: iTTPOb VbkSUe
let oldText = ""
let pastWord = ""
// var dictionaryAPI = "https://cors-anywhere.herokuapp.com/https://owlbot.info/api/v4/dictionary/"
var dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/"
// var dictionaryAPI = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20201029T213928Z.a53d9bc4b1fd4c5c.dde35a420a375d7ecc2e3bf0c3564770148fe9f5&lang=en&text="

var imageAPI = "https://pixabay.com/api/?key=18855007-d05abfa1edf07b804cd453ed1&q="
var wordList = []
var imgURLs = []
// chrome.runtime.onConnect.addListener(function(port) {
//     console.log("connected to: " + port.name)
// });

// var port = chrome.runtime.connect(null, {name: "transcript"});

var personObserver = new MutationObserver(async function(mutations){
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            var newTexts = document.querySelectorAll(".CNusmb")
            var newText = newTexts[newTexts.length - 1]
            
            newText = newText.textContent
            newText = newText.replace(/[^\w\s]|_'/g, "").replace(/\s+/g, " ");
            words = newText.split(" ")

            //real time caption-word transcribing, doesn't work if a word is repeated
            if(newText.toLowerCase() !== oldText.toLowerCase() && words.length == 1){
                oldText = newText
            } else if (newText.toLowerCase().includes(oldText.toLowerCase())) {
                lastWord = words[words.length - 1]
                
                if(lastWord.toLowerCase() == pastWord.toLowerCase()){
                    continue;
                }

                pastWord = lastWord
                oldText = newText

                await handleCaption(lastWord);
                console.log(lastWord)
            } else {
                oldText = newText
            }

        }
      }
})

async function checkPartOfSpeech(url) {
    partOfSpeech = false
    //TODO: NEED GOOD CALLBACK FUNCTION FOR ERROR
    //calling it too fast does not work
    // let params = {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': 'Token ' + '7e9c5970bd3e19459d6552fa1d675bd6d348fddb'
    //     }
    // }

    const response = await fetch(url);
    jsonPromise = response.json()
    json = await jsonPromise
    console.log(json)

    // if (json.message == "No definition :("){
    //     console.log("no definition found")
    //     return partOfSpeech;
    // }

    // json.definitions.forEach((definition) => {
    //     if(definition.type == "noun"){
    //         partOfSpeech = true
    //         console.log(partOfSpeech)
    //         return partOfSpeech;
    //     } 
    // });

    json[0].meanings.forEach((definition) => {
        if(definition.partOfSpeech == "noun"){
            partOfSpeech = true
            // console.log(partOfSpeech)
            return partOfSpeech;
        } 
    });

    // console.log(partOfSpeech)
    return partOfSpeech
}

async function returnImgUrl(url) {
    const response = await fetch(url);
    jsonPromise = response.json()
    json = await jsonPromise

    imgIdx = Math.floor((Math.random() * 5) + 1);
    imgUrl = await json.hits[imgIdx].previewURL
    // console.log(imgUrl)
    return await imgUrl
}

async function getImage(caption) {
    const response = await fetch(`https://picturebook-eff08-default-rtdb.firebaseio.com/images/-MZTSNJQCan0KNiU9GhM/status.json`);
    return response.json();
}

async function handleCaption(caption){
    var captions = document.querySelector("#captions");

    if(captions.offsetWidth >= 800){
        captions.removeChild(captions.firstChild)
    }

    if (caption == "over"){
        partOfSpeech = false;
    }

    var wordList = ['over', 'jumped', 'does', 'like', 'why', 'if', "I", "go", 'over', 'jumped']
    if (wordList.includes(caption.toLowerCase())){
        partOfSpeech = false
    } else{
    var partOfSpeech = await checkPartOfSpeech(dictionaryAPI + caption)
    }



    if (partOfSpeech == true){
        // var imgURL = await returnImgUrl(imageAPI + caption + "&image_type=photo")
        var imgURL = await getImage(caption);

        imgDiv = document.createElement('div')
        imgDiv.classList.add("imgDiv")
        captions.appendChild(imgDiv)

        html =`<div class="imageContainer"><img class="image" src = "${imgURL}"> </img> </div> <p class = "phrase">${caption}</p>`
        imgDiv.innerHTML = html

        textDiv = document.createElement('div')
        textDiv.classList.add("textDiv")
        captions.appendChild(textDiv)

        wordList.push(caption)
        imgURLs.push(imgURL)
    } else {
    var textDivs = document.querySelectorAll('.textDiv');

    if(textDivs.length == 0){
        console.log("first text div")
        textDiv = document.createElement('div')
        textDiv.classList.add("textDiv")
        captions.appendChild(textDiv)

        // textDiv = document.querySelector(".textDiv")
    } else {
        textDiv = textDivs[textDivs.length - 1]
    }
    //if partOfSpeech = false
    prevText = textDiv.textContent
    textDiv.textContent = prevText + "  " + caption

}
}

function addObserverIfDesiredNodeAvailable() {
    var captionContainer = document.querySelector(".a4cQT");
    if(!captionContainer) {
        //The node we need does not exist yet.
        //Wait 500ms and try again
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    }
    captionContainer.id = "captionContainer"

    var config = { 
        childList: true, 
        subtree: true,
        attributes: true
    };
    var captionBackground = document.createElement("div");
    captionBackground.id = "captionBackground"
    captionContainer.append(captionBackground);

    var captions = document.createElement("div");
    captions.id = "captions"
    captionBackground.append(captions)

    personObserver.observe(captionContainer,config);
}

addObserverIfDesiredNodeAvailable();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "makeFlashcards" ) {
        console.log(wordList)
        console.log(imgURLs)
        chrome.storage.local.set({"wordList": wordList, "imgURLs": imgURLs});
        
        sendResponse({response: "added data to sorage"})

        alert("made flashcards")
           }
    }
  );

