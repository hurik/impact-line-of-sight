# Impact Line of Sight

## Information
This plugin for the [Impact Game Engine](http://impactjs.com/) adds line of sight to the collition map, which also can take entities in his calculations! I was trying to check the line of sight with the collision map trace function, but it is not working very well. Thats why I created this plugin.


## Usage
Check the example/lib/game/entities/player.js and example/lib/game/entities/enemy.js!

### The function
```
traceLos(x, y, vx, vy, objectWidth, objectHeight, entityTypesArray, ignoreEntityArray)
```
* x, y, vx, vy, objectWidth and objectHeight are the same as the trace function in collision map.
* entityTypesArray are the names of the entity types which should marked in the pixel collision map (Example: ['EntitySoldier', 'EntityEnemy', ...]).
* ignoreEntityArray are references of the entities which should be ignored (Example: [currentSodier, currentEnemy, ...]). For example if you try to get the line of sight from the middle of one entity to middle of another entity, this two must be ignorered!


## Live demo
Check out: [http://www.hurik.de/impact-line-of-sight/](http://www.hurik.de/impact-line-of-sight/)


## Example
To change the level or work with the code, add in the example folder the missing libary files and folders:
```
lib/weltmeister/
lib/impact/
tools/
index.htmlw
weltmeister.html
```

### Example image
![Example image](/hurik/impact-line-of-sight/raw/master/example.png)


## How it works
#### init
* When a collision map is loaded, the plugin creates an pixel based collision map and adds the walls to it.

#### traceLos
* When you call the traceLos function it adds the entitiy types you want to the pixel based collision map.
* Then it uses the bresenham's line algorithm to check if the "lines" from the corners of the trace boxes are free in the pixel based collision map.
* After that it erases all the added entities from the pixel based collision map.
* And retuns true when there was an collision and when not false.

### Example image for the line of sight checks
![How it works](/hurik/impact-line-of-sight/raw/master/how-it-works.png)

#### Color explanation
* Green are soldiers (EntitySoldiers)
* Red are enemies (EntityEnemies)
* Black is a wall
* The different blue lines are tested in the pixel based collison map, when a pixel is a wall or an entity their is no line of sight!

### Code example
* The upper green soldier is currentSodier (This a reference on this soldier).
* The lower red enemy is the currentEnemy (This a reference on this enemy).

```
	var dx = currentEnemy.pos.x - currentSodier.pos.x;
	var dy = currentEnemy.pos.y - currentSodier.pos.y;

	var los = ig.game.collisionMap.traceLos(currentSodier.pos.x + currentSodier.size.x / 2 - 2, currentSodier.pos.y + currentSodier.size.y / 2 - 2, dx, dy, 4, 4, ['EntitySoldier', 'EntityEnemy'], [currentSodier, currentEnemy]);
```

### The pixel based collision map
![Pixel collision map](/hurik/impact-line-of-sight/raw/master/how-it-works-pixel-collision-map.png)

That is how the pixel based collision map look like for the example.


## TODO
* Improve the line of sight check, because when objectWidth, objectHeight are very big and their are very small entities, they can slip through
* Collision layer changes are ignored (The collison map is loaded on the init!), this is NOT affecting entities
* Make a debug view
* Slopes support
* Make it faster


## Changelog
##### v0.4.1
* added vars in traceLosDetailed()

#### v0.4.0
* Added traceLosDetailed, check the example how to use it (player.js)

##### v0.3.1
* Very little speedup (When there was an collision it doesn't check the other lines of sight!)

#### v0.3.0
* Adding and eraising of entities is now in a seperatet function
* _traceLosStep renamed to _traceLosLine
* _traceLosLine returns now the distance (Returns 0 when their was no collision and the distance when their was one, starting with 1!)
* Example added

##### v0.2.3
* Fixed the error when the check was outside the map

##### v0.2.2
* Fixed bug with objectWidth and objectHeight

##### v0.2.1
* objectWidth and objectHeight can be null now, without error
* Readme improved

#### v0.2.0
* Doesn't copy the pixel collision map anymore, adds the entities and after the check it erases them

#### v0.1.0
* First commit