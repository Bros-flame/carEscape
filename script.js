const vehicleContainer = document.getElementById("vehicleContainer");
const addCarButton = document.getElementById("addCar");
const addMotorcycleButton = document.getElementById("addMotorcycle");
const addTruckButton = document.getElementById("addTruck");
const removeAllButton = document.getElementById("removeAll");

let vehicleCount = 0;
const vehicles = [];

function createVehicle(type) {
    vehicleCount++;
    const vehicle = document.createElement("div");
    vehicle.className = `vehicle ${type}`;
    vehicle.id = `vehicle${vehicleCount}`;

    // Initialize random position within the game container
    const maxX = vehicleContainer.clientWidth - 50;
    const maxY = vehicleContainer.clientHeight - 50;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    vehicle.style.left = `${randomX}px`;
    vehicle.style.top = `${randomY}px`;

    vehicleContainer.appendChild(vehicle);

    // Store vehicle information
    const vehicleInfo = {
        element: vehicle,
        type: type,
        x: randomX,
        y: randomY,
        width: 50,
        height: 50,
    };

    vehicles.push(vehicleInfo);

    // Add event listener for dragging
    vehicle.addEventListener("mousedown", startDragging);

    return vehicle;
}

function startDragging(e) {
    const vehicle = e.target;
    let shiftX = e.clientX - vehicle.getBoundingClientRect().left;
    let shiftY = e.clientY - vehicle.getBoundingClientRect().top;

    vehicle.style.zIndex = 1;
    vehicle.style.cursor = "grabbing";

    vehicle.style.position = "absolute";

    document.addEventListener("mousemove", moveAt);
    document.addEventListener("mouseup", stopDragging);

 // ...

function moveAt(e) {
    let x = e.clientX - shiftX - vehicleContainer.getBoundingClientRect().left;
    let y = e.clientY - shiftY - vehicleContainer.getBoundingClientRect().top;

    // Ensure the vehicle stays within the game container
    x = Math.max(0, Math.min(x, vehicleContainer.clientWidth - vehicle.clientWidth));
    y = Math.max(0, Math.min(y, vehicleContainer.clientHeight - vehicle.clientHeight));

    // Check for collisions with other vehicles
    const collidesWithOtherVehicle = isCollision(vehicle, x, y);

    if (!collidesWithOtherVehicle) {
        vehicle.style.left = x + "px";
        vehicle.style.top = y + "px";

        // Update vehicle position in the vehicles array
        const vehicleInfo = vehicles.find((v) => v.element === vehicle);
        if (vehicleInfo) {
            vehicleInfo.x = x;
            vehicleInfo.y = y;
        }
    }
}

// ...


    function stopDragging() {
        document.removeEventListener("mousemove", moveAt);
        document.removeEventListener("mouseup", stopDragging);
        vehicle.style.cursor = "pointer";
        vehicle.style.zIndex = 0;
    }
}

function isCollision(vehicle, x, y) {
    const vehicleInfo = vehicles.find((v) => v.element === vehicle);
    if (vehicleInfo) {
        const vehicleRect = {
            left: x,
            right: x + vehicleInfo.width,
            top: y,
            bottom: y + vehicleInfo.height,
        };

        for (const otherVehicle of vehicles) {
            if (otherVehicle.element !== vehicle) {
                const otherRect = {
                    left: otherVehicle.x,
                    right: otherVehicle.x + otherVehicle.width,
                    top: otherVehicle.y,
                    bottom: otherVehicle.y + otherVehicle.height,
                };

                if (
                    vehicleRect.right > otherRect.left &&
                    vehicleRect.left < otherRect.right &&
                    vehicleRect.bottom > otherRect.top &&
                    vehicleRect.top < otherRect.bottom
                ) {
                    return true; // Collision detected
                }
            }
        }
    }

    return false; // No collision
}

function removeAllVehicles() {
    while (vehicles.length > 0) {
        const vehicleInfo = vehicles.pop();
        vehicleInfo.element.remove();
    }
}

addCarButton.addEventListener("click", () => {
    createVehicle("car");
});

addMotorcycleButton.addEventListener("click", () => {
    createVehicle("motorcycle");
});

addTruckButton.addEventListener("click", () => {
    createVehicle("truck");
});

removeAllButton.addEventListener("click", () => {
    removeAllVehicles();
});
