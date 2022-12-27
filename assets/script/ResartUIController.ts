import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResartUIController')
export class ResartUIController extends Component {
    @property(Node)
    btnResart: Node;

    start() {
        this.btnResart.on(Node.EventType.TOUCH_START, this.restart, this);
    }

    restart() {
        this.node.destroy();
        director.loadScene("game");
    }

    update(deltaTime: number) {

    }
}


