import React from 'react';

// import components
import WelcomeSection from '../components/home/WelcomeSection';
import HomeShop from '../components/home/HomeShop';
import WhyThrift from '../components/WhyThrift';
import HRLine from '../components/HRLine';

function Home() {
  return (
    <div>
      <WelcomeSection />
      <WhyThrift />
      <HRLine />
      <HomeShop />
    </div>
  );
}

export default Home;
