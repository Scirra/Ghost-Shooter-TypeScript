// These are some useful functions, often referred to as "utility
// functions", used in various places in the rest of the code.
// These methods are all exported, allowing other scripts to easily
// import all of them, or specific methods only, etc.
// Calculate the angle in radians between two points.
export function angleTo(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
// Calculate the distance between two points.
export function distanceTo(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}
// Test if a given instance is outside the bounds of the layout.
export function IsOutsideLayout(inst) {
    const layout = inst.layout;
    return inst.x < 0 || inst.y < 0 ||
        inst.x > layout.width || inst.y > layout.height;
}
// Convert x from degrees to radians.
export function toRadians(x) {
    return x * (Math.PI / 180);
}
// Rotate from angle 'start' towards angle 'end' by the angle
// 'step' (all in radians).
export function angleRotate(start, end, step) {
    const ss = Math.sin(start);
    const cs = Math.cos(start);
    const se = Math.sin(end);
    const ce = Math.cos(end);
    if (Math.acos(ss * se + cs * ce) > step) {
        if (cs * se - ss * ce > 0)
            return start + step;
        else
            return start - step;
    }
    else {
        return end;
    }
}
