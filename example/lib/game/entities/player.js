ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	size: {
		x: 8,
		y: 8
	},

	speed: 50,

	animSheet: new ig.AnimationSheet('media/player.png', 8, 8),

	enemy: null,
	enemyLos: false,

	ignoredObstacle: null,

	init: function(x, y, settings) {
		// You should use different animations, but i'm to lazy ...
		this.addAnim('idle', 999999999999999999, [0, 1, 2, 3, 4, 5, 6, 7, 8]);

		this.parent(x, y, settings);
	},

	ready: function() {
		// Get the enemy
		this.enemy = ig.game.getEntitiesByType('EntityEnemy')[0];

		// Get the obstacle in the middle ...
		var obstacles = ig.game.getEntitiesByType('EntityObstacle');

		for(var c = 0; c < obstacles.length; c++) {
			if(obstacles[c].pos.x == 192 && obstacles[c].pos.y == 40) {
				this.ignoredObstacle = obstacles[c];
			}
		}

		var dx = this.enemy.pos.x - this.pos.x;
		var dy = this.enemy.pos.y - this.pos.y;

		this.enemyLos = ig.game.collisionMap.traceLos(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, dx, dy, 4, 4, ['EntityObstacle'], [this.ignoredObstacle]);
	},

	update: function() {
		// Check if there is a line of sight, but only when the position have changed ...
		if(this.last.x != this.pos.x || this.last.y != this.pos.y) {
			var dx = this.enemy.pos.x - this.pos.x;
			var dy = this.enemy.pos.y - this.pos.y;

			this.enemyLos = ig.game.collisionMap.traceLos(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, dx, dy, 4, 4, ['EntityObstacle'], [this.ignoredObstacle]);
		}

		if(ig.input.pressed('space')) {
			var res = {
				collision: false,
				x: 0,
				y: 0
			};

			var playerCenter = {
				x: this.pos.x + this.size.x / 2,
				y: this.pos.y + this.size.y / 2
			};

			var enemyCenter = {
				x: this.enemy.pos.x + this.enemy.size.x / 2,
				y: this.enemy.pos.y + this.enemy.size.y / 2
			};

			ig.game.collisionMap._addEraseEntityLos(0, ['EntityObstacle'], [this.ignoredObstacle]);

			ig.game.collisionMap.traceLosDetailed(playerCenter, enemyCenter, res);

			ig.game.collisionMap._addEraseEntityLos(1, ['EntityObstacle'], [this.ignoredObstacle]);

			ig.log('res: {');
			ig.log('\toccurred: ' + res.collision + ',');
			ig.log('\tx: ' + res.x + ',');
			ig.log('\ty: ' + res.y + '\n}');
		}


		if(ig.input.pressed('leftClick')) {
			this.getPath(ig.input.mouse.x + ig.game.screen.x, ig.input.mouse.y + ig.game.screen.y, true, ['EntityObstacle']);
		}

		this.followPath(this.speed, true);
		this.currentAnim.gotoFrame(this.headingDirection);

		this.parent();
	},

	draw: function() {
		if(!ig.global.wm) {
			// When the line of sight is free draw a line to the target
			if(!this.enemyLos) {
				var mapTilesize = ig.game.collisionMap.tilesize;

				ig.system.context.strokeStyle = 'rgba(255, 0, 0, 1)';
				ig.system.context.lineWidth = 1 * ig.system.scale;

				ig.system.context.beginPath();

				ig.system.context.moveTo(
				ig.system.getDrawPos(this.pos.x + this.size.x / 2 - ig.game.screen.x), ig.system.getDrawPos(this.pos.y + this.size.y / 2 - ig.game.screen.y));

				ig.system.context.lineTo(ig.system.getDrawPos(this.enemy.pos.x + mapTilesize / 2 - ig.game.screen.x), ig.system.getDrawPos(this.enemy.pos.y + mapTilesize / 2 - ig.game.screen.y));

				ig.system.context.stroke();
				ig.system.context.closePath();
			}

			this.drawPath(0, 255, 33, 0.5);
		}

		this.parent();
	}
});

});