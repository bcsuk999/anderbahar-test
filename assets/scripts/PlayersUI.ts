// scripts/PlayersUI.ts
// Builds a row of player avatars under this node.
import { _decorator, Component, Node, Sprite, UITransform, SpriteFrame, Layers, executeInEditMode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayersUI')
@executeInEditMode
export class PlayersUI extends Component {

    @property(SpriteFrame)
    avatarSprite: SpriteFrame = null;

    @property(SpriteFrame)
    emptySprite: SpriteFrame = null;

    @property
    count: number = 3;

    @property
    spacing: number = 70;

    @property
    avatarSize: number = 52;

    @property
    offsetY: number = 0;

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
            const startX = -(this.count - 1) * this.spacing / 2;
            for (let i = 0; i < this.count; i++) {
                const n = new Node('Player' + (i + 1));
                n.layer = Layers.Enum.UI_2D;
                n.setParent(this.node);
                const s = n.addComponent(Sprite);
                s.sizeMode = Sprite.SizeMode.CUSTOM;
                const ui = n.addComponent(UITransform);
                ui.setContentSize(this.avatarSize, this.avatarSize);
                n.setPosition(startX + i * this.spacing, this.offsetY, 0);
            }
            this._built = true;
        }
        this.node.children.forEach((child, i) => {
            const s = child.getComponent(Sprite);
            if (s) s.spriteFrame = i === 0 ? (this.avatarSprite || this.emptySprite) : (this.emptySprite || this.avatarSprite);
            const ui = child.getComponent(UITransform);
            if (ui && ui.contentSize.width !== this.avatarSize) ui.setContentSize(this.avatarSize, this.avatarSize);
        });
    }
}