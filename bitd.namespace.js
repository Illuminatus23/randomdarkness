BITD = {
	data : datatables,
	npc : {
		name: '',
		gender: '',
		pronoun: '',
		looks: '',
		heritage: 'Akorosi',
		goals: '',
		methods: '',
		profession: '',
		style: '',
		traits: [],
		interests: '',
		quirk: ''
	},
	street: { 
		mood: '',
		impressions: '',
		use: '',
		type: '',
		details: '',
		props: ''
	},
	methods: {
		d6: function(die, mod) {
            var total = 0,
                roll;
            //$('#log').append('<p>Roll '+die+'d6 + '+mod);
            for (; die>0; die--) {
                roll = Math.floor((Math.random()*6)+1);
            //    $('#log').append(' = '+ roll);
                total = total + roll;

            }
            total = total + mod;
            //$('#log').append('+ ' + mod + ' = result = '+ total +'</p>');
            return total;
        },
		randomSelection: function(list) {
			var max = list.length;
			var randomRoll = Math.floor(Math.random()*max);
			return list[randomRoll];
		},
		initRandomDarkness () {
			//click events and buttons
			$('#generateNPC').on('click',function () {
				var lists = BITD.data.people;
				var genderArray = BITD.methods.randomSelection(lists.gender);
				
				BITD.npc = {
					name: BITD.methods.buildName(),
					gender: genderArray[0],
					pronoun: genderArray[1],
					looks: BITD.methods.randomSelection(lists.looks),
					heritage:  BITD.methods.getHeritage(),
					goals: BITD.methods.randomSelection(lists.goals),
					methods: BITD.methods.randomSelection(lists.methods),
					profession: BITD.methods.getProfession,
					clothes: BITD.methods.randomSelection(lists.clothes),
					traits: BITD.methods.getTraits(),
					interests: BITD.methods.randomSelection(lists.interests),
					quirks: BITD.methods.randomSelection(lists.quirks),
					deviltraits: ''
				}
				if (BITD.npc.heritage === 'Tycherosi') {
					BITD.npc.deviltraits = BITD.methods.getDevilTraits();
				}
				BITD.methods.printNPC();
			});
			$('#generateStreet').on('click',function () {
				var lists = BITD.data.streets;

				BITD.street = {
					mood: BITD.methods.randomSelection(lists.mood),
					sights: BITD.methods.randomSelection(lists.sights),
					sounds: BITD.methods.randomSelection(lists.sounds),
					smells: BITD.methods.randomSelection(lists.smells),
					use: BITD.methods.randomSelection(lists.use),
					type: BITD.methods.randomSelection(lists.type),
					details: BITD.methods.randomSelection(lists.details),
					props: BITD.methods.getProps(lists.props)
				}
				BITD.street.name = BITD.methods.getStreetName();
				BITD.methods.printStreet();
			});
			$('#generateBuilding').on('click',function () {
				var lists = BITD.data.buildings;
				//var multiExteriorMaterials = (BITD.methods.d6(1,0) >=5);

				BITD.building = {
					exteriorMaterials: BITD.methods.selectVariableCount(lists.exteriorMaterial),
					exteriorDetails: BITD.methods.selectVariableCount(lists.exteriorDetails),
					use: BITD.methods.selectUse(),
					details: BITD.methods.randomSelection(lists.details),
					items: BITD.methods.getProps(lists.items)
				}
				BITD.methods.printBuilding();
			});
			
			$('#generateJob').on('click',function () {
				var lists = BITD.data.scores;
				//var multiExteriorMaterials = (BITD.methods.d6(1,0) >=5);
				var ghost = BITD.methods.randomSelection(lists.connections);
				BITD.score = {
					contact: BITD.methods.randomSelection(lists.contact),
					client: BITD.methods.randomSelection(lists.connections).replace('a','A'),
					target: BITD.methods.randomSelection(lists.connections),
					work: BITD.methods.randomSelection(lists.work),
					twist: BITD.methods.randomSelection(lists.twist),
					positiveFaction: BITD.methods.randomSelection(lists.factions),
					negativeFaction: BITD.methods.randomSelection(lists.factions)
				}
				BITD.score.target.replace('{connection}',ghost);
				BITD.methods.printScore();
			});
			$('#clear').on('click',function() {
				$('#display').html('');
			});
		},
		selectVariableCount: function (list) {
			var itemCounts = [1,1,1,2,2,3];
			var itemCountRoll = BITD.methods.d6(1,-1);
			var itemCount = itemCounts[itemCountRoll];
			var items = '';
			var i =0;
			
			while (itemCount > i) {
				var item = BITD.methods.randomSelection(list);
				if (itemCount === 1) {
					items = items + item;
				}
				else if (itemCount >= 2 && i==0) {
					items =  items + ' and ' + item;
				} else {
					items =  items + ', ' + item;
				}
				
				
				i++;
			}
			return items;
			
		},
		selectUse: function () {
			var useCounts = [1,1,1,2,2,3];
			var useCountRoll = BITD.methods.d6(1,-1);
			
			var useCount = useCounts[useCountRoll];
			var useList = BITD.data.buildings.commonUse;
			var rareUseList = BITD.data.buildings.rareUse;
			var uses = [];
			var i =0;
			
			while (useCount > i) {
				var isRare = (BITD.methods.d6(1,0) >= 5);
				var list = (isRare)?rareUseList:useList;
				var item = BITD.methods.randomSelection(list);
				uses.push(item);
				
				i++;
			}
			return uses;
		},
		printNPC: function() {
			var display = $('#display');
			var npc = BITD.npc;
			var htmlDescriptionTemplate = '<h4>{name}</h4><p>A {looks} {gender} of {heritage} descent wearing <span class="lowercase">{clothes}</span>. <span class="capitalize">{pronoun}</span> works as a <span class="lowercase">{profession} and seeks to {goals} through {methods}.</span></p><p><span class="capitalize">{pronoun}</span> is interested in {interests} and is known as {traits}.</p><p>Quirks: {quirks}<br>{deviltraits}</p>';
			
			if (BITD.npc.looks.match('with') !== null) {
				htmlDescriptionTemplate = htmlDescriptionTemplate.replace('{looks} {gender} of {heritage} descent','{gender} of {heritage} descent {looks} and');
			}
			if (BITD.npc.clothes.match('using') !== null) {
				htmlDescriptionTemplate = htmlDescriptionTemplate.replace('wearing','');
			}
			$.each(npc, function(field, value){
				var findString = '{' +field + '}';
				var re = new RegExp(findString,"g");
				htmlDescriptionTemplate = htmlDescriptionTemplate.replace(re, value);
			});
			display.prepend(htmlDescriptionTemplate);
		},
		printStreet: function () {
			var display = $('#display');
			var street = BITD.street;
			var htmlDescriptionTemplate = '<h4><span class="capitalize">{name}</span></h4><p>{mood} {type} used for {use}.  It is covered with {sights} and {details} dot its edges.  The sound of {sounds} drift to your ears and the smell of {smells} permeats the air.</p><p>Props: {props}</p>';
			$.each(street, function(field, value){
				var findString = '{' +field + '}';
				var re = new RegExp(findString,"g");
				htmlDescriptionTemplate = htmlDescriptionTemplate.replace(re, value);
			});
			display.prepend(htmlDescriptionTemplate);
		},
		printScore: function () {
			var display = $('#display');
			var street = BITD.score;
			var htmlDescriptionTemplate = '<h4><span class="capitalize">Score</h4><p>The crew heard of a job from {contact}.  {client} wants to hire someone to {work} {target}.  {positiveFaction} would like to see this work done but {negativeFaction} would definitely not.  The crew might not know that {twist}.';
			$.each(street, function(field, value){
				var findString = '{' +field + '}';
				var re = new RegExp(findString,"g");
				htmlDescriptionTemplate = htmlDescriptionTemplate.replace(re, value);
			});
			display.prepend(htmlDescriptionTemplate);
		},
		printBuilding: function () {
			var display = $('#display');
			var building = BITD.building;
			var htmlDescriptionTemplate = '<h4><span class="capitalize">{Use1}</span></h4><p>A <span class="lowercase">{exteriorMaterials} building with {exteriorDetails} details and {details}.</span>  It is used as a {Use1}';
			var secondaryUsage = '';
			var endCap = '.</p><p>Items: ' + building.items + '</p>';
			var findUseString = '{Use1}';
			var findRegExp = new RegExp(findUseString,"g");
			
			htmlDescriptionTemplate = htmlDescriptionTemplate.replace(findRegExp, building.use[0]);
			
			if (building.use.length > 1) {
				var secondaryArea = BITD.methods.randomSelection(BITD.data.buildings.secondaryArea);
				 secondaryUsage = ' and doubles as a '+building.use[1]+' '+secondaryArea;
			}
			if (building.use.length > 2) {
				var secondaryArea = BITD.methods.randomSelection(BITD.data.buildings.secondaryArea);
				 secondaryUsage = secondaryUsage + ' with a '+building.use[2]+' '+secondaryArea;
			}
			
			$.each(building, function(field, value){
				var findString = '{' +field + '}';
				var re = new RegExp(findString,"g");
				htmlDescriptionTemplate = htmlDescriptionTemplate.replace(re, value);
			});
			htmlDescriptionTemplate=htmlDescriptionTemplate+secondaryUsage+endCap;
			display.prepend(htmlDescriptionTemplate);
		},
		buildName: function () {
			var nameBuilds = [['firstnames','lastnames'],['firstnames','lastnames'],['nicknames','lastnames'],['firstnames'],['lastnames'],['nicknames']]
			var buildIndex = BITD.methods.d6(1,-1);
			var build = nameBuilds[buildIndex];
			var npcName = '';
			$.each(build, function(key, value) {
				var list = BITD.data.people[value];
				npcName = npcName + BITD.methods.randomSelection(list) + ' ';
			});
			return npcName;
		},
		getHeritage: function () {
			var isForeigner = BITD.methods.d6(1,0);
			var foreignRoll = BITD.methods.d6(1,-1);
			var heritageList = BITD.data.people.heritage;
			var heritage = 'Akorosi';

			if (isForeigner  >= 4) {
				heritage = heritageList[foreignRoll];
			}
			return heritage;
		},
		getProfession: function () {
			var isRare = BITD.methods.d6(1,0);
			var professionList = (isRare >= 5)? BITD.data.people.professions.common : BITD.data.people.professions.rare;
			var profession = BITD.methods.randomSelection(professionList);
			return profession;
		},
		getTraits: function () {
			var traitCounts = [1,2,2,3,3,4];
			var traitCountRoll = BITD.methods.d6(1,-1);
			var traitCount = traitCounts[traitCountRoll];
			var traits = '';
			var i =0;
			
			while (traitCount > i) {
				var trait = BITD.methods.randomSelection(BITD.data.people.traits);
				
				if (traitCount === 1) {
					traits = traits + trait;
				}
				else if (traitCount >= 2 && i==0) {
					traits =  traits + ' and ' + trait;
				} else {
					traits =  trait + ', ' + traits;
				}
				
				
				i++;
			}
			return traits;
		},
		getDevilTraits () {
			var traitTypeRoll = BITD.methods.d6(1,-1);
			var traitTypes = ['eyes','hair','teeth','skin','claws','horns'];
			var traitType = traitTypes[traitTypeRoll];
			var trait = BITD.methods.randomSelection(BITD.data.people.deviltraits[traitType]);
			var traitString = '<span class="capitalize">' + BITD.npc.pronoun + '</span> has ' + trait + ' ' + traitType;
			return traitString;
		},
		getProps: function (propList) {
			var propCounts = [1,2,2,3,3,4];
			var propCountRoll = BITD.methods.d6(1,-1);
			var propCount = propCounts[propCountRoll];
			var props = '';
			var i =0;
			
			while (propCount > i) {
				var prop = BITD.methods.randomSelection(propList);
				if (propCount === 1) {
					props = props + prop;
				}
				else if (propCount >= 2 && i==0) {
					props =  props + ' and ' + prop;
				} else {
					props =  prop + ', ' + props;
				}
				
				
				i++;
			}
			return props;
		},
		getStreetName() {
			var typeArray = BITD.street.type.split(' ');
			var lastPart = (typeArray.length === 2)? typeArray[1]:typeArray[0];
			var firstPart = BITD.methods.randomSelection(BITD.data.streets.names);
			
			return firstPart + ' ' + lastPart;
		}
	}
}
