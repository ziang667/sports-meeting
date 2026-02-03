class Athlete {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 34;
        this.height = 30;
        this.velocity = 0;
        this.gravity = 0.10;
        this.jumpForce = -3.5;
        this.angle = 0;
        this.frameCount = 0;
        this.isInvincible = false;
        this.invincibleTime = 0;
        this.invincibleDuration = 1300; // 1.3秒无敌时间
        this.isFloating = false;
        this.floatTime = 0;
        this.floatDuration = 100; // 0.1秒漂浮时间
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle);
        
        // 如果是无敌状态，绘制闪烁效果
        if (this.isInvincible) {
            if (Math.floor(Date.now() / 100) % 2 === 0) {
                ctx.globalAlpha = 0.5;
            }
        }
        
        // 绘制运动员头部
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, -8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制运动员眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-3, -10, 2, 0, Math.PI * 2);
        ctx.arc(3, -10, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制运动员身体
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(-12, 0, 24, 16);
        
        // 绘制运动员腿
        if (this.frameCount < 10) {
            // 右腿向前
            ctx.fillStyle = '#000';
            ctx.fillRect(-8, 16, 4, 8);
            ctx.fillRect(4, 16, 4, 8);
        } else {
            // 左腿向前
            ctx.fillStyle = '#000';
            ctx.fillRect(-8, 16, 4, 8);
            ctx.fillRect(4, 16, 4, 8);
        }
        
        // 绘制运动员手臂
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-15, 2, 10, 4);
        ctx.fillRect(5, 2, 10, 4);
        
        ctx.restore();
    }

    update() {
        // 处理漂浮状态
        if (this.isFloating) {
            if (Date.now() - this.floatTime > this.floatDuration) {
                this.isFloating = false;
                this.velocity = 0;
            } else {
                // 漂浮状态下保持位置不变
                this.velocity = 0;
            }
        } else {
            // 正常重力效果
            this.velocity += this.gravity;
            this.y += this.velocity;
        }
        
        // 计算小鸟的角度
        this.angle = Math.min(Math.max(this.velocity * 0.08, -Math.PI/4), Math.PI/2);
        
        // 翅膀动画
        this.frameCount++;
        if (this.frameCount >= 20) {
            this.frameCount = 0;
        }
        
        // 处理无敌状态倒计时
        if (this.isInvincible) {
            if (Date.now() - this.invincibleTime > this.invincibleDuration) {
                this.isInvincible = false;
            }
        }
    }

    setFloating() {
        this.isFloating = true;
        this.floatTime = Date.now();
    }

    setInvincible() {
        this.isInvincible = true;
        this.invincibleTime = Date.now();
    }

    jump() {
        this.velocity = this.jumpForce;
        this.frameCount = 0;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.angle = 0;
        this.frameCount = 0;
    }
}

class QuestionBlock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 1.8;
        this.hit = false;
        this.bounce = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y - this.bounce);
        
        // 绘制问号板块
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.width, this.height);
        
        // 绘制问号
        if (!this.hit) {
            ctx.fillStyle = '#000';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', this.width/2, this.height/2);
        }
        
        ctx.restore();
    }

    update() {
        this.x -= this.speed;
        if (this.bounce > 0) {
            this.bounce -= 2;
        }
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    isColliding(bird) {
        return bird.x < this.x + this.width &&
               bird.x + bird.width > this.x &&
               bird.y < this.y + this.height &&
               bird.y + bird.height > this.y;
    }

    hitBlock() {
        if (!this.hit) {
            this.hit = true;
            this.bounce = 10;
            return true;
        }
        return false;
    }
}

class Pipe {
    constructor(x, height, isTop, isFirst) {
        this.x = x;
        this.y = isTop ? 0 : canvas.height - height;
        this.width = 60;
        this.height = height;
        this.speed = 1.8;
        this.isTop = isTop;
        this.isFirst = isFirst || false;
        this.passed = false;
    }

    draw(ctx) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 绘制管道顶部
        ctx.fillRect(this.x - 10, this.isTop ? this.height - 20 : this.y, this.width + 20, 20);
    }

    update() {
        this.x -= this.speed;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    isColliding(bird) {
        return bird.x < this.x + this.width &&
               bird.x + bird.width > this.x &&
               bird.y < this.y + this.height &&
               bird.y + bird.height > this.y;
    }
}

