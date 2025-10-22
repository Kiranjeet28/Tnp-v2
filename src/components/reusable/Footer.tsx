import { Globe, GraduationCap, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 mt-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center mb-4">
                            <GraduationCap className="w-8 h-8 mr-3 text-blue-300" />
                            <h3 className="text-2xl font-bold">GNDEC</h3>
                        </div>
                        <p className="text-blue-200 leading-relaxed">
                            Guru Nanak Dev Engineering College - Empowering students with world-class education and career opportunities.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <div className="space-y-3">
                            <a href="#" className="block text-blue-200 hover:text-white transition-colors">About College</a>
                            <a href="#" className="block text-blue-200 hover:text-white transition-colors">Placement Statistics</a>
                            <a href="#" className="block text-blue-200 hover:text-white transition-colors">Student Portal</a>
                            <a href="#" className="block text-blue-200 hover:text-white transition-colors">Career Resources</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                        <div className="space-y-3">
                            <div className="flex items-center text-blue-200">
                                <MapPin className="w-5 h-5 mr-3" />
                                <span>Ludhiana, Punjab, India</span>
                            </div>
                            <div className="flex items-center text-blue-200">
                                <Phone className="w-5 h-5 mr-3" />
                                <span>+91-161-123-4567</span>
                            </div>
                            <div className="flex items-center text-blue-200">
                                <Mail className="w-5 h-5 mr-3" />
                                <span>https://www.Infocascadegndec.com/</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <Globe className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-blue-800 mt-12 pt-8 text-center">
                    <p className="text-blue-200">© 2025 Guru Nanak Dev Engineering & Technology College. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};