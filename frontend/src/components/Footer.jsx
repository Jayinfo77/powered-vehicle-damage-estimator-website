import { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaGithub } from 'react-icons/fa';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Contact Section */}
        <div className="w-full md:w-auto text-center md:text-left">
          {/* Title with Toggle on Mobile */}
          {!isDesktop && (
            <div
              className="flex items-center justify-center md:justify-start cursor-pointer mb-2"
              onClick={() => setShowContact(!showContact)}
            >
              <p className="font-semibold text-sm">Contact Us</p>
              <span className="ml-2">
                {showContact ? <HiChevronUp /> : <HiChevronDown />}
              </span>
            </div>
          )}

          {/* Contact Info */}
          {(showContact || isDesktop) && (
            <div className="text-sm space-y-1">
              <p className="font-semibold md:mb-1 hidden md:block">Contact Us</p>
              <p>Vehicle Damage Estimator Pvt. Ltd.</p>
              <p>Biratnagar, Morang, Nepal</p>
              <p>
                Email:{' '}
                <a
                  href="mailto:info@vehicledamage.com"
                  className="text-blue-400 hover:underline"
                >
                  info@vehicledamage.com
                </a>
              </p>
              <p>
                Phone:{' '}
                <a
                  href="tel:+977-9807700635"
                  className="text-blue-400 hover:underline"
                >
                  +977-9807700635
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Copyright */}
        <p className="text-sm md:text-base text-center">
          © {new Date().getFullYear()}{' '}
          <span className="font-semibold">Vehicle Damage Estimator</span>..
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6 justify-center">
          <a
            href="https://www.facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 transition-colors"
          >
            <FaFacebookF size={22} />
          </a>
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-sky-400 transition-colors"
          >
            <FaTwitter size={22} />
          </a>
          <a
            href="https://github.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-100 transition-colors"
          >
            <FaGithub size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}
