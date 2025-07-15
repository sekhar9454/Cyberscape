let canvas1 = document.getElementById("canvas1");
let cx1 = canvas1.getContext('2d');
let screem = document.getElementById("container");
let canvas2 = document.getElementById("canvas2");
let cx2 = canvas2.getContext('2d'); // for dynamic components
let max_bullets = 5;

addEventListener("resize", (event) => {
    init();
});

addEventListener('click', () => {
    if (bullets.length < max_bullets) {
        bullets.push(new Bullet());
        setTimeout(()=>{} , 5000);
    }
});

let screen_width = innerWidth - 5;
let screen_height = innerHeight - 50;
let box_color = '#00FF00';
let padding = 20;
let divisions = 9;
let grid_width = screen_width / divisions;
let green_area_width = grid_width - 2 * padding;
let Radars = [];
let green_areas = [];
 let towerRadius = 5;
let player;
let Pause;
let keyradius = 8;
 let radarRadius = green_area_width * 0.7;
let shard_keys = [];
function init() {
    screen_width = innerWidth;
    screen_height = innerHeight - 50;
    pause = 1;
    Radars = [];
    green_areas = [];
    if (divisions == 9) grid_width = 170.66666666666666;
    else grid_width = screen_width / divisions;
    console.log(grid_width);
    green_area_width = grid_width - 2 * padding;
    let centers = [];
    canvas1.height = screen_height;
    canvas1.width = screen_width;
    canvas2.height = screen_height;
    canvas2.width = screen_width;

    for (let i = 1; i < divisions; i++) {
        cx1.beginPath();
        cx1.moveTo(grid_width * i, 0);
        cx1.lineTo(grid_width * i, screen_height);
        cx1.strokeStyle = box_color;
        cx1.lineWidth = 2;
        cx1.stroke();
    }
    for (i = 1; i < screen_height / grid_width; i++) {
        cx1.beginPath();
        cx1.moveTo(0, grid_width * i);
        cx1.lineTo(screen_width, grid_width * i);
        cx1.strokeStyle = box_color;
        cx1.lineWidth = 2;
        cx1.stroke();
    }

    for (i = 0; i < divisions * (Math.floor(screen_height / grid_width) + 1); i++) {
        var center = {
            x: undefined,
            y: undefined
        }
        center.x = (grid_width * (i % divisions)) + grid_width / 2;
        center.y = grid_width * (Math.floor(i / divisions)) + grid_width / 2;
        centers.push(center);
    }
    centers.forEach((c) => {
        let green_area = new Green_area(c.x, c.y);
        green_areas.push(green_area);
        let radar = new Radar(c.x, c.y);
        Radars.push(radar);
    });
    green_areas.forEach((a) => a.draw());

    let spawn_station = green_areas[Math.floor(Math.random() * green_areas.length)];
    player = new Player(spawn_station.x, spawn_station.y);
    player.spawn();
}

init();
blue_area = green_areas[Math.floor(Math.random() * (green_areas.length))];
let baseStation ;
baseStation = new BaseStation(blue_area.x, blue_area.y);
baseStation.draw();
let mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', (event) => {
    const rect = canvas2.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