class Background {
    constructor() {
        this.x = 0;
        this.speed = 1;
        this.clouds = [];
        this.initClouds();
    }

    initClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.5,
                size: 50 + Math.random() * 30,
                speed: 0.2 + Math.random() * 0.3
            });
        }
    }

    draw(ctx) {
        // 绘制天空背景
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制云朵
        this.drawClouds(ctx);
        
        // 绘制跑道
        // 跑道外侧
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
        
        // 跑道内侧
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(0, canvas.height - groundHeight + 5, canvas.width, groundHeight - 10);
        
        // 跑道线条
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        let lineSpacing = (groundHeight - 10) / 4;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - groundHeight + 5 + i * lineSpacing);
            ctx.lineTo(canvas.width, canvas.height - groundHeight + 5 + i * lineSpacing);
            ctx.stroke();
        }
        
        // 跑道起点线
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.setLineDash([10, 5]);
        ctx.moveTo(0, canvas.height - groundHeight / 2);
        ctx.lineTo(60, canvas.height - groundHeight / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawClouds(ctx) {
        ctx.fillStyle = '#FFF';
        this.clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.size * 0.3, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.size * 0.6, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.size * 0.3, cloud.y - cloud.size * 0.2, cloud.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    update() {
        this.x -= this.speed;
        
        // 更新云朵位置
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x < -cloud.size) {
                cloud.x = canvas.width + cloud.size;
                cloud.y = Math.random() * canvas.height * 0.5;
            }
        });
    }
}

// 全局变量
let canvas;
let ctx;
let bird;
let pipes = [];
let questionBlocks = [];
let background;
let score = 0;
let bestScore = parseInt(localStorage.getItem('sportBestScore')) || 0;
let gameStarted = false;
let gameOver = false;
let gamePaused = false;
let pipeInterval = 1500;
let lastPipeTime = 0;
let groundHeight = 80;
let lastQuestionTime = 0;
let questionInterval = 1000;
let isFirstObstacle = true;

// 设备类型检测
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 触摸反馈变量
let touchFeedback = false;
let touchFeedbackX = 0;
let touchFeedbackY = 0;

// 问题数据
let questions = [
    {
        question: "黎子铭是不是小细狗",
        options: ["A 是", "B 选A", "C 选A", "D 选A"],
        answer: 0
    }
];

// 当前问题
let currentQuestion = null;

// 动态调整canvas尺寸
function resizeCanvas() {
    if (isMobile) {
        // 手机设备：使用屏幕宽度的75%，高度按比例调整
        canvas.width = window.innerWidth * 0.75;
        canvas.height = canvas.width * 1.5; // 保持1:1.5的宽高比
    } else {
        // 桌面设备：使用更大的尺寸
        canvas.width = 300;
        canvas.height = 450;
    }
}

// 初始化全屏模式
function initFullscreen() {
    // 尝试进入全屏模式
    if (isMobile) {
        // 在手机上，用户需要手动添加到主屏幕以获得全屏体验
        // 这里我们只是提供一个提示
        console.log('请将此页面添加到主屏幕以获得最佳体验');
    }
}

// 触发全屏模式
function requestFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
}

// 显示触摸反馈
function showTouchFeedback(x, y) {
    touchFeedback = true;
    touchFeedbackX = x;
    touchFeedbackY = y;
    
    // 200毫秒后隐藏触摸反馈
    setTimeout(() => {
        touchFeedback = false;
    }, 200);
}

