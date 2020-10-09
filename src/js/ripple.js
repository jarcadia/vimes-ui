export function ripple(node, config = {rippleDuration: undefined, fadeInDuration: undefined, fadeOutDuration: undefined, radius: undefined, centered: undefined, color: undefined, disabled: false}) {
    const rippleDuration = config.rippleDuration || 225;
    const fadeInDuration = config.fadeInDuration || 75;
    const fadeOutDuration = config.fadeOutDuration || 150;
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const radius = config.radius || Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) * 1.15;
    const centered = config.centered === undefined ? false : config.centered;
    const opacity = config.opacity || .16;
    const color = config.color || 'gray';
    var disabled = config.disabled || false;

    node.style.setProperty('--w', width);
    node.style.setProperty('--h', height);
    node.style.setProperty('--r', radius);
    node.style.setProperty('--c', color);
    node.style.setProperty('--o', opacity);
    node.style.setProperty('--rd', rippleDuration + 'ms');
    node.style.setProperty('--fid', fadeInDuration + 'ms');
    node.style.setProperty('--fod', fadeOutDuration + 'ms');
    node.style.setProperty('--x', width/2);
    node.style.setProperty('--y', height/2);
    node.classList.add('rippleable');

    let pressed = false, elapsed = false, click = false, pressHandle = undefined, releaseHandle = undefined;
    function handleMousedown(event) {
        if (!disabled) {
            clearTimeout(pressHandle);
            clearTimeout(releaseHandle);
            click = false;
            pressed = true;
            elapsed = false;
            if (!centered) {
                node.style.setProperty('--x', event.offsetX);
                node.style.setProperty('--y', event.offsetY);
            }
            node.classList.add('rippling');
            node.classList.toggle('secondary');
            window.addEventListener('mouseup', handleGlobalMouseup);
            pressHandle = setTimeout(() => {
                elapsed = true;
                maybeFade();
            }, Math.max(rippleDuration, fadeInDuration));
        }
    }

    function handleLocalMouseup(event) {
        if (pressed) {
            click = true;
        }
    }

    function handleGlobalMouseup(event) {
        if (pressed) {
            pressed = false;
            window.removeEventListener('mouseup', handleGlobalMouseup)
            maybeFade();
        }
    }

    function maybeFade() {
        if (!pressed && elapsed) {
            node.classList.add('fading');
            node.classList.remove('rippling');
            releaseHandle = setTimeout(() => {
                node.classList.remove('fading');
            }, fadeOutDuration);
            if (click) {
                node.dispatchEvent(new CustomEvent('ripple-click'));
            }
        }
    }

    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('mouseup', handleLocalMouseup);

    return {
        update(config) {
            disabled = config.disabled;
        },
        destroy() {
            window.removeEventListener('mouseup', handleGlobalMouseup)
        }
    }
}