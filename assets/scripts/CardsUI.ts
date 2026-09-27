// scripts/CardsUI.ts
// AndarCard (A) + BaharCard (B). Each card = Back + Face{Base, Rank(BMFont), CornerSuit, Court/CenterSuit}.
// VS sits centered on top. Card faces are composed from layered sprites, not a single image.
import {
    _decorator, Component, Node, Sprite, UITransform, SpriteFrame, Label, Font,
    Color, Layers, tween, Tween, Vec3
} from 'cc';
import { EDITOR, PREVIEW } from 'cc/env';
const { ccclass, property, executeInEditMode } = _decorator;

export enum CardSuit {
    Spade = 0,
    Heart = 1,
    Diamond = 2,
    Club = 3,
}

export interface CardData {
    rank: string;
    suit: CardSuit;
}

const RANKS: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'A', 'J', 'Q', 'K'];
const SUITS: CardSuit[] = [CardSuit.Spade, CardSuit.Heart, CardSuit.Diamond, CardSuit.Club];
const COURTS: string[] = ['J', 'Q', 'K'];

const ANDAR = 'AndarCard';
const BAHAR = 'BaharCard';

@ccclass('CardsUI')
@executeInEditMode
export class CardsUI extends Component {

    @property(SpriteFrame)
    cardBackSprite: SpriteFrame = null;

    @property(SpriteFrame)
    cardFrontSprite: SpriteFrame = null;

    @property(SpriteFrame)
    vsSprite: SpriteFrame = null;

    @property(SpriteFrame)
    andarGlowSprite: SpriteFrame = null;

    @property(SpriteFrame)
    baharGlowSprite: SpriteFrame = null;

    @property(Font)
    cardFont: Font = null;

    @property(SpriteFrame)
    spadeSprite: SpriteFrame = null;

    @property(SpriteFrame)
    heartSprite: SpriteFrame = null;

    @property(SpriteFrame)
    diamondSprite: SpriteFrame = null;

    @property(SpriteFrame)
    clubSprite: SpriteFrame = null;

    @property(SpriteFrame)
    jackBlackSprite: SpriteFrame = null;

    @property(SpriteFrame)
    jackRedSprite: SpriteFrame = null;

    @property(SpriteFrame)
    queenBlackSprite: SpriteFrame = null;

    @property(SpriteFrame)
    queenRedSprite: SpriteFrame = null;

    @property(SpriteFrame)
    kingBlackSprite: SpriteFrame = null;

    @property(SpriteFrame)
    kingRedSprite: SpriteFrame = null;

    @property
    cardWidth: number = 105;

    @property
    cardHeight: number = 145;

    @property
    initCardGap: number = 136.67;

    @property
    initCardY: number = -10;

    @property
    vsWidth: number = 116;

    @property
    vsHeight: number = 69;

    @property
    rankWidth: number = 28;

    @property
    rankHeight: number = 40;

    @property
    rankX: number = -33;

    @property
    rankY: number = 50;

    @property
    cornerSuitWidth: number = 20;

    @property
    cornerSuitHeight: number = 24;

    @property
    cornerSuitX: number = -33;

    @property
    cornerSuitY: number = 22;

    @property
    courtWidth: number = 95;

    @property
    courtHeight: number = 103;

    @property
    courtX: number = 0;

    @property
    courtY: number = -10;

    @property
    centerSuitWidth: number = 42;

    @property
    centerSuitHeight: number = 48;

    @property
    centerSuitX: number = 0;

    @property
    centerSuitY: number = -6;

    @property
    rankRedColor: Color = new Color(228, 32, 39);

    @property
    rankBlackColor: Color = new Color(26, 26, 26);

    @property
    flipDuration: number = 0.18;

    @property
    flipStagger: number = 0.4;

    private _built: boolean = false;
    private _sig: string = '';
    private _tweens: Tween<Node>[] = [];
    private _cards: { [key: string]: CardData } = {};

    public static randomCard(): CardData {
        const r = RANKS[Math.floor(Math.random() * RANKS.length)];
        const s = SUITS[Math.floor(Math.random() * SUITS.length)];
        return { rank: r, suit: s };
    }

    protected onLoad(): void {
        this._all();
    }

    protected update(): void {
        this._all();
    }

    protected onDestroy(): void {
        this._stopFlips();
    }

    public flipCards(): void {
        if (EDITOR && !PREVIEW) return;
        this.flipCardsWith(CardsUI.randomCard(), CardsUI.randomCard());
    }

