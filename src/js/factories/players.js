import { mapGrid, mapCell, shipList } from '../factories/mapComponents';

const playerHelper = () => {
    const playerChats = {
        team: {
            greeting: [
                'Ships lined up, snacks secured, and morale is… questionably high. Ready, Captain!',
                'Everything’s prepped, captain! If we lose, it’ll definitely because of bad luck—not me',
                'All systems are green, captain! …Well, except the coffee machine, but we’ll survive.',
                'Good news: all systems are online. The bad news: crew’s betting on how long we last. No pressure, Captain.',
                'Engines are humming, cannons are purring, and the crew is pretending to know what they’re doing. We’re set, Captain!',
            ],
            hitShot: [
                'Direct hit, Captain! The enemy’s probably filing a complaint with their insurance right now.',
                'We nailed them, Captain! And by ‘we,’ I mean you… but I’ll take some credit anyway.',
                'That one rattled their teeth, Captain! …assuming Sinksalot has teeth.',
                'Splash one, sir! That hit was so good, even the fish are clapping.',
                'Direct hit, sir! Sinksalot probably just spit out his evil latte.',
                'Kaboom! They won’t be walking straight for a week. Well… sailing straight.',
                'Enemy’s reeling, Captain! I think I even heard their ship say ‘ouch.',
                'BOOM! Did you see that? I mean, of course you did, you shot it, but STILL!',
                'Direct hit! Captain, you just redecorated their deck—with explosions!',
                'That blast landed so well, we should charge them rent!',
                'Bullseye, Captain! The enemy crew is probably googling ‘how to surrender gracefully.’',
                'We hit them so hard, I almost want to send a ‘Get Well Soon’ card.',
                'Ka-BLAM! Sir, I may have accidentally cheered loud enough to wake the kraken.',
                'Impact confirmed. Sir, my knees are wobbly—but in a heroic way.',
                'Kablam! Captain, you just upgraded their ship from battleship to scrap-ship.',
                'Direct hit! Even the seagulls are impressed.',
                'HIT CONFIRMED! Permission to do a little victory dance? No? Already doing it.',
                'Beautiful shot! That was so precise, I’m starting to think you’re using cheat codes.',
                'Enemy ship just took a big ouch, Captain! I bet their evil parrot flew away.',
                'Bam! Right on target. I’d high-five you, but my hands are shaking from the explosion.',
            ],
            missedShot: [
                'Missed! But hey, we scared the fish at least.',
                'Oof, close one! Wanna blame the cannon? I do.',
                'Negative hit… but a positive splash!',
                'Missed ’em, Captain. On the bright side, free fireworks for the crew!',
                'Captain, the cannon must be shy—it just didn’t want to hit today.',
                'We missed! Quick, someone tell the enemy it was just part of the plan.',
                'Well… we definitely showed the ocean who’s boss.',
                'Missed ’em! Guess we’re just giving the ocean a massage.',
                'Missed! Don’t worry, Captain—every great story has a blooper reel.',
                'Shot went wide sir! Don’t worry, I’m sure the sea monsters felt intimidated.',
                'Swing and a miss! But it was a very dramatic miss, sir.',
                'No hit, Captain. Jenkins swears he saw the cannon flinch.',
                'Missed again! Maybe the cannon’s just shy around evil ships.',
                'Miss confirmed! Don’t worry, sir—statistically we’re due for a hit any century now.',
                'That shot was… uh… a warning! Yeah, a warning shot!',
                'No impact! Maybe we just wanted to give them a false sense of security?',
                'Missed again, Captain. But hey, at least the splash was majestic.',
                'Missed them Captain… maybe we should just throw the cannonballs by hand?',
                'Shot went so wide it’s probably halfway to another ocean.',
                'That was a warning shot, Captain! Very… convincing warning.',
                'Oh no! Our aim’s worse than Jenkins’ cooking.',
                'Missed again! Permission to blame the tide, the wind, and maybe ghosts?',
                'Sir, we didn’t miss… we’re just playing battleship on hard mode.',
                'We missed? Impossible. The enemy must’ve hacked physics.',
                'We didn’t miss, sir, we just hit… somewhere else.',
                'Oops… that was a tactical miss! Very tactical. Super tactical.',
                'Blast! Our aim is cursed—somebody throw salt overboard!',
                'Missed! But if intimidation splashes counted, we’d be winning.',
                'That wasn’t a miss, Captain, that was… target practice. Yeah!',
                'Miss confirmed. Can we just tell everyone it was Jenkins’ fault?',
            ],
            win: [
                'Ka-BOOOOM! Their fleet just applied for Atlantis residency.',
                'Captain, we did it! Victory smells like cannon smoke and slightly burnt toast.',
                'Fleet destroyed! Sinksalot’s probably writing sad poetry now.',
            ],
            lost: [
                'We’re sinking! Someone grab the snacks first!',
                'Glub… glub… permission to panic, sir?',
                'We may have lost the battle… and the ship… and the snacks… but we still have spirit!',
                'This isn’t defeat—it’s a tactical… uh… swim test.',
                'Captain, if anyone asks, let’s say we let them win.',
                'We lost! Quick, everyone look heroic while sinking.',
            ],
        },
        enemy: {
            greeting: [
                'Ahoy, Captain! Name’s Sinksalot — and guess what I do best?',
                'Sinksalot here! Prepare to be sunk, spanked, and spectacularly humiliated!',
                'So, you’re the so-called hero? Adorable. I’m Sinksalot, destroyer of ships and diets!',
                'You dare face Sinksalot? Oh, this is going to be hilariously one-sided!',
                'The ocean belongs to me, Sinksalot! …Well, except that part over there, rented by dolphins.',
                'Sinksalot’s arrived. So! You think you’re a captain? Ha! More like a snack-sized sailor for my sharks.',
            ],
            hitShot: [
                'Ha! Bullseye! Did that sting, cupcake?',
                'Direct hit! Sinksalot strikes again!',
                'Patch it up quick, or I’ll start charging you for extra ventilation!',
                'Target hit! You’re leaking dignity!',
                'Ha! You should’ve seen your crew’s faces just now!',
                'Direct hit! Jenkins, write this down for my memoirs!',
                'I call that shot ‘The Soggy Surprise!',
                'Bonk! Oh look, your ship’s got a new window!',
                'Direct hit! My aim’s so good, I scare myself sometimes.',
                "Ohoho! You patched one hole, I'll give you three more. You’re welcome!",
                'Oh-ho! Even your rubber duckies are abandoning ship now!',
                'Yes! That shot was so good, seagulls are writing songs about it!',
                'That shot was so perfect, I want it painted on a velvet canvas!',
                'Oho! Your ship just hiccupped. Or was that sinking?',
                'Yes! Another masterpiece of mayhem by yours truly!',
                'Bullseye! That one’s sponsored by chaos and bad luck!',
                'That was no hit, that was art. ART, I tell you!',
                'Need a bucket, Captain? Or maybe a whole mop army?',
                'Kaboom! And thus, Sinksalot’s legend grows!',
                'The ocean itself applauds my aim!',
                'Ha-ha-ha! You’re gonna need a bigger bucket!',
                'A hole for you, a laugh for me!',
                'Ha! I could hit you blindfolded… actually, I am blindfolded!',
            ],
            missedShot: [
                'Blast it! Stand still while I sink you properly!',
                'Arrrgh! I meant to miss… intimidation tactic!',
                'Curses! My cannons are allergic to accuracy today.',
                'What?! I could’ve sworn that hit you… in another dimension.',
                'Curse you, physics! You heartless wench!',
                'Missed?! No, no… that was a warning shot. A very expensive one.',
                'Who loaded the cannon with fruit again?! This is NOT a buffet battle!',
                'Curse these slippery waves! They cheated!',
                'Argh! I was just… testing gravity.',
                'Who swapped the powder for flour?! This isn’t bakery wars!',
                'Which fool yelled ‘FIRE’ while I was still stretching?!',
                'Ha! I wasn’t even aiming for you, fool!',
                'Drat! I meant to scare the fish! Yes, that’s it!',
                'That was just a practice shot. The next one counts!',
                'Curses! My evil eye patch must be on the wrong eye again.',
                'Missed?! Impossible! Someone clearly tampered with the laws of physics!',
                'Oh, look at that! I was aiming for a dolphin the whole time!',
                'Bah! I only missed because I was laughing too hard at you!',
                'Don’t laugh! I was only calibrating my evil aim.',
                'I meant to do that… very intimidating, right?',
                'Fine! That miss was intentional—building suspense, you see.',
                'You’re lucky! My cannons have stage fright when heroes are watching.',
                'Argh! My evil aura threw off the trajectory.',
                'This is the sixth most humiliating day of my life!',
                'Bah! I’ll get you next time! Maybe. Possibly. Don’t quote me.',
                'Arrgh! Missed again. Remind me to hire an optometrist.',
                'Arrgh! That shot was meant for… uh… practice. Yes. Practice.',
                'Blast it, crew! At this rate I’ll promote the mop to first mate!',
                'Next one who loads the cannon wrong is swabbing the sea… without a ship!',
            ],
            win: [
                'Ha! Down you go, Captain Clumsy!',
                'Victory is mine! Someone write this in the history books—preferably with glitter.',
                'The ocean belongs to ME now! Well… and also the sharks.',
                'Ha-ha-ha! Evil triumphs again! And I didn’t even spill my latte this time.',
                'Enjoy your new career as professional divers, Captain.',
            ],
            lost: [
                'Nooo! My beautiful fleet! I just waxed those decks!',
                'Nooo! Tell my parrot… he’s in charge now…',
                'You may have sunk my ships, but you’ll never sink… my dramatic monologues!',
                'Curse you! Next time I’ll bring bigger cannons—and more sunscreen!',
                'Nooo! My villain insurance doesn’t cover this!',
                'Defeated… by you?! I’ll haunt your snack rations forever!',
            ],
        },
    };

    const playerChatTmpIndex = {
        team: {
            greeting: [],
            hitShot: [],
            missedShot: [],
            win: [],
            lost: [],
        },
        enemy: {
            greeting: [],
            hitShot: [],
            missedShot: [],
            win: [],
            lost: [],
        },
    };

    const getRandomChatByCategory = (playerSide, chatCategory) => {
        if (
            playerChatTmpIndex[playerSide][chatCategory].length >=
            (playerChats[playerSide][chatCategory].length / 3) * 2
        ) {
            playerChatTmpIndex[playerSide][chatCategory] = [];
        }

        let randomIndex = Math.floor(Math.random() * playerChats[playerSide][chatCategory].length);

        while (playerChatTmpIndex[playerSide][chatCategory].includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * playerChats[playerSide][chatCategory].length);
        }
        playerChatTmpIndex[playerSide][chatCategory].push(randomIndex);

        return playerChats[playerSide][chatCategory][randomIndex];
    };

    return {
        getRandomChatByCategory,
    };
};

