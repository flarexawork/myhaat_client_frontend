import { FaWhatsapp } from "react-icons/fa";
import { socialLinks } from "../utils/socialLinks";

const WhatsAppButton = () => {
  return (
    <a
      href={socialLinks.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[28px] text-white shadow-[0_16px_35px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-110 md-lg:bottom-[138px] md-lg:right-4 md-lg:h-12 md-lg:w-12 md-lg:text-[24px]"
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;
