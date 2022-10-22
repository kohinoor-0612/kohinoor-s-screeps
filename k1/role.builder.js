var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var total_energy = Game.spawns.Spawn1.room.energyAvailable ;

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0 && total_energy > 200) {
            creep.memory.building = false;
            creep.say('🔄 withdrawing');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	          var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	          let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
              const targets = creep.room.find(FIND_STRUCTURES, {
                  filter: object => object.hits < object.hitsMax
              });
              targets.sort((a,b) => a.hits - b.hits);
              if(targets.length > 0) {
                     // 叫他去repair 離太遠無法repair時 移動
                  if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(targets[0]);
                  }
              }
              else {
          // nothing to repair, let's do something else?
               if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
      }

          }

	    }
	    else {
          var pickup_energy_targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
        });
            if(creep.withdraw(pickup_energy_targets[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(pickup_energy_targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});

            }

	    }
	}
};


module.exports = roleBuilder;
