
import HeroStateManager from "./hero/HeroStateManager";
import AnimatedBackground from "./hero/AnimatedBackground";

const Hero = () => {
  return (
    <div className="relative">
      <AnimatedBackground />
      <HeroStateManager />
    </div>
  );
};

export default Hero;
