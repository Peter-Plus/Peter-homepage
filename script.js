// 滚动组件初始化
function initScrollContainers() {
    const scrollContainers = document.querySelectorAll('.scroll-container');
    
    scrollContainers.forEach(container => {
        if (!container) return; // 确保元素存在
        
        const track = container.querySelector('.scroll-track');
        if (!track) return; // 确保轨道元素存在
        
        const items = track.querySelectorAll('.scroll-item');
        if (!items.length) return; // 确保有滚动项
        
        // 计算原始内容的总宽度（一半的滚动轨道宽度）
        const originalItemsCount = Math.ceil(items.length / 2); // 考虑到奇数项的情况
        let totalWidth = 0;
        
        for (let i = 0; i < originalItemsCount; i++) {
            if (items[i]) {
                // 获取元素宽度加上外边距
                const style = window.getComputedStyle(items[i]);
                const width = items[i].offsetWidth;
                const marginRight = parseInt(style.marginRight) || 0;
                totalWidth += width + marginRight;
            }
        }
        
        // 设置动画时间比例 - 更宽的容器需要更长的时间来滚动
        // 速度调整：每50px宽度大约需要1秒，最小值为20秒，最大值为60秒
        const baseSpeed = Math.min(Math.max(totalWidth / 50, 20), 60);
        
        // 为skills和achievements容器设置不同的滚动方向和速度
        if (container.id === 'achievements-scroll') {
            // 成就滚动略微慢一些，并且方向相反
            track.style.animation = `scroll ${baseSpeed * 1.2}s linear infinite reverse`;
        } else {
            // 技能正常滚动
            track.style.animation = `scroll ${baseSpeed}s linear infinite`;
        }
        
        // 确保子元素也能暂停父元素的动画
        items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                track.style.animationPlayState = 'paused';
            });
            
            item.addEventListener('mouseleave', function() {
                track.style.animationPlayState = 'running';
            });
        });
    });
}

// 项目轮播功能初始化（优化版）
function initProjectCarousel() {
    const track = document.querySelector('.project-carousel-track');
    const cards = track?.querySelectorAll('.project-card');
    const carouselContainer = document.querySelector('.project-carousel-container');
    const prevButton = document.querySelector('.arrow-left');
    const nextButton = document.querySelector('.arrow-right');
    
    if (!track || !cards?.length || !prevButton || !nextButton || !carouselContainer) return;
    
    // 统一卡片高度，确保一致性
    function normalizeCardHeights() {
        // 标题区域统一高度
        const titles = track.querySelectorAll('.project-content h3');
        // 描述区域统一高度
        const descriptions = track.querySelectorAll('.project-content p');
        
        // 确保图标大小一致
        const icons = track.querySelectorAll('.project-img i');
        icons.forEach(icon => {
            icon.style.fontSize = '3.5rem';
        });
    }
    
    // 设置初始位置
    let currentIndex = 2;
    const totalCards = cards.length;
    
    // 更新箭头状态
    function updateArrowState() {
        // 在第一个卡片时禁用左箭头
        prevButton.disabled = currentIndex === 0;
        
        // 在最后一个卡片时禁用右箭头
        nextButton.disabled = currentIndex === totalCards - 1;
    }
    
    // 计算轮播metrics
    function getCarouselMetrics() {
        const containerWidth = carouselContainer.getBoundingClientRect().width;
        const cardWidth = cards[0].offsetWidth;
        const cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight) || 0;
        const totalCardWidth = cardWidth + (cardMargin * 2);
        
        // 计算每屏可见的卡片数量
        let visibleCards;
        if (window.innerWidth >= 1200) {
            visibleCards = 3; // 桌面显示3个卡片（1个完整+2个半卡片）
        } else if (window.innerWidth >= 768) {
            visibleCards = 2; // 平板显示2个卡片
        } else {
            visibleCards = 1; // 手机显示1个卡片
        }
        
        return { containerWidth, cardWidth, cardMargin, totalCardWidth, visibleCards };
    }
    
    // 更新轮播位置 - 确保卡片居中显示
    function updateCarousel() {
        const { containerWidth, totalCardWidth, visibleCards } = getCarouselMetrics();
        
        // 计算偏移量，使当前卡片居中
        const offset = -(currentIndex * totalCardWidth) + ((containerWidth - totalCardWidth) / 2);
        track.style.transform = `translateX(${offset}px)`;
        
        // 更新箭头状态
        updateArrowState();
    }
    
    // 移动到指定项目
    function moveToItem(index) {
        // 确保索引在有效范围内
        index = Math.max(0, Math.min(index, totalCards - 1));
        currentIndex = index;
        updateCarousel();
    }
    
    // 移动到下一个项目
    function moveToNextItem() {
        if (currentIndex < totalCards - 1) {
            moveToItem(currentIndex + 1);
        }
    }
    
    // 移动到上一个项目
    function moveToPrevItem() {
        if (currentIndex > 0) {
            moveToItem(currentIndex - 1);
        }
    }
    
    // 绑定按钮事件
    nextButton.addEventListener('click', moveToNextItem);
    prevButton.addEventListener('click', moveToPrevItem);
    
    // 初始化轮播
    normalizeCardHeights();
    updateArrowState();
    updateCarousel();
    
    // 窗口大小改变时重新计算位置
    window.addEventListener('resize', function() {
        normalizeCardHeights();
        updateCarousel();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle?.querySelector('i');
  
    function applyTheme(theme) {
      const isDark = theme === 'dark';
      document.body.classList.toggle('dark-mode', isDark);
      if (icon) {
        icon.classList.remove('fa-lightbulb', 'fa-moon');
        icon.classList.add(isDark ? 'fa-moon' : 'fa-lightbulb');
      }
    }
  
    // Load saved theme or default to light
    const saved = localStorage.getItem('theme');
    applyTheme(saved === 'dark' ? 'dark' : 'light');
  
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        if (icon) {
          icon.classList.toggle('fa-lightbulb', !isDarkMode);
          icon.classList.toggle('fa-moon', isDarkMode);
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      });
    }
  
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    mobileMenuBtn?.addEventListener('click', () => {
      navLinks?.classList.toggle('open');
      const menuIcon = mobileMenuBtn.querySelector('i');
      if (navLinks?.classList.contains('open')) {
        menuIcon?.classList.replace('fa-bars', 'fa-times');
      } else {
        menuIcon?.classList.replace('fa-times', 'fa-bars');
      }
    });
  
    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks?.classList.contains('open')) {
          navLinks.classList.remove('open');
          const menuIcon = mobileMenuBtn.querySelector('i');
          menuIcon?.classList.replace('fa-times', 'fa-bars');
        }
      });
    });
  
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Header scroll shadow
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });
  
    // Card scroll animation
    const cards = document.querySelectorAll('.card');
    const animateCards = () => {
      cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (cardTop < windowHeight * 0.8) {
          card.classList.add('animate');
        }
      });
    };
  
    animateCards();
    window.addEventListener('scroll', animateCards);
    
    // 初始化滚动容器
    initScrollContainers();
    
    // 初始化项目轮播
    initProjectCarousel();
    
    // 窗口大小改变时重新初始化
    window.addEventListener('resize', () => {
        initScrollContainers();
        // initProjectCarousel() 已在内部处理resize事件
    });
});