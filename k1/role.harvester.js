var roleHarvester = {
    run: function(creep) {
          //決策樹
           if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.say('⛏️harvest');
	    }
	         if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
	        creep.memory.harvesting = false;
	        creep.say('🛏️idling');
          let source0 = creep.room.find(FIND_SOURCES)[0].energy;
          let source1 = creep.room.find(FIND_SOURCES)[1].energy;
          if (source0 > source1) {creep.memory.harvest_target_id = creep.room.find(FIND_SOURCES)[0].id
          }else{
            creep.memory.harvest_target_id = creep.room.find(FIND_SOURCES)[1].id
          }
	    }




	    if(creep.memory.harvesting == true) {
            let source = Game.getObjectById(creep.memory.harvest_target_id);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                let target = creep.pos.findClosestByPath(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;
