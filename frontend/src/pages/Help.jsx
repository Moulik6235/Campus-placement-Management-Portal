import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Help = () => {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <Navbar />
      
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold font-headline text-on-surface mb-4">Help & Support</h1>
        <p className="text-on-surface-variant mb-10 text-lg border-b border-outline-variant/20 pb-6">
          You can reach us for any help regarding your upcoming placement drives, interview scheduling, or platform issues. 
          Our placement unit is here to assist you.
        </p>

        <div className="space-y-8">
          
          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">contact_support</span>
              Contact Information
            </h2>
            <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="w-32 font-bold text-on-surface-variant">Email ID:</span>
                <a href="mailto:placement@gccbachd.org" className="text-primary hover:underline font-medium">
                  placement@gccba.edu.in
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="w-32 font-bold text-on-surface-variant">Phone Number:</span>
                <span className="text-on-surface font-medium">+91 (172) 2xxx-xxx</span>
              </div>
            </div>
          </div>

          {/* Timings Section */}
          <div>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">schedule</span>
              Operating Hours
            </h2>
            <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="w-32 font-bold text-on-surface-variant">Days:</span>
                <span className="text-on-surface font-medium">Monday to Saturday</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
                <span className="w-32 font-bold text-on-surface-variant">Timings:</span>
                <span className="text-on-surface font-medium">9:00 AM to 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">location_on</span>
              Visit the Cell
            </h2>
            <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/20">
              <h3 className="font-bold text-on-surface mb-1">Placement Cell</h3>
              <p className="text-on-surface-variant font-medium">Admin Block</p>
              <p className="text-on-surface-variant mt-2 text-sm">
                Government College of Commerce and Business Administration (GCCBA)
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
