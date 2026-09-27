// scripts/CardsUI.ts
// Builds AndarGlow, JokerCard, AndarCard, VS, BaharCard (+ icons) under this node.
import { _decorator, Component, Node, Sprite, UITransform, SpriteFrame, Layers, executeInEditMode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CardsUI')
@executeInEditMode
export class CardsUI extends Component {

    @property(SpriteFrame)
    jokerSprite: SpriteFrame = null;

    @property(SpriteFrame)
    cardBackSprite: SpriteFrame = null;

    @property(SpriteFrame)
    vsSprite: SpriteFrame = null;

    @property(SpriteFrame)
    andarGlowSprite: SpriteFrame = null;

    @property(SpriteFrame)
    baharGlowSprite: SpriteFrame = null;

    @property(SpriteFrame)
    andarIconSprite: SpriteFrame = null;

    @property(SpriteFrame)
    baharIconSprite: SpriteFrame = null;

    @property
    cardWidth: number = 105;

    @property
    cardHeight: number = 145;

    private _built: boolean = false;

    protected onLoad(): void {
        this._all();
    }

    protected update(): void {
        this._all();
    }

    private _all(): void {
        if (!this.node || !this.node.isValid) return;
        if (!this._built) {
            this.node.layer = Layers.Enum.UI_2D;
            this._makeImg('AndarGlow', this.andarGlowSprite, 479, 228, -260, -20, this.node);
            this._makeImg('BaharGlow', this.baharGlowSprite, 479, 228, 260, -20, this.node);
            this._makeImg('JokerCard', this.jokerSprite, this.cardWidth, this.cardHeight, 0, 130, this.node);
            const andar = this._makeImg('AndarCard', this.cardBackSprite, this.cardWidth, this.cardHeight, -200, -10, this.node);
            this._makeImg('VS', this.vsSprite, 116, 69, 0, -10, this.node);
            const bahar = this._makeImg('BaharCard', this.cardBackSprite, this.cardWidth, this.cardHeight, 200, -10, this.node);
            this._makeImg('AndarIcon', this.andarIconSprite, 50, 50, 0, -90, andar);
            this._makeImg('BaharIcon', this.baharIconSprite, 50, 50, 0, -90, bahar);
            this._built = true;
        }
        this._setChild('AndarGlow', this.andarGlowSprite);
        this._setChild('BaharGlow', this.baharGlowSprite);
        this._setChild('JokerCard', this.jokerSprite);
        this._setChild('AndarCard', this.cardBackSprite);
        this._setChild('VS', this.vsSprite);
        this._setChild('BaharCard', this.cardBackSprite);
        this._setChild('AndarIcon', this.andarIconSprite);
        this._setChild('BaharIcon', this.baharIconSprite);
    }

    private _setChild(name: string, sf: SpriteFrame): void {
        const n = this.node.getChildByName(name);
        if (!n) return;
        const s = n.getComponent(Sprite);
        if (s && s.spriteFrame !== sf) s.spriteFrame = sf;
        // Also size the card nodes to cardWidth/cardHeight
        if ((name === 'JokerCard' || name === 'AndarCard' || name === 'BaharCard') && s) {
            const ui = n.getComponent(UITransform);
            if (ui && (ui.contentSize.width !== this.cardWidth || ui.contentSize.height !== this.cardHeight)) {
                ui.setContentSize(this.cardWidth, this.cardHeight);
            }
        }
    }

    private _makeImg(name: string, sf: SpriteFrame, w: number, h: number, x: number, y: number, parent: Node): Node {
        const n = new Node(name);
        n.layer = Layers.Enum.UI_2D;
        n.setParent(parent);
        const s = n.addComponent(Sprite);
        s.sizeMode = Sprite.SizeMode.CUSTOM;
        s.spriteFrame = sf;
        const ui = n.addComponent(UITransform);
        ui.setContentSize(w, h);
        n.setPosition(x, y, 0);
        return n;
    }
}