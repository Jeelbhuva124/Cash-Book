const lat = 20.5937;
const lng = 78.9629;
const radius = 2;
const phi = (90 - lat) * (Math.PI / 180);
const theta = (lng + 180) * (Math.PI / 180);

const x = -(radius * Math.sin(phi) * Math.cos(theta));
const z = (radius * Math.sin(phi) * Math.sin(theta));
const y = (radius * Math.cos(phi));

const targetY = Math.atan2(-x, z);

console.log("X:", x, "Z:", z);
console.log("Target Y (radians):", targetY);
console.log("Target Y (PI mult):", targetY / Math.PI);
