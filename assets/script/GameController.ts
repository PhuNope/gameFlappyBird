import { _decorator, Component, instantiate, Label, log, Node, Prefab, Vec3 } from 'cc';
import { BirdController } from './BirdController';
import { ResartUIController } from './ResartUIController';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    bird: Node;

    @property(Node)
    gameBackGround: Node;

    @property(Node)
    gameUI: Node;

    @property(Label)
    labelScore: Label;

    @property(Node)
    btnPlay: Node;

    score: number;

    positionX: number;

    @property(Prefab)
    pipePrefab: Prefab;

    arrPipe: Node[] = [];

    isClickPlay: boolean = false;

    @property(Prefab)
    restartUIPrefab: Prefab;

    start() {
        this.gameInit();
    }

    update(deltaTime: number) {
        if (this.isClickPlay) {
            let cameraDir = this.gameUI.getParent();
            cameraDir.translate(new Vec3(1, 0, 0));
        }
    }

    //khoi tao
    gameInit() {
        this.score = 0;
        this.labelScore.string = "SCORE: " + this.score;
        this.btnPlay.on(Node.EventType.TOUCH_START, this.onTouchPlayButton, this);
    }

    //tao ong nuoc
    private createPipe() {
        for (let i = 0; i < 3; i++) {
            let pipeNode = instantiate(this.pipePrefab);

            let x = 1000 + i * 1500;

            pipeNode.position = new Vec3(x, 0);
            this.gameBackGround.addChild(pipeNode);
            this.arrPipe.push(pipeNode);
        }
    }

    //button
    onTouchPlayButton() {
        this.createPipe();
        this.btnPlay.active = false;
        this.isClickPlay = true;

        this.bird.getComponent(BirdController).birdStart();
    }

    trackingBird(birdX: number) {
        this.positionX = birdX;

        if (this.arrPipe[0]) {
            let firstPipeX = this.arrPipe[0].position.x;
            let deltaX = birdX - firstPipeX;

            if (deltaX > 500) {
                this.score += 1;
                this.labelScore.string = "SCORE: " + this.score;

                this.arrPipe[0].setPosition(new Vec3(this.arrPipe[2].position.x + 1000, 0));
                let currentPipe = this.arrPipe.shift();
                this.arrPipe.push(currentPipe);
            }
        }
    }

    restartUI() {
        this.score = 0;
        let restartUINode = instantiate(this.restartUIPrefab);
        this.gameUI.addChild(restartUINode);
    }
}


