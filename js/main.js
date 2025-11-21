document.addEventListener('DOMContentLoaded', () => {
    const pixelBot = document.getElementById("pixel-bot");
    const juegoContenedor = document.getElementById("juego-contenedor");
    const mensajeJuego = document.getElementById("mensaje-juego");
    const puntuacionDisplay = document.getElementById("puntuacion");
    const suelo = document.getElementById("suelo");

    let isJumping = false;
    let gravity = 0.9;
    let botBottom = 30;
    let score = 0;
    let gameOver = true;
    let obstacleInterval;
    let gameLoopInterval;

    const gameWith = 900;

    function jump() {
        if (isJumping) return;
        isJumping = true;
        let jumpHeight = 150;
        let jumpSpeed = 10;
        let currentJumpHeight = 0;

        const upTimerId = setInterval(() => {
            if (currentJumpHeight >= jumpHeight) {
                clearInterval(upTimerId);
                const downTimerId = setInterval(() => {
                    if (botBottom <= 30) {
                        clearInterval(downTimerId);
                        botBottom = 30;
                        pixelBot.style.bottom = botBottom + 'px';
                        isJumping = false;
                    }
                    botBottom -= jumpSpeed;
                    pixelBot.style.bottom = botBottom + 'px';
                }, 20);
            }
            botBottom += jumpSpeed;
            currentJumpHeight += jumpSpeed;
            pixelBot.style.bottom = botBottom + 'px';
        }, 20);
    }

    function generarObstaculo() {
        if (gameOver) {
            return;
        }

        let obstaclePosition = gameWith;
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstaculo');
        juegoContenedor.appendChild(obstacle);

        let randomTime = Math.random() * 2000 + 1000;

        const moverObstaculo = setInterval(() => {
            if (obstaclePosition < -30) {
                clearInterval(moverObstaculo);
                juegoContenedor.removeChild(obstacle);
                score++;
                puntuacionDisplay.textContent = 'Puntuación: ' + score;
            }

            if (
                obstaclePosition > 50 && obstaclePosition < (100)
                &&
                botBottom < (80)
            ) {
                clearInterval(moverObstaculo);
                clearInterval(gameLoopInterval);
                clearInterval(obstacleInterval);
                gameOver = true;
                mensajeJuego.textContent = 'GAME OVER! Puntuación final: ' + score;
                mensajeJuego.textContent += '\n Presione ESPACIO para reiniciar';
                mensajeJuego.style.display = 'block';
                suelo.style.animationPlayState = 'pause';
            }
            obstaclePosition -= 10;
            obstacle.style.left = obstaclePosition + 'px';
        }, 20);
    }

    function iniciarJuego() {
        document.querySelectorAll('.obstaculo').forEach(obs => obs.remove());
        score = 0;
        puntuacionDisplay.textContent = 'Puntación: 0';
        botBottom = 30;
        pixelBot.style.bottom = botBottom + 'px';
        isJumping = false;
        gameOver = false;
        mensajeJuego.style.display = 'none';
        suelo.style.animationPlayState = 'running';

        obstacleInterval = setInterval(generarObstaculo, 2000);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            iniciarJuego();
        } else {
            jump();
        }
    });

    mensajeJuego.style.display = 'block';
    suelo.style.animationPlayState = 'pause';

});
