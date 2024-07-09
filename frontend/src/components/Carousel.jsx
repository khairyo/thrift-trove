import React from 'react';
import styles from '../styles/Carousel.module.css';

function Carousel() {
  return (
    <div id="carouselExampleIndicators" className={`carousel slide ${styles.carousel}`} data-bs-ride="carousel">

      {/* carousel indicators (dots) */}
      <div className={`carousel-indicators ${styles.carouselIndicators}`}>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      
      {/* carousel images */}
      <div className="carousel-inner">
        <div className={`carousel-item active ${styles.carouselItem}`}>
          <img className={`d-block w-100 ${styles.carouselImage}`} src="/images/image1.jpg" alt="First slide" />
        </div>
        <div className={`carousel-item ${styles.carouselItem}`}>
          <img className={`d-block w-100 ${styles.carouselImage}`} src="/images/image2.jpg" alt="Second slide" />
        </div>
        <div className={`carousel-item ${styles.carouselItem}`}>
          <img className={`d-block w-100 ${styles.carouselImage}`} src="/images/image3.jpg" alt="Third slide" />
        </div>
      </div>

      {/* carousel controls (buttons) */}
      <button className={`carousel-control-prev ${styles.carouselControlPrev}`} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className={`carousel-control-prev-icon ${styles.carouselControlIcon}`} aria-hidden="true"></span>
      </button>
      <button className={`carousel-control-next ${styles.carouselControlNext}`} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className={`carousel-control-next-icon ${styles.carouselControlIcon}`} aria-hidden="true"></span>
      </button>
    </div>
  );
}

export default Carousel;
