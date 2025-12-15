const Footer = () => {
  return (
    <footer className="bg-[#132a13] text-[#e9eedd] pt-16 pb-6 px-6 mt-20">
      <div className="max-w-[1250px] mx-auto grid gap-10 md:grid-cols-3 text-center md:text-left">

        {/* Contact Section */}
        <div>
          <h4 className="text-[#ecf39e] font-semibold mb-4 text-lg">
            Contact Us
          </h4>
          <p className="mb-2">📞 +91 95149 54142</p>
          <p className="mb-2">📧 info@agrichain.com</p>
          <p>📍 Chennai, Tamil Nadu</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[#ecf39e] font-semibold mb-4 text-lg">
            Quick Links
          </h4>
          <a href="/" className="block mb-2 hover:text-[#90a955] transition">
            Home
          </a>
          <a href="/about" className="block mb-2 hover:text-[#90a955] transition">
            About
          </a>
          <a href="/contact" className="block hover:text-[#90a955] transition">
            Contact
          </a>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-[#ecf39e] font-semibold mb-4 text-lg">
            Follow Us
          </h4>
          <a className="block mb-2 hover:text-[#90a955] transition" href="#">
            Facebook
          </a>
          <a className="block mb-2 hover:text-[#90a955] transition" href="#">
            Twitter
          </a>
          <a className="block mb-2 hover:text-[#90a955] transition" href="#">
            Instagram
          </a>
          <a
            className="block hover:text-[#90a955] transition"
            href="https://wa.me/+919514954142"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-[#31572c] mt-12 pt-4 text-center text-sm text-[#c1e3c1]">
        © 2025 AgriChain. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
