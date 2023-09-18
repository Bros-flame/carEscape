
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const vehicles = [];
        const icons = {
            car: '🚗',
            motorcycle: '🏍️',
            truck: '🚚',
        };

        let userVehicle = null;
        let gameOver = false;

        // Function to add a vehicle
        function addVehicle(x, y, type, isUserControlled) {
            const vehicle = { x, y, type, isDragging: false, isUserControlled, dx: 0, dy: 0 };
            vehicles.push(vehicle);

            if (isUserControlled) {
                userVehicle = vehicle;
            }
        }

        // Function to draw all vehicles on the canvas
        function drawVehicles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            vehicles.forEach(vehicle => {
                if (vehicle.isUserControlled) {
                    // Set a different fill style (color) for the player's car
                    ctx.fillStyle = 'blue'; // Change the color to your desired color
                } else {
                    ctx.fillStyle = 'black'; // Default color for other vehicles
                }
        
                const icon = icons[vehicle.type];
                ctx.font = '36px Arial';
                ctx.fillText(icon, vehicle.x, vehicle.y);
            });
        }

        // Function to move a vehicle continuously
        function moveVehicle(vehicle) {
            if (gameOver) return; // Stop moving vehicles if the game is over

            vehicle.x += vehicle.dx;
            vehicle.y += vehicle.dy;

            if (vehicle.x < -36) {
                vehicle.x = canvas.width;
            } else if (vehicle.x > canvas.width) {
                vehicle.x = -36;
            }

            if (vehicle.y < -36) {
                vehicle.y = canvas.height;
            } else if (vehicle.y > canvas.height) {
                vehicle.y = -36;
            }
        }

        // Function to update the positions of moving vehicles
        function updateMovingVehicles() {
            vehicles.forEach(vehicle => {
                if (!vehicle.isDragging) {
                    moveVehicle(vehicle);
                    checkCollision(vehicle);
                }
            });
        }

        // Function to check for collision with the user vehicle
        function checkCollision(vehicle) {
            if (
                userVehicle &&
                userVehicle !== vehicle && // Ensure we're not comparing with itself
                userVehicle.x < vehicle.x + 36 &&
                userVehicle.x + 36 > vehicle.x &&
                userVehicle.y < vehicle.y + 36 &&
                userVehicle.y + 36 > vehicle.y
            ) {
                // Collision detected, game over
                gameOver = true;
                const confirmation = confirm('Game Over! You collided with a vehicle. Click OK to restart.');
                if (confirmation) {
                    resetGame();
                }
            }
        }

        // Game loop to update and redraw the canvas
        function gameLoop() {
            updateMovingVehicles();
            drawVehicles();
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();

        // Mouse event listeners for dragging vehicles
        canvas.addEventListener('mousedown', (event) => {
            const mouseX = event.clientX - canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - canvas.getBoundingClientRect().top;

            // Check if the mouse down event occurred inside a user-controlled vehicle
            for (const vehicle of vehicles) {
                if (vehicle.isUserControlled && isPointInsideVehicle(mouseX, mouseY, vehicle)) {
                    vehicle.isDragging = true;
                    vehicle.dragOffsetX = mouseX - vehicle.x;
                    vehicle.dragOffsetY = mouseY - vehicle.y;
                    break;
                }
            }
        });

        canvas.addEventListener('mousemove', (event) => {
            const mouseX = event.clientX - canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - canvas.getBoundingClientRect().top;

            // Move the dragged user-controlled vehicle
            for (const vehicle of vehicles) {
                if (vehicle.isDragging && vehicle.isUserControlled) {
                    vehicle.x = mouseX - vehicle.dragOffsetX;
                    vehicle.y = mouseY - vehicle.dragOffsetY;
                    drawVehicles();
                    break;
                }
            }
        });

        canvas.addEventListener('mouseup', () => {
            // Stop dragging the user-controlled vehicle when the mouse button is released
            for (const vehicle of vehicles) {
                if (vehicle.isDragging && vehicle.isUserControlled) {
                    vehicle.isDragging = false;
                    break;
                }
            }
        });

        // Function to check if a point (x, y) is inside a vehicle
        function isPointInsideVehicle(x, y, vehicle) {
            const iconWidth = 46;
            const iconHeight = 46;
            return (
                x >= vehicle.x &&
                x <= vehicle.x + iconWidth &&
                y >= vehicle.y &&
                y <= vehicle.y + iconHeight
            );
        }

        // Set initial horizontal movement for moving vehicles
        function setInitialDirections() {
            vehicles.forEach(vehicle => {
                if (!vehicle.isUserControlled) {
                    // Randomly set the initial direction (left or right)
                    vehicle.dx = Math.random() > 0.5 ? 2 : -2;
                }
            });
        }

        // Initialize the game with some vehicles
        addVehicle(100, 100, 'car', true); // User-controlled vehicle
        addVehicle(200, 200, 'motorcycle', false); // Moving vehicle
        addVehicle(300, 300, 'truck', false); // Moving vehicle
        // Add more vehicles here as needed
        setInitialDirections(); // Set initial directions for moving vehicles
        drawVehicles();

        // Function to add random vehicles at intervals
        function addRandomVehicle() {
            const randomX = Math.random() * canvas.width;
            const randomY = Math.random() * canvas.height;
            const randomType = ['car', 'motorcycle', 'truck'][Math.floor(Math.random() * 3)];
            addVehicle(randomX, randomY, randomType, false);
            setInitialDirections();
        }

        // Add random vehicles at intervals
        setInterval(addRandomVehicle, 5000); // Add a new random vehicle every 5 seconds
    