$(document).ready(function () {

    var cardState;
    var currentQuestion=0;
    var qbank=new Array;
    var qbank_img=new Array;
    var language=0;
    var currentLang=0;
    var numCards=0;
    var currentNumCards=0;
    $("body").css("background-color", "#F8F8F8");
    $("#lang1").css("background-color", "#EFD9A1");
    $("#lang2").css("background-color", "#EFD9A1");
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;
    slider.oninput = function() {
      output.innerHTML = this.value;
      numCards = this.value;
      currentNumCards=numCards;
    
    }
    
    
    function clickHandler(){
      $("#lang2").css("background-color", "#CBB478");
      $("#lang1").css("background-color", "#EFD9A1");
      document.getElementById("lang2").style.boxShadow = "0px 0px 0px 0 rgba(113, 86, 117, 0.21)";
      document.getElementById("lang1").style.boxShadow = "6px 6px 12px 0 rgba(113, 86, 117, 0.21)";
      $("#lang2").hover(function(){
      $("#lang2").css("background-color", "#CBB478");
      }, function(){
      $("#lang2").css("background-color", "#CBB478");
    });
    $("#lang1").hover(function(){
    $("#lang1").css("background-color", "#CBB478");
    }, function(){
    $("#lang1").css("background-color", "#EFD9A1");
    });
      console.log("chinese selected");
      language = 2;
      document.getElementById("title").innerHTML = "让我们一起回顾";
      goToFlash()

    }
    function clickHandler1(){
      $("#lang1").css("background-color", "#CBB478");
      $("#lang2").css("background-color", "#EFD9A1");
      document.getElementById("lang1").style.boxShadow = "0px 0px 0px 0 rgba(113, 86, 117, 0.21)";
      document.getElementById("lang2").style.boxShadow = "6px 6px 12px 0 rgba(113, 86, 117, 0.21)";
      $("#lang1").hover(function(){
      $("#lang1").css("background-color", "#CBB478");
      }, function(){
      $("#lang1").css("background-color", "#CBB478");
    });
    $("#lang2").hover(function(){
    $("#lang2").css("background-color", "#CBB478");
    }, function(){
    $("#lang2").css("background-color", "#EFD9A1");
    });
      console.log("spanish selected");
      language = 1;
      document.getElementById("title").innerHTML = "Repasemos juntos";
      goToFlash()
    }
    
    
    function goToFront(){
      document.getElementById('settingsPage').style.display='none';
      document.getElementById('flashcards').style.display='none';
      document.getElementById('front').style.display='';
      document.body.style.background="#F8F8F8";
      $("#reviewTime").hover(function(){
      $("#reviewTime").css("background-color", "#CBB478");
      }, function(){
      $("#reviewTime").css("background-color", "#EFD9A1");
      });
    
    }
    
    function goToSettings(){
      document.getElementById('settingsPage').style.display='';
      document.getElementById('flashcards').style.display='none';
      document.getElementById('front').style.display='none';
      document.body.style.background="#F8F8F8";
      console.log("here");
    
      $("#lang1").hover(function(){
      $("#lang1").css("background-color", "#CBB478");
      }, function(){
      $("#lang1").css("background-color", "#EFD9A1");
    });
    $("#lang2").hover(function(){
    $("#lang2").css("background-color", "#CBB478");
    }, function(){
    $("#lang2").css("background-color", "#EFD9A1");
    });
    
      var element = document.getElementById('lang2');
      element.addEventListener('click', clickHandler);
      var element2 = document.getElementById('lang1');
      element2.addEventListener('click', clickHandler1);
      var closeButton=document.getElementById('closeSetting');
      closeButton.addEventListener('click', goToFlash);
    
    }
    
    
    function goToFlash(){
      document.getElementById('front').style.display='none';
      document.getElementById('settingsPage').style.display='none';
      document.getElementById('flashcards').style.display='';
      document.body.style.background="#EFD9A1";
      var settingButton=document.getElementById('settingFlash');
      settingButton.addEventListener('click', goToSettings);
      var closeButton=document.getElementById('closeFlash');
      closeButton.addEventListener('click', goToFront);
    }
    
    var settingButton=document.getElementById('settingFront');
    settingButton.addEventListener('click', goToSettings);
    var reviewButton=document.getElementById('reviewTime');
    reviewButton.addEventListener('click', goToSettings);
    var closeButton=document.getElementById('closeFront');
    closeButton.addEventListener('click', goToFlash);
    $("#reviewTime").hover(function(){
    $("#reviewTime").css("background-color", "#CBB478");
    }, function(){
    $("#reviewTime").css("background-color", "#EFD9A1");
    });
    
      loadDB();
    
    
    function loadDB(){
      console.log(numCards);
      if(language==1 || language==2){
        $.getJSON("activity.json", function(data) {
          currentLang=language;
          if(language==2){
            for(i=0;i<numCards;i++){
             qbank[i]=[];
             qbank_img[i]=[];
             qbank[i][0]=data.questionlist_chi[i].cardfront;
             qbank_img[i][0]=data.questionlist_chi_img[i].word;
             qbank[i][1]=data.questionlist_chi[i].cardback;
             qbank_img[i][1]=data.questionlist_chi_img[i].img;
            }
          }
          else if(language==1){
            for(i=0;i<numCards;i++){
             qbank[i]=[];
             qbank_img[i]=[];
             qbank[i][0]=data.questionlist_esp[i].cardfront;
             qbank_img[i][0]=data.questionlist_esp_img[i].word;
             qbank[i][1]=data.questionlist_esp[i].cardback;
             qbank_img[i][1]=data.questionlist_esp_img[i].img;
            }
          }
    
         beginActivity();
        })
      }
      else{
        console.log("hello?");
        document.getElementById('flip-card-inner').innerHTML="<div id='card1' class='finalMessage'>Go to the 'Settings' icon and select a language</div><div id='card2' class='card_flipped'></div>";
        $('#card1').css({
            background: "-webkit-gradient(linear, left top, right top, from(#ECF1FF), to(#FFFFFF))"
        });
        $('#card2').css({
            background: "-webkit-gradient(linear, left top, right top, from(#ECF1FF), to(#FFFFFF))"
        });
        setTimeout(loadDB, 300);
      }
    
    }
    
    function beginActivity(){
      if(language!=currentLang){
        loadDB();
      }
      else if(language==0 && currentLang==0){
        loadDB();
      }
      else if(currentNumCards!=numCards){
        loadDB();
      }
      else if(currentNumCards==0 && currentLang==0){
        loadDB();
      }
     cardState=0;
     var color1="#FCFCF4";
     $("#flip-card-inner").empty();
     $("#flip-card-inner").append('<div id="card1" class="card">' + qbank[currentQuestion][0] + '</div>');
     $("#flip-card-inner").append('<div id="card2" class="card_flipped" style="position; absolute;">' + qbank[currentQuestion][1] + '<img src="' + qbank_img[currentQuestion][1]+'" alt="img" style="z-score: 30; height:90px; position:absolute; left:85px; top:10px;">'+'</div>');
     $('#card1').css({
         background: "-webkit-gradient(linear, left top, right top, from(#ECF1FF), to(#FFFFFF))"
     });
     $('#card2').css({
         background: "-webkit-gradient(linear, left top, right top, from(#ECF1FF), to(#FFFFFF))"
     });
    currentQuestion++;
    
    document.getElementById("countArea").innerHTML = currentQuestion+"/"+qbank.length;
    
     $("#leftButtonArea").empty();
     $("#rightButtonArea").empty();
     $("#leftButtonArea").append('<div class="arrow-left" id="backButton"></div>');
     $("#rightButtonArea").append('<div class="arrow-right" id="nextButton"></div>');
     $("#nextButton").on("click",function(){
      if(currentQuestion<qbank.length){
    
        beginActivity();
      }
      else{
        //displayFinalMessage();
      }
     });//click function
     $("#backButton").on("click",function(){
       if(currentQuestion>=2){
         currentQuestion-=2;
         beginActivity();
       }
     });
    
    
    }//beginactivity
    
    function togglePosition(){
     if($("#card1").position().top==-200){$("#card1").css("top","200px");};
    }//toggle
    
    function togglePosition2(){
     if($("#card2").position().top==-200){$("#card2").css("top","200px");};
    }//toggle2
    
    function displayFinalMessage(){
    
     $("#flip-card-inner").empty();
     $("#flip-card-inner").append('<div id="finalMessage">You finished the activity!</div>');
    }//final message
    
    });

function makeFlashcards(){
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "makeFlashcards"}, function(response){
            console.log(response)
            console.log(response.response)
            if (response.response == "added data to storage"){
                chrome.storage.local.get(["wordList", "imgURLs"], data =>{
                    console.log("got the data")
                    console.log(data)
                });
            }
        });
       });
}

// document.addEventListener('DOMContentLoaded', function(){
//     document.getElementById("makeFlashcards").addEventListener("click", makeFlashcards);

    
    // var transcriptContainer = document.querySelector("transcriptContainer")

    // port.onMessage.addListener(function(message) {
    //     console.log("MESSAGE RECEIVED: " + message.data)
    //     var splitMessage = message.split(" ");
    //     for (word in splitMessage){
    //         var textSpan = document.createElement("span")
    //         textSpan.textContent = word
    //         transcriptContainer.appendChild(textSpan)
    // }
    // });

    // chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
    //     console.log("MESSAGE RECEIVED: " + message.data)
    //     var splitMessage = message.split(" ");
    //     for (word in splitMessage){
    //         var textSpan = document.createElement("span")
    //         textSpan.textContent = word
    //         transcriptContainer.appendChild(textSpan)
    //     }
    //     sendResponse({confirmation: "received"})
    // });

// });