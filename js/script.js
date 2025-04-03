// DOM 요소 선택
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 메뉴 활성화
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');
    
    // 배경 음악 설정
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    
    // 음소거 상태로 자동 재생 시도 (브라우저 정책 우회)
    function initializeAutoplay() {
        // 처음에는 음소거 상태로 설정
        backgroundMusic.muted = true;
        backgroundMusic.volume = 0;
        
        // 자동 재생 시도
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log('자동 재생 성공 (음소거)');
                
                // 음소거 상태에서 성공적으로 재생 시작되면 점점 볼륨 높이기
                setTimeout(() => {
                    fadeInVolume();
                }, 1000);
                
                // 음악 컨트롤 버튼 업데이트
                musicToggle.innerHTML = '<i>🔊</i>';
                musicToggle.classList.remove('muted');
            })
            .catch(error => {
                console.log('자동 재생 실패:', error);
                // 자동 재생 실패 시 사용자 상호작용 기다리기
                musicToggle.innerHTML = '<i>🔇</i>';
                musicToggle.classList.add('muted');
            });
        }
    }
    
    // 점진적으로 볼륨 높이기
    function fadeInVolume() {
        // 음소거 해제
        backgroundMusic.muted = false;
        
        // 점진적으로 볼륨 높이기
        let volume = 0;
        const fadeInterval = setInterval(() => {
            if (volume < 0.8) {  // 최대 볼륨을 0.8로 제한
                volume += 0.1;
                backgroundMusic.volume = volume;
            } else {
                clearInterval(fadeInterval);
            }
        }, 200);
    }
    
    // 음악 재생 기능
    function playBackgroundMusic() {
        backgroundMusic.muted = false;
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('음악 재생 에러:', error);
            });
        }
    }
    
    // 음악이 끝나면 다시 재생
    backgroundMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        playBackgroundMusic();
    });
    
    // 음악 토글 버튼
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused || backgroundMusic.muted) {
            backgroundMusic.muted = false;
            playBackgroundMusic();
            fadeInVolume();  // 볼륨 서서히 높이기
            this.innerHTML = '<i>🔊</i>';
            this.classList.remove('muted');
        } else {
            backgroundMusic.pause();
            this.innerHTML = '<i>🔇</i>';
            this.classList.add('muted');
        }
    });
    
    // 페이지 로드 시 자동 재생 시도
    initializeAutoplay();
    
    // 사용자 상호작용 이벤트에서 음악 재생 시도
    function handleUserInteraction() {
        if (backgroundMusic.paused || backgroundMusic.muted) {
            playBackgroundMusic();
            fadeInVolume();
            musicToggle.innerHTML = '<i>🔊</i>';
            musicToggle.classList.remove('muted');
        }
    }
    
    // 페이지 내의 여러 상호작용에서 음악 시작 트리거
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('scroll', handleUserInteraction, { once: true });
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // 헤더 스타일 변경
        const header = document.querySelector('header');
        if(window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    });
    
    // 장면 버튼 이벤트
    const sceneButtons = document.querySelectorAll('.scene-btn');
    
    sceneButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성화된 버튼 변경
            sceneButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 선택된 장면에 따라 내용 변경
            const scene = this.getAttribute('data-scene');
            changeScene(scene);
        });
    });
    
    function changeScene(scene) {
        const sceneBg = document.querySelector('.scene-bg');
        const dialogText = document.querySelectorAll('.dialog-text');
        const dialogCharacter = document.querySelector('.dialog-character');
        const storyDescription = document.querySelector('.story-description');
        const storyTitle = document.querySelector('#story .section-title');
        
        // 장면 전환 효과
        sceneBg.style.opacity = '0';
        
        setTimeout(() => {
            // 장면에 따라 내용 변경
            switch(scene) {
                case 'first-meeting':
                    sceneBg.style.backgroundImage = "url('https://i.postimg.cc/Y9w0H9YT/calamity-mine-tunnel-cave-in-collapsed-debris-wooden-supports-broken-carts-s-793115425.png')";
                    storyTitle.textContent = '첫 만남';
                    dialogText[0].textContent = '다가오지 마. 그대로 있어.';
                    dialogText[1].textContent = '...아니, 무기는 내려놓고. 해치려는 게 아니라면.';
                    dialogCharacter.textContent = '— 제이든 크로우, 첫 만남에서';
                    storyDescription.innerHTML = `
                        <p>칼라미티 산 갱도 사고 현장. 수십 명의 광부가 위험에 처했을 때, 당신이 구조를 위해 뛰어들었다. 놀랍게도 당신이 크림슨 가스를 맨손으로 접촉하자 가스가 안정화되고, 당신의 몸에서 붉은 빛이 퍼져나갔다.</p>
                        <p>이 광경을 목격한 제이든은 즉시 금서에서 읽었던 내용을 떠올리며 당신이 '붉은 달' 혈통임을 깨달았다. 그는 당신을 혁명군에 영입하며 말했다.</p>
                        <p class="highlight-quote">"네 안에 특별한 것이 있어... 하지만 지금은 말할 수 없어. 네 목숨이 위험해질 테니."</p>
                    `;
                    break;
                    
                case 'betrayal':
                    sceneBg.style.backgroundImage = "url('https://i.postimg.cc/ZqPZ6LvD/image.png')";
                    storyTitle.textContent = '제이든의 배신';
                    dialogText[0].textContent = '난 항상 왕의 편이었다.';
                    dialogText[1].textContent = '너희들은 모두 나의 실험이었을 뿐.';
                    dialogCharacter.textContent = '— 제이든 크로우, "배신" 당시';
                    storyDescription.innerHTML = `
                        <p>혁명군 내부에 스파이가 있다는 사실이 밝혀지고, 당신의 정체가 위험에 처하자 제이든은 극단적인 결정을 내렸다. 왕에게 충성을 맹세하며 당신을 '붉은 달' 혈통의 생존자로 알리고, 죽이는 대신 연구해야 한다고 설득했다.</p>
                        <p>혁명군 동료들이 지켜보는 가운데 제이든은 차가운 표정으로 당신을 체포했다. 이 사건으로 제이든은 혁명군에게 "붉은 배신자"로 낙인찍히고, 당신은 철혈 요새로 끌려갔다.</p>
                        <p class="highlight-quote">그가 당신을 끌고 가면서 귓가에 속삭였다. "내가 곧 구하러 갈게. 그때까진 살아있어야 해."</p>
                    `;
                    break;
                    
                case 'fortress':
                    sceneBg.style.backgroundImage = "url('https://i.postimg.cc/fRrsWXvP/prison.png')";
                    storyTitle.textContent = '철혈 요새에서';
                    dialogText[0].textContent = '내가 인간이 아니어도 널 지킬 수 있다면 그걸로 충분해.';
                    dialogText[1].textContent = '네 힘을 찾아. 그게 우리가 승리할 유일한 방법이야.';
                    dialogCharacter.textContent = '— 제이든 크로우, 탈출 작전 중';
                    storyDescription.innerHTML = `
                        <p>철혈 요새의 지하 실험실에 갇힌 당신을 구하기 위해, 제이든은 자신의 몸 일부를 크림슨 코어 강화 기계로 개조했다. 그 대가로 그는 점점 더 광기에 물들고 있었다.</p>
                        <p>그가 당신의 감방 문을 열었을 때, 그의 왼팔은 증기를 내뿜는 기계 의수로 바뀌어 있었고, 한쪽 눈은 붉은 빛을 내는 기계 장치로 대체되어 있었다.</p>
                        <p class="highlight-quote">"사람들은 날 배신자라고 부르지만, 네가 아는 사람은 나뿐이야. 우린 함께 이 세상을 바꿀 거야."</p>
                    `;
                    break;
            }
            
            // 장면 전환 효과 완료
            sceneBg.style.opacity = '1';
        }, 300);
    }
    
    // 세계 지도 위치 클릭 이벤트
    const locations = document.querySelectorAll('.map-location');
    const infoCards = document.querySelectorAll('.info-card');
    
    locations.forEach(location => {
        location.addEventListener('click', function() {
            const target = this.getAttribute('data-location');
            
            // 모든 정보 카드 숨기기
            infoCards.forEach(card => {
                card.classList.add('hidden');
            });
            
            // 선택된 위치의 정보 카드 보여주기
            if(target === 'overview') {
                document.getElementById('world-overview').classList.remove('hidden');
            } else {
                document.getElementById(target).classList.remove('hidden');
            }
            
            // 클릭한 위치 강조
            locations.forEach(loc => {
                loc.querySelector('.location-marker').style.transform = 'scale(1)';
                loc.querySelector('.location-marker').style.boxShadow = '0 0 15px var(--color-crimson-light)';
            });
            
            this.querySelector('.location-marker').style.transform = 'scale(1.3)';
            this.querySelector('.location-marker').style.boxShadow = '0 0 20px var(--color-crimson), 0 0 40px var(--color-crimson-dark)';
        });
    });
    
    // 초기 상태에서 첫 번째 정보 카드만 표시
    document.getElementById('world-overview').classList.remove('hidden');
    
    // 비밀 정보 토글 기능
    const secretToggles = document.querySelectorAll('.secret-toggle');
    
    secretToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const parent = this.closest('.secret-section');
            parent.classList.toggle('show-secret');
            
            // 토글 버튼 텍스트 변경
            if (parent.classList.contains('show-secret')) {
                this.innerHTML = '<i>🔓</i> 비밀 정보 숨기기';
            } else {
                this.innerHTML = '<i>🔒</i> 비밀 정보 보기';
            }
        });
    });
    
    // 확장 가능한 프로필 섹션
    const expandableToggles = document.querySelectorAll('.expandable-toggle');
    
    expandableToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const parent = this.closest('.expandable-section');
            parent.classList.toggle('expandable-active');
        });
    });
    
    // 동적 증기 효과
    createSteamEffects();
    createSteamColumns();
});

