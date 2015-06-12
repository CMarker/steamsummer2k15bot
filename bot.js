var run=true;
console.log("Loaded SS2k15B");
setInterval(function(){
	if (!run)
		return;
	function UseAbility(ability) {
		g_Minigame.CurrentScene().m_rgAbilityQueue.push({
				'ability': ability
			});
	}

	function ChangeLane(newLane) {
		g_Minigame.CurrentScene().TryChangeLane(newLane);
	}

	function LaneHasEnemies(lane) {
		for(var x=0;x<g_Minigame.CurrentScene().m_rgEnemies.length;x++) {
			var enemy = g_Minigame.CurrentScene().m_rgEnemies[x];
			if (enemy.m_nLane == lane)
				return true;
		}

		return false;
	}

	if (g_Minigame.CurrentScene().m_bIsDead) {
		console.log("Respawning");
		RespawnPlayer();
		return;
	}

	var currentLane = g_Minigame.CurrentScene().m_rgPlayerData.current_lane;
	for (var x=0;x<g_Minigame.CurrentScene().m_rgLaneData.length;x++) {
		var laneData = g_Minigame.CurrentScene().m_rgLaneData[x];
		if (laneData.has_boss || laneData.has_treasure_mob && x != currentLane) {
			console.log("Changing to better lane: " + x);
			ChangeLane(x);
			break;
		}
	}

	var laneData = g_Minigame.CurrentScene().m_rgLaneData[currentLane];
	if (!LaneHasEnemies(currentLane) && !laneData.has_boss) {
		var keys = [];
		for(var k in g_Minigame.CurrentScene().m_rgLaneData) keys.push(k);
		var newLane = Math.floor(Math.random() * keys.length);
		if (newLane != currentLane) {
			console.log("Lane empty. Changing to better lane: " + newLane);
			ChangeLane(newLane);
		}
	}

	//buy upgrades
	var upgrades = window.jQuery("div.upgrade a.link");
	for (var x=upgrades.length-1;x>=0;x--) {
		//console.log("Buying upgrades");
		upgrades.eq(x).click();
	}

	//use abilities
	var abilities = window.jQuery("div#abilitiescontainer .abilitytemplate");
	for(x=0;x<abilities.length;x++) {
		var itemCount = abilities.eq(x).find(".abilityitemquantity").text();
		if (itemCount)
			continue;
		abilities.eq(x).find("a").click();
	}

	//console.log("Clicking");
	g_Minigame.CurrentScene().m_nClicks = 80
}, g_msTickRate);