let bullets = [];
function Bullet() {
    this.direction = Math.atan2((mouse.y - player.y), (mouse.x - player.x));
    this.speed = 500;
    this.vx = this.speed * Math.cos(this.direction);
    this.vy = this.speed * Math.sin(this.direction);
    this.x = player.x;
    this.y = player.y;
    this.radius = 5;
    this.bounceCount = 0;
    this.maxBounces = 5;

    this.draw = function () {
        cx2.beginPath();
        cx2.fillStyle = "white";
        cx2.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        cx2.fill();
        cx2.closePath();
    }

    this.fire = function (deltaTime) {
        let remainingTime = deltaTime;
        let maxStep = 0.001;
        let Index = [];
        while (remainingTime > 0) {
            const step = Math.min(maxStep , remainingTime);
            if (this.x >= screen_width - this.radius || this.x <= this.radius) { this.vx *= -1; this.bounceCount++; }
            if (this.y >= screen_height - this.radius || this.y <= this.radius) { this.vy *= -1; this.bounceCount++; }
            green_areas.forEach((B , Aindex) => {
                B.buildings.forEach((b, Bindex) => {
                    if (this.x + this.radius > b.x - b.width / 2 && this.x - this.radius < b.x + b.width / 2 && this.y + this.radius > b.y - b.height / 2 && this.y - this.radius < b.y + b.height / 2) {
                        index_ = bullets.indexOf(this);
                        bullets.splice(index_, 1);
                        Index.push([Bindex , Aindex]);
                    }
                })
            });

            Radars.forEach((r,i)=>{
                if(distance(r,this) <= towerRadius + this.radius){
                    Radars.splice(i,1);
                    index_ = bullets.indexOf(this);
                    bullets.splice(index_, 1);
                };
            })
            this.x += this.vx * step;
            this.y += this.vy * step;
            if (this.bounceCount >= this.maxBounces) {
                const index = bullets.indexOf(this);
                if (index !== -1) {
                    bullets.splice(index, 1);
                }
            }
            
            this.draw();
            remainingTime -= maxStep;
        }
        Index.forEach((i)=>{
            green_areas[i[1]].buildings.splice(i[0] ,1);
        })
    }

}
function Shard_Key(x,y){
    this.x = x;
    this.y = y;
    this.radius = keyradius;
    this.draw = function () {
        cx2.beginPath();
        cx2.fillStyle = "purple";
        cx2.arc(this.x,this.y , keyradius , 0 , Math.PI*2);
        cx2.fill();
    }
}

function spawn_keys(){
    if(shard_keys.length < 4){
        let x = Math.random()*innerWidth;
        let y = Math.random()*innerHeight;
        let key = new Shard_Key(x,y);
        shard_keys.push(key);
    }

}

function Building(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = "black"
    cx2.beginPath();
    this.draw = function () {
        cx2.fillStyle = this.color;
        cx2.fillRect(this.x, this.y, this.width, this.height);
        cx2.closePath();
    }

}
function Green_area(x, y) {
    this.buildings = [];
    this.x = x;
    this.y = y;
    for (i = 0; i < 6; i++) {
        let height = Math.random() < 0.5 ? -1 * (30 + Math.random() * 20) : (30 + Math.random() * 20);
        let width = Math.random() < 0.5 ? -1 * (30 + Math.random() * 20) : (30 + Math.random() * 20);
        let building = new Building(this.x + height / 6, this.y + width / 6, width, height);
        this.buildings.push(building);
    }
    this.draw = function () {
        cx2.beginPath();
        cx2.fillStyle = box_color;
        cx2.fillRect(x - green_area_width / 2, y - green_area_width / 2, green_area_width, green_area_width);
        cx2.stroke();


    };
    this.drawTower = function () {
        cx2.moveTo(this.x + towerRadius, this.y);
        cx2.arc(x, y, towerRadius, 0, Math.PI * 2);
        cx2.fillStyle = "rgba(0,0,255,0.5)";
        cx2.stroke();
        cx2.fill();
    }

}

function BaseStation(x, y) {
    this.x = x;
    this.y = y;
    this.buildings = [];
    green_areas.forEach((g) => {
        if (g.x == x && g.y == y) {
            cx1.clearRect(x - green_area_width / 2, y - green_area_width / 2, green_area_width, green_area_width);
            delete Radars[green_areas.indexOf(g)];
            delete green_areas[green_areas.indexOf(g)];
        }
    })

    for (i = 0; i < 6; i++) {
        let height = Math.random() < 0.5 ? -1 * (30 + Math.random() * 20) : (30 + Math.random() * 20);
        let width = Math.random() < 0.5 ? -1 * (30 + Math.random() * 20) : (30 + Math.random() * 20);
        let building = new Building(this.x + height / 6, this.y + width / 6, width, height);
        this.buildings.push(building);
        // building.draw();
    }
    this.draw = function () {
        cx1.fillStyle = "#00FFFF";
        cx1.fillRect(x - green_area_width / 2, y - green_area_width / 2, green_area_width, green_area_width);
        cx1.fill();

    }
    this.drawTower = function () {
        cx2.moveTo(this.x + towerRadius * 3.5, this.y);
        cx2.arc(x, y, towerRadius * 3.5, 0, Math.PI * 2);
        cx2.fillStyle = "rgba(0,0,255,1)";
        cx2.fill();
    }
};



