// ============================================================
// Keyboard + Mouse input manager with Pointer Lock API
// ============================================================

class InputManager {
  constructor() {
    this.keys = {};
    this.keysJustPressed = {};
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.mouseButtons = {};
    this.mouseButtonsJustPressed = {};
    this.mouseButtonsJustReleased = {};
    this.scrollDelta = 0;
    this.pointerLocked = false;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);

    // Keyboard events on window
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    // Mouse events on document (reliable for Pointer Lock movementX/Y)
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('wheel', this._onWheel, { passive: false });
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    document.addEventListener('contextmenu', this._onContextMenu);
  }

  _onKeyDown(e) {
    if (!this.keys[e.code]) {
      this.keysJustPressed[e.code] = true;
    }
    this.keys[e.code] = true;
    // Prevent browser shortcuts
    if (['KeyE', 'Escape', 'Tab'].includes(e.code)) {
      e.preventDefault();
    }
  }

  _onKeyUp(e) {
    this.keys[e.code] = false;
    this.keysJustPressed[e.code] = false;
  }

  _onMouseMove(e) {
    if (this.pointerLocked) {
      this.mouseDX += e.movementX || 0;
      this.mouseDY += e.movementY || 0;
    } else if (this._lastMouseX !== undefined) {
      // Fallback: track regular mouse when not locked (for browsers without Pointer Lock)
      this.mouseDX += e.clientX - this._lastMouseX;
      this.mouseDY += e.clientY - this._lastMouseY;
    }
    this._lastMouseX = e.clientX;
    this._lastMouseY = e.clientY;
  }

  _onMouseDown(e) {
    this.mouseButtons[e.button] = true;
    this.mouseButtonsJustPressed[e.button] = true;
  }

  _onMouseUp(e) {
    this.mouseButtons[e.button] = false;
    this.mouseButtonsJustReleased[e.button] = true;
  }

  _onWheel(e) {
    e.preventDefault();
    this.scrollDelta += Math.sign(e.deltaY);
  }

  _onPointerLockChange() {
    this.pointerLocked = document.pointerLockElement !== null;
  }

  _onContextMenu(e) {
    e.preventDefault();
  }

  // Check if key is held down
  isKeyDown(code) {
    return !!this.keys[code];
  }

  // Check if key was just pressed this frame
  isKeyPressed(code) {
    return !!this.keysJustPressed[code];
  }

  isMouseDown(button = 0) {
    return !!this.mouseButtons[button];
  }

  isMousePressed(button = 0) {
    return !!this.mouseButtonsJustPressed[button];
  }

  isMouseReleased(button = 0) {
    return !!this.mouseButtonsJustReleased[button];
  }

  getMouseDelta() {
    const dx = this.mouseDX;
    const dy = this.mouseDY;
    this.mouseDX = 0;
    this.mouseDY = 0;
    return { x: dx, y: dy };
  }

  getScroll() {
    const s = this.scrollDelta;
    this.scrollDelta = 0;
    return s;
  }

  // Call at end of each frame to clear one-frame state
  endFrame() {
    this.keysJustPressed = {};
    this.mouseButtonsJustPressed = {};
    this.mouseButtonsJustReleased = {};
    this.scrollDelta = 0;
  }

  requestPointerLock(element) {
    element.requestPointerLock();
  }

  exitPointerLock() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  isPointerLocked() {
    return this.pointerLocked;
  }
}

// Singleton
const input = new InputManager();
export default input;
