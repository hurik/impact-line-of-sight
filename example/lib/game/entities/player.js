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
	},

	update: function() {
		var dx = this.enemy.pos.x - this.pos.x;
		var dy = this.enemy.pos.y - this.pos.y;

		// check if there is a line of sight ...
		this.enemyLos = ig.game.collisionMap.traceLos(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, dx, dy, 4, 4, ['EntityObstacle'], [this.ignoredObstacle]);

		// Ignore this, it is only for the movement ...
		if(ig.input.pressed('leftClick')) {
			// Get the path
			this.getPath(ig.input.mouse.x + ig.game.screen.x, ig.input.mouse.y + ig.game.screen.y, true, ['EntityObstacle']);
		}

		// Walk the path
		this.followPath(this.speed, true);

		// Update the animation
		this.currentAnim.gotoFrame(this.headingDirection);

		// Heading direction values
		// 1 4 6
		// 2 0 7
		// 3 5 8
		this.parent();
	},

	draw: function() {
		if(!ig.global.wm) {
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
		}

		// Ignore this, it is only for the movement ...
		// Attention this is important when you use the drawPath function or the entity doesn't show in weltmeister!
		if(!ig.global.wm) {
			// Draw the path ...
			this.drawPath(0, 255, 33, 0.5);
		}

		this.parent();
	}
});

});