/*
 * line-of-sight
 * https://github.com/hurik/impact-line-of-sight
 *
 * v0.2.2
 *
 * Andreas Giemza
 * andreas@giemza.net
 * http://www.hurik.de/
 *
 * This work is licensed under the Creative Commons Attribution 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/.
 *
 */

ig.module(
	'plugins.line-of-sight'
)
.requires(
	'impact.collision-map'
)
.defines(function() {

ig.CollisionMap.inject({
	losMap: null,

	// When am map is loaded, create the pixel based collision map
	init: function(tilesize, data, tiledef) {
		this.parent(tilesize, data, tiledef);

		// Get them map size in pixels
		var height = this.height * this.tilesize;
		var width = this.width * this.tilesize;

		// Create an empty array
		this.losMap = new Array(height);

		for(var y = 0; y < height; y++) {
			this.losMap[y] = new Array(width);

			for(var x = 0; x < width; x++) {
				this.losMap[y][x] = 0;
			}
		}

		// Copy the collision map in this pixel based map
		for(var y = 0; y < this.height; y++) {
			for(var x = 0; x < this.width; x++) {
				if(this.data[y][x] == 1) {
					for(var los_y = 0; los_y < this.tilesize; los_y++) {
						for(var los_x = 0; los_x < this.tilesize; los_x++) {
							this.losMap[y * this.tilesize + los_y][x * this.tilesize + los_x] = 1;
						}
					}
				}
			}
		}
	},

	traceLos: function(x, y, vx, vy, objectWidth, objectHeight, entityTypesArray, ignoreEntityArray) {
		if (entityTypesArray == null) {
			entityTypesArray = [];
		}
		
		if (ignoreEntityArray == null) {
			ignoreEntityArray = [];
		}

		objectWidth = objectWidth - 1;
		objectHeight = objectHeight - 1;

		var ignoreThisEntity;

		// Add the entity types to the pixel collision map
		// Go through the entityTypesArray
		for(i = 0; i < entityTypesArray.length; i++) {
			var entities = ig.game.getEntitiesByType(entityTypesArray[i]);

			// Get every entity of this type
			for(j = 0; j < entities.length; j++) {
				ignoreThisEntity = false;

				// Check if it is excludes from the line of sight
				for(k = 0; k < ignoreEntityArray.length; k++) {
					if(ignoreEntityArray[k].id == entities[j].id) ignoreThisEntity = true;
				}

				// Add the entity to the pixel collision map
				if(!ignoreThisEntity) {
					for(var los_y = 0; los_y < entities[j].size.y; los_y++) {
						for(var los_x = 0; los_x < entities[j].size.x; los_x++) {
							this.losMap[(entities[j].pos.y).floor() + los_y][(entities[j].pos.x).floor() + los_x] = 2;
						}
					}
				}
			}
		}

		// Check if we have a free line of sight ...
		var ret = false;

		if(this._traceLosStep(x, y, x + vx, y + vy)) {
			ret = true;
		}

		if(this._traceLosStep(x + objectWidth, y, x + vx + objectWidth, y + vy)) {
			ret = true;
		}

		if(this._traceLosStep(x, y + objectHeight, x + vx, y + vy + objectHeight)) {
			ret = true;
		}

		if(this._traceLosStep(x + objectWidth, y + objectHeight, x + vx + objectWidth, y + vy + objectHeight)) {
			ret = true;
		}

		// Erase the entity types from the pixel collision map
		// Go through the entityTypesArray
		for(i = 0; i < entityTypesArray.length; i++) {
			var entities = ig.game.getEntitiesByType(entityTypesArray[i]);

			// Get every entity of this type
			for(j = 0; j < entities.length; j++) {
				ignoreThisEntity = false;

				// Check if it is excludes from the line of sight
				for(k = 0; k < ignoreEntityArray.length; k++) {
					if(ignoreEntityArray[k].id == entities[j].id) ignoreThisEntity = true;
				}

				// Add the entity to the pixel collision map
				if(!ignoreThisEntity) {
					for(var los_y = 0; los_y < entities[j].size.y; los_y++) {
						for(var los_x = 0; los_x < entities[j].size.x; los_x++) {
							this.losMap[(entities[j].pos.y).floor() + los_y][(entities[j].pos.x).floor() + los_x] = 0;
						}
					}
				}
			}
		}

		return ret;
	},

	_traceLosStep: function(x0, y0, x1, y1) {
		x0 = x0.floor();
		x1 = x1.floor();
		y0 = y0.floor();
		y1 = y1.floor();

		var dx = Math.abs(x1 - x0),
			sx = x0 < x1 ? 1 : -1;
		var dy = Math.abs(y1 - y0),
			sy = y0 < y1 ? 1 : -1;
		var err = (dx > dy ? dx : -dy) / 2;

		while(true) {
			if(this.losMap[y0][x0] != 0) {
				return true;
			}

			if(x0 === x1 && y0 === y1) {
				break;
			}

			var e2 = err;

			if(e2 > -dx) {
				err -= dy;
				x0 += sx;
			}

			if(e2 < dy) {
				err += dx;
				y0 += sy;
			}
		}

		return false;
	}
});
});