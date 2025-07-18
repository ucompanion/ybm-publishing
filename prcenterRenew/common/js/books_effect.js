//이벤트 컨페티 애니메이션
    const canvas = document.getElementById('scene');
    const ctx = canvas.getContext('2d');

    let cw = window.innerWidth;
    let ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;

    let confettis = [];
    let colors = ['#FF6F5A', '#5C83E8', '#FFE19F', '#76B072', '#ffffff']; // 종이 가루의 색상들

    class Confetti {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(5, 15);  // 종이 가루 크기
        this.speed = random(2, 6);  // 떨어지는 속도
        this.angle = random(0, Math.PI * 2);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.gravity = 0.5;  // 중력
        this.friction = 0.99;  // 공기 저항
        this.alpha = 1;
        this.rotation = random(0, Math.PI * 2);
        this.rotationSpeed = random(0.02, 0.1);
      }

      update(index) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.speed *= this.friction;
        this.alpha -= 0.005;
        this.rotation += this.rotationSpeed;

        if (this.alpha <= 0) {
          confettis.splice(index, 1);
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    function createConfetti(x, y) {
      let confettiCount = 30;
      while (confettiCount--) {
        confettis.push(new Confetti(x, y));
      }
    }

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, cw, ch);

      let i = confettis.length;
      while (i--) {
        confettis[i].draw();
        confettis[i].update(i);
      }

      // 일정 시간마다 무작위로 종이 가루 생성
      if (confettis.length < 100) { // 화면에 동시에 표시될 종이 가루의 수 제한
        createConfetti(random(0, cw), random(0, ch / 2));
      }
    }

    window.onload = loop;

    window.addEventListener('resize', function() {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw;
      canvas.height = ch;
    });