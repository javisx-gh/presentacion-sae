class PresentationModel {
    constructor(totalSlides) {
        this.currentSlide = 0;
        this.totalSlides = totalSlides;
    }

    next() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            return true;
        }
        return false;
    }

    prev() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            return true;
        }
        return false;
    }

    getSlideIndex() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }
}

class PresentationView {
    constructor() {
        this.wrapper = document.getElementById('presentation-wrapper');
        this.counter = document.getElementById('counter');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Determinar el total dinámicamente según el HTML
        this.totalSlides = document.querySelectorAll('.slide-container').length || 17;
    }

    bindEvents(handleNext, handlePrev) {
        this.nextBtn.addEventListener('click', handleNext);
        this.prevBtn.addEventListener('click', handlePrev);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        });

        // Soporte para gestos táctiles (swipe)
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Detectar swipe horizontal: debe ser mayor el mov horizontal que el vertical y superar 50px
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    handleNext(); // Swipe izquierda
                } else {
                    handlePrev(); // Swipe derecha
                }
            }
        }, { passive: true });
    }

    updateSlidePosition(index) {
        this.wrapper.style.transform = `translateX(-${index * 100}vw)`;
    }

    updateUI(index, total) {
        const displayNum = (index + 1).toString().padStart(2, '0');
        this.counter.innerText = `${displayNum} / ${total}`;
        
        this.prevBtn.disabled = index === 0;
        this.nextBtn.disabled = index === total - 1;
    }
}

class PresentationController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Bindeo del contexto ('this') para los event listeners
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);

        this.init();
    }

    init() {
        this.view.bindEvents(this.handleNext, this.handlePrev);
        this.view.updateUI(this.model.getSlideIndex(), this.model.getTotalSlides());
        
        window.addEventListener('resize', () => {
            this.updateView();
        });
    }

    handleNext() {
        if (this.model.next()) {
            this.updateView();
        }
    }

    handlePrev() {
        if (this.model.prev()) {
            this.updateView();
        }
    }

    updateView() {
        const currentIndex = this.model.getSlideIndex();
        this.view.updateSlidePosition(currentIndex);
        this.view.updateUI(currentIndex, this.model.getTotalSlides());
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializamos la Vista primero para saber cuántas diapositivas hay
    const view = new PresentationView();
    const model = new PresentationModel(view.totalSlides);
    const app = new PresentationController(model, view);
});
