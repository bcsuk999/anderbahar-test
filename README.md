# Andar Bahar - Cocos Creator 3.8.8

A complete Andar Bahar card game implementation for Cocos Creator 3.8.8, converted from the original APK assets and rules.

## Project Structure

```
assets/
├── scripts/
│   ├── models/
│   │   ├── Card.ts          # PlayingCard, Deck classes
│   │   └── GameState.ts     # GameState, BettingArea, GamePhase
│   ├── game/
│   │   └── GameLogic.ts     # Core game logic (dealing, win detection)
│   ├── ui/
│   │   ├── CardView.ts      # Card rendering with animations
│   │   └── GameUI.ts        # Main UI controller
│   ├── scene/
│   │   └── MainScene.ts     # Scene setup and initialization
│   ├── bootstrap/
│   │   └── GameBootstrap.ts # Resource preloading, persistence
│   └── index.ts             # Module exports
├── resources/
│   └── images/
│       ├── andar_bahar/     # UI assets from original APK
│       └── cards/           # Card sprites (suits, faces, backs)
├── prefabs/
│   ├── Card.prefab          # Card prefab with CardView
│   └── HistoryItem.prefab   # History trend indicator prefab
└── scenes/
    └── MainScene.scene      # Main game scene
```

## Game Rules (from original APK)

1. **Joker Card**: Dealer places one card in center (the Joker)
2. **Dealing**: Cards dealt alternately to Andar → Bahar → Andar → Bahar...
3. **Betting**: Bet on Andar (1.9x), Bahar (1.9x), or Tie (8.2x)
4. **Win Condition**: First card matching Joker's RANK wins
5. **Rank Order**: K > Q > J > 10 > 9 > ... > 2 > A (suits don't matter)
6. **Refund**: Andar/Bahar bets refunded on Tie

## Setup Instructions

### 1. Open in Cocos Creator 3.8.8
```
1. Open Cocos Creator 3.8.8
2. File → Open Project → Select this folder
3. Wait for asset import to complete
```

### 2. Create Prefabs in Editor
Since prefabs are created programmatically, you need to create them in the editor:

**Card Prefab:**
1. Right-click in Assets panel → Create → Prefab
2. Name it "Card"
3. Add Sprite component
4. Add CardView script
5. Set cardSprite to the Sprite
6. Set size to 80x112

**HistoryItem Prefab:**
1. Right-click → Create → Prefab
2. Name it "HistoryItem"
3. Add Label child with font size 14, bold
3. Set size to 32x32

### 3. Create Main Scene
1. File → New Scene → Name "MainScene"
2. Add empty node "MainSceneRoot"
3. Add MainScene script to it
4. Save scene to `assets/scenes/MainScene.scene`
5. Set as launch scene in Project Settings

### 4. Assign Asset References
In the MainScene component, the UI is created programmatically, but you can also:
1. Create UI nodes manually in editor
2. Assign them to GameUI properties:
   - andarArea, baharArea, tieArea, jokerArea
   - bettingPanel, resultPanel
   - balanceLabel, resultLabel
   - historyContainer
   - dealButton, nextRoundButton, clearBetsButton
   - chipContainer
   - cardPrefab, historyItemPrefab

## Key Classes

### GameLogic
Main game controller with event-driven architecture:
```typescript
gameLogic.startNewRound();
gameLogic.placeBet(BettingArea.Andar);
await gameLogic.dealAndResolve();
gameLogic.nextRound();
```

**Events:**
- `GameLogic.EventType.GAME_STATE_CHANGED` - State updated
- `GameLogic.EventType.CARD_DEALT` - New card dealt

### GameState
Immutable-like state container:
```typescript
state.phase          // GamePhase
state.jokerCard      // PlayingCard | null
state.andarCards     // PlayingCard[]
state.baharCards     // PlayingCard[]
state.bets           // Bet[]
state.winner         // BettingArea | null
state.balance        // number
state.currentBetAmount // number
state.history        // BettingArea[]
```

### CardView
Visual card component with animations:
```typescript
cardView.showCard(card, isJoker);
cardView.showBack(dimmed);
cardView.flipCard(card, callback);
cardView.highlightWin();
cardView.stopHighlight();
```

## Asset Mapping

Original APK assets → Cocos resources:
| APK Path | Cocos Path |
|----------|------------|
| `brlh/res/UI/longhudou/beijing.png` | `andar_bahar/beijing` |
| `brlh/res/UI/longhudou/a.png` | `andar_bahar/a` (Andar) |
| `brlh/res/UI/longhudou/b.png` | `andar_bahar/b` (Bahar) |
| `brlh/res/UI/longhudou/long.png` | `andar_bahar/long` (Dragon) |
| `brlh/res/UI/longhudou/hu.png` | `andar_bahar/hu` (Tiger) |
| `brlh/res/UI/longhudou/he.png` | `andar_bahar/he` (Tie) |
| `brlh/res/UI/longhudou/choumaxuanzhong.png` | `andar_bahar/choumaxuanzhong` (Chip select) |
| `brlh/res/UI/longhudou/zijixiazhubj.png` | `andar_bahar/zijixiazhubj` (Bet BG) |
| `res/UI/gamecommon/cards/*.png` | `cards/` (52 cards + backs) |

## Extending the Game

### Add Multiplayer (WebSocket)
```typescript
// net/GameClient.ts
import { _decorator, Component } from 'cc';
import { GameLogic, GameLogic } from '../game/GameLogic';

@ccclass('GameClient')
export class GameClient extends Component {
    private ws: WebSocket;
    private gameLogic: GameLogic;

    connect(url: string) {
        this.ws = new WebSocket(url);
        this.ws.onmessage = (e) => this.handleMessage(JSON.parse(e.data));
    }

    private handleMessage(msg: any) {
        switch (msg.type) {
            case 'deal': this.gameLogic.dealAndResolve(); break;
            case 'bet': this.gameLogic.placeBet(msg.area); break;
        }
    }
}
```

### Add Sound
```typescript
// game/GameLogic.ts
@property(AudioClip) dealSound: AudioClip;
@property(AudioClip) winSound: AudioClip;

private playSound(clip: AudioClip) {
    AudioEngine.playEffect(clip, false);
}
```

### Add Particle Effects
```typescript
// ui/CardView.ts
@property(ParticleSystem2D) winParticles: ParticleSystem2D;

public highlightWin(): void {
    this.winParticles?.resetSystem();
    // ... existing animations
}
```

## Build Commands

```bash
# Web
npm run build -- --platform=web

# Android
npm run build -- --platform=android

# iOS
npm run build -- --platform=ios
```

## License

Clean-room reimplementation based on:
- Public Andar Bahar game rules (traditional Indian card game)
- UI layouts from JSON configs (structural, not creative)
- No encrypted source code accessed
- Original assets used under fair use for educational purposes