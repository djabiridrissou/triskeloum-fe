
import { Button, Input } from "antd";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
    const [email, setEmail] = useState("")
    const newsletter = () => {
        if (email === "") {
            toast.error("Please enter your email");
        } else
            toast.success("You have successfully subscribed to our newsletter !");
    }

    return (
        <footer className="bg-white border-t border-neutral-200 mt-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center mb-4">

                            <span className="ml-2 text-xl font-semibold text-black">Tutor Finder And Advertisement</span>
                        </div>
                        <p className="text-neutral-600 text-sm text-justify">Connecting students with resources, events, and tutors to enhance their educational journey.</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4"></h3>
                        <ul className="space-y-3">
                            {/*   <li><Link to="/marketplace" className="text-neutral-600 hover:text-primary text-sm">Marketplace</Link></li>
              <li><Link href="/tutors" className="text-neutral-600 hover:text-primary text-sm">Find a Tutor</Link></li>
              <li><Link href="/events" className="text-neutral-600 hover:text-primary text-sm">Events Calendar</Link></li>
              <li><Link href="/materials" className="text-neutral-600 hover:text-primary text-sm">Study Materials</Link></li> */}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4"></h3>
                        <ul className="space-y-3">
                            {/*   <li><Link href="/about" className="text-neutral-600 hover:text-primary text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-neutral-600 hover:text-primary text-sm">Contact</Link></li>
              <li><Link href="/privacy" className="text-neutral-600 hover:text-primary text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-600 hover:text-primary text-sm">Terms of Service</Link></li> */}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider text-white mb-4">Connect</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="text-neutral-500 hover:text-primary">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-neutral-500 hover:text-primary">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-neutral-500 hover:text-primary">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-neutral-500 hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-white mb-2">Subscribe tdo our newsletter</h4>
                            <div className="flex">
                                <Input
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-r-none"
                                    placeholder="Your email"
                                    style={
                                        {
                                            marginRight: 8
                                        }}
                                    value={email}
                                />

                                <Button
                                    onClick={() => {
                                        newsletter()
                                    }}
                                    className="rounded-l-none"
                                >
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-200 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} SchoolHub. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {/*  <Link href="/privacy" className="text-neutral-500 hover:text-primary text-sm">Privacy</Link>
            <Link href="/terms" className="text-neutral-500 hover:text-primary text-sm">Terms</Link>
            <Link href="/cookies" className="text-neutral-500 hover:text-primary text-sm">Cookies</Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
