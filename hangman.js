var words;
var word = [];
var wrong = 0;
var count = 0;
var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N',
                    'O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var letters = [];

var HEAD_RADIUS = 15;
var BODY_LENGTH = 40;
var ARM_LENGTH = 20;
var LEG_DOWN = 30;
var LEG_SIDE = 10;
var EYE_LENGTH = 5;
var EYE_OFFSET_SIDE = 3;
var EYE_OFFSET_UP = 6;
var MOUTH_LENGTH = 15;
var MOUTH_OFFSET = 5;
var TIMER_MILLISECONDS = 5000;
var votes = [];
var LAST_GUESS;
var TIMER;
var current = 5;
var end = false;


function start(){
    for(var i = 0; i < 26; i++){
        votes[i] = 0;
    }
    setup();
    getWord();
    setTimer(endVote, TIMER_MILLISECONDS);
    keyDownMethod(readInput);
    setTimer(updateTimer, 1000);
    //mouseMoveMethod(hover);
    //mouseClickMethod(select);
}
function restart(){
    word = [];
    wrong = 0;
    end = false;
    count = 0;
    alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
                    'o','p','q','r','s','t','u','v','w','x','y','z'];
    letters = [];
    votes = [];
    removeAll();
    for(var i = 0; i < 26; i++){
        votes[i] = 0;
    }
    setup();
    getWord();
    setTimer(updateTimer, 1000);
}

function showLastGuess(){
    LAST_GUESS = new Text("Last Guess: ", "16pt Arial");
    LAST_GUESS.setPosition(0, 42.5);
    LAST_GUESS.setColor("#19B5FE");
    add(LAST_GUESS);
}

function showTimer(){
    TIMER = new Text("Time until next vote: " + current, "16pt Arial");
    TIMER.setPosition(0, 20);
    TIMER.setColor("#F39C12");
    add(TIMER);
}

function readInput(e){
    println(String.fromCharCode(e.keyCode));
    votes[e.keyCode - 65]++;
    LAST_GUESS.setText("Last Guess: " + String.fromCharCode(e.keyCode))
}

function updateTimer(){
    if(end){
        TIMER.setText("Time until next game: " + current);
    }
    else{
        TIMER.setText("Time until next vote: " + current);
    }
    current--;
}

function endVote(){
    current = 5;
    var largest = 0;
    var vote = "";
    index = -1;
    for(var i = 0; i < 26; i++){
        if(votes[i] > largest){
            largest = votes[i];
            index = i;
            vote = String.fromCharCode(i + 65);
        }
    }
    if(index != -1){
        var letterNotPicked = false;
        var correct = false;
        if(letters[index] != null){
            println("s");
            remove(letters[index]);
            letters[index] = null;
            letterNotPicked = true;
        }
        for(var i=0; i<word.length; i++){
            if(word[i] == vote.charAt(0).toLowerCase() && letterNotPicked){
                
                correct = true;
                
                var x = getWidth()/2 - (30*word.length/2) + i*30 + 3;
                var y = getHeight()/3 * 2 - 3;
                
                if(vote == "m"){
                    x-=5;
                }
                
                drawText(vote, "#ECF0F1", x, y);
                count++;
            }
        }
        if(!correct){
            if(letterNotPicked){
                wrong++;
                drawHangman();
            }    
        }else{
		    checkWin();
	    }
    }
    for(var i = 0; i < 26; i++){
        votes[i] = 0;
    }
}

function select(e){
    var element = getElementAt(e.getX(), e.getY());
    
    if(element == null){
        return;
    }
    
    var correct = false;
    
    if(element.getY() >= getHeight()/4 * 3){
        var letter = element.getText();
        
        for(var i=0; i<word.length; i++){
            if(word[i] == letter){
                
                correct = true;
                
                var x = getWidth()/2 - (30*word.length/2) + i*30 + 3;
                var y = getHeight()/3 * 2 - 3;
                
                if(letter == "m"){
                    x-=5;
                }
                if(letter == "w"){
                    x-=10;
                }
                
                drawText(letter, "ECF0F1", x, y);
                
                count++;
            }
        }
        
		remove(element);
        if(correct == false){
            wrong++;
            drawHangman();
        }else{
			checkWin();
		}
    }
}

function lose(){
    var text = new Text("YOU LOSE");
    text.setColor(Color.RED);
    text.setPosition(getWidth()/2 - text.getWidth()/2, 250);
    add(text);
    
    //right eye
    drawLine(getWidth()/2+20 + EYE_OFFSET_SIDE, 70 + HEAD_RADIUS - EYE_OFFSET_UP, 
             getWidth()/2+20 + EYE_OFFSET_SIDE + EYE_LENGTH,
             70 + HEAD_RADIUS - EYE_OFFSET_UP + EYE_LENGTH);
             
    drawLine(getWidth()/2+20 + EYE_OFFSET_SIDE, 70 + HEAD_RADIUS - EYE_OFFSET_UP + EYE_LENGTH, 
             getWidth()/2+20 + EYE_OFFSET_SIDE + EYE_LENGTH,
             70 + HEAD_RADIUS - EYE_OFFSET_UP);
             
    //left eye
    drawLine(getWidth()/2+20 - EYE_OFFSET_SIDE, 70 + HEAD_RADIUS - EYE_OFFSET_UP, 
             getWidth()/2+20 - EYE_OFFSET_SIDE - EYE_LENGTH,
             70 + HEAD_RADIUS - EYE_OFFSET_UP + EYE_LENGTH);
             
    drawLine(getWidth()/2+20 - EYE_OFFSET_SIDE, 70 + HEAD_RADIUS - EYE_OFFSET_UP + EYE_LENGTH, 
             getWidth()/2+20 - EYE_OFFSET_SIDE - EYE_LENGTH,
             70 + HEAD_RADIUS - EYE_OFFSET_UP);  
             
    //mouth
    drawLine(getWidth()/2+20 - MOUTH_LENGTH/2, 70 + HEAD_RADIUS + MOUTH_OFFSET, 
             getWidth()/2+20 + MOUTH_LENGTH/2, 70 + HEAD_RADIUS + MOUTH_OFFSET);
    end = true;
    setTimeout( newGame , 5000 );
}

