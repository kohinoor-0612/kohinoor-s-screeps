var roleHarvester = require('role.harvester');
var roleHarvester2 = require('role.harvester2');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
//var roleBuilder2 = require('role.builder2');
const  maxium_harvester = 7;
const  maxium_builder = 2;
const  maxium_upgrader = 1;

module.exports.loop = function () {

//刪除已經不存在的記憶
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

//數量追蹤
    var harvester_count = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var harvester2_count = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2');
    var builder_count = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgrader_count = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var total_energy = Game.spawns.Spawn1.room.energyAvailable ;


    //console.log("extension_count"+extension_count.length)


//產出高等單位 使用總能量
     if(total_energy > 300) {
       for(var name in Game.spawns) {
        var local_spawn = Game.spawns[name];


      if(harvester_count.length < maxium_harvester) {
        let newName = 'harvester' + Game.time;
        let source = _.sample(local_spawn.room.find(FIND_SOURCES)).id;
        local_spawn.spawnCreep([WORK,CARRY,CARRY,MOVE], newName,{memory: {role: 'harvester', harvest_target_id :source}});
      }
      else{
        if(upgrader_count.length < maxium_upgrader) {
                                      let newName = 'upgrader' + Game.time;
                                      local_spawn.spawnCreep([WORK,CARRY,CARRY,MOVE], newName,{memory: {role: 'upgrader'}});
        }
        if(builder_count.length < maxium_builder) {
                                      let newName = 'builder' + Game.time;
                                      local_spawn.spawnCreep([WORK,WORK,CARRY,MOVE], newName,{memory: {role: 'builder'}});
        }
      }

    }

     }

//產出低等單位
    if(total_energy < 301) {

     for(var name in Game.spawns) {
        var local_spawn = Game.spawns[name];

        if(harvester_count.length < maxium_harvester) {
                                      let newName = 'harvester' + Game.time;
                                      let source = _.sample(local_spawn.room.find(FIND_SOURCES)).id;
                                      local_spawn.spawnCreep([WORK,CARRY,MOVE], newName,{memory: {role: 'harvester', harvest_target_id :source}});
        }
        else{
      if(upgrader_count.length < maxium_upgrader) {
                                    let newName = 'upgrader' + Game.time;
                                    local_spawn.spawnCreep([WORK,CARRY,MOVE], newName,{memory: {role: 'upgrader'}});
      }

      if(builder_count.length < maxium_builder) {
                                    let newName = 'builder' + Game.time;
                                    local_spawn.spawnCreep([WORK,CARRY,MOVE], newName,{memory: {role: 'builder'}});
      }}
    }}

//城政中心的產出標記
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

//塔行為LOOP
var tower = Game.getObjectById('ca0dd09791abc03f7f51ac4a');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
//

//行為LOOP
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'harvester2') {
            roleHarvester2.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
