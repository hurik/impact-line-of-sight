/*
 * astar-for-entities
 * https://github.com/hurik/impact-astar-for-entities
 *
 * v0.9.3
 *
 * Andreas Giemza
 * andreas@giemza.net
 * http://www.hurik.de/
 *
 * This work is licensed under the Creative Commons Attribution 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/.
 *
 * Thanks to: Joncom and FabienM (http://impactjs.com/forums/code/a-path-finder)
 *
 * Based on : https://gist.github.com/994534
 *            http://www.policyalmanac.org/games/aStarTutorial_de.html
 *            http://theory.stanford.edu/~amitp/GameProgramming/index.html
 */

ig.module( 
	'plugins.astar-for-entities-debug' 
)
.requires(
	'impact.debug.menu',
	'impact.entity'
)
.defines(function(){

ig.Entity.inject({
	draw: function() {
		this.parent();

		if(ig.Entity._debugShowPaths) {
			// When there is a path draw it ...
			if(this.path) {
				var mapTilesize = ig.game.collisionMap.tilesize;

				ig.system.context.strokeStyle = 'rgba(255,0,0,0.5)';
				ig.system.context.lineWidth = 4.0;

				ig.system.context.beginPath();

				ig.system.context.moveTo(
				ig.system.getDrawPos(this.pos.x + this.size.x / 2 - ig.game.screen.x), ig.system.getDrawPos(this.pos.y + this.size.y / 2 - ig.game.screen.y));

				for(var i = 0; i < this.path.length; i++) {
					ig.system.context.lineTo(
					ig.system.getDrawPos(this.path[i].x + mapTilesize / 2 - ig.game.screen.x), ig.system.getDrawPos(this.path[i].y + mapTilesize / 2 - ig.game.screen.y));
				}

				ig.system.context.stroke();
				ig.system.context.closePath();
			}
		}
	}
});

ig.Entity._debugShowPaths = false;

ig.debug.addPanel({
	type: ig.DebugPanel,
	name: 'astar-for-entities-debug',
	label: 'A*',

	options: [{
		name: 'Show paths',
		object: ig.Entity,
		property: '_debugShowPaths'
	}]
});

});