import { Link } from 'react-router-dom';
import { services } from '../lib/services';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img
                src="/images/VirtueNex-Automation-Logo.png"
                alt="VirtueNex Automation"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Custom AI systems for Real Estate teams. Automate the grunt work, focus on closing deals.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Solutions</h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={service.path} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/how-it-works" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06]">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} VirtueNex Automation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
