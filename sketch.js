//Create variables here
var dog,dogImage;
var happyDog,happyDogImage;
var database;
var foodS;
var foodStock ;
var feed;
var addFood;
var fedTime;
var lastFed;
var food;

function preload()
{
  //load images here
  dogImage = loadImage("dogImg.png");
  happyDogImage = loadImage("dogImg1.png");
  sadDog = loadImage("Dog.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("WashRoom.png");
  bedroom = loadImage("BedRoom.png");
}

function setup() {
	createCanvas(700,700);
  database = firebase.database();

  food = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  console.log(foodStock);

  dog = createSprite(500,550,10,10);
  dog.addImage(dogImage)
  dog.scale = 0.3;

  feed = createButton("Feed The Dog");
  feed.position(800,195);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,150);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
}


function draw() {  
  background(46,139,87);
  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      food.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      food.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      food.washroom();
   }else{
    update("Hungry")
    food.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
   }

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed = data.val();
  });

  drawSprites();
  
  textSize(20);
  fill("white");
  text("Food : " + foodS,200,450);

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + "PM",300,50);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM",300,50);
  }else{
    text("Last Feed : " + lastFed + "AM",350,30);
  }
}

function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}
/*function writeStock(x){
  if(x > 0){
    x = x - 1;
  }
  else{
    x = 0;
  }
  database.ref('/').set({
    Food:x
  }
  )
}*/

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}

function feedDog(){
  food.updateFoodStock(food.getFoodStock()-1);
  database.ref('/').update({
    Food : food.getFoodStock(),
    FeedTime : hour(),
    gameState:"Hungry"
  })
   dog.addImage(happyDogImage);
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}




