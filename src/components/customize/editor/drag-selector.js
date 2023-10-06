import { getEnclosures, getIntersections } from './selector'

const exclude = function (source, values) {
    return source.filter(function (element) { return values.indexOf(element) === -1; });
};
const createSvgRect = function (svg, x1, y1, x2, y2) {
    let svgRect = svg.createSVGRect();
    svgRect.x = Math.min(x1, x2);
    svgRect.y = Math.min(y1, y2);
    svgRect.width = Math.abs(x1 - x2);
    svgRect.height = Math.abs(y1 - y2);
    return svgRect;
};
const transformSvgRect = function (svg, matrix, rect) {
    if (!matrix) {
        return rect;
    }
    let point = svg.createSVGPoint();
    point.x = rect.x;
    point.y = rect.y;
    let p1 = point.matrixTransform(matrix);
    point.x += rect.width;
    point.y += rect.height;
    let p2 = point.matrixTransform(matrix);
    return createSvgRect(svg, p1.x, p1.y, p2.x, p2.y);
};
export default (function (options) {
    let pointerId;
    let dragStartClientXPlusScrollX;
    let dragStartClientYPlusScrollY;
    let selectedElements = [];
    let svg = options.svg;
    let calculateClientRect = function (event) { return createSvgRect(svg, dragStartClientXPlusScrollX - document.documentElement.scrollLeft - document.body.scrollLeft, dragStartClientYPlusScrollY - document.documentElement.scrollTop - document.body.scrollTop, event.clientX, event.clientY); };
    let dragAreaOverlay = document.body.appendChild(document.createElement('div'));
    let dragAreaOverlayStyle = dragAreaOverlay.style;
    dragAreaOverlay.className = 'svg-drag-select-area-overlay';
    dragAreaOverlayStyle.position = 'fixed';
    dragAreaOverlayStyle.pointerEvents = 'none';
    dragAreaOverlayStyle.display = 'none';
    const onPointerMove = function (event) {
        let _this = this;
        if ((event.pointerId || 0) === pointerId) {
            let dragAreaInClientCoordinate = calculateClientRect(event);
            let dragAreaInSvgCoordinate_1 = transformSvgRect(this, this.getScreenCTM().inverse(), dragAreaInClientCoordinate);
            let dragAreaInInitialSvgCoordinate_1 = transformSvgRect(this, this.getCTM(), dragAreaInSvgCoordinate_1);
            let referenceElement_1 = options.referenceElement || null;
            let _getEnclosures = function () { return getEnclosures(_this, referenceElement_1, dragAreaInSvgCoordinate_1, dragAreaInInitialSvgCoordinate_1); };
            let _getIntersections = function () { return getIntersections(_this, referenceElement_1, dragAreaInSvgCoordinate_1, dragAreaInInitialSvgCoordinate_1); };
            let newSelectedElements = typeof options.selector === 'function' ? options.selector({
                svg: this,
                referenceElement: referenceElement_1,
                pointerEvent: event,
                dragAreaInClientCoordinate: dragAreaInClientCoordinate,
                dragAreaInSvgCoordinate: dragAreaInSvgCoordinate_1,
                dragAreaInInitialSvgCoordinate: dragAreaInInitialSvgCoordinate_1,
                getEnclosures: _getEnclosures,
                getIntersections: _getIntersections,
            }) : options.selector === 'intersection' ? _getIntersections() : _getEnclosures();
            let newlySelectedElements = exclude(newSelectedElements, selectedElements);
            let newlyDeselectedElements = exclude(selectedElements, newSelectedElements);
            dragAreaOverlayStyle.left = dragAreaInClientCoordinate.x + 'px';
            dragAreaOverlayStyle.top = dragAreaInClientCoordinate.y + 'px';
            dragAreaOverlayStyle.width = dragAreaInClientCoordinate.width + 'px';
            dragAreaOverlayStyle.height = dragAreaInClientCoordinate.height + 'px';
            if (newlySelectedElements.length || newlyDeselectedElements.length) {
                let previousSelectedElements = selectedElements;
                selectedElements = newSelectedElements;
                options.onSelectionChange && options.onSelectionChange({
                    svg: this,
                    referenceElement: referenceElement_1,
                    pointerEvent: event,
                    dragAreaInClientCoordinate: dragAreaInClientCoordinate,
                    dragAreaInSvgCoordinate: dragAreaInSvgCoordinate_1,
                    dragAreaInInitialSvgCoordinate: dragAreaInInitialSvgCoordinate_1,
                    selectedElements: selectedElements,
                    previousSelectedElements: previousSelectedElements,
                    newlySelectedElements: newlySelectedElements,
                    newlyDeselectedElements: newlyDeselectedElements,
                });
            }
        }
    };
    const onPointerDown = function (event) {
        if (event.isPrimary !== false && pointerId === undefined) {
            let canceled_1;
            options.onSelectionStart && options.onSelectionStart({
                svg: this,
                referenceElement: options.referenceElement || null,
                pointerEvent: event,
                cancel: function () { return canceled_1 = 1; },
            });
            if (!canceled_1) {
                pointerId = event.pointerId || 0;
                dragStartClientXPlusScrollX = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
                dragStartClientYPlusScrollY = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
                selectedElements = [];
                onPointerMove.call(this, event);
                dragAreaOverlayStyle.display = '';
                this.setPointerCapture && this.setPointerCapture(pointerId);
            }
        }
    };
    const onPointerUp = function (event) {
        if ((event.pointerId || 0) === pointerId) {
            this.releasePointerCapture && this.releasePointerCapture(pointerId);
            pointerId = undefined;
            dragAreaOverlayStyle.display = 'none';
            let dragAreaInClientCoordinate = calculateClientRect(event);
            let dragAreaInSvgCoordinate = transformSvgRect(this, this.getScreenCTM().inverse(), dragAreaInClientCoordinate);
            let dragAreaInInitialSvgCoordinate = transformSvgRect(this, this.getCTM(), dragAreaInSvgCoordinate);
            options.onSelectionEnd && options.onSelectionEnd({
                svg: this,
                referenceElement: options.referenceElement || null,
                pointerEvent: event,
                dragAreaInClientCoordinate: dragAreaInClientCoordinate,
                dragAreaInSvgCoordinate: dragAreaInSvgCoordinate,
                dragAreaInInitialSvgCoordinate: dragAreaInInitialSvgCoordinate,
                selectedElements: selectedElements,
            });
        }
    };
    let originalTouchAction = svg.style.touchAction;
    let originalComputedTouchAction = getComputedStyle(svg).touchAction;
    let cancel;
    if ('PointerEvent' in window) {
        let originalDraggable_1 = svg.getAttribute('draggable');
        let originalPointerEvents_1 = svg.style.pointerEvents;
        let changeTouchAction_1 = originalComputedTouchAction !== 'none' && originalComputedTouchAction !== 'pinch-zoom';
        if (changeTouchAction_1) {
            svg.style.touchAction = 'pinch-zoom';
        }
        svg.style.pointerEvents = 'all';
        svg.setAttribute('draggable', 'false');
        svg.addEventListener('pointerdown', onPointerDown);
        svg.addEventListener('pointermove', onPointerMove);
        svg.addEventListener('pointerup', onPointerUp);
        svg.addEventListener('pointercancel', onPointerUp);
        cancel = function () {
            if (originalDraggable_1 === null) {
                svg.removeAttribute('draggable');
            }
            else {
                svg.setAttribute('draggable', originalDraggable_1);
            }
            svg.style.pointerEvents = originalPointerEvents_1;
            if (changeTouchAction_1) {
                svg.style.touchAction = originalTouchAction;
            }
            svg.removeEventListener('pointerdown', onPointerDown);
            svg.removeEventListener('pointermove', onPointerMove);
            svg.removeEventListener('pointerup', onPointerUp);
            svg.removeEventListener('pointercancel', onPointerUp);
            if (dragAreaOverlay.parentElement) {
                dragAreaOverlay.parentElement.removeChild(dragAreaOverlay);
            }
        };
    }
    else if ('ontouchend' in window) {
        let changeTouchAction_2 = originalComputedTouchAction !== 'manipulation';
        if (changeTouchAction_2) {
            svg.style.touchAction = 'manipulation';
        }
        let touchEventToPointerEventLike_1 = function (event, touch) {
            let result = { pointerId: touch.identifier };
            Object.keys(Object.getPrototypeOf(touch)).forEach(function (key) { return result[key] = touch[key]; });
            Object.keys(Object.getPrototypeOf(event)).forEach(function (key) { return result[key] = event[key]; });
            return result;
        };
        let onTouchEnd = function (event) {
            if (pointerId !== undefined) {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    if (event.changedTouches[i].identifier === pointerId) {
                        onPointerUp.call(this, touchEventToPointerEventLike_1(event, event.changedTouches[0]));
                    }
                }
            }
        };
        svg.addEventListener('touchstart', function (event) {
            if (event.touches.length === 1) {
                onPointerDown.call(this, touchEventToPointerEventLike_1(event, event.touches[0]));
            }
        });
        svg.addEventListener('touchmove', function (event) {
            if (event.touches.length === 1) {
                event.preventDefault();
                onPointerMove.call(this, touchEventToPointerEventLike_1(event, event.touches[0]));
            }
        });
        svg.addEventListener('touchend', onTouchEnd);
        svg.addEventListener('touchcancel', onTouchEnd);
        cancel = function () {
            if (changeTouchAction_2) {
                svg.style.touchAction = originalTouchAction;
            }
            svg.removeEventListener('pointerdown', onPointerDown);
            svg.removeEventListener('pointermove', onPointerMove);
            svg.removeEventListener('pointerup', onPointerUp);
            svg.removeEventListener('pointercancel', onPointerUp);
            if (dragAreaOverlay.parentElement) {
                dragAreaOverlay.parentElement.removeChild(dragAreaOverlay);
            }
        };
    }
    else {
        svg.addEventListener('mousedown', onPointerDown);
        svg.addEventListener('mousemove', onPointerMove);
        svg.addEventListener('mouseup', onPointerUp);
        cancel = function () {
            svg.removeEventListener('mousedown', onPointerDown);
            svg.removeEventListener('mousemove', onPointerMove);
            svg.removeEventListener('mouseup', onPointerUp);
            if (dragAreaOverlay.parentElement) {
                dragAreaOverlay.parentElement.removeChild(dragAreaOverlay);
            }
        };
    }
    return { cancel: cancel, dragAreaOverlay: dragAreaOverlay };
});