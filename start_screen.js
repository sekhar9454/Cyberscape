let screen = document.body;
let canvas1 = document.getElementById("canvas1");
let cx1 = canvas1.getContext('2d');

let canvas2 = document.getElementById("canvas2");
let cx2 = canvas2.getContext('2d');


addEventListener("resize", (event) => {
    init();
});

let box_color = '#00FF00';
let padding = 30;
const divisions = 8;
let grid_width = innerWidth / divisions;
let green_area_width = grid_width - 2 * padding;
let Radars = [];
let green_areas = [];
function init() {
    Radars =[];
    green_areas = [];
    grid_width = innerWidth / divisions;
    green_area_width = grid_width - 2 * padding;
    let centers = [];
    canvas1.height = innerHeight;
    canvas1.width = innerWidth;
    canvas2.height = innerHeight;
    canvas2.width = innerWidth;
    
    for (let i = 1; i < divisions; i++) {
        cx1.beginPath();
        cx1.moveTo(grid_width * i, 0);
        cx1.lineTo(grid_width * i, innerHeight);
        cx1.strokeStyle = box_color;
        cx1.lineWidth = 2;
        cx1.stroke();
    }
    for (i = 1; i < innerHeight / grid_width; i++) {
        cx1.beginPath();
        cx1.moveTo(0, grid_width * i);
        cx1.lineTo(innerWidth, grid_width * i);
        cx1.strokeStyle = box_color;
        cx1.lineWidth = 2;
        cx1.stroke();
    }
    
    console.log(divisions*(Math.floor(innerHeight / grid_width)+1));
    for (i = 0; i <divisions*(Math.floor(innerHeight / grid_width)+1); i++) {
        var center = {
            x: undefined,
            y: undefined
        }
        center.x = (grid_width * (i % divisions)) + grid_width / 2;
        center.y = grid_width * (Math.floor(i / divisions)) + grid_width / 2;
        centers.push(center);
    }
    centers.forEach((c) => {
        let green_area = new Green_area(c.x , c.y);
        green_areas.push(green_area);
        let radar = new Radar(c.x, c.y);
        Radars.push(radar);
    });
    green_areas.forEach((a)=> a.draw());

    blue_area =  green_areas[Math.floor(Math.random()*(green_areas.length))];
    let baseStation = new BaseStation(blue_area.x,blue_area.y);
    baseStation.draw();
}


init();


function Building(x,y,width,height){
    this.x = x;
    this.y =y;
    this.width = width;
    this.height = height;
    cx1.beginPath();
    cx1.fillStyle = "black";
    this.draw = function(){
        cx1.fillRect(this.x, this.y , this.width , this.height);
        cx1.closePath();
    }

}
function Green_area(x, y) {
    this.buildings = [];
    this.x = x;
    this.y = y;
    this.draw = function(){
        cx1.beginPath();
        cx1.fillStyle = box_color;
        cx1.fillRect(x - green_area_width / 2, y - green_area_width / 2, green_area_width, green_area_width);
        cx1.stroke();
        for(i=0;i<6;i++){
            let height = Math.random()<0.5?-1*(30 + Math.random()*20):(30 + Math.random()*20);
            let width = Math.random()<0.5?-1*(30 + Math.random()*20):(30 + Math.random()*20);
            let building  = new Building(this.x +height/6,this.y + width/6, width, height);
            this.buildings.push(building);
            building.draw();
        }
        let towerRadius = 5;
        cx1.moveTo(this.x+towerRadius,this.y);
        cx1.arc(x, y, towerRadius, 0,Math.PI*2);
        cx1.fillStyle = "rgba(0,0,255,0.5)";
        cx1.stroke();
        cx1.fill();
        //make changes for the height and width
    };
    
}

function BaseStation(x,y){
    this.x = x;
    this.y = y;
    green_areas.forEach((g) => {
        if(g.x == x && g.y == y) {
            cx1.clearRect(x-green_area_width/2,y-green_area_width/2 , green_area_width,green_area_width);
            delete Radars[green_areas.indexOf(g)];
            delete green_areas[green_areas.indexOf(g)];
        }
    })

    this.draw =  function(){
        this.buildings = [];
        cx1.fillStyle = "#00FFFF" ;
        cx1.fillRect(x-green_area_width/2,y-green_area_width/2 , green_area_width,green_area_width); 
        cx1.fill();   
        for(i=0;i<6;i++){
            let height = Math.random()<0.5?-1*(30 + Math.random()*20):(30 + Math.random()*20);
            let width = Math.random()<0.5?-1*(30 + Math.random()*20):(30 + Math.random()*20);
            let building  = new Building(this.x +height/6,this.y + width/6, width, height);
            this.buildings.push(building);
            building.draw();
        }  
        let towerRadius = 5;
        cx1.moveTo(this.x+towerRadius*3.5,this.y);
        cx1.arc(x, y, towerRadius*3.5, 0,Math.PI*2);
        cx1.fillStyle = "rgba(0,0,255,1)";
        cx1.fill();  

    }
};


console.log(green_areas);
function Radar(x, y) {
    this.x = x;
    this.y = y;
    let omega =Math.PI/500 + Math.random()*(Math.PI/400);
    this.omega = Math.random()<0.5?omega:-1*omega;
    
    let begin_angle = Math.random() * Math.PI * 2;
    this.begin_angle = begin_angle;
    cx2.strokeStyle = "red";
    cx2.lineWidth = 2;
    let radarRadius = green_area_width*0.7; 
    let towerRadius = 10;
    this.draw = function () {
        cx2.beginPath()
        cx2.moveTo(this.x, this.y);
        cx2.lineTo(this.x + Math.cos(this.begin_angle) * (radarRadius)/2, this.y + Math.sin(this.begin_angle) * (radarRadius) / 2);
        cx2.arc(x, y, radarRadius, this.begin_angle, this.begin_angle + Math.PI / 3);
        cx2.lineTo(this.x, this.y);
        cx2.fill();
        
        cx2.stroke();
    }
    
    this.update = function(){
        this.begin_angle += this.omega;
        this.draw();
    }
    
}

function animate(){
    requestAnimationFrame(animate);
    cx2.clearRect(0,0,innerWidth,innerHeight);
    cx2.fillStyle = "rgba(255,0,0,0.3)";
    Radars.forEach((r)=> r.update());
}
animate();


let  scores = document.createElement("div");
scores.setAttribute("id" , "scores");

let Player_health = document.createElement('p');
Player_health.innerHTML = "Player Health :";
scores.appendChild(Player_health);

let System_Health = document.createElement('p');
System_Health.innerHTML = "System Health :";
scores.appendChild(System_Health);

let Keys = document.createElement('p');
Keys.innerHTML = "Player Health :";
scores.appendChild(Keys);

let Shards_Delivered = document.createElement('p');
Shards_Delivered.innerHTML = "Shards Delivered :";
scores.appendChild(Shards_Delivered);

let High_Score = document.createElement('p');
High_Score.innerHTML = "High Score :";
scores.appendChild(High_Score);




screen.appendChild(scores);
