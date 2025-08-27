 let params = new URLSearchParams(window.location.search);
 let level = params.get('level');
 let passageTime =  60;
 let currentPara = "";
 let isActive = false;
 let content = [];
 let written_content = [];
 let startTime =  null;
 let msitake_count = 0 ;
 let content_box =  document.querySelector('.content_box');
 let content_cover =  document.querySelector('.content_cover');
 let overlay =  document.querySelector('.overlay');
 let start =  document.querySelector('.start');
 let timer =  document.querySelector('.timer');
 let wpm =  document.querySelector('.wpm');
 let cpm =  document.querySelector('.cpm');
 let accuracy =  document.querySelector('.accuracy');
 let mistakes =  document.querySelector('.mistakes');
 let typing_level =  document.querySelector('.level');

 async function getData() {
    let res = await fetch("dataset.json");
    console.log(res);
    let data = await res.json();    
    let paras = data[level].para;
    passageTime = data[level].time;
    console.log(paras,passageTime);

    // Pick any one para randomly
    let random_para = paras[Math.floor(Math.random()*paras.length)];   
    return random_para;
}

getData().then(passage=>{
    currentPara = passage;
    content = passage.split('');
    console.log(currentPara,content);
    content_box.value = passage;
    timer.innerText = passageTime;
    typing_level.innerText = level;
    content_box.addEventListener('keydown',(event)=>{
        if(!isActive) return; // disable textarea
        if (!startTime) return;
        if (written_content.length == content.length) {
            isActive = false;
            return;
        }
        console.log(event.key);
        if(event.key == "Alt" || event.key == "Shift" || event.ctrlKey || event.key == "CapsLock") return;

        if(event.key==="Backspace"){
            event.preventDefault();
            if(written_content.length>0){
                written_content.pop();
                if(overlay.lastChild){
                    overlay.removeChild(overlay.lastChild);
                }
            }
            return;
        }
        //single characters only
        if(event.key.length===1) {
            written_content.push(event.key);
            check();
        }

        if(event.key ===' ') {
            event.preventDefault()
        }

        // console.log(written_contenxt);

        
    })
})


function check() {
    let i = written_content.length - 1;
    let span = document.createElement("span");
    span.className = "bg-blue-100"; // for highlight-effect
    if(written_content[i] == content[i]){
        span.className+= " "+"text-blue-500";
    } else{
         span.className+= " "+"text-red-500";
         msitake_count++;
    }
        span.textContent = content[i];
        overlay.appendChild(span);
}

//start button
start.addEventListener('click',()=>{
    isActive = true;
    startTime = new Date();
    let count = passageTime;
    console.log(count);

    let counter = setInterval(()=>{
        timer.innerText = --count;
        if(count<=0 || !isActive) {
            clearInterval(counter);
            isActive = false;
            calculateResult();
        }
    },1000);
});

// Result
function calculateResult() {
    let endTime = new Date();
    let timeTaken = (endTime - startTime) / 1000; //in seconds
    let timeTakenMinutes = timeTaken/60;

    let correctChars = written_content.filter((ch,i)=>ch=== content[i]).length;
    let totalTyped = written_content.length;

    let cpm_count =  Math.round(correctChars/timeTakenMinutes);
    let wpm_count =  Math.round((correctChars/5)/timeTakenMinutes);
    let acc =  totalTyped > 0 ?  ((correctChars/totalTyped)*100).toFixed(2) : 0;

    cpm.innerText = cpm_count;
    wpm.innerText = wpm_count;
    accuracy.innerText = acc;
    mistakes.innerText =  msitake_count;
}