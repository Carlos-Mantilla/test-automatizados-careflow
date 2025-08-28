import Link from 'next/link';
import Image from 'next/image';

const Header = () => {

    const currentYear = new Date().getFullYear();
    return (
        <header className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 to-gray-900 text-white shadow-lg z-50">
            {/* Logo/Brand Section */}
            <div className="p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10flex items-center justify-center">
                        <Image src="/favicon.ico" alt="Careflow" width={100} height={100} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Auto-Testing</h1>
                        <p className="text-xs text-white/70">Careflow</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4">
                <ul className="space-y-2">

                    <h3 className="font-semibold text-[#6bdaff] text-center mt-4">Herramientas</h3>

                    <li>
                        <Link
                            href="https://century21-careflow-knowledge-panel.fevig1.easypanel.host/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <span className="text-sm">🧠</span>
                            </div>
                            <span className="font-medium">Knowledge Panel</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://century21-microservicio-update-ghl-calendars.fevig1.easypanel.host/ui"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <span className="text-sm">📅</span>
                            </div>
                            <span className="font-medium">GHL Calendar Sync</span>
                        </Link>
                    </li>



                    {/* Separador */}
                    <li className="py-2">
                        <div className="border-t border-white/20"></div>
                    </li>
                    <h3 className="font-semibold text-[#6bdaff] text-center mt-4">Links</h3>
                    <li>
                        <Link
                            href="#guia"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <span className="text-sm">📖</span>
                            </div>
                            <span className="font-medium">Guía de uso</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://app.gohighlevel.com/v2/location/Qu3Y4OkCCLFg5jDh3qa8/contacts/smart_list/All"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <span className="text-sm">🚀</span>
                            </div>
                            <span className="font-medium">GHL Subcuentas</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="https://easypanel-n8n-production.gotiger.ai/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <span className="text-sm">⚙️</span>
                            </div>
                            <span className="font-medium">EasyPanel</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://drive.google.com/drive/u/0/folders/1palevGGCwzi4VCct375Ok9hsKn3rTSiS"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <span className="text-sm">☁️</span>
                            </div>
                            <span className="font-medium">Google Drive</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Footer Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
                <div className="text-center">
                    <p className="text-xs text-white/60">Versión 1.0</p>
                    <p className="text-xs text-white/40 mt-1">© {currentYear} Careflow</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
