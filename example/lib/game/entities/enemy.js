ig.module(
	'game.entities.enemy'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityEnemy = ig.Entity.extend({
	size: {
		x: 8,
		y: 8
	},

	animSheet: new ig.AnimationSheet('media/enemy.png', 8, 8),

	init: function(x, y, settings) {
		this.addAnim('idle', 999999999999999999, [0]);

		this.parent(x, y, settings);
	}
});

});
