import heroImage from "@/assets/hero-wedding.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Wedding photography by Creative Photography"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="gradient-dark-overlay absolute inset-0" />
      </div>

      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <h2 className="font-serif text-xl md:text-2xl text-gold tracking-wider">
          Creative Photography
        </h2>
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase font-sans">
          <a href="#about" className="text-foreground/70 hover:text-gold transition-colors duration-300">About</a>
          <a href="#portfolio" className="text-foreground/70 hover:text-gold transition-colors duration-300">Portfolio</a>
          <a href="#services" className="text-foreground/70 hover:text-gold transition-colors duration-300">Services</a>
          <a href="#book" className="text-foreground/70 hover:text-gold transition-colors duration-300">Book Now</a>
          <a href="#contact" className="text-foreground/70 hover:text-gold transition-colors duration-300">Contact</a>
        </div>
      </nav>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <p className="animate-fade-up stagger-1 mb-4 font-sans text-sm md:text-base tracking-[0.3em] uppercase text-gold">
          Capturing Moments That Last Forever
        </p>
        <h1 className="animate-fade-up stagger-2 font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          <span className="text-foreground">Creative</span>
          <br />
          <span className="text-gradient-gold">Photography</span>
        </h1>
        <p className="animate-fade-up stagger-3 max-w-lg font-sans text-base md:text-lg text-foreground/60 mb-8">
          From intimate birthdays to grand weddings — we tell your story through stunning visuals
        </p>
        <a
          href="#book"
          className="animate-fade-up stagger-4 inline-block gradient-gold px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wider uppercase text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Book Your Session
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-gold/40 flex items-start justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-gold animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
