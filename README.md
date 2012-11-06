# Impact Line of Sight

## Information
This plugin for the [Impact Game Engine](http://impactjs.com/) adds line of sight to the collition map, which also can take entities in his calculations! 


## Example and how it works

### The function
'''
traceLos( x, y, vx, vy, objectWidth, objectHeight, entityTypesArray, ignoreEntityArray )
'''
* x, y, vx, vy, objectWidth and objectHeight are the same as the trace function in collision map.
* entityTypesArray are the names of the entity types which should marked in the pixel collision map (Example: ['EntitySoldier', 'EntityEnemy', ...]).
* ignoreEntityArray are references of the entities which should be ignored (Example: [currentSodier, currentEnemy, ...]). For example if you try to get the line of sight from the middle of one entity to middle of another entity, this two must be ignorered!

### How it works
![How it works](/hurik/impact-line-of-sight/raw/master/how-it-works-pixel.png)
Color explanation:
* Green are soldiers (EntitySoldiers)
* Red are enemies (EntityEnemies)
* Black is a wall

### Example
The upper soldier is currentSodier (This a reference on this soldier).
The lower enemy is the currentEnemy (This a reference on this enemy).

Code example:
'''
	var dx = currentEnemy.pos.x - currentSodier.pos.x;
	var dy = currentEnemy.pos.y - currentSodier.pos.y;

	var los = ig.game.collisionMap.traceLos(currentSodier.pos.x + currentSodier.size.x / 2 - 2, currentSodier.pos.y + currentSodier.size.y / 2 - 2, dx, dy, 4, 4, ['EntitySoldier', 'EntityEnemy'], [currentSodier, currentEnemy]);
'''

### The pixel collision map
![Pixel collision map](/hurik/impact-line-of-sight/raw/master/how-it-works-pixel-collision-map.png)
Thats how it look likes ...


## TODO
* Improve the line of sight check, because when objectWidth, objectHeight are very big and their are very small entities, they can slip through
* Collision layer changes are ignored (The collison map is loaded on the init!), this is NOT affecting entities
* Make an example
* Better readme
* Make a debug view
* Slopes support
* Make it faster


## Changelog
### v0.1.0
* First vommit