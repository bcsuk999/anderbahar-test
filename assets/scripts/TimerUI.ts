// scripts/TimerUI.ts
// Builds TimerFrame + TimerBg + count under this node.
import { _decorator, Component, Node, Sprite, UITransform, SpriteFrame, Label, Color, Layers } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('TimerUI')
@executeInEditMode
export class TimerUI extends Component {

    @property(SpriteFrame)
    frameSprite: SpriteFrame = null;

    @property(SpriteFrame)
    bgSprite: SpriteFrame = null;

    @property
    seconds: number = 10;

    private _frameNode: Node = null;
    private _bgNode: Node = null;
    private _labelNode: Node = null;
    private _applied: boolean = false;

    protected onLoad(): void {
        this._build();
    }

    protected update(): void {
        this._build();
    }

    private _build(): void {
        if (!this.node || !this.node.isValid) return;
        if (!this._frameNode || !this._frameNode.isValid) {
            this.node.layer = Layers.Enum.UI_2D;
            this._frameNode = this._makeChild('TimerFrame', 148, 118, 0, 0);
            this._bgNode = this._makeChild('TimerBg', 120, 34, 0, 28);
            this._labelNode = this._makeLabel(String(this.seconds), 32, Color.YELLOW, 0, 28);
        }
        const s1 = this._frameNode.getComponent(Sprite);
        if (s1 && s1.spriteFrame !== this.frameSprite) s1.spriteFrame = this.frameSprite;
        const s2 = this._bgNode.getComponent(Sprite);
        if (s2 && s2.spriteFrame !== this.bgSprite) s2.spriteFrame = this.bgSprite;
        const l = this._labelNode.getComponent(Label);
        if (l && l.string !== String(this.seconds)) l.string = String(this.seconds);
    }

    private _makeChild(name: string, w: number, h: number, x: number, y: number): Node {
        const n = new Node(name);
        n.layer = Layers.Enum.UI_2D;
        n.setParent(this.node);
        const s = n.addComponent(Sprite);
        s.sizeMode = Sprite.SizeMode.CUSTOM;
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
        ui.setContentSize(120, 40);
        n.setPosition(x, y, 0);
        return n;
    }
}