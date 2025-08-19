const VideoSection = () => {
    const phoneNumber = "+573019505508";
    const nombre = "auto-testing"


    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <section id="guia" className="bg-[#1a1a1a] rounded-lg shadow-md p-6 space-y-4 mt-20">
            {/* ==================== TITLE ==================== */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                    Guía de uso
                </h2>
                <p className="animate-bounce">
                    Info para crear contacto 👇 en la subcuenta GHL
                </p>
            </div>

            {/* ==================== COPYABLE ELEMENTS ==================== */}
            <div className="flex items-center justify-center gap-6">
                {/* Name + Copy Button */}
                <div className="flex items-center justify-center">
                    <span className="font-mono text-lg bg-gray-800 p-1 rounded border text-green-400">
                        {nombre}
                    </span>
                    <button
                        className="ml-2 p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors active:scale-95 duration-100 cursor-pointer"
                        onClick={() => copyToClipboard(nombre, "Nombre")}
                        title="Copiar nombre"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <g fill="none">
                                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path fill="#fff" d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-9 13H8a1 1 0 0 0-.117 1.993L8 17h2a1 1 0 0 0 .117-1.993zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7H8a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2" />
                            </g>
                        </svg>
                    </button>
                </div>

                {/* Phone Number + Copy Button */}
                <div className="flex items-center justify-center">
                    <span className="font-mono text-lg bg-gray-800 p-1 rounded border text-green-400">
                        {phoneNumber}
                    </span>
                    <button
                        className="ml-2 p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors active:scale-95 duration-100 cursor-pointer"
                        onClick={() => copyToClipboard(phoneNumber, "Número")}
                        title="Copiar número"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <g fill="none">
                                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path fill="#fff" d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-9 13H8a1 1 0 0 0-.117 1.993L8 17h2a1 1 0 0 0 .117-1.993zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7H8a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

            {/* ==================== YOUTUBE VIDEO ==================== */}
            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src="https://www.youtube.com/embed/O2gRFb1ZB0M?si=xHx3nyIKU7R3ntWC"
                            title="Video de ayuda - Auto-Testing Careflow"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