function newGame(){
    stopTimer(updateTimer);
    restart();
}

function checkWin(){
    if(word.length == count){
		var text = new Text("YOU WIN");
		text.setColor("#2ECC71");
		text.setPosition(getWidth()/2 - text.getWidth()/2, 250);
		add(text);
		setTimeout( newGame , 5000 );
		end = true;
	}
}

function drawHangman(){
    if(wrong == 1){
        //head
        //drawCircle(HEAD_RADIUS, getWidth()/2+20, 70 + HEAD_RADIUS);
        drawColorCircle(HEAD_RADIUS-1.5, Color.WHITE, getWidth()/2+20, 70 + HEAD_RADIUS);
    }else if(wrong == 2){
        //body
        drawLine2(getWidth()/2+20, 70 + HEAD_RADIUS*2  ,getWidth()/2+20, 
            70 + HEAD_RADIUS*2 + BODY_LENGTH);
    }else if(wrong == 3){
        //right arm
        drawLine2(getWidth()/2+20, 70 + HEAD_RADIUS*2 + BODY_LENGTH/3 , 
            getWidth()/2+20 + ARM_LENGTH, 70 + HEAD_RADIUS*2 + BODY_LENGTH/3 - 3);
    }else if(wrong == 4){
        //left arm
        drawLine2(getWidth()/2+20, 70 + HEAD_RADIUS*2 + BODY_LENGTH/3 , 
            getWidth()/2+20 - ARM_LENGTH, 70 + HEAD_RADIUS*2 + BODY_LENGTH/3 - 3);
        
    }else if(wrong == 5){
        //right leg
        drawLine2(getWidth()/2+20, 70 + HEAD_RADIUS*2 + BODY_LENGTH, 
            getWidth()/2+20 + LEG_SIDE, 70 + HEAD_RADIUS*2 + BODY_LENGTH + LEG_DOWN);
    }else if(wrong == 6){
        //left leg
        drawLine2(getWidth()/2+20, 70 + HEAD_RADIUS*2 + BODY_LENGTH, 
            getWidth()/2+20 - LEG_SIDE, 70 + HEAD_RADIUS*2 + BODY_LENGTH + LEG_DOWN);
    }else if(wrong == 7){
        //lose
        lose();
    }
}

function hover(e){
    
    if(e.getY() < getHeight()/4 * 3){
        return;
    }    
    
    var element = getElementAt(e.getX(), e.getY());
    
    if(element != null && element.getType() == 'Text' && element){
        element.setColor(Color.RED);
    }else{
        for(var i = 0; i<26; i++){
            letters[i].setColor(Color.BLUE);
        }
    }
}

function setup(){
    addBackground();
    nooseSetup();
    makeLetters();
    showLastGuess();
    showTimer();
}

function addBackground(){
    var background = new Rectangle(getWidth(), getHeight());
    background.setPosition(0, 0);
    background.setColor("#663399");
    add(background);
}

function makeLetters(){
    
                    
    for(var i = 0; i<26; i++){
        var x = 15 + (getWidth()/10 * (i%10));
        var y = (getHeight()/4 * 3);
        
        if(alphabet[i] == 'm'){
            x-=5;
        }
        
        if(i<10){
            y += 35; 
        }else if(i>=10 && i<20){
            y += 70;
        }else{
            y += 105;
            x += getWidth()/10 * 2;
        }
        
        drawText(alphabet[i], "#ECECEC", x, y);
    }
}

function nooseSetup(){
    drawLine(getWidth()/2-20, 50, getWidth()/2-20, 200);   //big vertical
    drawLine(getWidth()/2-50, 200, getWidth()/2+35, 200);  //base
    drawLine(getWidth()/2-20, 50, getWidth()/2+20, 50);    //top
    drawLine(getWidth()/2+20, 50, getWidth()/2+20, 70);    //little vertical
}

function getWord(){
    words = ["kappa", "dank", "kush", "blaze", "fourtwenty", "rekt", "mlg", "mountaindew", "doritos", "yoloswag", "memes", "biblethump"
    ];
    
    var w = words[Randomizer.nextInt(0,words.length-1)];
    println(w);
    
    for(var i=0; i<w.length; i++){
        
        word.push(w.charAt(i));
    }
    
   
    
    for(var i = 0; i<word.length; i++){
        
        var x = getWidth()/2 - (30*word.length/2) + i*30;
        
        drawLine(x, getHeight()/3 * 2, x+20, getHeight()/3 * 2);
    }
    
    
    
}

function drawLine(x, y, x2, y2){
    var line = new Line(x,y,x2,y2);
    add(line);
    
}

function drawLine2(x, y, x2, y2){
    var line = new Line(x,y,x2,y2);
    line.setColor("#ECECEC");
    add(line);
    
}

function drawText(text, color, x, y){
    var txt = new Text(text);
    txt.setColor(color);
    txt.setPosition(x,y);
    add(txt);
    letters.push(txt);
}

function drawColorCircle(radius, color, x, y){
    var circle = new Circle(radius);
    circle.setPosition(x,y);
    circle.setColor(color);
    add(circle);
}

function drawCircle(radius, x, y){
    var circle = new Circle(radius);
    circle.setPosition(x,y);
    add(circle);
}