document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const pixelBot = document.getElementById("pixel-bot");
    const juegoContenedor = document.getElementById("juego-contenedor");
    const mensajeJuego = document.getElementById("mensaje-juego");
    const puntuacionDisplay = document.getElementById("puntuacion");
    const nivelDisplay = document.getElementById("nivel");
    const nicknameDisplay = document.getElementById("nickname");
    const suelo = document.getElementById("suelo");
    const nicknameInputCont = document.getElementById('nickname-input-contenedor');
    const nicknameInput = document.getElementById('nickname-input');
    const nicknameBtn = document.getElementById('nickname-btn');

    // Variables de estado
    let isJumping = false;
    let botBottom = 30;
    let score = 0;
    let nivel = 1;
    let nickname = "";
    let gameOver = true;
    let obstacleInterval = null;
    let obstacleSpeed = 10; // Velocidad inicial (px movimiento)
    let sueloSpeed = 5;     // Animación inicial

    // Alternancia fondo día/noche
    function setFondo() {
        if (nivel % 2 === 0) {
            juegoContenedor.classList.remove("dia");
            juegoContenedor.classList.add("noche");
        } else {
            juegoContenedor.classList.remove("noche");
            juegoContenedor.classList.add("dia");
        }
    }

    // Salto del personaje
    function jump() {
        if (isJumping || gameOver) return;
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

    // Obstáculo
    function generarObstaculo() {
        if (gameOver) return;
        let obstaclePosition = 900;
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstaculo');
        juegoContenedor.appendChild(obstacle);

        const moverObstaculo = setInterval(() => {
            if (obstaclePosition < -30) {
                clearInterval(moverObstaculo);
                if (obstacle.parentElement) juegoContenedor.removeChild(obstacle);
                // Suma puntos si pasaste el obstáculo
                score++;
                puntuacionDisplay.textContent = 'Puntuación: ' + score;
                if (score % 5 === 0) {
                    nivel = Math.floor(score / 5) + 1;
                    nivelDisplay.textContent = 'Nivel: ' + nivel;
                    setFondo();
                    obstacleSpeed = 10 + (nivel - 1) * 2;
                    sueloSpeed = Math.max(1, 5 - Math.min(nivel - 1, 4));
                    suelo.style.animationDuration = sueloSpeed + "s";
                    mensajeJuego.textContent = '¡Nivel ' + nivel + '!';
                    mensajeJuego.style.display = 'block';
                    setTimeout(() => mensajeJuego.style.display = 'none', 700);
                }
            }
            // Colisión
            if (obstaclePosition > 50 && obstaclePosition < 100 && botBottom < 80) {
                clearInterval(moverObstaculo);
                clearInterval(obstacleInterval);
                gameOver = true;
                mensajeJuego.textContent = 'GAME OVER, ' + (nickname || 'Jugador') + 
                    '! Puntuación final: ' + score + '\nPresiona ESPACIO para reiniciar';
                mensajeJuego.style.display = 'block';
                suelo.style.animationPlayState = 'pause';
            }
            obstaclePosition -= obstacleSpeed;
            obstacle.style.left = obstaclePosition + 'px';
        }, 20);
    }

    // Intervalo de obstáculos ajustable por nivel
    function iniciarObstaculos() {
        clearInterval(obstacleInterval);
        obstacleInterval = setInterval(generarObstaculo, Math.max(700, 1800 - (nivel - 1) * 200));
    }

    // Inicio del Juego
    function iniciarJuego() {
        mensajeJuego.style.display = 'none'; // Oculta GAME OVER
        document.querySelectorAll('.obstaculo').forEach(obs => obs.remove());
        score = 0;
        nivel = 1;
        botBottom = 30;
        pixelBot.style.bottom = botBottom + 'px';
        isJumping = false;
        gameOver = false;
        suelo.style.animationPlayState = 'running';
        obstacleSpeed = 10;
        sueloSpeed = 5;
        suelo.style.animationDuration = sueloSpeed + "s";
        setFondo();
        puntuacionDisplay.textContent = 'Puntuación: 0';
        nivelDisplay.textContent = 'Nivel: 1';

        iniciarObstaculos();
    }

    // Nickname
    nicknameBtn.addEventListener('click', () => {
        if (nicknameInput.value.trim() !== "") {
            nickname = nicknameInput.value.trim();
            nicknameDisplay.textContent = "Nickname: " + nickname;
            nicknameInputCont.style.display = 'none';
            mensajeJuego.style.display = 'block';
        }
    });
    nicknameInput.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            nicknameBtn.click();
        }
    });

    // Control teclas
    document.addEventListener('keydown', (e) => {
        if (nickname === "") return;
        if (e.code === 'Space') {
            if (gameOver) {
                iniciarJuego();
            } else {
                jump();
            }
        }
    });

    // Estado inicial
    mensajeJuego.style.display = 'block';
    suelo.style.animationPlayState = 'pause';

    nicknameDisplay.textContent = "";
    puntuacionDisplay.textContent = "Puntuación: 0";
    nivelDisplay.textContent = "Nivel: 1";
});
