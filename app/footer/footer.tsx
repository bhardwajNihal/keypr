import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className="mt-16 mb-8 text-center flex flex-col gap-4 text-sm text-muted-foreground border-t pt-6 border-border">
        <div className="flex gap-6 justify-center items-center">
          <p>Made with 💟 by Nihal Bhardwaj.</p>
          <a target="_blank" href="https://x.com/bhardwajnihal21" ><FaXTwitter className="hover:text-purple-500 text-lg"/></a>
          <a target="_blank" href="https://github.com/bhardwajNihal"><FaGithub className="hover:text-purple-500 text-lg"/></a>
          <a target="_blank" href="https://www.linkedin.com/in/nihal-bhardwaj-8397212b8/"><FaLinkedin className="hover:text-purple-500 text-lg"/></a>
        </div>
        <p>© 2025 Keypr. All rights reserved.</p>
      </footer>
  )
}

export default Footer