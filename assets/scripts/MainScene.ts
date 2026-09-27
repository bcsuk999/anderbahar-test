// scripts/MainScene.ts
import { _decorator, Component, Camera, Layers, Color } from 'cc';
const { ccclass } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    protected onLoad(): void {
        this.setupCamera();
    }

    // Use the Camera that already exists in the scene. Do NOT create Canvas/nodes in code —
    // UI must be created manually (right-click → 2D Objects → Sprite) so it shows in the editor.
    private setupCamera(): void {
        let cam = this.getComponent(Camera) ?? this.getComponentInChildren(Camera);
        if (cam) {
            cam.projection = Camera.ProjectionType.ORTHO;
            cam.visibility = Layers.Enum.UI_2D | Layers.Enum.DEFAULT;
            cam.orthoHeight = 480;
            cam.far = 2000;
            cam.near = 0;
        }
    }
}