const playerInfo = (playerSide, name = '') => {
    const playerMapManager = mapGrid(playerSide);
    const playerShipsManager = shipList();
    const playerChatManager = playerHelper();

    return {
        name,
        isActive: false,
        playerSide,
        playerChatManager,
        playerMapManager,
        playerShipsManager,
    };
};

const player = (playerSide, name = '') => {
    if (name === null || !playerSide) {
        throw new Error('missing input name or playerSide');
    }
    if (typeof name !== 'string' || typeof playerSide !== 'string') {
        throw new Error('name and playerSide must be a string');
    }

    const info = playerInfo(playerSide, name);
    // console.log(typeof info.playerShipsManager.getShipList());

    const togglePlayerIsActive = () => {
        getPlayerInfo().isActive = !info.isActive;
    };

    const getPlayerInfo = () => info;
    const getPlayerActiveState = () => info.isActive;

    return {
        getPlayerInfo,
        getPlayerActiveState,
        togglePlayerIsActive,
    };
};

const playersManager = () => {
    const playerList = [player('enemy', 'Sinksalot')];

    const adUserToPlayerList = (newName = '') => {
        const userPlayer = player('team', newName);
        userPlayer.togglePlayerIsActive();
        playerList.push(userPlayer);
    };

    const switchActivePlayer = () => {
        playerList[0].togglePlayerIsActive();
        playerList[1].togglePlayerIsActive();
    };

    const getPlayerList = () => playerList;
    const getActivePlayerInfo = () => {
        if (playerList[0].getPlayerActiveState()) {
            return playerList[0].getPlayerInfo();
        } else {
            return playerList[1].getPlayerInfo();
        }
    };

    const getTeamInfo = () => {
        return playerList[1].getPlayerInfo();
    };

    const getEnemyInfo = () => {
        return playerList[0].getPlayerInfo();
    };

    return {
        adUserToPlayerList,
        switchActivePlayer,
        getPlayerList,
        getActivePlayerInfo,
        getTeamInfo,
        getEnemyInfo,
    };
};

export default playersManager;

// const players = playersManager();
// players.adUserToPlayerList('yue');
// console.log(players.getPlayerList()[0].getPlayerInfo());
// console.log(players.getPlayerList()[1].getPlayerInfo());
// console.log(players.getActivePlayerInfo());
// players.switchActivePlayer();
// console.log(players.getActivePlayerInfo());