function Radar(x, y) {
    this.x = x;
    this.y = y;
    let omega = Math.PI / 10 + Math.random() * (Math.PI / 2);
    this.omega = Math.random() < 0.5 ? omega : -1 * omega;

    let begin_angle = Math.random() * Math.PI * 2;
    this.begin_angle = begin_angle;
    cx2.strokeStyle = "red";
    cx2.lineWidth = 2;
   
   
    this.draw = function () {
        cx2.beginPath()
        cx2.strokeStyle = "rgba(255,0,0,0.4)";
        cx2.moveTo(this.x, this.y);
        cx2.lineTo(this.x + Math.cos(this.begin_angle) * (radarRadius) / 2, this.y + Math.sin(this.begin_angle) * (radarRadius) / 2);
        cx2.fillStyle = "rgba(255,0,0,0.3)";
        cx2.arc(x, y, radarRadius, this.begin_angle, this.begin_angle + Math.PI / 3);
        cx2.lineTo(this.x, this.y);
        cx2.fill();

        cx2.stroke();
    }

    this.update = function (deltaTime) {
        this.begin_angle += this.omega * deltaTime;
        this.draw();
    }

}






let scoresValues = {
    Player_health: undefined,
    System_Health: undefined,
    Keys: 0,
    Shards_Delivered: undefined,
    High_Score: undefined
};


const scoreLabels = {
    Player_health: "Player Health",
    System_Health: "System Health",
    Keys: "Keys",
    Shards_Delivered: "Shards Delivered",
    High_Score: "High Score"
};


const scores = document.createElement("div");
scores.id = "scores";


const fragment = document.createDocumentFragment();


Object.keys(scoreLabels).forEach(key => {
    const p = document.createElement("p");
    const value = scoresValues[key] ?? "Not set";
    p.textContent = `${scoreLabels[key]}: ${value}`;
    fragment.appendChild(p);
});

scores.appendChild(fragment);
container.appendChild(scores);


const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false
};

window.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
        event.preventDefault();
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
        event.preventDefault();
    }
});

function Player(x, y) {
    this.x = x;
    this.y = y;
    this.x += (Math.random() < 0.5) ? (-60) : (60);
    this.y += (Math.random() < 0.5) ? (-60) : (60);
    this.speed = 200;
    this.radius = 10;

    this.spawn = function () {
        cx2.beginPath();
        cx2.fillStyle = "white";
        cx2.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        cx2.fill();
        cx2.strokeStyle = "white";
        cx2.stroke();
        cx2.closePath();
    }

    this.update = function (deltaTime) {
        let vx = 0;
        let vy = 0;

        if (keys.ArrowRight || keys.d) vx += this.speed;
        if (keys.ArrowLeft || keys.a) vx -= this.speed;
        if (keys.ArrowUp || keys.w) vy -= this.speed;
        if (keys.ArrowDown || keys.s) vy += this.speed;

        if (vx !== 0 && vy !== 0) {
            const magnitude = Math.sqrt(vx * vx + vy * vy);
            vx = (vx / magnitude) * this.speed;
            vy = (vy / magnitude) * this.speed;
        }

        this.x += vx * deltaTime;
        this.y += vy * deltaTime;

        if (this.x < this.radius) this.x = this.radius;
        if (this.x > screen_width - this.radius) this.x = screen_width - this.radius;
        if (this.y < this.radius) this.y = this.radius;
        if (this.y > screen_height - this.radius) this.y = screen_height - this.radius;
    }
}
let lastTime = performance.now();


function distance(a,b){
    return Math.sqrt(Math.pow(a.x -b.x , 2) + Math.pow(a.y-b.y , 2));
}

function animate() {
    requestAnimationFrame(animate);
    if (pause == 1) {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        cx2.clearRect(0, 0, screen_width, screen_height);
        green_areas.forEach((A) => {
            A.draw();
            A.buildings.forEach((b) => {
                b.draw();
            })
            A.drawTower();
        });
        baseStation.buildings.forEach(b => b.draw());
        baseStation.drawTower();
        Radars.forEach((r) => r.update(deltaTime));
        player.update(deltaTime);
        player.spawn();
        bullets.forEach(b => b.fire(deltaTime));
    }
    spawn_keys();
    shard_keys.forEach((k,i) =>{
        k.draw();
        if(distance(k , player) <= player.radius + k.radius) {
            shard_keys.splice(i,1);
            scoresValues.Keys++;
            
        }
    });
}
console.log(shard_keys);
animate();