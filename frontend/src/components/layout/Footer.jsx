import React from "react";

const Footer = () => {
  return (
    <footer className="bg-surface-container-high w-full border-t-0 mt-auto">
      <div className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          <div className="text-md font-bold text-outline uppercase tracking-[2px] mb-4">GCCBA PLACEMENT CELL</div>
          <p className="text-outline-variant text-xs">© 2026 Government College of Commerce and Business Administration. All Rights Reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-outline text-xs uppercase hover:text-primary font-bold transition-all" target="_blank" rel="noreferrer" href="https://gccbachd.org/about-us/">About Us</a>
          <a className="text-outline text-xs uppercase hover:text-primary font-bold transition-all" target="_blank" rel="noreferrer" href="https://gccbachd.org/privacy-policy/">Privacy Policy</a>
          <a className="text-outline text-xs uppercase hover:text-primary font-bold transition-all" target="_blank" rel="noreferrer" href="https://gccbaplacementcell.wordpress.com/">Placement Cell Blog</a>
          <a className="text-outline text-xs uppercase hover:text-primary font-bold transition-all" target="_blank" rel="noreferrer" href="https://gccbachd.org/contact-us/">Contact GCCBA</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
