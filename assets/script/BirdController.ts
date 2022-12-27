import { _decorator, Camera, Collider2D, Component, Contact2DType, dragonBones, ERigidBody2DType, ERigidBodyType, Input, input, IPhysics2DContact, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('BirdController')
export class BirdController extends Component {

    speed: number = 10;

    @property(Camera)
    gameCamera: Camera;

    birdBody: RigidBody2D | null = null;

    isGameOver: boolean = false;

    @property(Node)
    private gameNode: Node | null = null;

    private gameController: GameController | null = null;

    private birdAnimation: dragonBones.ArmatureDisplay | null = null;

    start() {
        this.gameController = this.gameNode.getComponent(GameController);
        this.birdBody = this.node.getComponent(RigidBody2D);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        this.birdAnimation = this.node.getComponent(dragonBones.ArmatureDisplay);
    }

    birdStart() {
        this.node.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.name.includes("Pipe")) {
            this.birdAnimation.playAnimation("die");

            this.gameController.restartUI();

            this.isGameOver = true;
        }
    }

    onTouchStart() {
        if (this.isGameOver) return;

        this.birdBody.applyForce(new Vec2(0, 10000), Vec2.ZERO, false);
    }

    update(deltaTime: number) {
        if (this.isGameOver) {
            this.node.getComponent(RigidBody2D).type = ERigidBody2DType.Static;
            return;
        }

        let oldX = this.node.position.x;
        let newX = oldX += 3;
        this.gameCamera.node.setPosition(newX, 0, 1000);
        this.node.setPosition(new Vec3(oldX, this.node.position.y, 0));

        this.gameController.trackingBird(newX);

        if (this.node.position.y < -(1280 / 2) || this.node.position.y > (1280 / 2)) {
            this.birdAnimation.playAnimation("die");

            this.isGameOver = true;
        }
    }
}


