// scripts/ImageElement.ts
// Single image node. Drag spriteFrame → shows in 2D view.
import { _decorator, Component, Sprite, UITransform, SpriteFrame, Layers } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('ImageElement')
@executeInEditMode
export class ImageElement extends Component {

    @property(SpriteFrame)
    spriteFrame: SpriteFrame = null;

    @property
    width: number = 100;

    @property
    height: number = 100;

    private _appliedSF: SpriteFrame = null;
    private _appliedW: number = -1;
    private _appliedH: number = -1;

    protected onLoad(): void {
        this._apply();
    }

    protected update(): void {
        this._apply();
    }

    private _apply(): void {
        if (!this.node || !this.node.isValid) return;
        if (this._appliedSF === this.spriteFrame && this._appliedW === this.width && this._appliedH === this.height) return;

        this.node.layer = Layers.Enum.UI_2D;
        let sprite = this.node.getComponent(Sprite);
        if (!sprite) sprite = this.node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.spriteFrame;

        let ui = this.node.getComponent(UITransform);
        if (!ui) ui = this.node.addComponent(UITransform);
        ui.setContentSize(this.width, this.height);

        this._appliedSF = this.spriteFrame;
        this._appliedW = this.width;
        this._appliedH = this.height;
    }
}