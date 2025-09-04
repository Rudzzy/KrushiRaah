import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const images = [
  {
    src: "/images/slide1.png",
    titleKey: "homepage.slide1Title",
    paragraphKey: "homepage.slide1Text",
    theme: "soil",
  },
  {
    src: "/images/slide2.png",
    paragraphKey:
      "homepage.slide2Text",
    theme: "health",
  },
  {
    src: "/images/slide3.jpg",
    paragraphKey:
      "homepage.slide3Text",
    theme: "finance",
  },
];

export default function ImageSlider({ onSlideChange }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const [ticker, setTicker] = useState([]);
  const startX = useRef(null);
  const containerRef = useRef(null);
  const lastX = useRef(null);
  const lastTime = useRef(null);
  const velocityRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  const goToSlide = (index) => setCurrentIndex(index);

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
    setDragging(true);
    setDragDistance(0);
    lastX.current = e.clientX;
    lastTime.current = performance.now();
  };

  const handleMouseMove = (e) => {
    if (!dragging || startX.current === null) return;
    const now = performance.now();
    const rawDelta = e.clientX - startX.current;
    // Edge resistance: soften pull beyond edges
    const atStart = currentIndex === 0 && rawDelta > 0;
    const atEnd = currentIndex === images.length - 1 && rawDelta < 0;
    const resistance = atStart || atEnd ? 0.35 : 1;
    setDragDistance(rawDelta * resistance);
    // Track velocity (px/ms)
    if (lastX.current != null && lastTime.current != null) {
      const dx = e.clientX - lastX.current;
      const dt = now - lastTime.current || 1;
      velocityRef.current = dx / dt;
    }
    lastX.current = e.clientX;
    lastTime.current = now;
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    const momentum = velocityRef.current * 220; // tune momentum influence
    const total = dragDistance + momentum;
    if (total > 80) {
      goToSlide(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    } else if (total < -80) {
      goToSlide(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
    }
    setDragging(false);
    setDragDistance(0);
    startX.current = null;
    velocityRef.current = 0;
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    setDragging(true);
    setDragDistance(0);
    lastX.current = e.touches[0].clientX;
    lastTime.current = performance.now();
  };

  const handleTouchMove = (e) => {
    if (!dragging || startX.current === null) return;
    const now = performance.now();
    const rawDelta = e.touches[0].clientX - startX.current;
    const atStart = currentIndex === 0 && rawDelta > 0;
    const atEnd = currentIndex === images.length - 1 && rawDelta < 0;
    const resistance = atStart || atEnd ? 0.35 : 1;
    setDragDistance(rawDelta * resistance);
    if (lastX.current != null && lastTime.current != null) {
      const dx = e.touches[0].clientX - lastX.current;
      const dt = now - lastTime.current || 1;
      velocityRef.current = dx / dt;
    }
    lastX.current = e.touches[0].clientX;
    lastTime.current = now;
  };

  const handleTouchEnd = () => handleMouseUp();

  useEffect(() => {
    if (prefersReducedMotion.current) return;
    let rafId;
    let startTs;
    const duration = 5000;

    const loop = (ts) => {
      if (dragging || isPaused || isFocused) {
        startTs = undefined;
        rafId = requestAnimationFrame(loop);
        return;
      }
      if (startTs === undefined) startTs = ts;
      const elapsed = ts - startTs;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        setProgress(0);
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        startTs = ts;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [dragging, isPaused, isFocused]);

  // Notify parent when slide changes
  useEffect(() => {
    if (typeof onSlideChange === "function") {
      onSlideChange(currentIndex);
    }
    setProgress(0);
  }, [currentIndex, onSlideChange]);

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Home") {
        setCurrentIndex(0);
      } else if (e.key === "End") {
        setCurrentIndex(images.length - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="slider-container"
      ref={containerRef}
      tabIndex={0}
      aria-label="Image slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="slider-track"
        style={{
          transform: `translateX(calc(${-currentIndex * 100}vw + ${dragDistance}px))`,
          transition: dragging ? "none" : "transform 0.5s ease-out",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className={`slider-slide ambient-glow`}
            data-theme={img.theme}
            style={{ backgroundImage: `url(${img.src})` }}
          >
            <div className="slider-overlay">
              <div className="slider-content spotlight-reveal">
                {img.titleKey && (
                  <h3 className="krushiraah-welcome">{t(img.titleKey)}</h3>
                )}
                <h2 className="krushiraah-subtitle">{t(img.paragraphKey)}</h2>
                <div className="hero-ctas">
                  <Link to="/crop-recomendation" className="cta primary">{t("getCropAdvice")}</Link>
                </div>

                {/* Widgets row: weather + market ticker shown on first slide for focus */}
                {i === 0 && (
                  <div className="widget-row">
                    {ticker && ticker.length > 0 && (
                      <div className="market-ticker" role="list">
                        {ticker.map((item) => (
                          <div key={item.name} role="listitem" className={`ticker-item ${item.change > 0 ? "up" : item.change < 0 ? "down" : "flat"}`}>
                            <span className="t-name">{item.name}</span>
                            <span className="t-price">₹{item.price}</span>
                            <span className="t-change">
                              {item.change > 0 ? "▲" : item.change < 0 ? "▼" : "•"}
                              {item.change !== 0 ? Math.abs(item.change).toFixed(0) : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {i === 0 && (
                  <ul className="slide-bullets theme-soil">
                    <li>{t("homepage.slide1Bullets.navbar")}</li>
                    <li>{t("homepage.slide1Bullets.slider")}</li>
                    <li>{t("homepage.slide1Bullets.styles")}</li>
                    <li>{t("homepage.slide1Bullets.mobile")}</li>
                  </ul>
                )}
                {i === 1 && (
                  <ul className="slide-bullets theme-health">
                    <li>{t("homepage.slide2Bullets.ai")}</li>
                    <li>{t("homepage.slide2Bullets.early")}</li>
                    <li>{t("homepage.slide2Bullets.expert")}</li>
                    <li>{t("homepage.slide2Bullets.workflow")}</li>
                  </ul>
                )}
                {i === 2 && (
                  <ul className="slide-bullets theme-finance">
                    <li>{t("homepage.slide3Bullets.prices")}</li>
                    <li>{t("homepage.slide3Bullets.costs")}</li>
                    <li>{t("homepage.slide3Bullets.dashboard")}</li>
                    <li>{t("homepage.slide3Bullets.decisions")}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Autoplay progress bar */}
      <div className="slider-progress" aria-hidden="true">
        <div className="slider-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="slider-dots">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => goToSlide(i)}
            className={`slider-dot ${i === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
