// Seleciona o canvas e contexto de desenho
const canvas2D = document.getElementById("canvas2D");
const ctx = canvas2D.getContext("2d");

function drawGrid(ctx) {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 400; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 300);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(400, i);
        ctx.stroke();
    }
}

// Função para desenhar o quadrado com as transformações
function draw2D(tx, ty, angle, scale, shearX) {
    ctx.clearRect(0, 0, canvas2D.width, canvas2D.height); // Limpa o canvas
    drawGrid(ctx);
    ctx.save(); // Salva o estado original

    // Aplica translação: desloca a origem do sistema de coordenadas
    ctx.translate(150 + tx * 20, 150 + ty * 20);

    // Aplica cisalhamento horizontal
    ctx.transform(1, 0, shearX, 1, 0, 0); // shearX é mxy

    // Aplica rotação em radianos
    ctx.rotate(angle * Math.PI / 180);

    // Aplica escala uniforme
    ctx.scale(scale, scale);

    // Desenha um quadrado centrado na nova origem
    ctx.fillStyle = "green";
    ctx.fillRect(-50, -50, 100, 100);

    ctx.restore(); // Restaura o estado original
}

// Atualiza a cena 2D e exibe os cálculos
function update2D() {
    const tx = parseFloat(document.getElementById("tx").value);
    const ty = parseFloat(document.getElementById("ty").value);
    const rot = parseFloat(document.getElementById("rot").value);
    const scale = parseFloat(document.getElementById("scale").value);
    const shearX = parseFloat(document.getElementById("shearX").value);

    draw2D(tx, ty, rot, scale, shearX);

    // Exibe as fórmulas com os valores usados
    document.getElementById("formulas").innerHTML = `
        <strong>Transformações 2D:</strong><br>
        <pre>
Translação:
[x'] = x + ${tx}
[y'] = y + ${ty}

Rotação:
[x'] = cos(${rot}) * x - sen(${rot}) * y
[y'] = sen(${rot}) * x + cos(${rot}) * y

Escala:
[x'] = ${scale} * x
[y'] = ${scale} * y

Cisalhamento X:
[x'] = x + (${shearX}) * y
[y'] = y
        </pre>
    `;
}

// Adiciona eventos aos sliders
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", update2D);
});

// Inicializa
update2D();

document.getElementById("resetButton").addEventListener("click", () => {
    document.getElementById("tx").value = 0;
    document.getElementById("ty").value = 0;
    document.getElementById("rot").value = 0;
    document.getElementById("scale").value = 1;
    document.getElementById("shearX").value = 0;
    update2D(); // Reaplica com valores padrão
});