    public flipCardsWith(a: CardData, b: CardData): void {
        if (EDITOR && !PREVIEW) return;
        this._deal(ANDAR, a);
        this.unschedule(this._flipBahar);
        this.scheduleOnce(this._flipBahar, Math.max(0, this.flipStagger));
        this._cards[BAHAR] = b;
    }

    public showBacks(): void {
        this.unschedule(this._flipBahar);
        this._stopFlips();
        for (const name of [ANDAR, BAHAR]) {
            const card = this.node.getChildByName(name);
            if (!card) continue;
            const back = card.getChildByName('Back');
            const face = card.getChildByName('Face');
            if (back) back.active = true;
            if (face) face.active = false;
            card.setScale(1, 1, 1);
        }
    }

    private _flipBahar(): void {
        this._flip(BAHAR);
    }

    private _deal(name: string, card: CardData): void {
        this._cards[name] = card;
        const face = this.node.getChildByPath(name + '/Face');
        if (face) this._applyCard(face, card);
    }

    private _all(): void {
        if (!this.node || !this.node.isValid) return;
        const sig = this._layoutSig();
        if (!this._built || sig !== this._sig) {
            this._sig = sig;
            this._build();
            this._built = true;
        }
        this._setChild(ANDAR + '/Back', this.cardBackSprite);
        this._setChild(BAHAR + '/Back', this.cardBackSprite);
        this._setChild(ANDAR + '/Face/Base', this.cardFrontSprite);
        this._setChild(BAHAR + '/Face/Base', this.cardFrontSprite);
        this._setChild('VS', this.vsSprite);
        for (const name of [ANDAR, BAHAR]) {
            const face = this.node.getChildByPath(name + '/Face');
            if (!face) continue;
            const c = this._cards[name] ?? CardsUI.randomCard();
            this._cards[name] = c;
            this._applyCard(face, c);
        }
    }

    private _layoutSig(): string {
        return [
            this.cardWidth, this.cardHeight,
            this.vsWidth, this.vsHeight,
            this.rankWidth, this.rankHeight, this.rankX, this.rankY,
            this.cornerSuitWidth, this.cornerSuitHeight, this.cornerSuitX, this.cornerSuitY,
            this.courtWidth, this.courtHeight, this.courtX, this.courtY,
            this.centerSuitWidth, this.centerSuitHeight, this.centerSuitX, this.centerSuitY,
        ].join(',');
    }

    private _build(): void {
        this.node.layer = Layers.Enum.UI_2D;
        this._ensurePlaced(BAHAR, this.node, this.cardWidth, this.cardHeight, this.initCardGap, this.initCardY);
        this._ensurePlaced(ANDAR, this.node, this.cardWidth, this.cardHeight, -this.initCardGap, this.initCardY);
        this._ensurePlaced('VS', this.node, this.vsWidth, this.vsHeight, 0, this.initCardY, this.vsSprite);
        for (const name of [ANDAR, BAHAR]) {
            this._buildCard(name);
        }
    }

    private _ensurePlaced(name: string, parent: Node, w: number, h: number, initX: number, initY: number, sf?: SpriteFrame): Node {
        const isNew = !parent.getChildByName(name);
        const n = this._ensureNode(parent, name);
        this._ensureTransform(n).setContentSize(w, h);
        if (sf !== undefined) {
            const s = n.getComponent(Sprite) ?? n.addComponent(Sprite);
            s.sizeMode = Sprite.SizeMode.CUSTOM;
            if (sf && s.spriteFrame !== sf) s.spriteFrame = sf;
        }
        if (isNew) n.setPosition(initX, initY, 0);
        return n;
    }

    private _buildCard(name: string): void {
        const card = this.node.getChildByName(name);
        if (!card) return;
        this._ensureImg('Back', card, this.cardWidth, this.cardHeight, 0, 0, this.cardBackSprite);
        const face = this._ensureNode(card, 'Face');
        const fui = this._ensureTransform(face);
        fui.setContentSize(this.cardWidth, this.cardHeight);
        face.setPosition(0, 0, 0);
        face.active = false;
        this._ensureImg('Base', face, this.cardWidth, this.cardHeight, 0, 0, this.cardFrontSprite);
        this._ensureLabel('Rank', face, this.rankWidth, this.rankHeight, this.rankX, this.rankY);
        this._ensureImg('CornerSuit', face, this.cornerSuitWidth, this.cornerSuitHeight, this.cornerSuitX, this.cornerSuitY, null);
        this._ensureImg('Court', face, this.courtWidth, this.courtHeight, this.courtX, this.courtY, null);
        this._ensureImg('CenterSuit', face, this.centerSuitWidth, this.centerSuitHeight, this.centerSuitX, this.centerSuitY, null);
    }

