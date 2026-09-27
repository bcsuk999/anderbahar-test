// scripts/BankerCardUI.ts
// Builds Bg + Crown + Avatar + Name + Coin + Amount under this node.
import { _decorator, Component, Node, Sprite, UITransform, SpriteFrame, Label, Color, Layers } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('BankerCardUI')
@executeInEditMode
export class BankerCardUI extends Component {

    @property(SpriteFrame)
    bgSprite: SpriteFrame = null;

    @property(SpriteFrame)
    crownSprite: SpriteFrame = null;

    @property(SpriteFrame)
    avatarSprite: SpriteFrame = null;

    @property(SpriteFrame)
    coinSprite: SpriteFrame = null;

    @property
    bankerName: string = 'BANKER';

    @property
    amount: string = '0';

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
            this._makeImg('Bg', this.bgSprite, 260, 100, 0, 0);
            this._makeImg('Crown', this.crownSprite, 34, 26, -95, 38);
            this._makeImg('Avatar', this.avatarSprite, 56, 56, -95, -8);
            this._makeLabel(this.bankerName, 16, Color.WHITE, 15, 18);
            this._makeImg('Coin', this.coinSprite, 34, 12, 15, -20);
            this._makeLabel(this.amount, 18, Color.YELLOW, 62, -20);
            this._built = true;
        }
        this._setChild('Bg', this.bgSprite);
        this._setChild('Crown', this.crownSprite);
        this._setChild('Avatar', this.avatarSprite);
        this._setChild('Coin', this.coinSprite);
        this._setLabel('Label_BANKER', this.bankerName);
        this._setLabel('Label_0', this.amount);
    }

    private _setChild(name: string, sf: SpriteFrame): void {
        const n = this.node.getChildByName(name);
        if (!n) return;
        const s = n.getComponent(Sprite);
        if (s && s.spriteFrame !== sf) s.spriteFrame = sf;
    }

    private _setLabel(name: string, text: string): void {
        const n = this.node.getChildByName(name);
        if (!n) return;
        const l = n.getComponent(Label);
        if (l && l.string !== text) l.string = text;
    }

    private _makeImg(name: string, sf: SpriteFrame, w: number, h: number, x: number, y: number): Node {
        const n = new Node(name);
        n.layer = Layers.Enum.UI_2D;
        n.setParent(this.node);
        const s = n.addComponent(Sprite);
        s.sizeMode = Sprite.SizeMode.CUSTOM;
        s.spriteFrame = sf;
        const ui = n.addComponent(UITransform);
        ui.setContentSize(w, h);
        n.setPosition(x, y, 0);
        return n;
    }

    private _makeLabel(text: string, size: number, color: Color, x: number, y: number): Node {
        const n = new Node('Label_' + text);
        n.layer = Layers.Enum.UI_2D;
        n.setParent(this.node);
        const l = n.addComponent(Label);
        l.string = text;
        l.fontSize = size;
        l.isBold = true;
        l.color = color;
        l.horizontalAlign = Label.HorizontalAlign.CENTER;
        l.verticalAlign = Label.VerticalAlign.CENTER;
        const ui = n.addComponent(UITransform);
        ui.setContentSize(200, 40);
        n.setPosition(x, y, 0);
        return n;
    }
}