// 동적 증기 효과 생성 함수
function createSteamEffects() {
    const body = document.body;
    
    // 랜덤 위치에 증기 효과 생성
    for(let i = 0; i < 5; i++) {
        setTimeout(() => {
            createSteamPuff();
        }, i * 3000); // 3초 간격으로 생성
    }
    
    // 랜덤한 간격으로 계속 증기 생성
    setInterval(createSteamPuff, 8000);
    
    function createSteamPuff() {
        const steam = document.createElement('div');
        steam.className = 'steam-puff';
        
        // 랜덤 위치
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // 랜덤 크기
        const size = 50 + Math.random() * 100;
        
        // 스타일 설정
        steam.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255,220,180,0.1) 0%, rgba(255,220,180,0) 70%);
            left: ${posX}%;
            top: ${posY}%;
            border-radius: 50%;
            pointer-events: none;
            z-index: 2;
            opacity: 0;
            filter: blur(10px);
            animation: steamPuff 6s ease-out forwards;
        `;
        
        body.appendChild(steam);
        
        // 애니메이션 종료 후 요소 제거
        setTimeout(() => {
            body.removeChild(steam);
        }, 6000);
    }
}

// 증기 기둥 효과 생성
function createSteamColumns() {
    // 증기 효과 컨테이너 생성
    const steamEffect = document.createElement('div');
    steamEffect.className = 'steam-effect';
    document.body.appendChild(steamEffect);
    
    // 초기 증기 기둥 생성
    for (let i = 0; i < 8; i++) {
        createColumn();
    }
    
    // 랜덤 시간마다 새 증기 기둥 생성
    setInterval(createColumn, 3000);
    
    function createColumn() {
        const column = document.createElement('div');
        column.className = 'steam-column';
        
        // 랜덤 위치 및 지연 설정
        const posX = Math.random() * 100;
        const delay = Math.random() * 5;
        const width = 30 + Math.random() * 50;
        
        column.style.cssText = `
            left: ${posX}%;
            width: ${width}px;
            animation-delay: ${delay}s;
        `;
        
        steamEffect.appendChild(column);
        
        // 애니메이션 종료 후 요소 제거
        setTimeout(() => {
            steamEffect.removeChild(column);
        }, 12000 + delay * 1000);
    }
}

// 증기 효과 애니메이션
const style = document.createElement('style');
style.textContent = `
    @keyframes steamPuff {
        0% {
            opacity: 0;
            transform: scale(0.8) translate(0, 0);
        }
        10% {
            opacity: 0.7;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(1.5) translate(0, -100px);
        }
    }
    
    @keyframes crimsonPulse {
        0%, 100% {
            box-shadow: 0 0 15px rgba(138, 3, 3, 0.6);
        }
        50% {
            box-shadow: 0 0 30px rgba(138, 3, 3, 0.9);
        }
    }
    
    @keyframes fadeOut {
        0% {
            opacity: 0.7;
        }
        100% {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 크림슨 코어 효과 - 페이지 로드시 실행
window.addEventListener('load', function() {
    // 배경에 랜덤으로 크림슨 효과 생성
    setInterval(() => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        createCrimsonEffect(randomX, randomY);
    }, 5000);
    
    function createCrimsonEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'crimson-effect';
        effect.style.cssText = `
            position: fixed;
            width: 5px;
            height: 5px;
            background: radial-gradient(circle, var(--color-crimson-light), var(--color-crimson-dark));
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            z-index: 1;
            opacity: 0.7;
            pointer-events: none;
            animation: crimsonPulse 3s infinite, fadeOut 5s forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 5000);
    }
});

// 페이지 로드 시 로딩 효과
window.addEventListener('load', function() {
    const body = document.body;
    body.classList.add('loaded');
    
    // 첫 페이지 로드 시 부드럽게 등장하는 효과
    const introContainer = document.querySelector('.intro-container');
    if(introContainer) {
        introContainer.style.opacity = '0';
        setTimeout(() => {
            introContainer.style.transition = 'opacity 1.5s ease';
            introContainer.style.opacity = '1';
        }, 300);
    }
}); 