    private _ensureNode(parent: Node, name: string): Node {
        let n = parent.getChildByName(name);
        if (!n) {
            n = new Node(name);
            n.layer = Layers.Enum.UI_2D;
            n.setParent(parent);
        }
        return n;
    }

    private _ensureTransform(n: Node): UITransform {
        const found = n.getComponents(UITransform);
        if (found.length > 0) return found[0];
        return n.addComponent(UITransform);
    }

    private _ensureImg(name: string, parent: Node, w: number, h: number, x: number, y: number, sf: SpriteFrame): Node {
        const n = this._ensureNode(parent, name);
        this._ensureTransform(n).setContentSize(w, h);
        const s = n.getComponent(Sprite) ?? n.addComponent(Sprite);
        s.sizeMode = Sprite.SizeMode.CUSTOM;
        if (sf && s.spriteFrame !== sf) s.spriteFrame = sf;
        n.setPosition(x, y, 0);
        return n;
    }

    private _ensureLabel(name: string, parent: Node, w: number, h: number, x: number, y: number): Label {
        const n = this._ensureNode(parent, name);
        this._ensureTransform(n).setContentSize(w, h);
        const l = n.getComponent(Label) ?? n.addComponent(Label);
        if (this.cardFont && l.font !== this.cardFont) l.font = this.cardFont;
        l.fontSize = 46;
        l.lineHeight = 46;
        l.horizontalAlign = Label.HorizontalAlign.CENTER;
        l.verticalAlign = Label.VerticalAlign.CENTER;
        n.setPosition(x, y, 0);
        return l;
    }

    private _setChild(path: string, sf: SpriteFrame): void {
        const n = this.node.getChildByPath(path);
        if (!n) return;
        const s = n.getComponent(Sprite);
        if (s && s.spriteFrame !== sf) s.spriteFrame = sf;
    }

    private _applyCard(face: Node, card: CardData): void {
        if (!card) return;
        const red = card.suit === CardSuit.Heart || card.suit === CardSuit.Diamond;
        const isCourt = COURTS.indexOf(card.rank) >= 0;
        const suit = this._suitSprite(card.suit);

        const rank = face.getChildByName('Rank');
        if (rank) {
            const l = rank.getComponent(Label);
            if (l) {
                if (l.string !== card.rank) l.string = card.rank;
                const c = red ? this.rankRedColor : this.rankBlackColor;
                if (!l.color.equals(c)) l.color = c;
            }
        }

        this._setSprite(face, 'CornerSuit', suit);
        this._setSprite(face, 'CenterSuit', suit);

        const court = face.getChildByName('Court');
        if (court) {
            court.active = isCourt;
            if (isCourt) this._setSprite(face, 'Court', this._courtSprite(card.rank, red));
        }

        const center = face.getChildByName('CenterSuit');
        if (center) center.active = !isCourt;
    }

    private _setSprite(face: Node, name: string, sf: SpriteFrame): void {
        const n = face.getChildByName(name);
        if (!n) return;
        const s = n.getComponent(Sprite);
        if (s && s.spriteFrame !== sf) s.spriteFrame = sf;
    }

    private _suitSprite(suit: CardSuit): SpriteFrame {
        if (suit === CardSuit.Spade) return this.spadeSprite;
        if (suit === CardSuit.Heart) return this.heartSprite;
        if (suit === CardSuit.Diamond) return this.diamondSprite;
        return this.clubSprite;
    }

    private _courtSprite(rank: string, red: boolean): SpriteFrame {
        if (rank === 'J') return red ? this.jackRedSprite : this.jackBlackSprite;
        if (rank === 'Q') return red ? this.queenRedSprite : this.queenBlackSprite;
        return red ? this.kingRedSprite : this.kingBlackSprite;
    }

    private _flip(name: string): void {
        const card = this.node.getChildByName(name);
        if (!card) return;
        const back = card.getChildByName('Back');
        const face = card.getChildByName('Face');
        if (!back || !face) return;

        if (!face.active) {
            const c = this._cards[name] ?? CardsUI.randomCard();
            this._cards[name] = c;
            this._applyCard(face, c);
        }

        const d = Math.max(0.01, this.flipDuration);
        card.setScale(1, 1, 1);
        this._tweens.push(
            tween(card)
                .to(d, { scale: new Vec3(0, 1, 1) })
                .call(() => {
                    back.active = !back.active;
                    face.active = !face.active;
                })
                .to(d, { scale: new Vec3(1, 1, 1) })
                .start()
        );
    }

    private _stopFlips(): void {
        for (const tw of this._tweens) tw.stop();
        this._tweens.length = 0;
    }
}