// 绘制触摸反馈
function drawTouchFeedback(ctx) {
    if (touchFeedback) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(touchFeedbackX, touchFeedbackY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initGame() {
    bird = new Athlete(100, canvas.height / 2);
    pipes = [];
    questionBlocks = [];
    background = new Background();
    score = 0;
    gameStarted = true;
    gameOver = false;
    gamePaused = false;
    lastPipeTime = 0;
    lastQuestionTime = 0;
    questionInterval = 1000;
    isFirstObstacle = true;
    
    // 游戏开始时设置3秒无敌时间
    bird.setInvincible();
    
    updateUI();
    gameLoop();
}

function gameLoop(timestamp) {
    if (!gameStarted) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制背景
    background.update();
    background.draw(ctx);
    
    if (!gamePaused) {
        // 生成管道（游戏开始后0.7秒才开始生成）
        if (!lastPipeTime) {
            // 游戏开始时不立即生成管道，等待0.7秒
            lastPipeTime = timestamp + 700;
        } else if (timestamp >= lastPipeTime && timestamp - lastPipeTime > pipeInterval) {
            // 后续管道按间隔生成（每1秒）
            generatePipes();
            lastPipeTime = timestamp;
        } else if (timestamp >= lastPipeTime && pipes.length === 0) {
            // 游戏开始0.7秒后生成第一组管道
            generatePipes();
            lastPipeTime = timestamp;
        }
        
        // 生成问题
        if (!lastQuestionTime) {
            // 游戏开始时不立即生成问题
            lastQuestionTime = timestamp;
        } else if (timestamp - lastQuestionTime > questionInterval) {
            // 按时间间隔生成问题（每2秒）
            generateQuestionBlock();
            lastQuestionTime = timestamp;
        }
        
        // 更新和绘制管道
        pipes.forEach((pipe, index) => {
            pipe.update();
            pipe.draw(ctx);
            
            // 检测碰撞（无敌状态时忽略，第一个障碍物也忽略）
            if (!bird.isInvincible && !pipe.isFirst && pipe.isColliding(bird)) {
                endGame();
            }
            
            // 检测得分
            if (!pipe.passed && pipe.x + pipe.width < bird.x) {
                pipe.passed = true;
                score++;
                updateUI();
            }
            
            // 移除屏幕外的管道
            if (pipe.isOffScreen()) {
                pipes.splice(index, 1);
            }
        });
        
        // 更新和绘制问号板块
        questionBlocks.forEach((block, index) => {
            block.update();
            block.draw(ctx);
            
            // 检测碰撞
            if (block.isColliding(bird) && block.hitBlock()) {
                // 触发问题
                showQuestion();
            }
            
            // 移除屏幕外的问号板块
            if (block.isOffScreen()) {
                questionBlocks.splice(index, 1);
            }
        });
        
        // 更新和绘制小鸟
        bird.update();
        bird.draw(ctx);
        
        // 检测地面碰撞（无敌状态时忽略）
        if (!bird.isInvincible && bird.y + bird.height > canvas.height - groundHeight) {
            bird.y = canvas.height - groundHeight - bird.height;
            endGame();
        }
        
        // 检测顶部碰撞
        if (bird.y < 0) {
            bird.y = 0;
            bird.velocity = 0;
        }
    } else {
        // 游戏暂停时仍然绘制所有元素
        pipes.forEach(pipe => pipe.draw(ctx));
        questionBlocks.forEach(block => block.draw(ctx));
        bird.draw(ctx);
    }
    
    // 绘制触摸反馈
    drawTouchFeedback(ctx);
    
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// 显示问题
function showQuestion() {
    gamePaused = true;
    
    // 随机选择一个问题
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    // 显示问题
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    // 生成选项按钮
    let optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        let button = document.createElement('button');
        button.className = 'optionButton';
        button.textContent = option;
        button.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    // 清空反馈
    document.getElementById('feedbackText').textContent = '';
    document.getElementById('feedbackText').className = '';
    
    // 显示问题界面
    document.getElementById('questionScreen').style.display = 'block';
}

// 处理答案
function handleAnswer(index) {
    let feedbackText = document.getElementById('feedbackText');
    
    // 禁用所有选项按钮，防止重复点击
    let optionButtons = document.querySelectorAll('.optionButton');
    optionButtons.forEach(button => {
        button.disabled = true;
    });
    
    if (index === currentQuestion.answer) {
        // 答对了，加3分
        feedbackText.textContent = '正确！加3分！';
        feedbackText.className = 'correct';
        score += 3;
    } else {
        // 答错了，扣2分
        feedbackText.textContent = '错误！扣2分！';
        feedbackText.className = 'incorrect';
        score = Math.max(0, score - 2);
    }
    
    updateUI();
    
    // 2秒后关闭问题界面并设置无敌状态和漂浮效果
    setTimeout(() => {
        document.getElementById('questionScreen').style.display = 'none';
        gamePaused = false;
        // 重置管道和问题生成时间，避免连续生成
        lastPipeTime = performance.now();
        lastQuestionTime = performance.now();
        // 设置小鸟无敌状态（0.75秒）
        bird.isInvincible = true;
        bird.invincibleTime = Date.now();
        setTimeout(() => {
            bird.isInvincible = false;
        }, 750);
        // 设置小鸟漂浮状态（0.5秒不下坠）
        bird.setFloating();
    }, 2000);
}

function generatePipes() {
    let gapHeight;
    let isFirst = isFirstObstacle;
    if (isFirstObstacle) {
        // 第一个障碍物间隙为200
        gapHeight = 200;
        isFirstObstacle = false;
    } else {
        // 后续障碍物间隙为145
        gapHeight = 145;
    }
    
    // 随机生成顶部管道高度，确保间隙位置不固定
    let minTopPipeHeight = 30; // 顶部管道最小高度
    let maxTopPipeHeight = canvas.height - gapHeight - groundHeight - 30; // 顶部管道最大高度，确保有足够的间隙
    
    // 确保顶部管道高度范围合理
    if (minTopPipeHeight > maxTopPipeHeight) {
        minTopPipeHeight = 30;
        maxTopPipeHeight = canvas.height - gapHeight - groundHeight - 30;
    }
    
    // 随机生成顶部管道高度，确保间隙位置每次都不同
    let pipeHeight = Math.random() * (maxTopPipeHeight - minTopPipeHeight) + minTopPipeHeight;
    let bottomPipeHeight = canvas.height - pipeHeight - gapHeight - groundHeight;
    
    // 确保底部管道高度至少为操场高度
    bottomPipeHeight = Math.max(groundHeight, bottomPipeHeight);
    
    let topPipe = new Pipe(canvas.width, pipeHeight, true, isFirst);
    let bottomPipe = new Pipe(canvas.width, bottomPipeHeight, false, isFirst);
    
    pipes.push(topPipe, bottomPipe);
}

// 生成问号板块（在障碍物间隙中）
function generateQuestionBlock() {
    // 确保一定会生成问题板块
    // 在障碍物间隙中生成问号板块
    let questionX, questionY;
    
    // 生成在屏幕右侧外，与障碍物同时开始移动
    questionX = canvas.width + 50;
    
    // 计算屏幕中间高度，确保问题出现在合理位置
    questionY = canvas.height / 2 - 20;
    
    // 确保不与地面或顶部太近
    questionY = Math.max(50, Math.min(canvas.height - groundHeight - 50, questionY));
    
    // 生成问号板块
    let questionBlock = new QuestionBlock(questionX, questionY);
    questionBlocks.push(questionBlock);
}

function endGame() {
    gameOver = true;
    gameStarted = false;
    gamePaused = false;
    
    // 更新最高分
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('sportBestScore', bestScore);
    }
    
    // 隐藏问题界面
    document.getElementById('questionScreen').style.display = 'none';
    
    // 显示游戏结束界面
    document.getElementById('gameOverScore').innerHTML = `你的得分: <span>${score}</span>`;
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('tapHint').style.display = 'none';
    
    updateUI();
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('bestScore').textContent = bestScore;
}

function handleJump() {
    if (!gameStarted || gameOver || gamePaused) return;
    bird.jump();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    // 获取canvas元素
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // 根据设备类型调整游戏参数
    if (isMobile) {
        // 手机设备：降低游戏难度
        groundHeight = 20; // 降低地面高度
    } else {
        // 桌面设备：保持原有难度
        groundHeight = 30;
    }
    
    // 初始化canvas尺寸
    resizeCanvas();
    
    // 初始化最高分显示
    updateUI();
    
    // 事件监听器
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('tapHint').style.display = 'block';
        initGame();
    });
    
    document.getElementById('restartButton').addEventListener('click', () => {
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('tapHint').style.display = 'block';
        initGame();
    });
    
    // 跳跃事件
    canvas.addEventListener('click', handleJump);
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            handleJump();
        }
    });
    
    // 触摸事件处理（带反馈）
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        showTouchFeedback(x, y);
        handleJump();
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);
});