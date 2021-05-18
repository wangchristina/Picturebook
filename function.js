
  
export function queryWord(word){
    var imageRef = firebase.database().ref('images/Image 4/status');
    imageRef.on('value', (snapshot) => {
      const data = snapshot.val();
        console.log (data);

    });
    
}




